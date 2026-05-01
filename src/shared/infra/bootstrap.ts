import { StockModule } from "@modules/stock/stock.module";
import { AppDataSource } from "./db/data-source";
import RabbitMQServer from "./messaging/RabbitMQServer";
import { CatalogModule } from "@modules/catalog/catalog.module";
import { OutboxRelayWorker } from "./messaging/OutboxRelayWorker";
import { OutboxEntity } from "@modules/catalog/infrastructure/persistence/entities/OutboxEntity";

export async function bootstrapInfrastructure() {
  await AppDataSource.initialize();

  const rabbit = RabbitMQServer.getInstance(
  `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBIT_URI}:5672/`)
  await rabbit.start();
  
  // Inicializa os módulos
  await StockModule.setup();
  await CatalogModule.setup();

  // Workers
  const catalogOutbox = new OutboxRelayWorker(
    AppDataSource.getRepository(OutboxEntity),
    rabbit
  )

  catalogOutbox.start();
}