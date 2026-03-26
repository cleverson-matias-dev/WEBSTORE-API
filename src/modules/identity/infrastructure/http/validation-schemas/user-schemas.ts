import { z } from 'zod';
import { UserRole } from '../../persistence/entities/user-entity';

export const CreateUserSchema = z.object({
  body: z.object({
    email: z.string()
        .email('E-mail inválido')
        .min(5, 'E-mail muito curto')
        .toLowerCase(),
    password: z.string()
        .min(8, 'A senha deve ter no mínimo 8 caracteres'),
    firstName: z.string()
        .min(2, 'Nome deve ter pelo menos 2 caracteres')
        .max(50),
    lastName: z.string()
        .min(2, 'Sobrenome deve ter pelo menos 2 caracteres')
        .max(50),
    role: z.nativeEnum(UserRole).optional().default(UserRole.CLIENT),
  })
});

export const UpdateUserSchema = z.object({
  body: z.object({
    email: z
        .email({message: 'email inválido'})
        .optional()
        .or(z.literal('')),

    password: z
        .string()
        .min(6, "A senha deve ter pelo menos 6 caracteres")
        .optional()
        .or(z.literal('')),

    firstName: z
        .string()
        .min(1, "Nome não pode estar vazio")
        .optional()
        .or(z.literal('')),

    lastName: z
        .string()
        .min(1, "Sobrenome não pode estar vazio")
        .optional()
        .or(z.literal('')),

    role: z
        .nativeEnum(UserRole).optional().or(z.literal(''))
    })
});

export const PaginationSchema = z.object({
    query: z.object({
        page: z.coerce.number({error: 'page deve ser um número'}).int().positive({error:'page deve ser um número positivo'}).default(1),
        limit: z.coerce.number({error: 'limit dever ser um número'}).int().positive({error:'limit deve ser um número positivo'}).max(100).default(10),
        search: z.string().optional()
    })
});

export const FindBySchema = z.object({
    query: z.object({
        id: z.string().uuid('ID inválido').optional(),
        email: z.string().email().optional(),
        role: z.nativeEnum(UserRole).optional(),
    }).refine(data => Object.keys(data).length > 0, {
        message: "Pelo menos um critério de busca deve ser fornecido",
    })
})

export const IdParamSchema = z.object({
    params: z.object({
        id: z.string().uuid('O formato do ID é inválido'),
    })
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema>['body'];
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>['body'];
