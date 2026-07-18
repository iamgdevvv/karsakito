# KarsaKito

KarsaKito adalah Ekosistem Produktivitas AI Bahasa Nusantara untuk membantu Pengguna membuat, menyempurnakan, menerjemahkan, dan mengolah teks melalui alur kerja terstruktur.

KarsaKito bukan chatbot prompt bebas. Pengguna memilih tool, mengisi parameter sesuai kebutuhan, lalu meninjau dan menyempurnakan hasil untuk pekerjaannya.

## Fitur saat ini

Fitur utama yang tersedia saat ini:

- KarsaWriter untuk menyusun berbagai draf tulisan.
- KarsaLisa untuk menganalisis penggunaan bahasa.
- KarsaFrase untuk parafrasa, rangkuman, dan adaptasi dialek.
- KarsaLator untuk menerjemahkan teks.

KarsaPedia dan KarsaLingo merupakan arah pengembangan berikutnya dan belum diposisikan sebagai fitur aktif. Mode Kreator di Workspace masih bersifat eksperimental.

## Token

KarsaKito menggunakan Token Aplikasi, bukan token API AI.

- Pengguna memperoleh hingga 100 Token harian yang tersedia kembali setiap pukul 00.00 sesuai timezone akun.
- Token harian digunakan lebih dahulu saat memakai tool.
- Estimasi harga Token adalah Rp50 per Token.
- Pembelian Token masih disiapkan; antarmuka top up saat ini hanya menampilkan estimasi harga.

## Teknologi

Project ini menggunakan React Router, React, Mantine, Cloudflare Workers, Cloudflare D1, dan Prisma.

## Menjalankan Project

Pasang dependensi:

```bash
npm install
```

Jalankan server pengembangan:

```bash
npm run dev
```

Aplikasi tersedia di `http://localhost:5173`.

## Build dan Deploy

Verifikasi build produksi:

```bash
npm run build
```

Deploy ke Cloudflare Workers:

```bash
npm run deploy
```

Untuk membuat dan mempromosikan versi preview:

```bash
npx wrangler versions upload
npx wrangler versions deploy
```

## Database

Project ini memakai Prisma sebagai sumber schema dan Cloudflare D1 sebagai database runtime. Tidak ada database SQLite lokal permanen; migrasi dibuat dari riwayat file `prisma/migrations` lalu diterapkan ke D1 remote dengan Wrangler.

Kalau memakai PowerShell di Windows, gunakan `cmd /c` jika command `npm` atau `npx` terkena policy eksekusi.

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

- Jangan gunakan `wrangler d1 migrations apply --local` untuk project ini.
- Jangan buat atau commit `prisma/db.sqlite`.
- `remote: true` berarti query dari dev server dapat menyentuh resource Cloudflare asli. Hindari operasi tulis atau hapus tanpa sadar.
- Untuk perubahan destruktif, backup atau export D1 remote terlebih dahulu, atau pastikan rencana rollback sudah jelas sebelum menjalankan `npm run db:migrate:remote`.
