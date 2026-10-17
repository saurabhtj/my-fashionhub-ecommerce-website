# my-fashionhub-ecommerce-website

This is a Next.js App Router e-commerce site with Prisma, PostgreSQL, NextAuth, and Razorpay Test Mode.

## Local development

Copy `.env.example` to `.env.local`, set a PostgreSQL `DATABASE_URL` and the required NextAuth/Razorpay test values, then install and run:

```bash
npm install
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The old SQLite database and its migrations are preserved under `prisma/sqlite-source/`; the local database file is ignored by Git. See [docs/deployment.md](./docs/deployment.md) for the Netlify + Render deployment and safe one-time import instructions, and [docs/admin-launch.md](./docs/admin-launch.md) for admin setup.

## Deployment status

The project is pushed to [GitHub](https://github.com/saurabhtj/my-fashionhub-ecommerce-website); Render and Netlify services have not yet been created. Render Free Postgres is temporary and must not be used for real orders; see the deployment guide before creating resources.
