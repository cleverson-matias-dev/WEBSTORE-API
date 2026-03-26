import { Router } from "express";
import { authRoutes } from "./users-auth-routes";
import { userRoutes } from "./user-routes";

export const identityRoutes = Router();

identityRoutes.use('/v1/users/auth', authRoutes);
identityRoutes.use('/v1/users', userRoutes);