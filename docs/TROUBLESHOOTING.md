# 🔧 Troubleshooting Guide - Kost Management Frontend

## Error: Network Error - Tidak Dapat Terhubung ke Server

### Gejala

Saat mencoba login, muncul error:

```
Network error - no response received
Tidak dapat terhubung ke server
```

### Penyebab

Frontend tidak dapat terhubung ke backend API di `http://localhost:3000/api`

### Solusi

#### 1. Pastikan Backend API Berjalan

**Cek apakah backend sudah berjalan:**

```bash
# Buka terminal baru
cd path/to/KostManagement

# Jalankan backend
npm run start:dev
```

**Output yang benar:**

```
[Nest] 12345  - 01/07/2026, 10:00:00 AM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 01/07/2026, 10:00:00 AM     LOG [InstanceLoader] AppModule dependencies initialized
[Nest] 12345  - 01/07/2026, 10:00:00 AM     LOG [RoutesResolver] AuthController {/api/auth}:
[Nest] 12345  - 01/07/2026, 10:00:00 AM     LOG [RouterExplorer] Mapped {/api/auth/login, POST} route
[Nest] 12345  - 01/07/2026, 10:00:00 AM     LOG [NestApplication] Nest application successfully started
```

#### 2. Verifikasi Backend Berjalan di Port 3000

**Test dengan curl atau browser:**

```bash
# Test dengan curl
curl http://localhost:3000/api

# Atau buka di browser
http://localhost:3000/api
```

**Jika backend berjalan, Anda akan melihat response (bukan error "Connection refused")**

#### 3. Cek Environment Variables

**File: `kost-management-frontend/.env.local`**

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

**Pastikan:**

- File `.env.local` ada di root folder frontend
- URL sesuai dengan port backend
- Tidak ada typo atau spasi ekstra

#### 4. Restart Frontend Setelah Mengubah .env

```bash
# Stop frontend (Ctrl+C)
# Restart
npm run dev
```

**PENTING:** Next.js harus di-restart setiap kali mengubah environment variables!

#### 5. Cek CORS di Backend

**File backend: `src/main.ts`**

Pastikan CORS enabled:

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: "http://localhost:3001", // Frontend URL
    credentials: true,
  });

  await app.listen(3000);
}
```

#### 6. Cek Firewall/Antivirus

Beberapa firewall atau antivirus bisa memblokir koneksi localhost:

- **Windows Defender Firewall**: Pastikan Node.js diizinkan
- **Antivirus**: Tambahkan exception untuk localhost:3000 dan localhost:3001
- **VPN**: Coba matikan VPN jika ada

#### 7. Cek Port Conflict

Pastikan tidak ada aplikasi lain yang menggunakan port 3000:

**Windows:**

```bash
netstat -ano | findstr :3000
```

**Mac/Linux:**

```bash
lsof -i :3000
```

Jika ada aplikasi lain, stop aplikasi tersebut atau ubah port backend.

---

## Error: 401 Unauthorized

### Gejala

```
Session expired. Please login again.
```

### Penyebab

- Username atau password salah
- Token expired
- Backend tidak mengenali token

### Solusi

1. **Cek Credentials**
   - Username: `owner`
   - Password: `password123`

2. **Clear Browser Storage**

   ```
   F12 → Application → Local Storage → Clear All
   F12 → Application → Cookies → Clear All
   ```

3. **Restart Browser**

---

## Error: CORS Policy

### Gejala

```
Access to XMLHttpRequest at 'http://localhost:3000/api/auth/login'
from origin 'http://localhost:3001' has been blocked by CORS policy
```

### Solusi

**Update backend `src/main.ts`:**

```typescript
app.enableCors({
  origin: ["http://localhost:3001", "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
```

---

## Error: Module Not Found

### Gejala

```
Module not found: Can't resolve '@/components/ui/button'
```

### Solusi

```bash
# Clear cache
rm -rf node_modules .next
npm install

# Install missing component
npx shadcn-ui@latest add button
```

---

## Error: TypeScript Errors

### Gejala

Red squiggly lines di VS Code, build gagal

### Solusi

1. **Restart TypeScript Server**
   - VS Code: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

2. **Check tsconfig.json**

   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```

3. **Clear TypeScript Cache**
   ```bash
   rm -rf .next
   npm run dev
   ```

---

## Error: Build Failed

### Gejala

```
npm run build
Error: Build failed
```

### Solusi

1. **Check for TypeScript Errors**

   ```bash
   npx tsc --noEmit
   ```

2. **Check for ESLint Errors**

   ```bash
   npm run lint
   ```

3. **Clear and Rebuild**
   ```bash
   rm -rf .next
   npm run build
   ```

---

## Checklist Sebelum Memulai Development

- [ ] Backend API berjalan di `http://localhost:3000`
- [ ] Frontend berjalan di `http://localhost:3001`
- [ ] File `.env.local` sudah dibuat dengan `NEXT_PUBLIC_API_URL`
- [ ] CORS enabled di backend
- [ ] Database sudah di-migrate dan di-seed
- [ ] Node modules sudah di-install (`npm install`)
- [ ] Browser cache sudah di-clear

---

## Quick Test Commands

### Test Backend

```bash
# Test API endpoint
curl http://localhost:3000/api

# Test login endpoint
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"owner","password":"password123"}'
```

### Test Frontend

```bash
# Check if dev server running
curl http://localhost:3001

# Check environment variables
npm run dev
# Look for: NEXT_PUBLIC_API_URL in console
```

---

## Masih Bermasalah?

### Debug Steps

1. **Check Browser Console (F12)**
   - Lihat error messages
   - Cek Network tab untuk failed requests
   - Lihat request/response details

2. **Check Backend Logs**
   - Lihat terminal backend
   - Cek error messages
   - Pastikan endpoint dipanggil

3. **Check Network Tab**
   - F12 → Network
   - Coba login
   - Lihat request ke `/api/auth/login`
   - Cek status code dan response

4. **Test dengan Postman/Insomnia**
   - Import API collection
   - Test login endpoint
   - Pastikan backend berfungsi

### Informasi untuk Debugging

Saat meminta bantuan, sertakan:

1. **Error message lengkap** dari browser console
2. **Backend logs** dari terminal
3. **Network tab** screenshot (F12 → Network)
4. **Environment variables** (`.env.local` content)
5. **Node version**: `node --version`
6. **npm version**: `npm --version`

---

## Kontak Support

Jika masih mengalami masalah setelah mengikuti panduan ini:

1. Buat issue di repository
2. Sertakan informasi debugging di atas
3. Screenshot error messages
4. Langkah-langkah untuk reproduce error

---

**Happy Debugging! 🐛🔧**
