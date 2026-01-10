# 📋 Backend Notification Endpoints Checklist

**Last Updated:** 10 Januari 2026

---

## 🎯 Overview

Dokumen ini berisi checklist endpoint backend yang dibutuhkan untuk sistem notifikasi frontend. Gunakan ini untuk memverifikasi apakah backend sudah lengkap.

---

## ✅ Endpoint yang Dibutuhkan Frontend

### 1. Notification Preferences (Settings)

#### GET `/api/notifications/preferences`
**Status:** ⚠️ Perlu Verifikasi

**Deskripsi:** Get user notification preferences

**Response:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "whatsappEnabled": true,
  "pushEnabled": true,
  "invoiceNotification": true,
  "paymentReminder": true,
  "complaintUpdate": true,
  "announcementNotification": true,
  "createdAt": "2024-01-10T00:00:00.000Z",
  "updatedAt": "2024-01-10T00:00:00.000Z"
}
```

**Cara Test:**
```bash
GET http://localhost:3000/api/notifications/preferences
Authorization: Bearer <access-token>
```

---

#### PATCH `/api/notifications/preferences`
**Status:** ⚠️ Perlu Verifikasi

**Deskripsi:** Update user notification preferences

**Request Body:**
```json
{
  "whatsappEnabled": true,
  "pushEnabled": true,
  "invoiceNotification": true,
  "paymentReminder": true,
  "complaintUpdate": true,
  "announcementNotification": true
}
```

**Response:** Same as GET

**Cara Test:**
```bash
PATCH http://localhost:3000/api/notifications/preferences
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "pushEnabled": true,
  "invoiceNotification": false
}
```

---

### 2. FCM Token Management

#### POST `/api/notifications/fcm-token`
**Status:** ⚠️ Perlu Verifikasi

**Deskripsi:** Register FCM token for push notifications

**Request Body:**
```json
{
  "token": "fcm-token-string",
  "deviceId": "device-id-optional",
  "platform": "web"
}
```

**Response:**
```json
{
  "message": "FCM token registered successfully"
}
```

**Cara Test:**
```bash
POST http://localhost:3000/api/notifications/fcm-token
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "token": "test-fcm-token",
  "platform": "web"
}
```

---

#### POST `/api/notifications/fcm-token/remove`
**Status:** ⚠️ Perlu Verifikasi

**Deskripsi:** Remove FCM token (logout/disable notifications)

**Request Body:**
```json
{
  "token": "fcm-token-string"
}
```

**Response:**
```json
{
  "message": "FCM token removed successfully"
}
```

**Cara Test:**
```bash
POST http://localhost:3000/api/notifications/fcm-token/remove
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "token": "test-fcm-token"
}
```

---

### 3. Notification History

#### GET `/api/notifications/history`
**Status:** ❌ MISSING (Error 404)

**Deskripsi:** Get notification history with pagination

**Query Parameters:**
- `limit` (optional): Number of items per page (default: 20)
- `offset` (optional): Offset for pagination (default: 0)
- `unreadOnly` (optional): Filter unread only (default: false)

**Response:**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "userId": "uuid",
      "title": "Invoice Baru",
      "message": "Invoice untuk bulan Januari telah dibuat",
      "type": "INVOICE",
      "isRead": false,
      "readAt": null,
      "createdAt": "2024-01-10T00:00:00.000Z"
    }
  ],
  "total": 50,
  "unreadCount": 5
}
```

**Cara Test:**
```bash
GET http://localhost:3000/api/notifications/history?limit=20&offset=0
Authorization: Bearer <access-token>
```

---

#### GET `/api/notifications/history/unread-count`
**Status:** ❌ MISSING (Error 404)

**Deskripsi:** Get unread notification count (untuk badge)

**Response:**
```json
{
  "count": 5
}
```

**Cara Test:**
```bash
GET http://localhost:3000/api/notifications/history/unread-count
Authorization: Bearer <access-token>
```

**Note:** Endpoint ini yang menyebabkan error 404 di frontend. Sudah di-handle gracefully di frontend (return 0 jika tidak ada).

---

#### PATCH `/api/notifications/history/:id/read`
**Status:** ❌ MISSING

**Deskripsi:** Mark single notification as read

