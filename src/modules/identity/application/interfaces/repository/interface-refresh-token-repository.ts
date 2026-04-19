import type { RefreshTokenEntity } from "@modules/identity/infrastructure/persistence/entities/refresh-token-entity";

export interface IRefreshTokenRepository {
  save(userId: string, token: string, expiresAt: Date): Promise<void>;
  findByToken(token: string): Promise<RefreshTokenEntity | null>;
  deleteByUserId(userId: string): Promise<void>;
}