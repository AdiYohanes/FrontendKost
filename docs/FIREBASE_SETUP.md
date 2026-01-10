# Firebase Push Notification Setup Guide

Panduan lengkap untuk setup Firebase Cloud Messaging (FCM) untuk push notifications di Management Kost.

## ⚡ Quick Start (Config Sudah Siap!)

Firebase config Anda sudah disetup! Yang perlu dilakukan:

1. ✅ **Firebase project sudah dibuat** (`kost-management-75ffb`)
2. ✅ **Web app sudah registered**
3. ✅ **Config sudah diisi** di `.env.local` dan `firebase-messaging-sw.js`
4. ⏳ **Generate VAPID key** (lihat Step 4 di bawah)
5. ⏳ **Setup Backend credentials** (lihat Step 5 di bawah)
6. ⏳ **Test push notification** (lihat Step 7 di bawah)

**Next Steps:**
- Lanjut ke **Step 3** untuk enable Cloud Messaging
- Lanjut ke **Step 4** untuk generate VAPID key
- Lanjut ke **Step 5** untuk setup backend

---

## 📋 Prerequisites

- Akun Google/Firebase
- Project sudah running (backend & frontend)
- Browser yang support push notifications (Chrome, Firefox, Edge)

---

## 🔥 Step 1: Buat Firebase Project

