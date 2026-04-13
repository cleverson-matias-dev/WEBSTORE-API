import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { UserRole } from './authorization-middleware';

export const injectUserMetadata = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader?.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const payload = jwt.decode(token) as { id: string; role: UserRole } | null;

            if (payload) {
                // Injeta nos headers (garante que sejam strings)
                req.headers['x-user-id'] = String(payload.id);
                req.headers['x-user-role'] = String(payload.role);

                // Injeta no objeto req (agora tipado)
                req.user = {
                    id: payload.id,
                    role: payload.role
                };
            }
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error("Erro ao decodificar token:", message);
    }
    
    next();
};
