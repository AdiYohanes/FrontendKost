# 🎥 Video Tutorial Script - Notification System

Script untuk membuat video tutorial testing notification system.

---

## 📹 Video 1: Setup & Push Notification (3 menit)

### Scene 1: Intro (15 detik)
**Screen:** Desktop
**Narasi:**
> "Halo! Di video ini kita akan test notification system yang sudah kita implement. Kita akan test push notification, notification history, dan settings. Mari kita mulai!"

### Scene 2: Start Servers (30 detik)
**Screen:** Terminal split screen
**Action:**
1. Show terminal 1
2. Type: `cd backend && npm run start:dev`
3. Show terminal 2
4. Type: `cd frontend && npm run dev`

**Narasi:**
> "Pertama, kita start backend dan frontend. Backend di port 3000, frontend di port 3001."

### Scene 3: Login (30 detik)
**Screen:** Browser `http://localhost:3001`
**Action:**
1. Show login page
2. Enter username & password
3. Click Login
4. Show dashboard

**Narasi:**
> "Sekarang kita login. Setelah login, kita akan redirect ke dashboard."

### Scene 4: Enable Push Notification (1 menit)
**Screen:** Browser - Settings page
**Action:**
1. Click "Settings" di sidebar
2. Scroll ke "Push Notification"
3. Show status "Belum diaktifkan"
4. Click "Aktifkan" button
5. Browser permission popup muncul
6. Click "Allow"
7. Show status berubah jadi "Aktif" (hijau)

**Narasi:**
> "Klik Settings di sidebar. Di sini kita lihat Push Notification belum aktif. Klik Aktifkan, browser akan minta permission. Klik Allow. Sekarang status jadi Aktif dengan icon hijau."

### Scene 5: Test Push Notification (1 menit)
**Screen:** Split - Browser Console & Swagger
**Action:**
1. Open console (F12)
2. Type: `JSON.parse(localStorage.getItem('auth-storage')).state.user.id`
3. Copy user ID
4. Open Swagger `http://localhost:3000/api/docs`
5. Click Authorize
6. Paste access token
7. Find POST /notifications/test/push
8. Click "Try it out"
9. Paste user ID in request body
10. Click Execute
11. Show notification muncul di browser

**Narasi:**
> "Sekarang kita test. Buka console, ambil user ID. Buka Swagger, authorize dengan token. Cari endpoint test push. Paste user ID, execute. Dan... notification muncul! Perfect!"

### Scene 6: Outro (15 detik)
**Screen:** Browser dengan notification
**Narasi:**
> "Oke, push notification works! Di video berikutnya kita akan test notification history dan settings. See you!"

---

## 📹 Video 2: Notification History (3 menit)

### Scene 1: Intro (15 detik)
**Screen:** Browser - Dashboard
**Narasi:**
> "Welcome back! Sekarang kita akan test notification history. Kita akan create beberapa notifications, lihat badge, dan test mark as read."

### Scene 2: Create Test Notifications (1 menit)
**Screen:** Swagger UI
**Action:**
1. Open Swagger
2. Find POST /notifications/history
3. Create 3 notifications dengan type berbeda:
   - INVOICE
   - PAYMENT_REMINDER
   - COMPLAINT_UPDATE
4. Show response 201 Created

**Narasi:**
> "Kita create beberapa test notifications. Invoice, payment reminder, dan complaint update. Semuanya berhasil dibuat."

### Scene 3: Check Badge (30 detik)
**Screen:** Browser - Dashboard
**Action:**
1. Refresh page
2. Show badge di header/sidebar dengan angka "3"
3. Hover badge

**Narasi:**
> "Refresh page. Lihat, badge muncul dengan angka 3. Ini adalah unread count."

### Scene 4: Notification List (1 menit)
**Screen:** Browser - Notifications page
**Action:**
1. Click "Notifications" menu
2. Show list dengan 3 notifications
3. Point out:
   - Blue border untuk unread
   - Icons berbeda per type
   - Time relative
4. Click salah satu notification
5. Show blue border hilang
6. Show badge count jadi "2"

**Narasi:**
> "Klik Notifications. Ini list semua notifications. Lihat, yang unread ada blue border. Icon berbeda sesuai type. Time nya relative. Klik salah satu, blue border hilang, badge berkurang jadi 2."

### Scene 5: Mark All & Delete (45 detik)
**Screen:** Browser - Notifications page
**Action:**
1. Click "Tandai Semua Dibaca"
2. Show toast notification
3. Show semua jadi read
4. Show badge jadi "0"
5. Hover notification
6. Click delete button (×)
7. Show notification hilang
8. Show toast "Notifikasi dihapus"

