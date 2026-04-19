import z from 'zod';

export const LoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  })
});

export const RefreshSchema = z.object({
  body: z.object({
    refreshToken: z.string(),
  })
});