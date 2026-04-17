import { Connection, Channel, connect, ConsumeMessage } from 'amqplib';
import type { IMessageBroker } from './IMessageBroker';

export default class RabbitMQServer implements IMessageBroker {
  private static instance: RabbitMQServer;
  private conn: Connection;
  private channel: Channel;

  private constructor(private uri: string) {}

  public static getInstance(uri?: string): RabbitMQServer {
    if(!RabbitMQServer.instance) {
        if(!uri) throw new Error("É necessário uma uri válida para inicializar o servidor rabbitMQ!");
        RabbitMQServer.instance = new RabbitMQServer(uri);
    }
    return RabbitMQServer.instance;
  }

  async start(): Promise<void> {
    try {
      //@ts-expect-error erro do rabbit types
      this.conn = await connect(this.uri);
      //@ts-expect-error erro do rabbit types
      this.channel = await this.conn.createChannel();
      
      await this.channel.prefetch(1);
      
      console.log('✅ RabbitMQ: Conexão estabelecida com sucesso.');
    } catch (error) {
      console.error('❌ RabbitMQ: Falha ao conectar', error);
      throw error;
    }
  }

  /*eslint-disable */
  async publishInQueue(queue: string, message: any): Promise<boolean> {
    try {
      await this.channel.assertQueue(queue, { durable: true });
      return this.channel.sendToQueue(
        queue, 
        Buffer.from(JSON.stringify(message)),
        { persistent: true }
      );
    } catch (error) {
      console.error(`❌ RabbitMQ: Erro ao publicar na fila ${queue}`, error);
      throw error;
    }
  }

  async publishInExchange(
    exchange: string,
    routingKey: string,
    message: any,
    type: 'topic' | 'direct' | 'fanout' = 'topic' // Alterado para topic como padrão
  ): Promise<boolean> {
    try {
      // Alterado de 'direct' para o parâmetro dinâmico 'type'
      await this.channel.assertExchange(exchange, type, { durable: true });
      return this.channel.publish(
        exchange,
        routingKey,
        Buffer.from(JSON.stringify(message)),
        { persistent: true }
      );
    } catch (error) {
      console.error(`❌ RabbitMQ: Erro ao publicar na exchange ${exchange}`, error);
      throw error;
    }
  }

    /**
   * Consome mensagens de uma Exchange do tipo Topic
   * @param exchange Nome da exchange (ex: 'catalog.product')
   * @param routingKey Padrão da chave (ex: 'product.created' ou 'product.#')
   * @param queue Nome da fila que receberá as mensagens (ex: 'inventory_creation_queue')
   * @param callback Função que processará a mensagem
   */
  async consumeFromExchange(
    exchange: string,
    routingKey: string,
    queue: string,
    callback: (message: ConsumeMessage) => Promise<void>
  ): Promise<void> {
    try {
      // 1. Garante que a exchange existe (como topic)
      await this.channel.assertExchange(exchange, 'topic', { durable: true });

      // 2. Garante a fila e a configuração de DLQ (reutilizando sua lógica)
      // Chamamos o assertQueue aqui para garantir que os argumentos da DLQ sejam aplicados
      const dlxName = `${queue}_dlx`;
      await this.channel.assertExchange(dlxName, 'direct', { durable: true });
      await this.channel.assertQueue(queue, { 
        durable: true,
        arguments: {
          'x-dead-letter-exchange': dlxName,
          'x-dead-letter-routing-key': 'error_key'
        }
      });

      // 3. FAZ O BIND (O "pulo do gato" para tópicos)
      // Isso diz ao RabbitMQ: "Tudo que chegar na exchange X com a chave Y, mande para a fila Z"
      await this.channel.bindQueue(queue, exchange, routingKey);

      // 4. Inicia o consumo
      await this.consume(queue, callback);
      
      console.log(`📡 RabbitMQ: Fila ${queue} vinculada à exchange ${exchange} com a chave ${routingKey}`);
    } catch (error) {
      console.error(`❌ RabbitMQ: Erro ao configurar consumeFromExchange`, error);
      throw error;
    }
  }


  async consume(queue: string, callback: (message: ConsumeMessage) => Promise<void>): Promise<void> {
    try {
      const dlqName = `${queue}_errors`;
      const dlxName = `${queue}_dlx`;

      await this.channel.assertExchange(dlxName, 'direct', { durable: true });
      await this.channel.assertQueue(dlqName, { durable: true });
      await this.channel.bindQueue(dlqName, dlxName, 'error_key');

      await this.channel.assertQueue(queue, { 
        durable: true,
        arguments: {
          'x-dead-letter-exchange': dlxName,
          'x-dead-letter-routing-key': 'error_key'
        }
      });
      
      await this.channel.consume(queue, async (msg) => {
        if (msg) {
          try {
            await callback(msg);
            this.channel.ack(msg);
          } catch (error) {
            console.error(`⚠️ Erro na fila ${queue}. Movendo para ${dlqName}:`, error);
            this.channel.nack(msg, false, false); 
          }
        }
      });
    } catch (error) {
      console.error(`❌ RabbitMQ: Erro ao consumir fila ${queue}`, error);
      throw error;
    }
  }
}
