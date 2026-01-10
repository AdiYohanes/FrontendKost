# ⚡ Quick Test - Notification System

Panduan cepat untuk test notification dalam 5 menit.

---

## 🚀 Quick Start

### 1. Start Servers (2 terminal)

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## 🧪 Test Steps (5 menit)

### Step 1: Login (30 detik)
1. Buka `http://localhost:3001`
2. Login dengan credentials Anda
3. ✅ Check: Redirect ke dashboard

### Step 2: Enable Push Notification (1 menit)
1. Klik menu **"Settings"** di sidebar
2. Lihat section **"Push Notification"**
3. Klik button **"Aktifkan"**
4. Browser minta permission → Klik **"Allow"**
5. ✅ Check: Status jadi "Aktif" (hijau)

### Step 3: Get User ID (30 detik)
Buka Console (F12) → Console tab:
```javascript
const auth = JSON.parse(localStorage.getItem('auth-storage'))
console.log('User ID:', auth.state.user.id)
```
📋 Copy user ID ini

### Step 4: Test Push Notification (2 menit)

#### Option A: Swagger UI (Recommended)
1. Buka `http://localhost:3000/api/docs`
2. Klik **"Authorize"** (🔒 icon)
3. Paste token dari console:
   ```javascript
   localStorage.getItem('accessToken')
   ```
4. Cari: **POST /notifications/test/push**
5. Klik **"Try it out"**
6. Paste request body:
   ```json
   {
     "userId": "paste-user-id-disini",
     "title": "Test Notification 🎉",
     "message": "Berhasil! Push notification works!"
   }
   ```
7. Klik **"Execute"**

#### Option B: Postman/Thunder Client
```bash
POST http://localhost:3000/api/notifications/test/push
Authorization: Bearer <your-access-token>
Content-Type: application/json

{
  "userId": "your-user-id",
  "title": "Test Notification 🎉",
  "message": "Berhasil! Push notification works!"
}
```

✅ **Expected:** Notification muncul di browser (top-right corner)

### Step 5: Test Notification History (1 menit)
1. Klik menu **"Notifications"** di sidebar
2. ✅ Check: Badge shows "1" (unread count)
3. ✅ Check: Notification list muncul
4. Klik notification
5. ✅ Check: Blue border hilang (marked as read)
6. ✅ Check: Badge jadi "0"

---

## ✅ Success Checklist

- [ ] Login berhasil
- [ ] Push notification permission granted
- [ ] Test notification muncul di browser
- [ ] Badge shows unread count
- [ ] Notification list muncul
- [ ] Mark as read works
- [ ] Badge count updates

---

## 🎯 Quick Commands

### Get Access Token
```javascript
localStorage.getItem('accessToken')
```

### Get User ID
```javascript
JSON.parse(localStorage.getItem('auth-storage')).state.user.id
```

### Check FCM Token
```javascript
localStorage.getItem('fcmToken')
```

### Check Permission
```javascript
Notification.permission
```

### Test API Manually
```javascript
fetch('http://localhost:3000/api/notifications/test/push', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    userId: JSON.parse(localStorage.getItem('auth-storage')).state.user.id,
    title: 'Test',
    message: 'Test notification'
  })
})
.then(r => r.json())
.then(console.log)
```

---

## 🐛 Troubleshooting

### Notification tidak muncul?
1. Check permission: `Notification.permission` → harus "granted"
2. Check FCM token: `localStorage.getItem('fcmToken')` → harus ada
3. Check console untuk errors
4. Refresh page dan coba lagi

### Badge tidak muncul?
1. Create notification dulu (step 4)
2. Wait 30 seconds (auto-refresh)
3. Atau refresh page

### Service Worker error?
1. F12 → Application → Service Workers
2. Unregister service worker
3. Hard reload (Ctrl+Shift+R)

---

## 📱 Test Background Notification

1. Minimize browser atau switch tab
2. Send notification (step 4)
3. ✅ Check: Notification muncul di system tray

---

## 🎉 Done!

Jika semua checklist ✅, notification system works perfectly!

**Full testing guide:** See `TESTING_GUIDE.md`
