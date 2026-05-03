import "reflect-metadata";
import { AppDataSource } from "../db/data-source";
import RabbitMQServer from "./RabbitMQServer"; // Ajuste o path conforme seu projeto
import { ProductCreatedConsumerFactory } from "./factories/ProductCreatedConsumerFactory";
import { MeilisearchService } from "../meilisearch/MeilisearchService";

async function bootstrap() {
  try {

    const meiliService = new MeilisearchService();
    await meiliService.setupIndex('products');
    // 1. Inicializa Banco de Dados
    await AppDataSource.initialize();
    console.log("📂 [Worker] Banco de dados conectado.");

    // 2. Inicializa RabbitMQ
    const rabbitUri = `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:5672`;
    const rabbit = RabbitMQServer.getInstance(rabbitUri);
    await rabbit.start();

    // 3. Define as constantes de roteamento
    const EXCHANGE = "catalog.products";
    const ROUTING_KEY = "product.created";
    const QUEUE = "catalog.sync.meilisearch";

    // 4. Instancia o Consumer via Factory
    const consumer = ProductCreatedConsumerFactory.make();

    // 5. Inicia o consumo usando sua lógica de Exchange
    // Seu método já cuida de: AssertExchange, AssertQueue, Bind e DLQ
    await rabbit.consumeFromExchange(
      EXCHANGE,
      ROUTING_KEY,
      QUEUE,
      async (msg) => {
        // Importante: Seu RabbitMQServer já faz o .ack() e .nack() automaticamente
        // baseado na execução (ou erro) deste callback.
        await consumer.handle(msg); 
      } 
    );

    console.log(`🚀 [Worker Search] Rodando e ouvindo ${ROUTING_KEY}...`);

  } catch (error) {
    console.error("❌ [Worker] Erro fatal no bootstrap:", error);
    process.exit(1);
  }
}

bootstrap();
