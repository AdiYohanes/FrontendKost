# Login Troubleshooting Guide

## Masalah: Tidak Bisa Login dengan Username "owner" dan Password "password123"

### Langkah-langkah Troubleshooting

#### 1. Pastikan Backend API Berjalan

```bash
# Buka terminal baru dan jalankan backend
cd ../KostManagement
npm run start:dev
```

Backend harus berjalan di `http://localhost:3000`

#### 2. Test API Endpoint Secara Manual

Buka PowerShell dan jalankan:

```powershell
# Test login endpoint
curl http://localhost:3000/api/auth/login -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"username":"owner","password":"password123"}' -UseBasicParsing
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

Jika response berhasil, berarti backend berfungsi dengan baik.

#### 3. Cek Konfigurasi Frontend

Pastikan file `.env.local` sudah benar:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

#### 4. Cek Browser Console

1. Buka browser (Chrome/Edge)
2. Tekan F12 untuk membuka Developer Tools
3. Buka tab "Console"
4. Coba login lagi
5. Lihat error yang muncul

**Common Errors:**

##### Error: "Network Error" atau "ERR_CONNECTION_REFUSED"

**Penyebab**: Backend tidak berjalan
**Solusi**:

```bash
cd ../KostManagement
npm run start:dev
```

##### Error: "CORS Error"

**Penyebab**: Backend tidak mengizinkan request dari frontend
**Solusi**: Cek file `main.ts` di backend, pastikan ada:

```typescript
app.enableCors({
  origin: "http://localhost:3001", // atau port frontend Anda
  credentials: true,
});
```

##### Error: "401 Unauthorized" atau "Invalid credentials"

**Penyebab**: Username atau password salah
**Solusi**:

- Pastikan username: `owner` (lowercase)
- Pastikan password: `password123`
- Cek di database apakah user sudah ada

#### 5. Cek Network Tab

1. Buka Developer Tools (F12)
2. Buka tab "Network"
3. Coba login lagi
4. Cari request ke `/api/auth/login`
5. Klik request tersebut
6. Lihat:
   - **Request URL**: Harus `http://localhost:3000/api/auth/login`
   - **Request Method**: POST
   - **Status Code**: Harus 200 jika berhasil
   - **Response**: Lihat response body

#### 6. Test dengan Credentials Lain

Coba test dengan user lain yang mungkin ada di database:

```javascript
// Di browser console
fetch("http://localhost:3000/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    username: "owner",
    password: "password123",
  }),
})
  .then((res) => res.json())
  .then((data) => console.log("Success:", data))
  .catch((err) => console.error("Error:", err));
```

#### 7. Clear Browser Cache & Storage

Kadang token lama atau data cache bisa menyebabkan masalah:

1. Buka Developer Tools (F12)
2. Buka tab "Application" (Chrome) atau "Storage" (Firefox)
3. Klik "Local Storage" → `http://localhost:3001`
4. Hapus semua data (klik kanan → Clear)
5. Refresh halaman (Ctrl+F5)
6. Coba login lagi

#### 8. Restart Development Server

```bash
# Stop frontend server (Ctrl+C)
# Kemudian start lagi
npm run dev
```

## Checklist Debugging

- [ ] Backend API berjalan di `http://localhost:3000`
- [ ] Test API endpoint berhasil (curl command)
- [ ] File `.env.local` sudah benar
- [ ] Browser console tidak ada error
- [ ] Network tab menunjukkan request berhasil (200)
- [ ] CORS sudah dikonfigurasi di backend
- [ ] Username dan password sudah benar
- [ ] Local storage sudah dibersihkan
- [ ] Development server sudah direstart

## Error Messages dan Solusinya

### "Tidak dapat terhubung ke server"

**Penyebab**: Backend tidak berjalan atau port salah
**Solusi**:

1. Jalankan backend: `cd ../KostManagement && npm run start:dev`
2. Cek port di `.env.local` sesuai dengan backend

### "Invalid credentials"

**Penyebab**: Username atau password salah
**Solusi**:

1. Cek username: `owner` (lowercase, tanpa spasi)
2. Cek password: `password123` (tanpa spasi)
3. Cek di database apakah user ada

### "Session expired"

**Penyebab**: Token lama masih tersimpan
**Solusi**: Clear local storage dan coba lagi

### "CORS Error"

**Penyebab**: Backend tidak mengizinkan request dari frontend
**Solusi**: Update CORS config di backend `main.ts`

## Cara Test Login yang Benar

1. **Pastikan backend berjalan**:

   ```bash
   cd ../KostManagement
   npm run start:dev
   ```

   Tunggu sampai muncul: `Application is running on: http://localhost:3000`

2. **Pastikan frontend berjalan**:

   ```bash
   cd kost-management-frontend
   npm run dev
   ```

   Buka: `http://localhost:3001/login`

3. **Login dengan credentials**:
   - Username: `owner`
   - Password: `password123`
   - Klik "Masuk"

4. **Jika berhasil**:
   - Akan redirect ke `/dashboard`
   - Sidebar akan muncul dengan menu sesuai role OWNER

## Kontak Support

Jika masih ada masalah setelah mengikuti semua langkah di atas, silakan:

1. Screenshot error di browser console
2. Screenshot error di network tab
3. Copy paste error message
4. Tanyakan ke developer

---

**Last Updated**: January 7, 2026