1. Buka [Firebase Console](https://console.firebase.google.com)
2. Klik **"Add project"** atau **"Create a project"**
3. Masukkan nama project: `management-kost` (atau nama lain)
4. Disable Google Analytics (optional, bisa diaktifkan nanti)
5. Klik **"Create project"**

---

## 📱 Step 2: Register Web App

1. Di Firebase Console, pilih project yang baru dibuat
2. Klik icon **Web** (</>) untuk add web app
3. Masukkan app nickname: `Management Kost Web`
4. **Jangan** centang "Also set up Firebase Hosting"
5. Klik **"Register app"**
6. Copy Firebase configuration object yang muncul:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "management-kost.firebaseapp.com",
  projectId: "management-kost",
  storageBucket: "management-kost.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

---

## 🔔 Step 3: Enable Cloud Messaging

1. Di sidebar Firebase Console, klik **"Build"** → **"Cloud Messaging"**
2. Jika diminta, klik **"Get started"**
3. Cloud Messaging sekarang aktif

---

## 🔑 Step 4: Generate VAPID Key

VAPID key diperlukan untuk web push notifications.

1. Di Firebase Console, klik **"Build"** → **"Cloud Messaging"** (di sidebar kiri)
2. Scroll ke bawah ke section **"Web configuration"** atau **"Web Push certificates"**
3. Klik **"Generate key pair"** button
4. Copy VAPID key yang muncul (format: `BNxxx...` atau `BMxxx...`)
5. Paste ke `.env.local` sebagai `NEXT_PUBLIC_FIREBASE_VAPID_KEY`

**Screenshot lokasi:**
```
Firebase Console → Project → Cloud Messaging → Web Push certificates → Generate key pair
```

⚠️ **Penting:** Jika tidak menemukan "Generate key pair", pastikan:
- Cloud Messaging API sudah enabled
- Anda sudah register web app (Step 2)
- Refresh halaman Firebase Console

---

## 🔐 Step 5: Setup Backend (Firebase Admin SDK)

### 5.1 Generate Service Account Key

1. Di Firebase Console, klik icon **Settings** (⚙️) → **"Project settings"**
2. Pilih tab **"Service accounts"**
3. Klik **"Generate new private key"**
4. Klik **"Generate key"** pada dialog konfirmasi
5. File JSON akan terdownload

### 5.2 Extract Credentials

Buka file JSON yang didownload, cari:
- `project_id`
- `private_key`
- `client_email`

### 5.3 Update Backend .env

Tambahkan ke `.env` di backend:

```env
# Firebase Cloud Messaging (Backend)
FIREBASE_PROJECT_ID="management-kost"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@management-kost.iam.gserviceaccount.com"
```

⚠️ **Important:** 
- Private key harus dalam format string dengan `\n` untuk newlines
- Gunakan double quotes untuk value yang mengandung special characters

---

## 🌐 Step 6: Setup Frontend

### 6.1 Create .env.local

✅ **File `.env.local` sudah dibuat dengan config Firebase Anda!**

Anda hanya perlu update **VAPID key** setelah generate di Step 4:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=Management Kost

# Firebase Configuration (SUDAH DIISI)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB5fJ8XvliDca2WfbpP7MGywJodNDIYFxQ
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=kost-management-75ffb.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=kost-management-75ffb
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=kost-management-75ffb.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=244470238845
NEXT_PUBLIC_FIREBASE_APP_ID=1:244470238845:web:c0dc6963dfd0ac45edab14

# VAPID Key (PERLU DIISI - dari Step 4)
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your-vapid-key-here
```

**Yang perlu dilakukan:**
1. Generate VAPID key di Firebase Console (Step 4)
2. Copy VAPID key
3. Paste ke `.env.local` menggantikan `your-vapid-key-here`

### 6.2 Update Service Worker

✅ **File `public/firebase-messaging-sw.js` sudah diupdate dengan config Firebase Anda!**

Tidak perlu edit lagi, sudah otomatis menggunakan config yang benar.

---

## 🧪 Step 7: Testing

### 7.1 Start Development Servers

**Backend:**
```bash
cd backend
npm run start:dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### 7.2 Test Push Notification

1. Login ke aplikasi
2. Buka browser console (F12)
3. Cek apakah ada error Firebase
4. Klik "Allow" saat browser meminta permission untuk notifications
5. Cek console untuk FCM token

### 7.3 Test dari Backend

Gunakan endpoint test:

```bash
POST http://localhost:3000/api/notifications/test/push
Authorization: Bearer <your-access-token>
Content-Type: application/json

{
  "userId": "your-user-id",
  "title": "Test Notification",
  "message": "This is a test push notification"
}
```

### 7.4 Verify

- ✅ Notification muncul di browser
- ✅ Notification muncul saat tab tidak aktif (background)
- ✅ Klik notification membuka aplikasi

---

## 🔍 Troubleshooting

### Error: "Firebase: Error (auth/invalid-api-key)"
- Cek `NEXT_PUBLIC_FIREBASE_API_KEY` di `.env.local`
- Pastikan tidak ada typo atau extra spaces

### Error: "Messaging: This browser doesn't support the API's required to use the Firebase SDK"
- Gunakan browser yang support: Chrome, Firefox, Edge
- Pastikan browser versi terbaru

### Error: "Messaging: Notifications have been blocked"
- User sudah block notifications
- Minta user untuk enable di browser settings
- Chrome: Settings → Privacy and security → Site Settings → Notifications

### FCM Token tidak ter-register
- Cek network tab untuk request ke `/api/notifications/fcm-token`
- Cek console untuk error
- Pastikan user sudah login
- Pastikan backend running

### Notification tidak muncul
- Cek apakah FCM token sudah ter-register di database
- Cek backend logs untuk error saat send notification
- Pastikan Firebase credentials benar
- Test dengan endpoint `/api/notifications/test/push`

### Service Worker Error
- Cek `public/firebase-messaging-sw.js` sudah update dengan config yang benar
- Clear browser cache dan reload
- Unregister service worker lama: DevTools → Application → Service Workers → Unregister

---

## 📱 Production Deployment

### HTTPS Required
Push notifications hanya bekerja di:
- `https://` (production)
- `localhost` (development)

### Environment Variables
Pastikan semua environment variables sudah di-set di hosting platform:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Build & Deploy → Environment
- Railway: Project → Variables

### Service Worker
Pastikan `firebase-messaging-sw.js` accessible di root URL:
- ✅ `https://yourdomain.com/firebase-messaging-sw.js`
- ❌ `https://yourdomain.com/_next/static/firebase-messaging-sw.js`

---

## 📚 Additional Resources

- [Firebase Cloud Messaging Documentation](https://firebase.google.com/docs/cloud-messaging)
- [Web Push Notifications Guide](https://firebase.google.com/docs/cloud-messaging/js/client)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

## 🎉 Done!

Push notifications sekarang sudah aktif! User akan menerima notifikasi untuk:
- 📄 Invoice baru
- 💰 Payment reminder
- 🔧 Complaint updates
- 📢 Announcements

User bisa mengatur preferensi notifikasi di **Settings → Notifications**.
