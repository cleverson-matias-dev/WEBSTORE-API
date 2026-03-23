import { ILogger } from "@modules/catalogo/application/interfaces/logs/ILogger";
import { requestContext } from "@shared/infra/monitoring/context";
import pino from "pino";

export class PinoLoggerAdapter implements ILogger {
    private logger = pino({
        mixin() {
            const store = requestContext.getStore();
            return { correlationId: store?.get('correlationId') }
        },
        formatters: {
            level: (label) => {
                return {
                    level: label
                }
            }
        }
    });

    info(message: string, context?: any): void { this.logger.info({ context }, message) }
    error(message: string, trace?: string, context?: any): void { this.logger.error({ ...context, trace }, message) }
    warn(message: string, context?: any): void { this.logger.warn({ context }, message) }
    debug(message: string, context?: any): void { this.logger.debug({ context }, message) }
}