**Response:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "title": "Invoice Baru",
  "message": "Invoice untuk bulan Januari telah dibuat",
  "type": "INVOICE",
  "isRead": true,
  "readAt": "2024-01-10T10:00:00.000Z",
  "createdAt": "2024-01-10T00:00:00.000Z"
}
```

**Cara Test:**
```bash
PATCH http://localhost:3000/api/notifications/history/uuid-here/read
Authorization: Bearer <access-token>
```

---

#### PATCH `/api/notifications/history/read-all`
**Status:** ❌ MISSING

**Deskripsi:** Mark all notifications as read

**Response:**
```json
{
  "count": 5,
  "message": "5 notifications marked as read"
}
```

**Cara Test:**
```bash
PATCH http://localhost:3000/api/notifications/history/read-all
Authorization: Bearer <access-token>
```

---

#### DELETE `/api/notifications/history/:id`
**Status:** ❌ MISSING

**Deskripsi:** Delete single notification

**Response:**
```json
{
  "message": "Notification deleted successfully"
}
```

**Cara Test:**
```bash
DELETE http://localhost:3000/api/notifications/history/uuid-here
Authorization: Bearer <access-token>
```

---

### 4. Test Endpoints (Optional - untuk development)

#### POST `/api/notifications/test/push`
**Status:** ⚠️ Perlu Verifikasi

**Deskripsi:** Test push notification

**Request Body:**
```json
{
  "userId": "uuid",
  "title": "Test Notification",
  "message": "This is a test"
}
```

**Response:**
```json
{
  "message": "Push notification sent successfully"
}
```

**Cara Test:**
```bash
POST http://localhost:3000/api/notifications/test/push
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "userId": "your-user-id",
  "title": "Test",
  "message": "Testing push notification"
}
```

---

#### POST `/api/notifications/test/whatsapp`
**Status:** ⚠️ Perlu Verifikasi

**Deskripsi:** Test WhatsApp notification

**Request Body:**
```json
{
  "phoneNumber": "628123456789",
  "message": "Test WhatsApp notification"
}
```

**Response:**
```json
{
  "message": "WhatsApp notification sent successfully"
}
```

**Cara Test:**
```bash
POST http://localhost:3000/api/notifications/test/whatsapp
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "phoneNumber": "628123456789",
  "message": "Test message"
}
```

---

## 📊 Summary Status

| Kategori | Endpoint | Status | Priority |
|----------|----------|--------|----------|
| **Preferences** | GET /preferences | ⚠️ Verify | HIGH |
| **Preferences** | PATCH /preferences | ⚠️ Verify | HIGH |
| **FCM Token** | POST /fcm-token | ⚠️ Verify | HIGH |
| **FCM Token** | POST /fcm-token/remove | ⚠️ Verify | MEDIUM |
| **History** | GET /history | ❌ Missing | HIGH |
| **History** | GET /history/unread-count | ❌ Missing | HIGH |
| **History** | PATCH /history/:id/read | ❌ Missing | HIGH |
| **History** | PATCH /history/read-all | ❌ Missing | MEDIUM |
| **History** | DELETE /history/:id | ❌ Missing | MEDIUM |
| **Test** | POST /test/push | ⚠️ Verify | LOW |
| **Test** | POST /test/whatsapp | ⚠️ Verify | LOW |

**Legend:**
- ✅ **Verified** - Endpoint tested dan berfungsi
- ⚠️ **Verify** - Perlu ditest apakah sudah ada
- ❌ **Missing** - Endpoint belum ada (confirmed by 404 error)

---

## 🔧 Backend Implementation Guide

### Database Schema yang Dibutuhkan

#### 1. NotificationHistory Model
```prisma
model NotificationHistory {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  title     String
  message   String   @db.Text
  type      NotificationType
  
  isRead    Boolean  @default(false)
  readAt    DateTime?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([userId])
  @@index([userId, isRead])
  @@index([createdAt])
}

