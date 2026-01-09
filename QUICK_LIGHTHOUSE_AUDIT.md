# Quick Lighthouse Audit Guide

## TL;DR - Run Lighthouse Now

### Option 1: Chrome DevTools (Easiest)

1. **Start the app:**

   ```bash
   cd kost-management-frontend
   npm run build
   npm start
   ```

2. **Open Chrome and navigate to:** `http://localhost:3000/login`

3. **Open DevTools:** Press `F12` or `Ctrl+Shift+I`

4. **Go to Lighthouse tab** (may be under >> menu)

5. **Configure:**
   - ✅ Performance
   - ✅ Accessibility
   - ✅ Best Practices
   - ✅ SEO
   - ✅ Progressive Web App
   - Select "Desktop" mode

6. **Click "Analyze page load"**

7. **Review scores** (Target: 90+ for all categories)

8. **Repeat for other pages:**
   - `/dashboard`
   - `/rooms`
   - `/residents`
   - `/invoices`
   - `/reports`

### Option 2: Command Line (Advanced)

```bash
# Install Lighthouse CLI globally
npm install -g lighthouse

# Start the app
cd kost-management-frontend
npm run build
npm start

# Run audit (in a new terminal)
lighthouse http://localhost:3000/login --view
```

## Expected Scores

Based on optimizations implemented:

| Category       | Target | Expected |
| -------------- | ------ | -------- |
| Performance    | 90+    | 90-95    |
| Accessibility  | 90+    | 95-100   |
| Best Practices | 90+    | 90-95    |
| SEO            | 90+    | 90-95    |
| PWA            | 90+    | 90-95    |

## Key Pages to Audit

1. **Login** (`/login`) - Entry point
2. **Dashboard** (`/dashboard`) - Main page
3. **Rooms** (`/rooms`) - Data table
4. **Residents** (`/residents`) - Complex table
5. **Invoices** (`/invoices`) - Financial data
6. **Reports** (`/reports`) - Charts

## Quick Fixes for Common Issues

### Performance < 90

- Check bundle size: `npm run build` output
- Verify images use Next.js Image component
- Check for console errors

### Accessibility < 90

- Verify ARIA labels on buttons
- Check color contrast
- Test keyboard navigation

### Best Practices < 90

- Check for console errors
- Verify HTTPS (in production)
- Check security headers

### SEO < 90

- Add meta descriptions
- Check heading structure
- Verify title tags

### PWA < 90

- Check service worker registration
- Verify manifest.json
- Test install prompt

## Troubleshooting

### "Cannot connect to localhost:3000"

```bash
# Make sure the app is running
npm start
```

### "Lighthouse tab not visible"

- Update Chrome to latest version
- Check under >> menu in DevTools

### "Scores are low in development"

```bash
# Always test production build
npm run build
npm start
```

## Save Reports

1. Click "Save report" button in Lighthouse
2. Choose HTML format
3. Save to `lighthouse-reports/` folder
4. Compare scores over time

## Continuous Monitoring

Add to your workflow:

```bash
# Before committing
npm run build
# Run Lighthouse audit
# Verify scores are 90+
```

## Need Help?

See detailed guides:

- `LIGHTHOUSE_AUDIT_GUIDE.md` - Complete guide
- `LIGHTHOUSE_AUDIT_RESULTS.md` - Expected results
- `PERFORMANCE_OPTIMIZATION_SUMMARY.md` - Optimizations done

---

**Quick Start:** Build → Start → Open Chrome → F12 → Lighthouse → Analyze
