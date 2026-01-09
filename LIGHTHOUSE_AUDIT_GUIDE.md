# Lighthouse Audit Guide

This guide provides instructions for running Lighthouse audits on the Kost Management Frontend application.

## Prerequisites

1. **Build the production version:**

   ```bash
   npm run build
   ```

2. **Start the production server:**

   ```bash
   npm start
   ```

3. **Install Lighthouse CLI (optional):**
   ```bash
   npm install -g lighthouse
   ```

## Running Lighthouse Audits

### Method 1: Chrome DevTools (Recommended)

1. Open Chrome browser
2. Navigate to the page you want to audit
3. Open DevTools (F12 or Ctrl+Shift+I)
4. Go to the "Lighthouse" tab
5. Select categories to audit:
   - ✅ Performance
   - ✅ Accessibility
   - ✅ Best Practices
   - ✅ SEO
   - ✅ Progressive Web App
6. Select "Desktop" mode
7. Click "Analyze page load"
8. Review the report and save it

### Method 2: Lighthouse CLI

Run audits on major pages:

```bash
# Login page
lighthouse http://localhost:3000/login --output html --output-path ./lighthouse-reports/login.html --chrome-flags="--headless"

# Dashboard
lighthouse http://localhost:3000/dashboard --output html --output-path ./lighthouse-reports/dashboard.html --chrome-flags="--headless"

# Rooms list
lighthouse http://localhost:3000/rooms --output html --output-path ./lighthouse-reports/rooms.html --chrome-flags="--headless"

# Residents list
lighthouse http://localhost:3000/residents --output html --output-path ./lighthouse-reports/residents.html --chrome-flags="--headless"

# Invoices list
lighthouse http://localhost:3000/invoices --output html --output-path ./lighthouse-reports/invoices.html --chrome-flags="--headless"

# Reports page
lighthouse http://localhost:3000/reports --output html --output-path ./lighthouse-reports/reports.html --chrome-flags="--headless"
```

### Method 3: PageSpeed Insights (Online)

1. Deploy the application to a public URL
2. Visit https://pagespeed.web.dev/
3. Enter your URL
4. Review the report

## Pages to Audit

Audit these major pages to get comprehensive coverage:

1. **Login Page** (`/login`)
   - Entry point for all users
   - Should be fast and accessible

2. **Dashboard** (`/dashboard`)
   - Main landing page after login
   - Role-based content

3. **Rooms List** (`/rooms`)
   - Data-heavy page with tables
   - Search and filter functionality

4. **Residents List** (`/residents`)
   - Complex data table
   - Multiple filters

5. **Invoices List** (`/invoices`)
   - Financial data display
   - Status badges and filters

6. **Reports Page** (`/reports`)
   - Charts and visualizations
   - Heavy data processing

## Target Scores

Aim for these minimum scores:

- **Performance:** 90+
- **Accessibility:** 90+
- **Best Practices:** 90+
- **SEO:** 90+
- **PWA:** 90+

## Common Performance Issues & Fixes

### 1. Large JavaScript Bundles

**Issue:** Bundle size too large
**Fix:**

- Implement code splitting with dynamic imports
- Remove unused dependencies
- Use tree-shaking

### 2. Unoptimized Images

**Issue:** Large image files
**Fix:**

- Use Next.js Image component
- Enable AVIF/WebP formats
- Add blur placeholders
- Implement lazy loading

### 3. Render-Blocking Resources

**Issue:** CSS/JS blocking initial render
**Fix:**

- Inline critical CSS
- Defer non-critical JavaScript
- Use font-display: swap

### 4. Long Tasks

**Issue:** JavaScript execution blocking main thread
**Fix:**

- Break up long tasks
- Use Web Workers for heavy computation
- Implement virtualization for long lists

### 5. Cumulative Layout Shift (CLS)

**Issue:** Elements shifting during load
**Fix:**

- Set explicit width/height for images
- Reserve space for dynamic content
- Use skeleton loaders

