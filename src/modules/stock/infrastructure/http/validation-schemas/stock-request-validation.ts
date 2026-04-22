import { z } from 'zod';

// --- Warehouse Schemas ---
export const CreateWarehouseSchema = z.object({
    body: z.object({
        code: z.string().min(2, "Código deve ter pelo menos 2 caracteres").toUpperCase(),
        name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    })
});

export const GetDetailsSchema = z.object({
    params: z.object({
        sku: z.uuid(),
    })
});

export const UpdateWarehouseSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  isActive: z.boolean().optional(),
});

// --- Stock Management Schemas ---
export const AdjustStockSchema = z.object({
  body: z.object({
    sku: z.string().min(1, "SKU é obrigatório"),
    warehouseId: z.string().uuid("ID do armazém inválido"),
    amount: z.number().int("A quantidade deve ser um número inteiro"),
    reason: z.string().min(5, "A razão deve ter pelo menos 5 caracteres"),
  })
});

export const CheckAvailabilitySchema = z.object({
  query: z.object({
    sku: z.string().min(1, "SKU é obrigatório"),
    warehouseId: z.string().uuid("ID do armazém inválido"),
  })
});

export const ReserveStockSchema = z.object({
  body: z.object({
    orderId: z.string().min(1, "ID do pedido é obrigatório"),
    sku: z.string().min(1, "SKU é obrigatório"),
    warehouseId: z.string().uuid("ID do armazém inválido"),
    quantity: z.number().positive("A quantidade deve ser maior que zero"),
  })
});
