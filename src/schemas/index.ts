import { z } from 'zod';

export const registerSchema = z.object({ name: z.string().min(2).max(80), email: z.string().email(), password: z.string().min(8).max(100) });
export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
export const categorySchema = z.object({ name: z.string().min(2).max(80) });
export const productSchema = z.object({ name: z.string().min(2).max(120), description: z.string().max(1000).optional(), price: z.coerce.number().positive(), stock: z.coerce.number().int().min(0), categoryId: z.string().min(1), active: z.boolean().optional() });
export const cartSchema = z.object({ productId: z.string().min(1), quantity: z.coerce.number().int().min(1).max(99) });
export const orderStatusSchema = z.object({ status: z.enum(['PENDING','PAID','PROCESSING','SHIPPED','DELIVERED','CANCELLED']) });
