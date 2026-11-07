This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Tests

Tests live in a `__tests__` folder within the section they cover.

Run the test suite once:

```bash
npm test
```

Run tests automatically while editing:

```bash
npm run test:watch
```

Route Handler tests run in Node.js using Vitest. They call the real handlers
without mocking NextResponse or the sample data, and check HTTP status, JSON
content type, vehicle IDs and prices, and the documented financing policy.
They do not start an HTTP server or test Next.js routing and caching.

API client tests also cover Zod validation, HTTP and JSON errors, cancellation
error propagation, and request signals. Query tests exercise independent caches,
fresh-data reuse, transient retries, and failures that must not be retried.

Calculation tests live in `features/installment-calculator/lib/__tests__`.
They cover a manually calculated loan, zero interest, final-payment rounding,
full down payment, invalid inputs, safe-integer limits, and consistency between
schedule rows and totals. The rounding policy is documented in `DECISIONS.md`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
