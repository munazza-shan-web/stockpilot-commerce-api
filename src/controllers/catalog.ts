import { prisma } from '../lib/prisma.js';
import { categorySchema, productSchema } from '../schemas/index.js';
import { ApiError, asyncHandler, slugify } from '../utils/http.js';

export const listProducts = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1), limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
  const search = String(req.query.search || ''), category = req.query.category ? String(req.query.category) : undefined;
  const where = { active: true, ...(search ? { name: { contains: search, mode: 'insensitive' as const } } : {}), ...(category ? { category: { slug: category } } : {}) };
  const [items, total] = await prisma.$transaction([prisma.product.findMany({ where, include: { category: true }, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }), prisma.product.count({ where })]);
  res.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: String(req.params.id) }, include: { category: true } });
  if (!product) throw new ApiError(404, 'Product not found');
  res.json(product);
});

export const createProduct = asyncHandler(async (req, res) => {
  const data = productSchema.parse(req.body);
  const product = await prisma.product.create({ data: { ...data, slug: `${slugify(data.name)}-${Date.now().toString(36)}` }, include: { category: true } });
  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const data = productSchema.partial().parse(req.body);
  res.json(await prisma.product.update({ where: { id: String(req.params.id) }, data, include: { category: true } }));
});

export const deleteProduct = asyncHandler(async (req, res) => { await prisma.product.delete({ where: { id: String(req.params.id) } }); res.status(204).send(); });
export const listCategories = asyncHandler(async (_req, res) => { res.json(await prisma.category.findMany({ include: { _count: { select: { products: true } } }, orderBy: { name: 'asc' } })); });
export const createCategory = asyncHandler(async (req, res) => { const data = categorySchema.parse(req.body); res.status(201).json(await prisma.category.create({ data: { name: data.name, slug: slugify(data.name) } })); });
