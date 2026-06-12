/**
 * Automated Performance Tests
 * Run with: node performance-test.js
 * 
 * Requirements:
 * npm install --save-dev puppeteer lighthouse
 */

const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const { URL } = require('url');

// Configuration
const CONFIG = {
  url: process.env.TEST_URL || 'http://localhost:5173',
  runs: 3, // Number of test runs
  thresholds: {
    performance: 90,
    fcp: 600,
    lcp: 1000,
    cls: 0.02,
    tti: 1200,
    tbt: 150,
  },
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

/**
 * Log with color
 */
const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

/**
 * Get rating based on value and threshold
 */
const getRating = (value, threshold, inverse = false) => {
  if (inverse) {
    return value <= threshold ? 'good' : value <= threshold * 1.5 ? 'needs-improvement' : 'poor';
  }
  return value >= threshold ? 'good' : value >= threshold * 0.8 ? 'needs-improvement' : 'poor';
};

/**
 * Format metric value
 */
const formatMetric = (value, unit = 'ms') => {
  if (unit === 'score') return Math.round(value);
  if (unit === 'ms') return Math.round(value);
  if (unit === 'cls') return value.toFixed(3);
  return value;
};

/**
 * Run Lighthouse audit
 */
const runLighthouse = async (url, options = {}) => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const { lhr } = await lighthouse(url, {
    port: new URL(browser.wsEndpoint()).port,
    output: 'json',
    onlyCategories: ['performance'],
    ...options,
  });

  await browser.close();
  return lhr;
};

/**
 * Extract key metrics from Lighthouse report
 */
const extractMetrics = (lhr) => {
  const audits = lhr.audits;
  
  return {
    performanceScore: lhr.categories.performance.score * 100,
    fcp: audits['first-contentful-paint'].numericValue,
    lcp: audits['largest-contentful-paint'].numericValue,
    cls: audits['cumulative-layout-shift'].numericValue,
    tti: audits['interactive'].numericValue,
    tbt: audits['total-blocking-time'].numericValue,
    speedIndex: audits['speed-index'].numericValue,
  };
};

/**
 * Calculate statistics from multiple runs
 */
