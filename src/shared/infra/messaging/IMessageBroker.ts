import { ConsumeMessage } from 'amqplib';

/*eslint-disable */
export interface IMessageBroker {
  start(): Promise<void>;
  
  publishInQueue(
    queue: string, 
    message: any
  ): Promise<boolean>;

  publishInExchange(
    exchange: string,
    routingKey: string,
    message: any,
    type?: 'topic' | 'direct' | 'fanout'
  ): Promise<boolean>;

  consumeFromExchange(
    exchange: string,
    routingKey: string,
    queue: string,
    callback: (message: ConsumeMessage) => Promise<void>
  ): Promise<void>;

  consume(
    queue: string, 
    callback: (message: ConsumeMessage) => Promise<void>
  ): Promise<void>;
}