**Narasi:**
> "Klik Tandai Semua Dibaca. Toast muncul, semua jadi read, badge jadi 0. Sekarang delete salah satu. Hover, klik X, notification hilang. Perfect!"

### Scene 6: Outro (15 detik)
**Screen:** Browser - Notifications page
**Narasi:**
> "Great! Notification history works perfectly. Next, kita test settings dan error handling. Stay tuned!"

---

## 📹 Video 3: Settings & Error Handling (3 menit)

### Scene 1: Intro (15 detik)
**Screen:** Browser - Settings page
**Narasi:**
> "Final video! Kita akan test notification settings dan error handling. Let's go!"

### Scene 2: Test Settings Toggles (1 menit 30 detik)
**Screen:** Browser - Settings page
**Action:**
1. Show WhatsApp toggle
2. Toggle ON → Show toast
3. Toggle OFF → Show toast
4. Show Push toggle
5. Toggle ON/OFF → Show toast
6. Show notification type toggles
7. Toggle each one → Show toast
8. Refresh page
9. Show settings persist

**Narasi:**
> "Test semua toggles. WhatsApp, Push, dan notification types. Setiap toggle, toast muncul. Refresh page, settings tetap tersimpan. Perfect!"

### Scene 3: Test Error Handling (1 menit)
**Screen:** Split - Terminal & Browser
**Action:**
1. Stop backend server (Ctrl+C)
2. Try toggle setting
3. Show toast error
4. Show setting revert
5. Start backend again
6. Try toggle
7. Show success

**Narasi:**
> "Sekarang test error handling. Stop backend. Try toggle. Error toast muncul, setting revert. Start backend lagi, toggle works. Error handling perfect!"

### Scene 4: Test Rate Limiting (30 detik)
**Screen:** Browser
**Action:**
1. Spam refresh page (Ctrl+R berkali-kali)
2. Show rate limit toast
3. Wait beberapa detik
4. Try again
5. Show works

**Narasi:**
> "Test rate limiting. Spam refresh. Rate limit toast muncul dengan countdown. Wait, try again, works. Excellent!"

### Scene 5: Outro (15 detik)
**Screen:** Browser - Dashboard
**Narasi:**
> "Perfect! Semua features works. Push notification, notification history, settings, error handling. Notification system complete! Thanks for watching!"

---

## 🎬 Production Tips

### Camera Setup
- Screen recording: 1920x1080
- Frame rate: 30fps
- Cursor highlight: ON
- Keyboard shortcuts visible: ON

### Audio
- Clear microphone
- No background noise
- Consistent volume
- Speak clearly & slowly

### Editing
- Add text overlays untuk important points
- Highlight cursor clicks
- Add zoom untuk small UI elements
- Background music (optional, low volume)

### Timestamps (untuk YouTube description)
```
Video 1: Setup & Push Notification
0:00 - Intro
0:15 - Start Servers
0:45 - Login
1:15 - Enable Push Notification
2:15 - Test Push Notification
2:45 - Outro

Video 2: Notification History
0:00 - Intro
0:15 - Create Test Notifications
1:15 - Check Badge
1:45 - Notification List
2:45 - Mark All & Delete
3:30 - Outro

Video 3: Settings & Error Handling
0:00 - Intro
0:15 - Test Settings Toggles
1:45 - Test Error Handling
2:45 - Test Rate Limiting
3:15 - Outro
```

---

## 📝 Video Description Template

```
🔔 Notification System Testing - Management Kost

Di video ini kita test complete notification system yang sudah diimplement:
✅ Push Notifications dengan Firebase Cloud Messaging
✅ Notification History dengan badge & pagination
✅ Notification Settings dengan preferences
✅ Error Handling & Rate Limiting

🎯 Features:
- Automatic token refresh
- Real-time push notifications
- Notification badge dengan unread count
- Mark as read & delete functionality
- Filter all/unread
- Pagination dengan load more
- Complete settings UI
- Error handling & rate limiting

📚 Resources:
- Testing Guide: TESTING_GUIDE.md
- Quick Test: QUICK_TEST.md
- Implementation Status: IMPLEMENTATION_STATUS.md

🔗 Links:
- GitHub: [your-repo-url]
- Documentation: [docs-url]

⏱️ Timestamps:
[timestamps here]

#notification #pushnotification #firebase #nextjs #react #typescript
```

---

**Happy Recording! 🎥**
