import { prisma } from '../lib/prisma.js';
import { cartSchema } from '../schemas/index.js';
import { ApiError, asyncHandler } from '../utils/http.js';

export const getCart = asyncHandler(async (req, res) => {
  const items = await prisma.cartItem.findMany({ where: { userId: req.user!.id }, include: { product: true } });
  const total = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
  res.json({ items, total: Number(total.toFixed(2)) });
});

export const addToCart = asyncHandler(async (req, res) => {
  const data = cartSchema.parse(req.body);
  const product = await prisma.product.findUnique({ where: { id: data.productId } });
  if (!product || !product.active) throw new ApiError(404, 'Product not found');
  if (data.quantity > product.stock) throw new ApiError(409, 'Requested quantity exceeds stock');
  const item = await prisma.cartItem.upsert({ where: { userId_productId: { userId: req.user!.id, productId: data.productId } }, update: { quantity: data.quantity }, create: { userId: req.user!.id, ...data }, include: { product: true } });
  res.status(201).json(item);
});

export const removeCartItem = asyncHandler(async (req, res) => { await prisma.cartItem.deleteMany({ where: { id: String(req.params.id), userId: req.user!.id } }); res.status(204).send(); });
