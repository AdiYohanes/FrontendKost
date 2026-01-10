# 📋 Quick Reference

Referensi cepat untuk development Management Kost Frontend.

---

## 🚀 Start Development

```bash
# Backend
cd backend && npm run start:dev

# Frontend
cd frontend && npm run dev
```

**URLs:**
- Frontend: http://localhost:3001
- Backend: http://localhost:3000
- API Docs: http://localhost:3000/api/docs

---

## 📁 Important Files

### Configuration
- `.env.local` - Environment variables (configured)
- `.env.example` - Template untuk environment variables
- `public/firebase-messaging-sw.js` - Service worker untuk push notifications

### Documentation
- `IMPLEMENTATION_STATUS.md` - **Main doc** - Status, issues, improvements
- `README.md` - Overview dan quick start
- `docs/FIREBASE_SETUP.md` - Firebase setup guide

### Key Code Files
- `lib/api/client.ts` - API client dengan auto-refresh
- `lib/stores/authStore.ts` - Auth state management
- `lib/firebase/fcm.ts` - Push notification helpers
- `components/settings/notification-settings.tsx` - Settings UI

---

## 🧪 Testing Checklist

- [ ] Login berhasil
- [ ] Token auto-refresh (wait 15 min atau force 401)
- [ ] Logout revoke token
- [ ] Browser minta notification permission
- [ ] Allow notifications
- [ ] FCM token registered (check console)
- [ ] Settings page accessible
- [ ] Toggle preferences works
- [ ] Test push notification dari backend
- [ ] Notification muncul di browser

---

## 🔑 Environment Variables

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Firebase (Already configured)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB5fJ8XvliDca2WfbpP7MGywJodNDIYFxQ
NEXT_PUBLIC_FIREBASE_PROJECT_ID=kost-management-75ffb
NEXT_PUBLIC_FIREBASE_VAPID_KEY=BGtEMhaRyYOjyJ3Y2dzj2WvVeYC-7EJu1f8grWz-ogorOoz-yEKP_DSCIoEY0CtdmQS4slM-wSMjPtvDpxkdxfU
```

---

## 🐛 Common Issues

### Notification tidak muncul
1. Check browser console untuk error
2. Verify FCM token registered: `localStorage.getItem('fcmToken')`
3. Check notification permission: `Notification.permission`
4. Test dari backend dengan user ID yang benar

### Token refresh tidak jalan
1. Check `.env.local` ada `NEXT_PUBLIC_API_URL`
2. Restart dev server
3. Clear localStorage dan login ulang
4. Check backend logs

### Service worker error
1. DevTools → Application → Service Workers → Unregister
2. Clear cache (Ctrl+Shift+Delete)
3. Hard reload (Ctrl+Shift+R)

---

## 📊 API Endpoints

```bash
# Auth
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout

# Notifications
GET /api/notifications/preferences
PATCH /api/notifications/preferences
POST /api/notifications/fcm-token
POST /api/notifications/fcm-token/remove
POST /api/notifications/test/push
```

---

## 🎯 Next Tasks

### Testing (Now)
1. Test all features
2. Verify push notifications
3. Check error handling

### Improvements (Soon)
1. Add rate limit error toast
2. Add notification history
3. Improve error messages
4. Add notification badge

### Future (Later)
1. Payment gateway
2. Advanced reports
3. File upload
4. Email notifications

---

## 📚 Full Documentation

See `IMPLEMENTATION_STATUS.md` for:
- Complete feature list
- Detailed issues & improvements
- Implementation details
- Configuration guides

---

**Last Updated:** 10 Januari 2026  
**Version:** 1.3
