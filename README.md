# StockPilot Commerce API

A production-ready e-commerce REST API for product catalogues, inventory, shopping carts, authentication, and transaction-safe order processing.

Built with TypeScript, Express, PostgreSQL, Prisma ORM, JWT authentication, Swagger, and automated API testing.

## Live Deployment

- **Live API:** https://stockpilot-commerce-api-dcke.vercel.app/
- **Swagger Documentation:** https://stockpilot-commerce-api-dcke.vercel.app/api/docs/
- **Health Check:** https://stockpilot-commerce-api-dcke.vercel.app/api/health

## Key Features

- TypeScript and Express 5 backend architecture
- PostgreSQL database with Prisma ORM
- JWT authentication
- Admin and Customer role-based authorization
- Product and category management
- Inventory and stock tracking
- Customer shopping carts
- Transaction-safe checkout
- Automatic stock reduction after successful checkout
- Prevention of negative inventory
- Product search, filtering, and pagination
- Zod request validation
- Centralized error handling
- Helmet security headers
- CORS configuration
- Authentication rate limiting
- Interactive Swagger documentation
- Vitest and Supertest API testing
- Docker-based local PostgreSQL environment
- Serverless deployment on Vercel

## Architecture

```mermaid
flowchart LR
  A[API Client] --> B[Express REST API]
  B --> C[JWT Authentication]
  B --> D[Zod Validation]
  B --> E[Prisma ORM]
  E --> F[(PostgreSQL)]
```

## Demo Accounts

The following accounts are available after database seeding:

### Admin

- Email: `admin@stockpilot.dev`
- Password: `DemoPass123!`

### Customer

- Email: `customer@stockpilot.dev`
- Password: `DemoPass123!`

## API Endpoints

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/health` | Public | Check API status |
| POST | `/api/auth/register` | Public | Register a customer |
| POST | `/api/auth/login` | Public | Login and receive JWT |
| GET | `/api/auth/me` | Authenticated | View current user |
| GET | `/api/products` | Public | List products |
| GET | `/api/products/:id` | Public | View one product |
| POST | `/api/products` | Admin | Create product |
| PATCH | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |
| GET | `/api/categories` | Public | List categories |
| POST | `/api/categories` | Admin | Create category |
| GET | `/api/cart` | Authenticated | View current cart |
| POST | `/api/cart` | Authenticated | Add or update cart item |
| DELETE | `/api/cart/:id` | Authenticated | Remove cart item |
| POST | `/api/orders/checkout` | Authenticated | Checkout current cart |
| GET | `/api/orders` | Authenticated | View permitted orders |
| PATCH | `/api/orders/:id/status` | Admin | Update order status |

## Transaction-Safe Checkout

Checkout runs inside a Prisma database transaction.

Before creating an order, the API verifies that every requested product has sufficient stock. Stock is reduced only when the required quantity is available.

If any product has insufficient stock, the complete transaction is rolled back. This prevents:

- Partially created orders
- Incorrect stock quantities
- Negative inventory
- Inconsistent order data

## Authentication

Protected endpoints require a JWT bearer token:

```http
Authorization: Bearer YOUR_TOKEN
```

You can obtain a token through:

```http
POST /api/auth/login
```

The token can also be entered using the **Authorize** button in the Swagger documentation.

## Local Setup

### Requirements

- Node.js 20+
- Docker Desktop
- npm

### Installation

1. Clone the repository.

```bash
git clone https://github.com/munazza-shan-web/StockPilot-Commerce-API.git
cd StockPilot-Commerce-API
```

2. Install dependencies.

```bash
npm install
```

3. Copy `.env.example` to `.env`.

4. Start PostgreSQL.

```bash
docker compose up -d
```

5. Create the database tables.

```bash
npm run db:push
```

6. Seed the database.

```bash
npm run db:seed
```

7. Start the development server.

```bash
npm run dev
```

8. Open the documentation:

```text
http://localhost:4000/api/docs/
```

## Environment Variables

```env
DATABASE_URL=postgresql://stockpilot:stockpilot@localhost:5432/stockpilot
JWT_SECRET=replace_with_a_secret_containing_at_least_32_characters
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

Never commit production credentials or secrets to GitHub.

## Testing

Run the automated test suite:

```bash
npm test
```

The project uses Vitest and Supertest for API endpoint testing.

## Technology Stack

- Node.js
- TypeScript
- Express 5
- PostgreSQL
- Prisma ORM
- JSON Web Tokens
- Zod
- Swagger / OpenAPI
- Vitest
- Supertest
- Docker
- Vercel
- Neon PostgreSQL

## Author

**Munazza Shan** — Full-Stack Web Developer

- GitHub: https://github.com/munazza-shan-web
- Portfolio: https://munazza-shan-web.github.io/munazza-shan-web/
