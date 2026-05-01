import type { OutboxEntity } from "@modules/catalog/infrastructure/persistence/entities/OutboxEntity";
import type { Repository } from "typeorm";
import type { IMessageBroker } from "./IMessageBroker";

export class OutboxRelayWorker {
  private isRunning = false;

  constructor(
    private readonly outboxRepo: Repository<OutboxEntity>,
    private readonly messageBroker: IMessageBroker
  ) {}

  async start() {
    this.isRunning = true;
    console.log("🚀 Outbox Relay Worker iniciado...");
    
    while (this.isRunning) {
      try {
        await this.processMessages();
      } catch (error) {
        console.error("❌ Erro no Worker:", error);
      }
      // Espera 1 segundo antes da próxima rodada (polling)
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  private async processMessages() {
    // Busca mensagens não processadas
    const messages = await this.outboxRepo.find({
      where: { published: false },
      take: 20,
      order: { created_at: 'ASC' }
    });

    for (const msg of messages) {
      try {
        // Envia para o Broker (RabbitMQ/Kafka)
        await this.messageBroker.publishInExchange(
            msg.exchange, 
            msg.routing_key, 
            JSON.parse(msg.payload)
        );

        // Marca como enviado
        msg.published = true;
        msg.processed_at = new Date();
        await this.outboxRepo.save(msg);
        
      } catch (err) {
        console.error(`Falha ao processar mensagem ${err}`);
        // Aqui você pode implementar lógica de retry
      }
    }
  }
}
