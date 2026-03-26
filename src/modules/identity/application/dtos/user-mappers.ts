import { User as DomainUser } from '@modules/identity/domain/entities/User';
import { Email } from '@modules/identity/domain/value-objects/email-vo';
import { Password } from '@modules/identity/domain/value-objects/password-vo';
import { User as PersistenceUser } from '@modules/identity/infrastructure/persistence/entities/user-entity';
import { UserResponseDTO } from './user-dtos';

export class UserMapper {
  static toDomain(raw: PersistenceUser): DomainUser {
    return DomainUser.create({
      id: raw.id,
      email: Email.create(raw.email),
      password: Password.create(raw.password),
      firstName: raw.firstName,
      lastName: raw.lastName,
      role: raw.role,
      isActive: raw.isActive,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(domain: DomainUser): Partial<PersistenceUser> {
    return {
      id: domain.id,
      password: (domain as any).props.password.getValue,
      email: domain.email,
      firstName: (domain as any).props.firstName,
      lastName: (domain as any).props.lastName,
      role: (domain as any).props.role,
      isActive: (domain as any).props.isActive,
    };
  }

  static toDTO(domain: DomainUser): UserResponseDTO {
    return {
      id: domain.id!,
      email: domain.email,
      fullName: domain.fullName,
      role: (domain as any).props.role,
      isActive: (domain as any).props.isActive,
      createdAt: (domain as any).props.createdAt,
    };
  }
}