enum NotificationType {
  INVOICE
  PAYMENT
  COMPLAINT
  ANNOUNCEMENT
  MOVE_IN
  MOVE_OUT
}
```

#### 2. NotificationPreference Model (Mungkin sudah ada)
```prisma
model NotificationPreference {
  id        String   @id @default(uuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  whatsappEnabled           Boolean @default(true)
  pushEnabled               Boolean @default(true)
  invoiceNotification       Boolean @default(true)
  paymentReminder           Boolean @default(true)
  complaintUpdate           Boolean @default(true)
  announcementNotification  Boolean @default(true)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### 3. FcmToken Model (Mungkin sudah ada)
```prisma
model FcmToken {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  token     String   @unique
  deviceId  String?
  platform  String   @default("web") // web, ios, android
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([userId])
}
```

---

## 🚀 Quick Implementation Steps

### Step 1: Verifikasi Endpoint yang Sudah Ada
```bash
# Test preferences
curl -X GET http://localhost:3000/api/notifications/preferences \
  -H "Authorization: Bearer <token>"

# Test FCM token
curl -X POST http://localhost:3000/api/notifications/fcm-token \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"token":"test","platform":"web"}'
```

### Step 2: Implementasi Notification History Endpoints

**Priority HIGH - Dibutuhkan untuk badge dan notification page:**

1. `GET /api/notifications/history` - List notifications
2. `GET /api/notifications/history/unread-count` - Badge count
3. `PATCH /api/notifications/history/:id/read` - Mark as read

**Priority MEDIUM - Nice to have:**

4. `PATCH /api/notifications/history/read-all` - Mark all as read
5. `DELETE /api/notifications/history/:id` - Delete notification

### Step 3: Buat Service untuk Save Notification History

Setiap kali kirim notifikasi (WhatsApp/Push), save juga ke NotificationHistory:

```typescript
// notification.service.ts
async sendNotification(userId: string, title: string, message: string, type: NotificationType) {
  // 1. Send WhatsApp/Push notification
  await this.sendPushNotification(userId, title, message);
  
  // 2. Save to history
  await this.prisma.notificationHistory.create({
    data: {
      userId,
      title,
      message,
      type,
    },
  });
}
```

---

## 📝 Testing Checklist

Setelah implementasi, test dengan urutan ini:

### 1. Test Preferences
- [ ] GET preferences (should return default values for new user)
- [ ] PATCH preferences (update some values)
- [ ] GET preferences again (verify changes saved)

### 2. Test FCM Token
- [ ] POST register token
- [ ] POST register same token again (should update, not duplicate)
- [ ] POST remove token
- [ ] Verify token removed from database

### 3. Test Notification History
- [ ] GET history (empty for new user)
- [ ] Manually create some test notifications in database
- [ ] GET history (should return notifications)
- [ ] GET unread-count (should return correct count)
- [ ] PATCH mark one as read
- [ ] GET unread-count (count should decrease)
- [ ] PATCH mark all as read
- [ ] GET unread-count (should be 0)
- [ ] DELETE one notification
- [ ] GET history (notification should be gone)

### 4. Test Integration
- [ ] Create invoice → notification history created
- [ ] Send payment reminder → notification history created
- [ ] Update complaint → notification history created
- [ ] Frontend badge shows correct count
- [ ] Frontend notification page shows all notifications
- [ ] Mark as read from frontend works
- [ ] Delete from frontend works

---

## 🎯 Current Status

**Frontend:** ✅ Siap dan sudah handle missing endpoints gracefully

**Backend yang Perlu Diimplementasi:**
1. ❌ NotificationHistory model & endpoints (HIGH PRIORITY)
2. ⚠️ Verify existing preferences & FCM endpoints
3. ⚠️ Integrate history saving ke existing notification flow

**Impact jika Backend Belum Lengkap:**
- Badge notifikasi akan selalu 0 (tidak error, tapi tidak berfungsi)
- Halaman notifications akan kosong
- User tidak bisa lihat history notifikasi
- Fitur mark as read tidak berfungsi

**Workaround Sementara:**
- Frontend sudah handle dengan graceful degradation
- Tidak ada error yang muncul ke user
- Badge akan muncul otomatis saat backend ready

---

## 📞 Support

Jika ada pertanyaan tentang implementasi backend, refer ke:
- Frontend implementation: `lib/api/services/notification-history.ts`
- Frontend hooks: `lib/hooks/useNotificationHistory.ts`
- Frontend components: `components/notifications/*`

---

**Last Updated:** 10 Januari 2026  
**Version:** 1.0
