import type { IRefreshTokenRepository } from "@modules/identity/application/interfaces/repository/interface-refresh-token-repository";
import { RefreshTokenEntity } from "@modules/identity/infrastructure/persistence/entities/refresh-token-entity";
import { v4 as uuidv4 } from 'uuid';

export class InMemoryRefreshTokenRepository implements IRefreshTokenRepository {
  private items: RefreshTokenEntity[] = [];

  async save(userId: string, token: string, expiresAt: Date): Promise<void> {
    const entity = new RefreshTokenEntity();
    
    entity.id = uuidv4();
    entity.userId = userId;
    entity.token = token;
    entity.expiresAt = expiresAt;
    entity.createdAt = new Date();

    this.items.push(entity);
  }

  async findByToken(token: string): Promise<RefreshTokenEntity | null> {
    const refreshToken = this.items.find((item) => item.token === token);
    return refreshToken || null;
  }

  async deleteByUserId(userId: string): Promise<void> {
    this.items = this.items.filter((item) => item.userId !== userId);
  }
}
