import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { env } from '../config/env.js';
import { loginSchema, registerSchema } from '../schemas/index.js';
import { ApiError, asyncHandler } from '../utils/http.js';

const tokenFor = (id: string, role: string) => jwt.sign({ sub: id, role }, env.JWT_SECRET, { expiresIn: '1d' });

export const register = asyncHandler(async (req, res) => {
  const data = registerSchema.parse(req.body);
  if (await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } })) throw new ApiError(409, 'Email already registered');
  const user = await prisma.user.create({ data: { ...data, email: data.email.toLowerCase(), password: await bcrypt.hash(data.password, 12) }, select: { id: true, name: true, email: true, role: true } });
  res.status(201).json({ user, token: tokenFor(user.id, user.role) });
});

export const login = asyncHandler(async (req, res) => {
  const data = loginSchema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
  if (!user || !(await bcrypt.compare(data.password, user.password))) throw new ApiError(401, 'Invalid email or password');
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token: tokenFor(user.id, user.role) });
});

export const me = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id }, select: { id: true, name: true, email: true, role: true, createdAt: true } });
  if (!user) throw new ApiError(404, 'User not found');
  res.json(user);
});
