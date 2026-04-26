import { StockModule } from "@modules/stock/stock.module";
import { AppDataSource } from "./db/data-source";
import RabbitMQServer from "./messaging/RabbitMQServer";

export async function bootstrapInfrastructure() {
  await AppDataSource.initialize();

  const rabbit = RabbitMQServer.getInstance(
  `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBIT_URI}:5672/`)
  await rabbit.start();
  
  // Inicializa os módulos
  await StockModule.setup();
  // await CatalogModule.setup();
}