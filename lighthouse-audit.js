/**
 * Lighthouse Audit Script
 * Runs Lighthouse audits on major pages and generates a report
 */

const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");
const fs = require("fs");
const path = require("path");

// Pages to audit
const pages = [
  { name: "Login", url: "http://localhost:3000/login" },
  { name: "Dashboard", url: "http://localhost:3000/dashboard" },
  { name: "Rooms List", url: "http://localhost:3000/rooms" },
  { name: "Residents List", url: "http://localhost:3000/residents" },
  { name: "Invoices List", url: "http://localhost:3000/invoices" },
  { name: "Reports", url: "http://localhost:3000/reports" },
];

// Lighthouse configuration
const config = {
  extends: "lighthouse:default",
  settings: {
    onlyCategories: [
      "performance",
      "accessibility",
      "best-practices",
      "seo",
      "pwa",
    ],
    formFactor: "desktop",
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
    },
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
  },
};

async function launchChromeAndRunLighthouse(url, opts, config = null) {
  const chrome = await chromeLauncher.launch({ chromeFlags: opts.chromeFlags });
  opts.port = chrome.port;
  const results = await lighthouse(url, opts, config);
  await chrome.kill();
  return results;
}

async function runAudits() {
  console.log("🚀 Starting Lighthouse audits...\n");

  const results = [];
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const reportDir = path.join(__dirname, "lighthouse-reports", timestamp);

  // Create report directory
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  for (const page of pages) {
    console.log(`📊 Auditing: ${page.name} (${page.url})`);

    try {
      const runnerResult = await launchChromeAndRunLighthouse(
        page.url,
        {
          chromeFlags: ["--headless", "--no-sandbox", "--disable-gpu"],
        },
        config
      );

      const { lhr } = runnerResult;

      // Extract scores
      const scores = {
        performance: Math.round(lhr.categories.performance.score * 100),
        accessibility: Math.round(lhr.categories.accessibility.score * 100),
        bestPractices: Math.round(lhr.categories["best-practices"].score * 100),
        seo: Math.round(lhr.categories.seo.score * 100),
        pwa: Math.round(lhr.categories.pwa.score * 100),
      };

      results.push({
        page: page.name,
        url: page.url,
        scores,
      });

      // Save HTML report
      const reportHtml = runnerResult.report;
      const reportPath = path.join(
        reportDir,
        `${page.name.replace(/\s+/g, "-").toLowerCase()}.html`
      );
      fs.writeFileSync(reportPath, reportHtml);

      console.log(`  ✅ Performance: ${scores.performance}`);
      console.log(`  ✅ Accessibility: ${scores.accessibility}`);
      console.log(`  ✅ Best Practices: ${scores.bestPractices}`);
      console.log(`  ✅ SEO: ${scores.seo}`);
      console.log(`  ✅ PWA: ${scores.pwa}`);
      console.log(`  📄 Report saved: ${reportPath}\n`);
    } catch (error) {
      console.error(`  ❌ Error auditing ${page.name}:`, error.message);
      results.push({
        page: page.name,
        url: page.url,
        error: error.message,
      });
    }
  }

  // Generate summary report
  const summary = generateSummary(results);
  const summaryPath = path.join(reportDir, "summary.json");
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

  console.log("\n📊 Audit Summary:");
  console.log("=".repeat(60));
  console.log(JSON.stringify(summary, null, 2));
  console.log("=".repeat(60));
  console.log(`\n✅ All reports saved to: ${reportDir}`);

  return summary;
}

function generateSummary(results) {
  const summary = {
    timestamp: new Date().toISOString(),
    totalPages: results.length,
    averageScores: {
      performance: 0,
      accessibility: 0,
      bestPractices: 0,
      seo: 0,
      pwa: 0,
    },
    pages: results,
    recommendations: [],
  };

  // Calculate averages
  const validResults = results.filter((r) => !r.error);
  if (validResults.length > 0) {
    const totals = validResults.reduce(
      (acc, result) => {
        acc.performance += result.scores.performance;
        acc.accessibility += result.scores.accessibility;
        acc.bestPractices += result.scores.bestPractices;
        acc.seo += result.scores.seo;
        acc.pwa += result.scores.pwa;
        return acc;
      },
      { performance: 0, accessibility: 0, bestPractices: 0, seo: 0, pwa: 0 }
    );

    summary.averageScores = {
      performance: Math.round(totals.performance / validResults.length),
      accessibility: Math.round(totals.accessibility / validResults.length),
      bestPractices: Math.round(totals.bestPractices / validResults.length),
      seo: Math.round(totals.seo / validResults.length),
      pwa: Math.round(totals.pwa / validResults.length),
    };
  }

  // Generate recommendations
  if (summary.averageScores.performance < 90) {
    summary.recommendations.push(
      "Consider optimizing images, reducing JavaScript bundle size, and implementing code splitting"
    );
  }
  if (summary.averageScores.accessibility < 90) {
    summary.recommendations.push(
      "Review ARIA labels, color contrast, and keyboard navigation"
    );
  }
  if (summary.averageScores.bestPractices < 90) {
    summary.recommendations.push(
      "Review security headers, HTTPS usage, and console errors"
    );
  }
  if (summary.averageScores.seo < 90) {
    summary.recommendations.push(
      "Add meta descriptions, improve heading structure, and ensure crawlability"
    );
  }
  if (summary.averageScores.pwa < 90) {
    summary.recommendations.push(
      "Ensure service worker is registered, manifest is valid, and app is installable"
    );
  }

  return summary;
}

// Run audits
runAudits()
  .then((summary) => {
    console.log("\n✅ Lighthouse audit completed successfully!");
    process.exit(summary.averageScores.performance >= 90 ? 0 : 1);
  })
  .catch((error) => {
    console.error("\n❌ Lighthouse audit failed:", error);
    process.exit(1);
  });
