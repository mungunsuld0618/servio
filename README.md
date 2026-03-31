# Servio - Гэртээ мэргэжлийн үйлчилгээ

Монголын хамгийн том үйлчилгээний зах зээлийн платформ. Гоо сайхан, маникюр, үсчин, цэвэрлэгээ, тогооч, асрагч зэрэг 100+ үйлчилгээг гэртээ захиалах боломжтой.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL + Drizzle ORM
- **Auth:** Supabase Auth
- **Payments:** Stripe
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** Zustand + TanStack Query
- **Rate Limiting:** Upstash Redis
- **PWA:** Serwist
- **Maps:** Leaflet / React-Leaflet

## Project Structure

```
servio/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── bookings/create/      # Booking creation + Stripe checkout
│   │   └── marketplace/orders/   # Product order + Stripe checkout
│   ├── dashboard/                # Dashboard (role-based)
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   └── sw.ts                     # Service Worker (PWA)
├── components/                   # React components
│   ├── dashboards/               # Role-specific dashboards
│   │   ├── admin-dashboard.tsx
│   │   ├── customer-dashboard.tsx
│   │   └── provider-dashboard.tsx
│   ├── ui/                       # shadcn/ui components
│   ├── header.tsx
│   └── providers.tsx             # React Query provider
├── lib/                          # Shared libraries
│   ├── auth/
│   │   └── auth-actions.ts       # Server actions (signUp, signIn, signOut)
│   ├── db/
│   │   ├── index.ts              # DB connection
│   │   ├── schema.ts             # Drizzle schema (all tables + relations)
│   │   └── queries.ts            # Admin & marketplace queries
│   ├── supabase/
│   │   ├── admin.ts              # Service role client
│   │   ├── client.ts             # Browser client
│   │   └── server.ts             # Server client (cookies)
│   ├── env.ts                    # Zod-validated env vars
│   └── utils.ts                  # Utilities (cn, formatPrice, formatIban)
├── middleware.ts                  # Rate limiting + admin auth guard
├── drizzle.config.ts             # Drizzle Kit config
├── next.config.mjs               # Next.js + Serwist config
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
├── .env.example
├── .gitignore
└── package.json
```

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/your-username/servio.git
cd servio
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env
```

`.env` файлд шаардлагатай утгуудаа оруулна уу.

### 3. Database Setup

```bash
npm run db:push
```

### 4. Run Development Server

```bash
npm run dev
```

`http://localhost:3000` дээр нээнэ.

## Key Features

- **Multi-role system:** Customer, Provider, Admin
- **Booking system** with Stripe / bank transfer / cash payment
- **Product marketplace** with order management
- **Real-time messaging** (Supabase Realtime)
- **Course platform** for provider training
- **Loyalty points & referral system**
- **Complaint management**
- **Audit logging**
- **Rate limiting** (Upstash Redis)
- **PWA support** (offline-capable)
- **Mongolian language** (mn-MN locale)

## License

Private