const calculateStats = (results) => {
  const metrics = Object.keys(results[0]);
  const stats = {};

  metrics.forEach((metric) => {
    const values = results.map((r) => r[metric]);
    const sorted = values.sort((a, b) => a - b);
    
    stats[metric] = {
      min: sorted[0],
      max: sorted[sorted.length - 1],
      median: sorted[Math.floor(sorted.length / 2)],
      avg: values.reduce((sum, v) => sum + v, 0) / values.length,
      p75: sorted[Math.floor(sorted.length * 0.75)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
    };
  });

  return stats;
};

/**
 * Print results table
 */
const printResults = (stats, thresholds) => {
  log('\n📊 Performance Test Results\n', 'cyan');
  log('═'.repeat(80), 'blue');
  
  const metrics = [
    { key: 'performanceScore', label: 'Performance Score', unit: 'score', threshold: thresholds.performance },
    { key: 'fcp', label: 'First Contentful Paint', unit: 'ms', threshold: thresholds.fcp, inverse: true },
    { key: 'lcp', label: 'Largest Contentful Paint', unit: 'ms', threshold: thresholds.lcp, inverse: true },
    { key: 'cls', label: 'Cumulative Layout Shift', unit: 'cls', threshold: thresholds.cls, inverse: true },
    { key: 'tti', label: 'Time to Interactive', unit: 'ms', threshold: thresholds.tti, inverse: true },
    { key: 'tbt', label: 'Total Blocking Time', unit: 'ms', threshold: thresholds.tbt, inverse: true },
    { key: 'speedIndex', label: 'Speed Index', unit: 'ms', threshold: 3000, inverse: true },
  ];

  metrics.forEach(({ key, label, unit, threshold, inverse }) => {
    const stat = stats[key];
    const value = stat.median;
    const rating = getRating(value, threshold, inverse);
    
    const ratingColor = rating === 'good' ? 'green' : rating === 'needs-improvement' ? 'yellow' : 'red';
    const ratingSymbol = rating === 'good' ? '✅' : rating === 'needs-improvement' ? '⚠️' : '❌';
    
    log(`\n${label}:`, 'cyan');
    log(`  Median: ${formatMetric(value, unit)}${unit === 'score' ? '' : unit === 'cls' ? '' : 'ms'} ${ratingSymbol}`, ratingColor);
    log(`  Min: ${formatMetric(stat.min, unit)}${unit === 'score' ? '' : unit === 'cls' ? '' : 'ms'}`, 'reset');
    log(`  Max: ${formatMetric(stat.max, unit)}${unit === 'score' ? '' : unit === 'cls' ? '' : 'ms'}`, 'reset');
    log(`  Avg: ${formatMetric(stat.avg, unit)}${unit === 'score' ? '' : unit === 'cls' ? '' : 'ms'}`, 'reset');
    log(`  P75: ${formatMetric(stat.p75, unit)}${unit === 'score' ? '' : unit === 'cls' ? '' : 'ms'}`, 'reset');
    log(`  P95: ${formatMetric(stat.p95, unit)}${unit === 'score' ? '' : unit === 'cls' ? '' : 'ms'}`, 'reset');
    log(`  Target: ${threshold}${unit === 'score' ? '' : unit === 'cls' ? '' : 'ms'}`, 'blue');
  });
  
  log('\n' + '═'.repeat(80), 'blue');
};

/**
 * Check if all metrics pass thresholds
 */
const checkThresholds = (stats, thresholds) => {
  const checks = [
    { name: 'Performance Score', value: stats.performanceScore.median, threshold: thresholds.performance, inverse: false },
    { name: 'FCP', value: stats.fcp.median, threshold: thresholds.fcp, inverse: true },
    { name: 'LCP', value: stats.lcp.median, threshold: thresholds.lcp, inverse: true },
    { name: 'CLS', value: stats.cls.median, threshold: thresholds.cls, inverse: true },
    { name: 'TTI', value: stats.tti.median, threshold: thresholds.tti, inverse: true },
    { name: 'TBT', value: stats.tbt.median, threshold: thresholds.tbt, inverse: true },
  ];

  log('\n🎯 Threshold Checks\n', 'cyan');
  log('═'.repeat(80), 'blue');

  let allPassed = true;

  checks.forEach(({ name, value, threshold, inverse }) => {
    const passed = inverse ? value <= threshold : value >= threshold;
    const symbol = passed ? '✅' : '❌';
    const color = passed ? 'green' : 'red';
    
    log(`${symbol} ${name}: ${formatMetric(value)} (threshold: ${threshold})`, color);
    
    if (!passed) allPassed = false;
  });

  log('\n' + '═'.repeat(80), 'blue');

  return allPassed;
};

/**
 * Main test function
 */
const runPerformanceTests = async () => {
  log('\n🚀 Starting Performance Tests\n', 'cyan');
  log(`URL: ${CONFIG.url}`, 'blue');
  log(`Runs: ${CONFIG.runs}`, 'blue');
  log('\n' + '═'.repeat(80), 'blue');

  const results = [];

  for (let i = 0; i < CONFIG.runs; i++) {
    log(`\n📊 Run ${i + 1}/${CONFIG.runs}...`, 'yellow');
    
    try {
      const lhr = await runLighthouse(CONFIG.url);
      const metrics = extractMetrics(lhr);
      results.push(metrics);
      
      log(`✅ Run ${i + 1} complete`, 'green');
    } catch (error) {
      log(`❌ Run ${i + 1} failed: ${error.message}`, 'red');
      throw error;
    }
  }

  // Calculate statistics
  const stats = calculateStats(results);

  // Print results
  printResults(stats, CONFIG.thresholds);

  // Check thresholds
  const allPassed = checkThresholds(stats, CONFIG.thresholds);

  // Final status
  log('\n' + '═'.repeat(80), 'blue');
  if (allPassed) {
    log('\n✅ All performance tests PASSED!\n', 'green');
    process.exit(0);
  } else {
    log('\n❌ Some performance tests FAILED!\n', 'red');
    process.exit(1);
  }
};

// Run tests
runPerformanceTests().catch((error) => {
  log(`\n❌ Test execution failed: ${error.message}\n`, 'red');
  console.error(error);
  process.exit(1);
});
