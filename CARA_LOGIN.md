# 🔐 Cara Login ke Aplikasi

## ✅ Server Sudah Berjalan!

Frontend: **http://localhost:3000**

---

## 📝 Langkah Login

### 1. Pastikan Backend API Berjalan

Buka terminal baru dan jalankan:

```bash
cd ../KostManagement
npm run start:dev
```

Tunggu sampai muncul:

```
Application is running on: http://localhost:3000
```

⚠️ **PENTING**: Backend harus berjalan di port **3000** (sama dengan frontend sekarang)

### 2. Update File .env.local

Karena frontend sekarang di port 3000, backend harus di port lain. Update file `.env.local`:

```env
# Ubah ke port backend yang baru
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

**ATAU** jalankan backend di port berbeda:

```bash
# Di folder KostManagement
PORT=3001 npm run start:dev
```

### 3. Buka Aplikasi

Buka browser dan akses:

```
http://localhost:3000/login
```

### 4. Login dengan Credentials

**Username**: `owner`  
**Password**: `password123`

Klik tombol **"Masuk"**

### 5. Jika Berhasil

Anda akan diarahkan ke dashboard dengan:

- ✅ Sidebar di sebelah kiri
- ✅ Header dengan breadcrumbs
- ✅ Menu sesuai role OWNER

---

## ❌ Troubleshooting

### Error: "Tidak dapat terhubung ke server"

**Penyebab**: Backend tidak berjalan atau port salah

**Solusi**:

1. Pastikan backend berjalan
2. Cek port backend (harus berbeda dengan frontend)
3. Update `NEXT_PUBLIC_API_URL` di `.env.local`

### Error: "Port 3000 is already in use"

**Penyebab**: Ada aplikasi lain di port 3000

**Solusi**:

```bash
# Hentikan semua proses Node.js
taskkill /F /IM node.exe

# Atau jalankan di port lain
npm run dev -- -p 3001
```

### Error: "Invalid credentials"

**Penyebab**: Username atau password salah

**Solusi**:

- Username: `owner` (lowercase, tanpa spasi)
- Password: `password123` (tanpa spasi)

### Error: "CORS Error"

**Penyebab**: Backend tidak mengizinkan request dari frontend

**Solusi**: Update `main.ts` di backend:

```typescript
app.enableCors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
});
```

---

## 🎯 Quick Fix

Jika masih error, coba ini:

```bash
# 1. Stop semua proses
taskkill /F /IM node.exe

# 2. Jalankan backend di port 3001
cd ../KostManagement
PORT=3001 npm run start:dev

# 3. Update .env.local
# NEXT_PUBLIC_API_URL=http://localhost:3001/api

# 4. Jalankan frontend di port 3000
cd ../kost-management-frontend
npm run dev
```

---

## ✅ Checklist

Sebelum login, pastikan:

- [ ] Backend berjalan (cek terminal backend)
- [ ] Frontend berjalan (cek terminal frontend)
- [ ] Port tidak konflik (backend dan frontend beda port)
- [ ] File `.env.local` sudah benar
- [ ] Browser console tidak ada error (F12)

---

**Selamat mencoba! 🚀**

Jika masih ada masalah, cek browser console (F12) dan lihat error message yang muncul.
