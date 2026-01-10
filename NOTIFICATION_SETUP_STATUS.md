# 📱 Status Setup Notifikasi - WhatsApp & Push Notification

**Last Updated:** 10 Januari 2026

---

## 📊 Status Overview

| Komponen | Status | Keterangan |
|----------|--------|------------|
| **Frontend - Firebase/FCM** | ✅ **SUDAH SETUP** | Config lengkap, siap digunakan |
| **Backend - Firebase Admin** | ⚠️ **PERLU VERIFIKASI** | Perlu cek service account key |
| **Backend - Fonnte WhatsApp** | ⚠️ **PERLU TOKEN** | Perlu API token dari Fonnte |

---

## 1️⃣ Frontend - Firebase Cloud Messaging (FCM)

### ✅ Status: SUDAH SETUP LENGKAP

**Yang Sudah Dikonfigurasi:**

#### A. Environment Variables (`.env.local`)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB5fJ8XvliDca2WfbpP7MGywJodNDIYFxQ
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=kost-management-75ffb.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=kost-management-75ffb
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=kost-management-75ffb.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=244470238845
NEXT_PUBLIC_FIREBASE_APP_ID=1:244470238845:web:c0dc6963dfd0ac45edab14
NEXT_PUBLIC_FIREBASE_VAPID_KEY=BGtEMhaRyYOjyJ3Y2dzj2WvVeYC-7EJu1f8grWz-ogorOoz-yEKP_DSCIoEY0CtdmQS4slM-wSMjPtvDpxkdxfU
```

✅ **Semua credentials sudah lengkap dan valid**

#### B. Firebase Project
- **Project ID:** `kost-management-75ffb`
- **VAPID Key:** Sudah dikonfigurasi untuk web push
- **Web App:** Sudah terdaftar

#### C. Implementasi Frontend
- ✅ Firebase SDK initialized (`lib/firebase/config.ts`)
- ✅ FCM token management (`lib/firebase/fcm.ts`)
- ✅ React hook untuk push notifications (`lib/hooks/usePushNotifications.ts`)
- ✅ Service worker untuk background messages (`public/firebase-messaging-sw.js`)
- ✅ UI untuk notification settings (`components/settings/notification-settings.tsx`)
- ✅ API service untuk register/remove token (`lib/api/services/notification.ts`)

#### D. Fitur yang Sudah Berfungsi
- ✅ Request permission untuk push notifications
- ✅ Generate & register FCM token ke backend
- ✅ Receive foreground messages
- ✅ Receive background messages (via service worker)
- ✅ Toggle push notification on/off
- ✅ Permission status indicator
- ✅ Re-request permission jika denied

### 🎯 Cara Testing Frontend FCM

1. **Start Frontend:**
   ```bash
   npm run dev
   ```

2. **Login & Buka Settings:**
   - Login ke aplikasi
   - Buka `/settings/notifications`
   - Klik "Aktifkan" pada Push Notification
   - Allow permission di browser

3. **Cek Console:**
   ```
   ✅ "FCM token registered successfully"
   ✅ Token akan terlihat di console
   ```

4. **Test dari Backend:**
   ```bash
   POST http://localhost:3000/api/notifications/test/push
   Authorization: Bearer <your-token>
   Content-Type: application/json

   {
     "userId": "your-user-id",
     "title": "Test Notification",
     "message": "This is a test"
   }
   ```

---

## 2️⃣ Backend - Firebase Admin SDK

### ⚠️ Status: PERLU VERIFIKASI

**Yang Dibutuhkan:**

Backend memerlukan **Firebase Service Account Key** untuk mengirim push notifications via FCM.

#### A. Environment Variables yang Dibutuhkan

Backend harus punya file `.env` dengan:

```env
# Firebase Admin SDK (untuk kirim push notification)
FIREBASE_PROJECT_ID=kost-management-75ffb
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@kost-management-75ffb.iam.gserviceaccount.com
```

#### B. Cara Mendapatkan Service Account Key

1. **Buka Firebase Console:**
   - https://console.firebase.google.com/
   - Pilih project: `kost-management-75ffb`

2. **Download Service Account Key:**
   - Klik ⚙️ (Settings) → Project settings
   - Tab "Service accounts"
   - Klik "Generate new private key"
   - Download file JSON

3. **Extract Credentials:**
   ```json
   {
     "project_id": "kost-management-75ffb",
     "private_key": "-----BEGIN PRIVATE KEY-----\n...",
     "client_email": "firebase-adminsdk-xxxxx@..."
   }
   ```

4. **Tambahkan ke Backend `.env`:**
   ```env
   FIREBASE_PROJECT_ID=kost-management-75ffb
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@kost-management-75ffb.iam.gserviceaccount.com
   ```

   **⚠️ PENTING:** 
   - Private key harus dalam quotes
   - Jangan hapus `\n` di dalam private key
   - Jangan commit file ini ke git!

#### C. Verifikasi Backend Setup

Cek apakah backend sudah punya:

```bash
# Di folder backend
cat .env | grep FIREBASE
```

**Expected Output:**
```
FIREBASE_PROJECT_ID=kost-management-75ffb
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...
```

Jika **BELUM ADA**, ikuti langkah B di atas.

#### D. Test Backend FCM

Setelah setup, test dengan:

```bash
# Start backend
npm run start:dev

