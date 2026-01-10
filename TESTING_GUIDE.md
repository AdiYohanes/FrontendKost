# 🧪 Testing Guide - Notification System

Panduan lengkap untuk testing semua fitur notification system.

---

## 📋 Prerequisites

### 1. Backend Running
```bash
cd backend
npm run start:dev
```
**Check:** Backend running di `http://localhost:3000`

### 2. Frontend Running
```bash
cd frontend
npm run dev
```
**Check:** Frontend running di `http://localhost:3001`

### 3. Database Ready
- PostgreSQL running
- Migrations sudah dijalankan
- Ada user untuk login

---

## 🔐 Step 1: Test Authentication & Refresh Token

### 1.1 Login
1. Buka `http://localhost:3001`
2. Login dengan credentials:
   - Username: (your username)
   - Password: (your password)
3. **Expected:** Redirect ke dashboard

### 1.2 Check Tokens
Buka Browser Console (F12) → Console tab:
```javascript
// Check tokens tersimpan
localStorage.getItem('accessToken')
localStorage.getItem('refreshToken')
localStorage.getItem('auth-storage')
```
**Expected:** Semua ada value-nya

### 1.3 Test Auto Refresh (Optional)
```javascript
// Simulate token expired
localStorage.setItem('accessToken', 'invalid-token')

// Lalu coba akses halaman lain atau refresh
// Expected: Auto-refresh token atau redirect ke login
```

---

## 🔔 Step 2: Test Push Notification Permission

### 2.1 Navigate to Settings
1. Klik menu **"Settings"** di sidebar
2. Atau langsung ke `http://localhost:3001/settings/notifications`

### 2.2 Check Permission Status
**Lihat section "Push Notification":**

**Scenario A: Permission Default (Belum pernah diminta)**
- Status: ⚠️ "Belum diaktifkan" (Yellow)
- Button: "Aktifkan" visible
- Action: Klik button "Aktifkan"
- Expected: Browser minta permission → Klik "Allow"

**Scenario B: Permission Granted**
- Status: ✅ "Aktif" (Green)
- Toggle: Enabled
- Expected: Bisa toggle ON/OFF

**Scenario C: Permission Denied**
- Status: ❌ "Diblokir" (Red)
- Instructions: Cara enable di browser settings
- Expected: Tidak bisa toggle

### 2.3 Check FCM Token
Buka Console:
```javascript
// Check FCM token registered
localStorage.getItem('fcmToken')
```
**Expected:** Ada token string panjang

---

## 📱 Step 3: Test Push Notification

### 3.1 Get User ID
Buka Console:
```javascript
// Get user ID
const authData = JSON.parse(localStorage.getItem('auth-storage'))
console.log('User ID:', authData.state.user.id)
```
Copy user ID ini.

### 3.2 Test dari Backend (Swagger)

#### Option A: Menggunakan Swagger UI
1. Buka `http://localhost:3000/api/docs`
2. Klik **"Authorize"** button (kunci icon)
3. Paste access token dari localStorage
4. Klik **"Authorize"** → **"Close"**

5. Cari endpoint: **POST /notifications/test/push**
6. Klik **"Try it out"**
7. Isi request body:
```json
{
  "userId": "paste-user-id-disini",
  "title": "Test Notification 🎉",
  "message": "Ini adalah test push notification dari backend!"
}
```
8. Klik **"Execute"**

**Expected:**
- Response 200 OK
- Notification muncul di browser (top-right)
- Toast notification muncul

#### Option B: Menggunakan Postman/Thunder Client
```bash
POST http://localhost:3000/api/notifications/test/push
Authorization: Bearer <your-access-token>
Content-Type: application/json

{
  "userId": "your-user-id",
  "title": "Test Notification 🎉",
  "message": "Ini adalah test push notification!"
}
```

### 3.3 Test Background Notification
1. Minimize browser atau switch ke tab lain
2. Send notification dari backend (step 3.2)
3. **Expected:** Notification muncul di system tray/notification center

---

## 📋 Step 4: Test Notification History

### 4.1 Create Test Notifications (Backend)

**Cara 1: Menggunakan Swagger**
1. Buka `http://localhost:3000/api/docs`
2. Cari endpoint: **POST /notifications/history**
3. Create beberapa test notifications:

```json
{
  "userId": "your-user-id",
  "type": "INVOICE",
  "title": "Invoice Baru #001",
  "message": "Invoice untuk bulan Januari telah dibuat"
}
```

```json
{
  "userId": "your-user-id",
  "type": "PAYMENT_REMINDER",
  "title": "Pengingat Pembayaran",
  "message": "Pembayaran jatuh tempo dalam 3 hari"
}
```

