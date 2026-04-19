import type { IRefreshTokenRepository } from '@modules/identity/application/interfaces/repository/interface-refresh-token-repository';
import { AppDataSource } from '@shared/infra/db/data-source';
import { Repository } from 'typeorm';
import { RefreshTokenEntity } from './entities/refresh-token-entity';

export class TypeOrmRefreshTokenRepository implements IRefreshTokenRepository {
  private repository: Repository<RefreshTokenEntity> = AppDataSource.getRepository(RefreshTokenEntity)


  async save(userId: string, token: string, expiresAt: Date): Promise<void> {
    const refreshToken = this.repository.create({
      userId,
      token,
      expiresAt,
    });

    await this.repository.save(refreshToken);
  }

  async findByToken(token: string): Promise<RefreshTokenEntity | null> {
    return await this.repository.findOne({
      where: { token },
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.repository.delete({ userId });
  }
}
