# Network Error Fix - Solusi Error Koneksi

## Masalah yang Diperbaiki

Error yang muncul saat login:

```
Network error - no response received
AxiosError: Network Error
```

## Penyebab

Frontend tidak dapat terhubung ke backend API karena:

1. Backend API belum berjalan
2. Backend berjalan di port yang berbeda
3. CORS tidak dikonfigurasi dengan benar

## Solusi yang Diimplementasikan

### 1. Error Handler yang Lebih Informatif

**File: `lib/api/errorHandler.ts`**

Diupdate untuk memberikan pesan error yang lebih jelas dalam Bahasa Indonesia:

```typescript
} else if (error.request) {
  // Request made but no response received
  return 'Tidak dapat terhubung ke server. Pastikan:\n• Backend API berjalan di http://localhost:3000\n• Koneksi internet Anda stabil\n• Tidak ada firewall yang memblokir koneksi';
}
```

### 2. Login Page dengan Error Message yang Lebih Baik

**File: `app/(auth)/login/page.tsx`**

Menampilkan pesan error yang lebih detail untuk network error:

```typescript
if (!err.response && err.request) {
  // Network error - show detailed message
  setError(
    "❌ Tidak dapat terhubung ke server\n\n" +
      "Pastikan:\n" +
      "1. Backend API berjalan di http://localhost:3000\n" +
      "2. Jalankan: cd ../KostManagement && npm run start:dev\n" +
      "3. Cek file .env.local sudah benar\n\n" +
      "Lihat TROUBLESHOOTING.md untuk panduan lengkap"
  );
}
```

### 3. Troubleshooting Guide

**File: `TROUBLESHOOTING.md`**

Panduan lengkap untuk mengatasi berbagai error, termasuk:

- Network error
- CORS error
- 401 Unauthorized
- Module not found
- TypeScript errors
- Build errors

## Cara Mengatasi Error

### Langkah 1: Jalankan Backend API

```bash
# Buka terminal baru
cd path/to/KostManagement

# Install dependencies (jika belum)
npm install

# Jalankan backend
npm run start:dev
```

**Tunggu sampai muncul:**

```
[Nest] LOG [NestApplication] Nest application successfully started
```

### Langkah 2: Verifikasi Backend Berjalan

**Test dengan browser:**

```
http://localhost:3000/api
```

**Atau dengan curl:**

```bash
curl http://localhost:3000/api
```

Jika backend berjalan, Anda akan melihat response (bukan "Connection refused").

### Langkah 3: Cek Environment Variables

**File: `kost-management-frontend/.env.local`**

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=Kost Management
NEXT_PUBLIC_APP_VERSION=1.0.0
NODE_ENV=development
```

### Langkah 4: Restart Frontend

```bash
# Stop frontend (Ctrl+C di terminal frontend)
# Restart
npm run dev
```

**PENTING:** Next.js harus di-restart setiap kali mengubah `.env.local`!

### Langkah 5: Test Login

1. Buka `http://localhost:3001/login`
2. Masukkan credentials:
   - Username: `owner`
   - Password: `password123`
3. Klik "Masuk"

## Verifikasi Solusi Berhasil

### ✅ Backend Berjalan dengan Benar

Terminal backend menampilkan:

```
[Nest] LOG [NestApplication] Nest application successfully started
```

### ✅ Frontend Dapat Terhubung

Browser console (F12) tidak menampilkan error "Network Error"

### ✅ Login Berhasil

Setelah login, redirect ke dashboard (atau halaman home)

## Troubleshooting Tambahan

### Jika Masih Error Setelah Mengikuti Langkah di Atas

1. **Cek Port Conflict**

   ```bash
   # Windows
   netstat -ano | findstr :3000

   # Mac/Linux
   lsof -i :3000
   ```

2. **Cek CORS di Backend**

   File: `src/main.ts`

   ```typescript
   app.enableCors({
     origin: "http://localhost:3001",
     credentials: true,
   });
   ```

3. **Clear Browser Cache**
   - F12 → Application → Clear Storage → Clear site data
   - Restart browser

4. **Cek Firewall/Antivirus**
   - Pastikan Node.js diizinkan
   - Tambahkan exception untuk localhost

5. **Test dengan Postman**
   - Import API collection
   - Test endpoint `/api/auth/login`
   - Pastikan backend merespons

## File yang Dimodifikasi

1. ✅ `lib/api/errorHandler.ts` - Error handler yang lebih informatif
2. ✅ `app/(auth)/login/page.tsx` - Error message yang lebih detail
3. ✅ `TROUBLESHOOTING.md` - Panduan troubleshooting lengkap
4. ✅ `NETWORK_ERROR_FIX.md` - Dokumentasi solusi (file ini)

## Testing

### Manual Test

1. **Test dengan Backend Mati**
   - Stop backend
   - Coba login
   - Harus muncul error message yang informatif

2. **Test dengan Backend Hidup**
   - Start backend
   - Coba login dengan credentials yang benar
   - Harus berhasil login dan redirect

3. **Test dengan Credentials Salah**
   - Backend hidup
   - Login dengan password salah
   - Harus muncul error "Username atau password salah"

## Kesimpulan

Error "Network Error" sekarang ditangani dengan lebih baik:

✅ Pesan error lebih informatif dalam Bahasa Indonesia
✅ Instruksi jelas untuk mengatasi masalah
✅ Panduan troubleshooting lengkap tersedia
✅ User tahu persis apa yang harus dilakukan

## Next Steps

Setelah backend berjalan dan login berhasil:

1. Test logout functionality di `/test-logout`
2. Lanjutkan implementasi dashboard layout (Task 9)
3. Implementasi fitur-fitur lainnya sesuai tasks.md

---

**Catatan:** Error ini adalah error yang umum terjadi saat development. Solusi ini membantu developer untuk cepat mengidentifikasi dan mengatasi masalah koneksi.