```json
{
  "userId": "your-user-id",
  "type": "COMPLAINT_UPDATE",
  "title": "Komplain Diproses",
  "message": "Komplain Anda sedang ditangani"
}
```

**Cara 2: Langsung dari Database**
```sql
INSERT INTO "NotificationHistory" (id, "userId", type, title, message, "isRead", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'your-user-id', 'INVOICE', 'Invoice Baru #001', 'Invoice untuk bulan Januari telah dibuat', false, NOW(), NOW()),
  (gen_random_uuid(), 'your-user-id', 'PAYMENT_REMINDER', 'Pengingat Pembayaran', 'Pembayaran jatuh tempo dalam 3 hari', false, NOW(), NOW()),
  (gen_random_uuid(), 'your-user-id', 'COMPLAINT_UPDATE', 'Komplain Diproses', 'Komplain Anda sedang ditangani', false, NOW(), NOW());
```

### 4.2 Check Notification Badge
1. Lihat header/sidebar
2. **Expected:** Badge dengan angka unread count (e.g., "3")

### 4.3 Navigate to Notifications Page
1. Klik menu **"Notifications"** di sidebar
2. Atau langsung ke `http://localhost:3001/notifications`

**Expected:**
- List notifications muncul
- Unread notifications ada blue border & background
- Icon sesuai type (💰 Invoice, ⏰ Payment, 🔧 Complaint)
- Time relative ("beberapa detik yang lalu")

### 4.4 Test Mark as Read
1. Klik salah satu notification yang unread
2. **Expected:**
   - Blue border hilang
   - Background jadi putih
   - Badge count berkurang

### 4.5 Test Mark All as Read
1. Klik button **"Tandai Semua Dibaca"** (jika ada unread)
2. **Expected:**
   - Semua notification jadi read
   - Badge count jadi 0
   - Toast: "X notifikasi ditandai sebagai dibaca"

### 4.6 Test Delete Notification
1. Hover notification
2. Klik button **"×"** (delete)
3. **Expected:**
   - Notification hilang dari list
   - Toast: "Notifikasi dihapus"
   - Badge count update (jika unread)

### 4.7 Test Filter
1. Klik tab **"Belum Dibaca"**
2. **Expected:** Hanya show unread notifications

3. Klik tab **"Semua"**
4. **Expected:** Show all notifications

### 4.8 Test Pagination
1. Create 25+ notifications (lebih dari 20)
2. Scroll ke bawah
3. **Expected:** Button "Muat Lebih Banyak" muncul
4. Klik button
5. **Expected:** Load 20 notifications berikutnya

---

## ⚙️ Step 5: Test Notification Settings

### 5.1 Navigate to Settings
`http://localhost:3001/settings/notifications`

### 5.2 Test WhatsApp Toggle
1. Toggle **"WhatsApp Notification"** ON/OFF
2. **Expected:**
   - Toast: "Pengaturan berhasil diperbarui"
   - Setting tersimpan (refresh page untuk verify)

### 5.3 Test Push Toggle
1. Toggle **"Push Notification"** ON/OFF
2. **Expected:**
   - Toast: "Pengaturan berhasil diperbarui"
   - Disabled jika permission denied

### 5.4 Test Notification Type Toggles
Toggle setiap tipe:
- Invoice Baru
- Pengingat Pembayaran
- Update Komplain
- Pengumuman

**Expected:** Setiap toggle save dengan toast notification

### 5.5 Test Error Handling
1. Stop backend server
2. Try toggle setting
3. **Expected:** Toast error: "Gagal memperbarui pengaturan"
4. Setting revert ke nilai sebelumnya

---

## 🔄 Step 6: Test Real-time Updates

### 6.1 Test Badge Auto-refresh
1. Buka notifications page
2. Biarkan page terbuka
3. Create notification baru dari backend (atau database)
4. Wait 30 seconds
5. **Expected:** Badge count update otomatis

### 6.2 Test Multiple Tabs
1. Buka 2 tabs dengan aplikasi
2. Mark notification as read di tab 1
3. Refresh tab 2
4. **Expected:** Notification sudah read di tab 2

---

## 🚨 Step 7: Test Error Scenarios

### 7.1 Test Rate Limiting
1. Spam request (refresh page berkali-kali cepat)
2. **Expected:** Toast error: "Terlalu banyak request. Silakan coba lagi dalam X detik"

### 7.2 Test Network Error
1. Disconnect internet
2. Try mark as read
3. **Expected:** Toast error: "Gagal menandai sebagai dibaca"

### 7.3 Test Token Expired
1. Wait 15 minutes (access token expired)
2. Try any action
3. **Expected:** Auto-refresh token, action berhasil

