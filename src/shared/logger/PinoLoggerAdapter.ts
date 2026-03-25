import { ILogger } from "@modules/catalog/application/interfaces/logs/ILogger";
import { logger } from "./logger-context";

export class PinoLoggerAdapter implements ILogger {
    private logger = logger;

    info(message: string, context?: any): void { this.logger.info({ context }, message) }
    error(message: string, trace?: string, context?: any): void { this.logger.error({ ...context, trace }, message) }
    warn(message: string, context?: any): void { this.logger.warn({ context }, message) }
    debug(message: string, context?: any): void { this.logger.debug({ context }, message) }
}