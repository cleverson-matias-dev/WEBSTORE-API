import { ILogger } from "@modules/catalogo/application/interfaces/logs/ILogger";
import { PinoLoggerAdapter } from "@shared/logger/PinoLoggerAdapter";
import { AppError } from "@shared/errors/AppError";
import { NextFunction, Request, Response } from "express";

const logger: ILogger = new PinoLoggerAdapter();

export const errorHandlerMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Log do erro original
    logger.error(error.message, error.message, {});

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            status: 'error',
            errors: [error.message], // Retorna a mensagem em uma array
        });
    } 

    // Log para erros não tratados (500)
    console.error('Erro inesperado:', error);

    return res.status(500).json({
        status: 'error',
        errors: ['Internal server error'],
    });
};