# Test endpoint
POST http://localhost:3000/api/notifications/test/push
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "userId": "user-id-dari-database",
  "title": "Test Push",
  "message": "Testing FCM dari backend"
}
```

**Expected Result:**
- ✅ Status 200 OK
- ✅ Notification muncul di browser (jika user sudah register FCM token)
- ✅ Console backend: "Push notification sent successfully"

**Jika Error:**
- ❌ "Firebase not initialized" → Service account key belum setup
- ❌ "Invalid credentials" → Private key salah format
- ❌ "No FCM token found" → User belum register token dari frontend

---

## 3️⃣ Backend - Fonnte WhatsApp API

### ⚠️ Status: PERLU TOKEN

**Yang Dibutuhkan:**

Backend memerlukan **Fonnte API Token** untuk mengirim WhatsApp notifications.

#### A. Environment Variables yang Dibutuhkan

Backend harus punya di `.env`:

```env
# Fonnte WhatsApp API
FONNTE_API_URL=https://api.fonnte.com/send
FONNTE_API_TOKEN=your-fonnte-api-token-here
```

#### B. Cara Mendapatkan Fonnte Token

1. **Daftar/Login ke Fonnte:**
   - Website: https://fonnte.com/
   - Login atau buat akun baru

2. **Hubungkan WhatsApp:**
   - Scan QR code untuk hubungkan nomor WhatsApp
   - Pastikan nomor aktif dan bisa kirim pesan

3. **Dapatkan API Token:**
   - Buka menu "API"
   - Copy API Token yang tersedia
   - Format: `xxxxx-xxxxxx-xxxxxx-xxxxxx`

4. **Tambahkan ke Backend `.env`:**
   ```env
   FONNTE_API_URL=https://api.fonnte.com/send
   FONNTE_API_TOKEN=paste-token-disini
   ```

#### C. Verifikasi Backend Setup

Cek apakah backend sudah punya:

```bash
# Di folder backend
cat .env | grep FONNTE
```

**Expected Output:**
```
FONNTE_API_URL=https://api.fonnte.com/send
FONNTE_API_TOKEN=xxxxx-xxxxxx-xxxxxx-xxxxxx
```

Jika **BELUM ADA**, ikuti langkah B di atas.

#### D. Test Backend WhatsApp

Setelah setup, test dengan:

```bash
# Start backend
npm run start:dev

