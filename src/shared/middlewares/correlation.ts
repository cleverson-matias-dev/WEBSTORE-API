import { NextFunction, Request, Response } from "express";
import { randomUUID } from "crypto";
import { requestContext } from "@shared/infra/monitoring/context";

export const correlationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const correlationId = req.header('x-correlation-id') || randomUUID();

    res.setHeader('x-correlation-id', correlationId);

    const store = new Map();
    store.set('correlationId', correlationId);

    requestContext
    .run(store, () => next());
}