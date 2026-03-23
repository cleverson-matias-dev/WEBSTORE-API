import { ILogger } from "@modules/catalogo/application/interfaces/logs/ILogger";
import { PinoLoggerAdapter } from "@shared/logger/PinoLoggerAdapter";
import { AppError } from "@shared/errors/AppError";
import { NextFunction, Request, Response } from "express";

const logger: ILogger = new PinoLoggerAdapter();

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    if (error instanceof AppError) {
        logger.error(error.message, error.stack, {});
        return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
        });
    } 

    console.log('Erro inesperado', error);
    logger.error(error.message, error.stack, {});
    

    return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });

}