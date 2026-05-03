import { AsyncLocalStorage } from 'async_hooks';
import { EntityManager } from 'typeorm';

// Este objeto vai armazenar o EntityManager da transação para cada "thread" de execução
export const transactionStorage = new AsyncLocalStorage<EntityManager>();
