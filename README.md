# StockPilot Commerce API

A production-style TypeScript REST API for products, inventory, carts, and transaction-safe order management. Built to demonstrate backend architecture, relational data modelling, authentication, authorization, validation, testing, documentation, and deployment skills.

## Highlights

- TypeScript and Express 5
- PostgreSQL with Prisma ORM
- JWT authentication and Admin/Customer roles
- Products, categories, inventory, carts, and orders
- Atomic checkout transaction with guarded stock reduction
- Search, category filtering, and pagination
- Zod validation and centralized error responses
- Helmet, CORS, and authentication rate limiting
- Swagger UI at `/api/docs`
- Vitest and Supertest
- Docker-based local PostgreSQL
- Vercel-ready serverless entry point

## Demo accounts after seeding

- Admin: `admin@stockpilot.dev` / `DemoPass123!`
- Customer: `customer@stockpilot.dev` / `DemoPass123!`

## Local setup

1. Copy `.env.example` to `.env`.
2. Run `docker compose up -d`.
3. Set `DATABASE_URL="postgresql://stockpilot:stockpilot@localhost:5432/stockpilot"` in `.env`.
4. Run `npm install`.
5. Run `npm run db:push`.
6. Run `npm run db:seed`.
7. Run `npm run dev`.
8. Open `http://localhost:4000/api/docs`.

## Main endpoints

| Method | Route | Access |
|---|---|---|
| GET | `/api/health` | Public |
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/products` | Public |
| POST/PATCH/DELETE | `/api/products` | Admin |
| GET/POST | `/api/cart` | Customer/Admin |
| POST | `/api/orders/checkout` | Customer/Admin |
| GET | `/api/orders` | Authenticated |
| PATCH | `/api/orders/:id/status` | Admin |

## Transaction-safe inventory

Checkout runs inside a Prisma transaction. Each product is updated only when enough stock remains (`stock >= requested quantity`). If any item fails, the complete transaction rolls back, preventing partial orders and negative inventory.

## Deployment environment variables

- `DATABASE_URL`
- `JWT_SECRET` (32+ random characters)
- `CLIENT_URL`
- `NODE_ENV=production`

## Author

**Munazza Shan** — Full-Stack Web Developer  
[GitHub](https://github.com/munazza-shan-web) · [Portfolio](https://munazza-shan-web.github.io/munazza-shan-web/)
