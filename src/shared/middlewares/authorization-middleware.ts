import { Request, Response, NextFunction } from 'express';

export enum UserRole {
  CLIENT = 'client',
  ADMIN = 'admin',
}

export const authorize = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    // 2. Agora o TS reconhece req.user e req.user.role corretamente
    if (user && allowedRoles.includes(user.role)) {
      return next();
    }

    return res.status(403).json({
      message: "Acesso negado. Você não tem permissão para acessar este recurso."
    });
  };
};
