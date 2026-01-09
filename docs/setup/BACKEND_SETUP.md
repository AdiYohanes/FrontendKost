# 🔧 Backend Setup - PENTING!

## ⚠️ MASALAH SAAT INI

Backend **BELUM BERJALAN** di port 3001. Request API malah mengarah ke frontend Next.js.

---

## ✅ Cara Menjalankan Backend

### Langkah 1: Buka Terminal Baru

**JANGAN tutup terminal frontend!** Buka terminal baru.

### Langkah 2: Pindah ke Folder Backend

```bash
cd ../KostManagement
```

Atau jika struktur folder berbeda:

```bash
cd [path-ke-folder-backend]
```

### Langkah 3: Jalankan Backend di Port 3001

**Windows PowerShell:**

```powershell
$env:PORT=3001; npm run start:dev
```

**Windows CMD:**

```cmd
set PORT=3001 && npm run start:dev
```

**Linux/Mac:**

```bash
PORT=3001 npm run start:dev
```

### Langkah 4: Tunggu Sampai Backend Siap

Tunggu sampai muncul pesan:

```
Application is running on: http://localhost:3001
```

---

## 🧪 Test Backend Sudah Berjalan

Setelah backend berjalan, test dengan PowerShell:

```powershell
curl http://localhost:3001/api/auth/login -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"username":"owner","password":"password123"}' -UseBasicParsing
```

**Expected Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "username": "owner",
    "name": "Owner Name",
    "role": "OWNER",
    ...
  }
}
```

Jika Anda melihat HTML response (bukan JSON), berarti backend belum berjalan!

---

## 📋 Checklist

Sebelum login, pastikan:

- [ ] Terminal backend terbuka (terminal terpisah dari frontend)
- [ ] Backend berjalan di port 3001
- [ ] Muncul pesan "Application is running on: http://localhost:3001"
- [ ] Test curl berhasil (response JSON, bukan HTML)
- [ ] Frontend masih berjalan di port 3000

---

## ❌ Troubleshooting

### Error: "Port 3001 is already in use"

**Solusi 1**: Gunakan port lain

```powershell
$env:PORT=3002; npm run start:dev
```

Jangan lupa update `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3002/api
```

**Solusi 2**: Hentikan proses yang menggunakan port 3001

```powershell
# Cari proses
netstat -ano | findstr :3001

# Hentikan proses (ganti PID dengan nomor yang muncul)
taskkill /PID [PID] /F
```

### Error: "Cannot find module" atau "npm not found"

**Penyebab**: Belum install dependencies

**Solusi**:

```bash
cd ../KostManagement
npm install
```

### Backend Tidak Bisa Start

**Cek**:

1. Apakah file `package.json` ada?
2. Apakah sudah `npm install`?
3. Apakah database sudah berjalan?
4. Cek error message di terminal

---

## 🎯 Quick Start (Copy-Paste)

### Terminal 1 - Frontend (sudah berjalan)

```
# Biarkan tetap berjalan
# http://localhost:3000
```

### Terminal 2 - Backend (JALANKAN INI!)

```powershell
cd ../KostManagement
$env:PORT=3001; npm run start:dev
```

### Test Backend

```powershell
curl http://localhost:3001/api/auth/login -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"username":"owner","password":"password123"}' -UseBasicParsing
```

### Login di Browser

```
http://localhost:3000/login
Username: owner
Password: password123
```

---

## 💡 Tips

1. **Jangan tutup terminal backend** - Biarkan tetap berjalan
2. **Cek terminal backend** - Lihat apakah ada error
3. **Test dengan curl dulu** - Sebelum login di browser
4. **Cek port** - Backend harus di port berbeda dari frontend

---

**PENTING**: Backend HARUS berjalan sebelum Anda bisa login!

Jalankan backend dulu, baru coba login lagi.
