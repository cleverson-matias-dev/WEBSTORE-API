import type { UserRole } from "@shared/middlewares/authorization-middleware";

export {}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
      };
    }
  }
}
