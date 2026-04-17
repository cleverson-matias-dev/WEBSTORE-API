// src/modules/inventory/adapter/messaging/rabbitmq/product-created-subscriber.ts

import type { StockCreateItemUC } from "@modules/stock/application/use-cases/stock-create-use-case";
import RabbitMQServer from "@shared/infra/messaging/RabbitMQServer";

export class ProductCreatedSubscriber {
  constructor(
    private createInventoryItem: StockCreateItemUC
  ) {}

  async execute(): Promise<void> {
    const rabbit = RabbitMQServer.getInstance();
    const exchangeName = 'catalog.sku';
    const routingKey = 'sku.created';
    const queueName = '_sku_creation_queue';

  await rabbit.consumeFromExchange(
    exchangeName,    // Exchange
    routingKey,
    queueName,
        async (msg) => {
            const data = JSON.parse(msg.content.toString());
            
            await this.createInventoryItem.execute(data)
            // await useCase.execute(data);
        }
    )

}}
