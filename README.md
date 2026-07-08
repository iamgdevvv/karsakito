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

Project ini memakai Prisma sebagai sumber schema dan Cloudflare D1 sebagai database runtime. Tidak ada database SQLite lokal permanen; migrasi dibuat dari riwayat file `prisma/migrations` lalu diterapkan ke D1 remote dengan Wrangler.

Kalau kamu pakai PowerShell di Windows, pakai `cmd /c` jika command `npm` atau `npx` terkena policy eksekusi.

### Konfigurasi

- Binding D1 ada di `wrangler.jsonc` dengan `binding: "DB"` dan `remote: true`.
- Folder migrasi ada di `prisma/migrations`.
- Layout migrasi memakai format Prisma nested: `0001_nama_migrasi/migration.sql`.
- Wrangler membaca layout nested lewat `migrations_pattern`.

### Membuat migrasi berikutnya

1. Edit model di `prisma/schema.prisma`.
2. Buat file migrasi dari diff schema:

```bash
npm run db:migrate:create -- nama_migrasi
```

3. Review file SQL yang dibuat di `prisma/migrations/<nomor>_nama_migrasi/migration.sql`.
4. Cek migrasi yang pending di Cloudflare D1:

```bash
npm run db:migrate:list
```

5. Terapkan migrasi ke D1 remote:

```bash
npm run db:migrate:remote
```

6. Verifikasi tabel remote:

```bash
npm run db:tables
```

7. Generate ulang Prisma client kalau schema berubah:

```bash
npm run db:generate
```

### Catatan aman

- Jangan pakai `wrangler d1 migrations apply --local` untuk project ini.
- Jangan buat atau commit `prisma/db.sqlite`.
- `remote: true` berarti query dari dev server dapat menyentuh resource Cloudflare asli. Hindari operasi tulis/hapus tanpa sadar.
- Untuk perubahan destruktif, backup/export D1 remote dulu atau pastikan rollback plan jelas sebelum `npm run db:migrate:remote`.

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