# Test endpoint
POST http://localhost:3000/api/notifications/test/whatsapp
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "phoneNumber": "628123456789",
  "message": "Test WhatsApp notification dari Management Kost"
}
```

**Expected Result:**
- ✅ Status 200 OK
- ✅ WhatsApp message diterima di nomor yang dituju
- ✅ Console backend: "WhatsApp notification sent successfully"

**Jika Error:**
- ❌ "Invalid token" → Token Fonnte salah atau expired
- ❌ "WhatsApp not connected" → Nomor WhatsApp belum di-scan/hubungkan
- ❌ "Invalid phone number" → Format nomor salah (harus 628xxx)

#### E. Format Nomor WhatsApp

**Benar:**
- ✅ `628123456789` (62 + nomor tanpa 0)
- ✅ `6281234567890`

**Salah:**
- ❌ `08123456789` (jangan pakai 0 di depan)
- ❌ `+628123456789` (jangan pakai +)
- ❌ `8123456789` (harus pakai kode negara 62)

---

## 📋 Checklist Setup

### Frontend (✅ SUDAH SELESAI)
- [x] Firebase config di `.env.local`
- [x] Firebase SDK initialized
- [x] FCM token management
- [x] Service worker
- [x] UI notification settings
- [x] API integration

### Backend - Firebase Admin (⚠️ PERLU VERIFIKASI)
- [ ] Cek apakah `FIREBASE_PROJECT_ID` ada di backend `.env`
- [ ] Cek apakah `FIREBASE_PRIVATE_KEY` ada di backend `.env`
- [ ] Cek apakah `FIREBASE_CLIENT_EMAIL` ada di backend `.env`
- [ ] Test endpoint `/api/notifications/test/push`
- [ ] Verifikasi notification diterima di frontend

**Jika belum ada, download Service Account Key dari Firebase Console**

### Backend - Fonnte WhatsApp (⚠️ PERLU TOKEN)
- [ ] Cek apakah `FONNTE_API_TOKEN` ada di backend `.env`
- [ ] Verifikasi token valid di Fonnte dashboard
- [ ] Verifikasi WhatsApp sudah terhubung
- [ ] Test endpoint `/api/notifications/test/whatsapp`
- [ ] Verifikasi pesan WhatsApp diterima

**Jika belum ada, daftar/login ke Fonnte.com dan dapatkan token**

---

## 🚀 Quick Start Guide

### 1. Verifikasi Backend Environment

```bash
cd backend
cat .env
```

Pastikan ada:
```env
# Firebase Admin
FIREBASE_PROJECT_ID=kost-management-75ffb
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...

# Fonnte WhatsApp
FONNTE_API_URL=https://api.fonnte.com/send
FONNTE_API_TOKEN=xxxxx-xxxxxx-xxxxxx-xxxxxx
```

### 2. Jika Belum Ada Firebase Admin

1. Buka https://console.firebase.google.com/
2. Pilih project `kost-management-75ffb`
3. Settings → Service accounts → Generate new private key
4. Download JSON file
5. Copy credentials ke backend `.env`

### 3. Jika Belum Ada Fonnte Token

1. Buka https://fonnte.com/
2. Login/Register
3. Hubungkan WhatsApp (scan QR)
4. Copy API Token
5. Paste ke backend `.env`

### 4. Test Notifications

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev

# Browser
1. Login ke http://localhost:3001
2. Buka /settings/notifications
3. Aktifkan push notification
4. Test dari Postman/Thunder Client
```

---

## 🔍 Troubleshooting

### Push Notification Tidak Muncul

**Cek Frontend:**
- [ ] Permission granted di browser?
- [ ] FCM token berhasil di-register? (cek console)
- [ ] Service worker active? (cek DevTools → Application → Service Workers)

**Cek Backend:**
- [ ] Firebase Admin credentials ada di `.env`?
- [ ] User punya FCM token di database?
- [ ] Backend log ada error?

### WhatsApp Tidak Terkirim

**Cek Backend:**
- [ ] Fonnte token ada di `.env`?
- [ ] Token masih valid? (cek di Fonnte dashboard)
- [ ] WhatsApp masih terhubung? (cek di Fonnte dashboard)
- [ ] Format nomor benar? (628xxx)

**Cek Fonnte Dashboard:**
- [ ] Quota masih ada?
- [ ] WhatsApp status: Connected?
- [ ] History pengiriman ada error?

---

## 📞 Support

### Firebase Issues
- Documentation: https://firebase.google.com/docs/cloud-messaging
- Console: https://console.firebase.google.com/

### Fonnte Issues
- Website: https://fonnte.com/
- Documentation: https://fonnte.com/api
- Support: Contact via Fonnte dashboard

---

## ✅ Summary

**Frontend:** ✅ **SIAP DIGUNAKAN**
- Semua konfigurasi sudah lengkap
- UI sudah berfungsi
- Tinggal test dengan backend

**Backend Firebase:** ⚠️ **PERLU VERIFIKASI**
- Cek apakah service account key sudah ada
- Jika belum, download dari Firebase Console
- Test endpoint push notification

**Backend Fonnte:** ⚠️ **PERLU TOKEN**
- Perlu daftar/login ke Fonnte.com
- Hubungkan WhatsApp
- Dapatkan API token
- Test endpoint WhatsApp

**Next Steps:**
1. Verifikasi backend `.env` punya semua credentials
2. Jika belum, ikuti panduan di atas
3. Test kedua notification methods
4. Deploy ke production

---

**Status:** Frontend Ready ✅ | Backend Needs Verification ⚠️
