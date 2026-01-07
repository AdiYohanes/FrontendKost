# 🚀 Panduan Memulai Aplikasi

## ✅ Status Saat Ini

- ✅ Frontend sudah berjalan di: **http://localhost:3000**
- ✅ Login page sudah diperbaiki (Suspense boundary)
- ✅ File test-login.html sudah dihapus
- ✅ Konfigurasi API sudah diupdate

---

## 📋 Langkah-langkah untuk Login

### Langkah 1: Jalankan Backend API

Buka **terminal baru** (jangan tutup terminal frontend) dan jalankan:

```bash
# Pindah ke folder backend
cd ../KostManagement

# Jalankan backend di port 3001 (karena frontend di port 3000)
PORT=3001 npm run start:dev
```

**Atau** jika di Windows PowerShell:

```powershell
cd ../KostManagement
$env:PORT=3001; npm run start:dev
```

Tunggu sampai muncul:

```
Application is running on: http://localhost:3001
```

### Langkah 2: Buka Aplikasi di Browser

Buka browser dan akses:

```
http://localhost:3000/login
```

### Langkah 3: Login

Masukkan credentials:

- **Username**: `owner`
- **Password**: `password123`

Klik tombol **"Masuk"**

### Langkah 4: Berhasil! 🎉

Jika berhasil, Anda akan diarahkan ke dashboard dengan:

- ✅ Sidebar di kiri (bisa collapse/expand)
- ✅ Header dengan breadcrumbs dan user menu
- ✅ Menu lengkap sesuai role OWNER
- ✅ Dashboard dengan metrics cards

---

## 🔧 Konfigurasi Saat Ini

### Frontend

- **Port**: 3000
- **URL**: http://localhost:3000
- **Status**: ✅ Running

### Backend (yang harus Anda jalankan)

- **Port**: 3001
- **URL**: http://localhost:3001
- **API Endpoint**: http://localhost:3001/api
- **Status**: ⏳ Belum berjalan (jalankan dulu!)

### File .env.local

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## ❌ Troubleshooting

### 1. Error: "Tidak dapat terhubung ke server"

**Penyebab**: Backend belum berjalan

**Solusi**:

```bash
cd ../KostManagement
PORT=3001 npm run start:dev
```

### 2. Error: "Port 3001 is already in use"

**Penyebab**: Ada aplikasi lain di port 3001

**Solusi**:

```bash
# Cek proses yang menggunakan port 3001
netstat -ano | findstr :3001

# Atau gunakan port lain
PORT=3002 npm run start:dev

# Jangan lupa update .env.local jika ganti port
```

### 3. Error: "Invalid credentials"

**Penyebab**: Username atau password salah

**Cek**:

- Username harus: `owner` (lowercase)
- Password harus: `password123`
- Tidak ada spasi di awal/akhir

### 4. Error: "CORS Error"

**Penyebab**: Backend tidak mengizinkan request dari frontend

**Solusi**: Buka file `main.ts` di backend dan pastikan ada:

```typescript
app.enableCors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
});
```

### 5. Halaman Blank atau Loading Terus

**Solusi**:

1. Buka Developer Tools (F12)
2. Lihat tab Console untuk error
3. Lihat tab Network untuk request yang gagal
4. Clear browser cache (Ctrl+Shift+Delete)
5. Refresh halaman (Ctrl+F5)

---

## 🧪 Test Koneksi Backend

Sebelum login, test dulu apakah backend bisa diakses:

### Test dengan Browser

Buka di browser:

```
http://localhost:3001/api
```

Jika backend berjalan, Anda akan melihat response (bisa error 404, tapi itu normal).

### Test dengan PowerShell

```powershell
curl http://localhost:3001/api/auth/login -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"username":"owner","password":"password123"}' -UseBasicParsing
```

Jika berhasil, Anda akan melihat response dengan `accessToken`.

---

## 📝 Checklist Sebelum Login

Pastikan semua ini sudah dilakukan:

- [ ] Backend berjalan di port 3001
- [ ] Frontend berjalan di port 3000
- [ ] File `.env.local` sudah benar (API URL ke port 3001)
- [ ] Browser sudah dibuka di http://localhost:3000/login
- [ ] Username: `owner`, Password: `password123`

---

## 🎯 Quick Start (Copy-Paste)

### Terminal 1 - Backend

```bash
cd ../KostManagement
PORT=3001 npm run start:dev
```

### Terminal 2 - Frontend (sudah berjalan)

```bash
# Frontend sudah berjalan di http://localhost:3000
# Tidak perlu jalankan lagi
```

### Browser

```
http://localhost:3000/login
```

**Login**: `owner` / `password123`

---

## 📚 File Dokumentasi Lainnya

- `CARA_LOGIN.md` - Panduan login detail
- `LOGIN_TROUBLESHOOTING.md` - Troubleshooting lengkap
- `LAYOUT_IMPLEMENTATION.md` - Dokumentasi layout dashboard
- `TROUBLESHOOTING.md` - Troubleshooting umum

---

## 💡 Tips

1. **Jangan tutup terminal frontend** - Biarkan tetap berjalan
2. **Buka terminal baru untuk backend** - Jangan jalankan di terminal yang sama
3. **Cek browser console** - Tekan F12 untuk lihat error
4. **Clear cache jika perlu** - Ctrl+Shift+Delete
5. **Gunakan Incognito mode** - Untuk test tanpa cache

---

## 🆘 Masih Error?

Jika masih ada masalah:

1. **Screenshot error** di browser console (F12)
2. **Copy error message** yang muncul
3. **Cek terminal backend** - ada error tidak?
4. **Cek terminal frontend** - ada error tidak?

Kemudian tanyakan dengan detail error yang muncul.

---

**Selamat mencoba! 🚀**

Aplikasi sudah siap digunakan. Tinggal jalankan backend dan login!
