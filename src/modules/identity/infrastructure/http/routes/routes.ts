import { Router } from "express";
import { authRoutes } from "./users-auth-routes";

export const identityRoutes = Router();

identityRoutes.use('/v1/users/auth', authRoutes);