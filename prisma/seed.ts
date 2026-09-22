import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('DemoPass123!', 12);
  await prisma.user.upsert({ where: { email: 'admin@stockpilot.dev' }, update: {}, create: { name: 'StockPilot Admin', email: 'admin@stockpilot.dev', password, role: Role.ADMIN } });
  await prisma.user.upsert({ where: { email: 'customer@stockpilot.dev' }, update: {}, create: { name: 'Demo Customer', email: 'customer@stockpilot.dev', password } });
  const electronics = await prisma.category.upsert({ where: { slug: 'electronics' }, update: {}, create: { name: 'Electronics', slug: 'electronics' } });
  const office = await prisma.category.upsert({ where: { slug: 'office' }, update: {}, create: { name: 'Office', slug: 'office' } });
  const products = [
    { name: 'Wireless Keyboard', slug: 'wireless-keyboard', description: 'Compact rechargeable keyboard', price: 49.99, stock: 35, categoryId: electronics.id },
    { name: 'USB-C Hub', slug: 'usb-c-hub', description: 'Seven-port productivity hub', price: 39.99, stock: 50, categoryId: electronics.id },
    { name: 'Desk Organizer', slug: 'desk-organizer', description: 'Minimal modular desk organizer', price: 24.5, stock: 80, categoryId: office.id }
  ];
  for (const product of products) await prisma.product.upsert({ where: { slug: product.slug }, update: product, create: product });
}

main().finally(() => prisma.$disconnect());