### 7.4 Test Permission Denied
1. Block notifications di browser settings
2. Try enable push notification
3. **Expected:** Show instructions untuk enable

---

## ✅ Testing Checklist

### Authentication
- [ ] Login berhasil
- [ ] Tokens tersimpan
- [ ] Auto-refresh works
- [ ] Logout revoke tokens

### Push Notifications
- [ ] Permission request works
- [ ] Permission status indicator correct
- [ ] Test notification muncul (foreground)
- [ ] Test notification muncul (background)
- [ ] FCM token registered

### Notification History
- [ ] Badge shows unread count
- [ ] Badge auto-refresh (30s)
- [ ] Notifications list loads
- [ ] Click to mark as read
- [ ] Mark all as read
- [ ] Delete notification
- [ ] Filter all/unread works
- [ ] Pagination works
- [ ] Empty state shows
- [ ] Icons correct per type
- [ ] Time display correct

### Settings
- [ ] WhatsApp toggle works
- [ ] Push toggle works
- [ ] Type toggles work
- [ ] Settings persist
- [ ] Error handling works
- [ ] Permission status shows

### Error Handling
- [ ] Rate limit toast shows
- [ ] Network error handled
- [ ] Token refresh works
- [ ] Permission denied handled

---

## 🐛 Common Issues & Solutions

### Issue 1: Notification tidak muncul
**Check:**
- Browser permission granted?
- FCM token registered? (check localStorage)
- Backend running?
- User ID correct?

**Solution:**
```javascript
// Check permission
console.log(Notification.permission)

// Check FCM token
console.log(localStorage.getItem('fcmToken'))

// Re-register token
// Go to Settings → Push Notification → Aktifkan
```

### Issue 2: Badge tidak update
**Check:**
- Network tab untuk API calls
- Console untuk errors

**Solution:**
```javascript
// Manual refresh
window.location.reload()

// Check API endpoint
fetch('http://localhost:3000/api/notifications/history/unread-count', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
}).then(r => r.json()).then(console.log)
```

### Issue 3: Service Worker error
**Solution:**
1. Open DevTools (F12)
2. Application tab → Service Workers
3. Unregister old service worker
4. Clear site data
5. Hard reload (Ctrl+Shift+R)

### Issue 4: Token expired
**Solution:**
```javascript
// Clear all and re-login
localStorage.clear()
window.location.href = '/login'
```

---

## 📊 Expected Results Summary

| Feature | Expected Behavior |
|---------|------------------|
| Login | Redirect to dashboard, tokens saved |
| Push Permission | Browser asks, status indicator updates |
| Test Notification | Notification appears in browser |
| Badge | Shows unread count, updates every 30s |
| Notification List | Shows all notifications with icons |
| Mark as Read | Blue border removed, badge decreases |
| Delete | Notification removed, toast shown |
| Filter | Shows filtered notifications |
| Settings Toggle | Saves with toast, persists on refresh |
| Rate Limit | Toast error with retry time |

---

## 🎯 Quick Test Script

Untuk test cepat, jalankan di Console:

```javascript
// 1. Check auth
console.log('Auth:', !!localStorage.getItem('accessToken'))

// 2. Check FCM token
console.log('FCM Token:', !!localStorage.getItem('fcmToken'))

// 3. Check permission
console.log('Permission:', Notification.permission)

// 4. Get user ID
const auth = JSON.parse(localStorage.getItem('auth-storage'))
console.log('User ID:', auth?.state?.user?.id)

// 5. Test notification API
fetch('http://localhost:3000/api/notifications/history/unread-count', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
})
.then(r => r.json())
.then(data => console.log('Unread Count:', data.count))
.catch(err => console.error('Error:', err))
```

---

## 📝 Test Report Template

```
# Notification System Test Report

**Date:** [Date]
**Tester:** [Name]
**Environment:** Development

## Test Results

### Authentication ✅/❌
- Login: ✅
- Token refresh: ✅
- Logout: ✅

### Push Notifications ✅/❌
- Permission request: ✅
- Foreground notification: ✅
- Background notification: ✅
- FCM token registration: ✅

### Notification History ✅/❌
- Badge display: ✅
- List display: ✅
- Mark as read: ✅
- Delete: ✅
- Filter: ✅
- Pagination: ✅

### Settings ✅/❌
- Toggle WhatsApp: ✅
- Toggle Push: ✅
- Toggle types: ✅
- Error handling: ✅

## Issues Found
1. [Issue description]
2. [Issue description]

## Notes
[Additional notes]
```

---

**Happy Testing! 🚀**

Jika ada issues, check console untuk error messages dan network tab untuk API calls.
