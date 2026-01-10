# Management Kost - Frontend

Aplikasi manajemen kost berbasis Next.js dengan fitur PWA, offline sync, push notifications, dan optimasi performa.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local dengan konfigurasi Anda

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Buka [http://localhost:3001](http://localhost:3001) untuk melihat aplikasi.

## 📚 Dokumentasi

### Main Documentation
- **[IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md)** - Status implementasi fitur, issues, dan improvements
- **[START_HERE.md](START_HERE.md)** - Panduan awal untuk memulai development
- **[docs/FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md)** - Setup Firebase untuk push notifications

### Additional Docs
- **Setup**: Panduan instalasi dan konfigurasi ([docs/](docs/README.md))
- **Guides**: Tutorial testing dan development
- **Audits**: Hasil audit performa dan aksesibilitas

## ✨ Fitur Utama

### Core Features
- 📱 Progressive Web App (PWA) dengan offline support
- 🔄 Offline sync untuk data management
- 📊 Dashboard dengan charts dan reports
- 🏠 Manajemen rooms, residents, invoices
- 💰 Tracking expenses dan utilities
- 🧺 Laundry management
- 📝 Complaint handling
- 🍽️ Fridge inventory

### New Features (v1.3)
- 🔐 Automatic token refresh mechanism
- 🔔 Push notifications (Firebase Cloud Messaging)
- ⚙️ Notification preferences settings
- 🔒 Enhanced security dengan refresh tokens
- 🚦 Rate limiting error handling

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: Tailwind CSS + shadcn/ui
- **State**: Zustand + React Query
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **PWA**: next-pwa
- **Push Notifications**: Firebase Cloud Messaging
- **Authentication**: JWT with refresh tokens

## 📊 Performance

- Lighthouse Score: 90+ (semua kategori)
- 31+ routes (27 static, 4+ dynamic)
- Code splitting & lazy loading
- Image optimization (AVIF/WebP)
- API caching & prefetching
- Automatic token refresh (no re-login)

## 🔗 Quick Links

### Setup & Configuration
- [Backend Setup](docs/setup/BACKEND_SETUP.md)
- [Firebase Setup](docs/FIREBASE_SETUP.md)
- [Environment Variables](.env.example)

### Development
- [Implementation Status](IMPLEMENTATION_STATUS.md) - **Start here for current status**
- [Best Practices](docs/BEST_PRACTICES.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)

### Testing
- Test push notifications: See [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md#testing)
- Test refresh tokens: Login → wait 15 min → auto-refresh
- Test notification settings: `/settings/notifications`

## 🎯 Current Status

**Version:** 1.3  
**Implementation:** 35% Complete (Phase 1 Done)  
**Status:** ✅ Ready to Test

**Completed Features:**
- ✅ Password hashing (backend)
- ✅ Refresh token mechanism
- ✅ Rate limiting
- ✅ Push notifications (FCM)
- ✅ Notification preferences UI
- ✅ Settings page

**Next Phase:**
- Payment gateway integration
- Advanced reporting
- File upload management

See [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) for detailed status and improvements.

## 📝 License

Private project for Management Kost.
