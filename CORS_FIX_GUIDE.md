# 🔧 CORS Fix Guide - Solusi Error CORS

## Error yang Muncul

```
Access to XMLHttpRequest at 'http://localhost:3000/api/auth/login'
from origin 'http://localhost:3001' has been blocked by CORS policy:
Response to preflight request doesn't pass access control check:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Penyebab

Backend API (NestJS) belum mengaktifkan CORS atau tidak mengizinkan origin `http://localhost:3001`.

## ✅ Solusi: Update Backend Configuration

### Langkah 1: Buka File Backend

**File: `KostManagement/src/main.ts`**

### Langkah 2: Enable CORS

Tambahkan konfigurasi CORS sebelum `app.listen()`:

```typescript
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global prefix
  app.setGlobalPrefix("api");

  // ✅ Enable CORS - TAMBAHKAN INI
  app.enableCors({
    origin: [
      "http://localhost:3001", // Frontend development
      "http://localhost:3000", // Alternative frontend port
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Origin",
      "X-Requested-With",
    ],
    exposedHeaders: ["Authorization"],
    maxAge: 3600, // Cache preflight request for 1 hour
  });

  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000`);
}
bootstrap();
```

### Langkah 3: Restart Backend

```bash
# Stop backend (Ctrl+C)
# Restart
npm run start:dev
```

### Langkah 4: Test Login Lagi

1. Refresh halaman login: `http://localhost:3001/login`
2. Buka Browser Console (F12) → Network tab
3. Coba login dengan:
   - Username: `owner`
   - Password: `password123`
4. Cek Network tab - request harus berhasil (status 200 atau 201)

---

## Penjelasan Konfigurasi CORS

### `origin`

```typescript
origin: [
  'http://localhost:3001',  // Frontend URL
  'http://localhost:3000',  // Alternative
],
```

- Mengizinkan request dari frontend di port 3001
- Bisa tambahkan domain production nanti

### `credentials: true`

```typescript
credentials: true,
```

- Mengizinkan pengiriman cookies dan authorization headers
- Diperlukan untuk JWT authentication

### `methods`

```typescript
methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
```

- Mengizinkan HTTP methods yang digunakan API
- OPTIONS diperlukan untuk preflight request

### `allowedHeaders`

```typescript
allowedHeaders: [
  'Content-Type',    // Untuk JSON request
  'Authorization',   // Untuk JWT token
  'Accept',
  'Origin',
  'X-Requested-With',
],
```

- Headers yang diizinkan dari frontend

### `exposedHeaders`

```typescript
exposedHeaders: ['Authorization'],
```

- Headers yang bisa dibaca oleh frontend
- Diperlukan jika backend mengirim token di response header

### `maxAge: 3600`

```typescript
maxAge: 3600,
```

- Cache preflight request selama 1 jam
- Mengurangi jumlah OPTIONS request

---

## Alternatif: CORS Sederhana (Development Only)

Jika hanya untuk development, bisa gunakan konfigurasi sederhana:

```typescript
// ⚠️ HANYA UNTUK DEVELOPMENT - TIDAK AMAN UNTUK PRODUCTION
app.enableCors({
  origin: true, // Allow all origins
  credentials: true,
});
```

**⚠️ WARNING:** Jangan gunakan `origin: true` di production!

---

## Verifikasi CORS Berhasil

### ✅ Cek di Browser Console

1. Buka F12 → Network tab
2. Coba login
3. Klik request `/api/auth/login`
4. Cek Response Headers:

```
Access-Control-Allow-Origin: http://localhost:3001
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
```

### ✅ Tidak Ada Error CORS

Browser console tidak menampilkan error:

```
❌ blocked by CORS policy
```

### ✅ Login Berhasil

Setelah login, redirect ke dashboard atau home page.

---

## Troubleshooting CORS

### Masalah 1: Masih Error Setelah Enable CORS

**Solusi:**

1. Pastikan backend sudah di-restart
2. Clear browser cache (Ctrl+Shift+Delete)
3. Hard refresh (Ctrl+Shift+R)
4. Coba di incognito/private window

### Masalah 2: Error di Production

**Solusi:**
Update `origin` dengan domain production:

```typescript
app.enableCors({
  origin: [
    "http://localhost:3001", // Development
    "https://yourdomain.com", // Production
    "https://www.yourdomain.com", // Production with www
  ],
  credentials: true,
  // ... rest of config
});
```

### Masalah 3: Preflight Request Failed

**Solusi:**
Pastikan `OPTIONS` method diizinkan:

```typescript
methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
```

### Masalah 4: Authorization Header Tidak Terkirim

**Solusi:**
Pastikan `credentials: true` dan `Authorization` di `allowedHeaders`:

```typescript
credentials: true,
allowedHeaders: ['Content-Type', 'Authorization'],
```

---

## CORS untuk Environment Variables

Untuk lebih fleksibel, gunakan environment variables:

### File: `KostManagement/.env`

```bash
FRONTEND_URL=http://localhost:3001
CORS_ORIGINS=http://localhost:3001,http://localhost:3000
```

### File: `KostManagement/src/main.ts`

```typescript
app.enableCors({
  origin: process.env.CORS_ORIGINS?.split(",") || ["http://localhost:3001"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
```

---

## Testing CORS dengan curl

Test preflight request:

```bash
curl -X OPTIONS http://localhost:3000/api/auth/login \
  -H "Origin: http://localhost:3001" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization" \
  -v
```

Response harus include:

```
Access-Control-Allow-Origin: http://localhost:3001
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## Checklist CORS Configuration

- [ ] `app.enableCors()` dipanggil di `main.ts`
- [ ] `origin` include `http://localhost:3001`
- [ ] `credentials: true` untuk JWT
- [ ] `methods` include `OPTIONS`
- [ ] `allowedHeaders` include `Authorization`
- [ ] Backend sudah di-restart
- [ ] Browser cache sudah di-clear
- [ ] Test login berhasil

---

## Summary

**Error CORS terjadi karena:**

- Backend belum enable CORS
- Backend tidak mengizinkan origin frontend

**Solusi:**

1. ✅ Tambahkan `app.enableCors()` di `main.ts`
2. ✅ Restart backend
3. ✅ Test login lagi

**Setelah fix CORS:**

- Login harus berhasil
- Token tersimpan di localStorage
- Redirect ke dashboard

---

## Next Steps

Setelah CORS berhasil dan login berhasil:

1. ✅ Test logout functionality di `/test-logout`
2. 🔄 Implementasi dashboard layout (Task 9)
3. 🔄 Implementasi fitur-fitur lainnya

---

**Catatan:** CORS adalah security feature di browser. Backend harus explicitly mengizinkan frontend untuk mengakses API.

**Happy Coding! 🚀**