### 6. Largest Contentful Paint (LCP)

**Issue:** Slow loading of main content
**Fix:**

- Optimize images
- Preload critical resources
- Use CDN for static assets
- Implement server-side rendering

### 7. First Input Delay (FID)

**Issue:** Slow response to user interaction
**Fix:**

- Reduce JavaScript execution time
- Break up long tasks
- Use code splitting

## Accessibility Issues & Fixes

### 1. Missing ARIA Labels

**Issue:** Screen readers can't identify elements
**Fix:**

- Add `aria-label` to interactive elements
- Use `aria-describedby` for descriptions
- Add `aria-live` for dynamic content

### 2. Low Color Contrast

**Issue:** Text hard to read
**Fix:**

- Use WCAG AA compliant colors
- Test with contrast checker
- Adjust color palette

### 3. Missing Alt Text

**Issue:** Images not accessible
**Fix:**

- Add descriptive `alt` attributes
- Use empty `alt=""` for decorative images

### 4. Keyboard Navigation

**Issue:** Can't navigate without mouse
**Fix:**

- Ensure all interactive elements are focusable
- Add visible focus indicators
- Implement keyboard shortcuts

## Best Practices Issues & Fixes

### 1. Console Errors

**Issue:** JavaScript errors in console
**Fix:**

- Fix all console errors
- Remove console.log statements
- Handle errors gracefully

### 2. HTTPS

**Issue:** Not using HTTPS
**Fix:**

- Deploy with HTTPS enabled
- Redirect HTTP to HTTPS

### 3. Security Headers

**Issue:** Missing security headers
**Fix:**

- Add Content-Security-Policy
- Add X-Frame-Options
- Add X-Content-Type-Options

## SEO Issues & Fixes

### 1. Missing Meta Tags

**Issue:** No meta description
**Fix:**

- Add meta description to all pages
- Add Open Graph tags
- Add Twitter Card tags

### 2. Missing Title Tags

**Issue:** Generic or missing titles
**Fix:**

- Add unique, descriptive titles
- Include keywords
- Keep under 60 characters

### 3. Heading Structure

**Issue:** Improper heading hierarchy
**Fix:**

- Use h1 for main heading
- Use h2-h6 in proper order
- Don't skip heading levels

## PWA Issues & Fixes

### 1. Service Worker Not Registered

**Issue:** PWA not installable
**Fix:**

- Ensure service worker is registered
- Check manifest.json is valid
- Test install prompt

### 2. Missing Manifest

**Issue:** No app manifest
**Fix:**

- Create manifest.json
- Add icons (192x192, 512x512)
- Set display mode to standalone

### 3. Not Served Over HTTPS

**Issue:** PWA requires HTTPS
**Fix:**

- Deploy with HTTPS
- Test on localhost (HTTPS not required)

## Automated Audit Script

For automated audits, use the provided script:

```bash
node lighthouse-audit.js
```

This will:

- Run audits on all major pages
- Generate HTML reports
- Create a summary JSON file
- Calculate average scores
- Provide recommendations

## Continuous Monitoring

Set up continuous monitoring:

1. **CI/CD Integration:**
   - Add Lighthouse CI to your pipeline
   - Fail builds if scores drop below threshold

2. **Regular Audits:**
   - Run audits weekly
   - Track score trends
   - Address issues promptly

3. **Performance Budget:**
   - Set bundle size limits
   - Monitor Core Web Vitals
   - Track loading times

## Resources

- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Web.dev Performance](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)

## Summary Checklist

- [ ] Build production version
- [ ] Start production server
- [ ] Run Lighthouse on all major pages
- [ ] Review performance scores (target: 90+)
- [ ] Review accessibility scores (target: 90+)
- [ ] Review best practices scores (target: 90+)
- [ ] Review SEO scores (target: 90+)
- [ ] Review PWA scores (target: 90+)
- [ ] Document issues found
- [ ] Implement fixes
- [ ] Re-run audits to verify improvements
- [ ] Save reports for future reference
