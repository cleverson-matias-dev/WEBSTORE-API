import z from "zod";

export const registerUserSchema = z.object({
    body: z.object({
        email: z.email({message: 'Email inválido'}),
        password: z.string('Senha inválida'),
        firstName: z.string('Nome precisa ter 3 ou mais letras').min(3),
        lastName: z.string('Sobrenome tem que ter 3 ou mais letras').min(3)
    }).strict()
})
export type RegisterUserSchema = z.infer<typeof registerUserSchema>['body'];

export const loginUserSchema = z.object({
    body: z.object({
        email: z.email({message: 'Email inválido'}),
        password: z.string('Senha inválida')
    }).strict()
})
export type LoginUserSchema = z.infer<typeof loginUserSchema>['body'];

