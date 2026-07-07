# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Previewing the Production Build

Preview the production build locally:

```bash
npm run preview
```

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

Deployment is done using the Wrangler CLI.

To build and deploy directly to production:

```sh
npm run deploy
```

To deploy a preview URL:

```sh
npx wrangler versions upload
```

You can then promote a version to production after verification or roll it out progressively.

```sh
npx wrangler versions deploy
```

## Database

Project ini memakai Prisma untuk schema dan type generation, lalu Cloudflare D1 untuk database di runtime.

Kalau kamu pakai PowerShell di Windows, pakai `cmd /c` supaya command `npm` dan `npx` tidak kena policy eksekusi.

### 1. Generate Prisma client

```bash
npm run db:generate
```

### 2. Buat migrasi baru

```bash
npm run db:migrate:create -- nama_migrasi
```

Contoh:

```bash
npm run db:migrate:create -- add_balance_table
```

### 3. Jalankan migrasi ke database lokal

```bash
npm run db:migrate:local
```

### 4. Jalankan migrasi ke database Cloudflare

```bash
npm run db:migrate:remote
```

### 5. Cek isi tabel D1 lokal

```bash
.\node_modules\.bin\wrangler.cmd d1 execute DB --local --command "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"
```

### Alur paling simpel

```bash
npm run db:generate
npm run db:migrate:create -- nama_migrasi_baru
npm run db:migrate:local
npm run db:migrate:remote
```

### Catatan penting

- Folder migrasi D1 sekarang ada di `prisma/migrations`.
- File `prisma/schema.prisma` tetap jadi sumber schema utama.
- Runtime Worker mengambil database dari binding `env.DB` lewat adapter Prisma D1.

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
