import { Prisma, Role } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { orderStatusSchema } from '../schemas/index.js';
import { ApiError, asyncHandler } from '../utils/http.js';

export const checkout = asyncHandler(async (req, res) => {
  const order = await prisma.$transaction(async tx => {
    const cart = await tx.cartItem.findMany({ where: { userId: req.user!.id }, include: { product: true } });
    if (!cart.length) throw new ApiError(400, 'Cart is empty');
    for (const item of cart) {
      const changed = await tx.product.updateMany({ where: { id: item.productId, active: true, stock: { gte: item.quantity } }, data: { stock: { decrement: item.quantity } } });
      if (!changed.count) throw new ApiError(409, `Insufficient stock for ${item.product.name}`);
    }
    const total = cart.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
    const created = await tx.order.create({ data: { userId: req.user!.id, total: new Prisma.Decimal(total), items: { create: cart.map(item => ({ productId: item.productId, quantity: item.quantity, unitPrice: item.product.price })) } }, include: { items: { include: { product: true } } } });
    await tx.cartItem.deleteMany({ where: { userId: req.user!.id } });
    return created;
  });
  res.status(201).json(order);
});

export const listOrders = asyncHandler(async (req, res) => {
  const where = req.user!.role === Role.ADMIN ? {} : { userId: req.user!.id };
  res.json(await prisma.order.findMany({ where, include: { user: { select: { id: true, name: true, email: true } }, items: { include: { product: true } } }, orderBy: { createdAt: 'desc' } }));
});

export const updateOrderStatus = asyncHandler(async (req, res) => { const { status } = orderStatusSchema.parse(req.body); res.json(await prisma.order.update({ where: { id: String(req.params.id) }, data: { status } })); });
