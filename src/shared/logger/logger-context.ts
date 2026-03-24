import { AsyncLocalStorage } from "node:async_hooks";
import pino from "pino";

export const loggerStorage = new AsyncLocalStorage<pino.Logger>();
const isProduction = process.env.NODE_ENV !== 'production';
const baseLogger = pino({
    level: isProduction ? 'trace' : 'info',
    transport: isProduction ? { target: 'pino-pretty', options: {ignore: 'pid,hostname'} } : undefined
});

export const logger = new Proxy(baseLogger, {
  get(target, property, receiver) {
    const store = loggerStorage.getStore();
    const provider = store || target;
    const value = Reflect.get(provider, property);
    if (typeof value === 'function') {
      return value.bind(provider);
    }

    return value;
  },
});
