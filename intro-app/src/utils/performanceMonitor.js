/**
 * Performance Monitoring Utility
 * Tracks Web Vitals and custom performance metrics
 * 
 * Usage:
 * import { initPerformanceMonitoring } from '@/utils/performanceMonitor';
 * initPerformanceMonitoring();
 */

// Web Vitals thresholds (Google recommendations)
const THRESHOLDS = {
  FCP: { good: 1800, needsImprovement: 3000 },
  LCP: { good: 2500, needsImprovement: 4000 },
  FID: { good: 100, needsImprovement: 300 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  TTFB: { good: 800, needsImprovement: 1800 },
  INP: { good: 200, needsImprovement: 500 }
};

/**
 * Get rating based on metric value and thresholds
 */
const getRating = (value, thresholds) => {
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.needsImprovement) return 'needs-improvement';
  return 'poor';
};

/**
 * Send metric to analytics
 */
const sendToAnalytics = (metric) => {
  if (window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta,
      metric_rating: metric.rating,
    });
  }

  if (process.env.REACT_APP_ANALYTICS_ENDPOINT) {
    fetch(process.env.REACT_APP_ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metric: metric.name,
        value: metric.value,
        rating: metric.rating,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      }),
      keepalive: true,
    }).catch(() => {});
  }
};

/**
 * Track First Contentful Paint (FCP)
 */
const trackFCP = () => {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        const metric = {
          name: 'FCP',
          value: entry.startTime,
          rating: getRating(entry.startTime, THRESHOLDS.FCP),
          id: `v1-${Date.now()}-${Math.random()}`,
          delta: entry.startTime,
        };
        sendToAnalytics(metric);
        observer.disconnect();
      }
    }
  });

  observer.observe({ type: 'paint', buffered: true });
};

/**
 * Track Largest Contentful Paint (LCP)
 */
const trackLCP = () => {
  let lcpValue = 0;

  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    lcpValue = lastEntry.renderTime || lastEntry.loadTime;
  });

  observer.observe({ type: 'largest-contentful-paint', buffered: true });

  // Report when page is hidden or unloaded
  const reportLCP = () => {
    if (lcpValue > 0) {
      const metric = {
        name: 'LCP',
        value: lcpValue,
        rating: getRating(lcpValue, THRESHOLDS.LCP),
        id: `v1-${Date.now()}-${Math.random()}`,
        delta: lcpValue,
      };
      sendToAnalytics(metric);
    }
    observer.disconnect();
  };

  ['visibilitychange', 'pagehide'].forEach((event) => {
    addEventListener(event, reportLCP, { once: true, capture: true });
  });
};

/**
 * Track Cumulative Layout Shift (CLS)
 */
const trackCLS = () => {
  let clsValue = 0;
  let sessionValue = 0;
  let sessionEntries = [];

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) {
        const firstSessionEntry = sessionEntries[0];
        const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

        if (
          sessionValue &&
          entry.startTime - lastSessionEntry.startTime < 1000 &&
          entry.startTime - firstSessionEntry.startTime < 5000
        ) {
          sessionValue += entry.value;
          sessionEntries.push(entry);
        } else {
          sessionValue = entry.value;
          sessionEntries = [entry];
        }

        if (sessionValue > clsValue) {
          clsValue = sessionValue;
        }
      }
    }
  });

  observer.observe({ type: 'layout-shift', buffered: true });

  // Report when page is hidden or unloaded
  const reportCLS = () => {
    const metric = {
      name: 'CLS',
      value: clsValue,
      rating: getRating(clsValue, THRESHOLDS.CLS),
      id: `v1-${Date.now()}-${Math.random()}`,
      delta: clsValue,
    };
    sendToAnalytics(metric);
    observer.disconnect();
  };

  ['visibilitychange', 'pagehide'].forEach((event) => {
    addEventListener(event, reportCLS, { once: true, capture: true });
  });
};

/**
 * Track First Input Delay (FID)
 */
const trackFID = () => {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const metric = {
        name: 'FID',
        value: entry.processingStart - entry.startTime,
        rating: getRating(entry.processingStart - entry.startTime, THRESHOLDS.FID),
        id: `v1-${Date.now()}-${Math.random()}`,
        delta: entry.processingStart - entry.startTime,
      };
      sendToAnalytics(metric);
      observer.disconnect();
    }
  });

  observer.observe({ type: 'first-input', buffered: true });
};

/**
 * Track Time to First Byte (TTFB)
 */
const trackTTFB = () => {
  const navigationEntry = performance.getEntriesByType('navigation')[0];
  if (navigationEntry) {
    const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
    const metric = {
      name: 'TTFB',
      value: ttfb,
      rating: getRating(ttfb, THRESHOLDS.TTFB),
      id: `v1-${Date.now()}-${Math.random()}`,
      delta: ttfb,
    };
    sendToAnalytics(metric);
  }
};

/**
 * Track custom metrics
 */
const trackCustomMetrics = () => {
  // Track initial mount time
  const mountTime = performance.now();
  const metric = {
    name: 'MOUNT_TIME',
    value: mountTime,
    rating: mountTime < 100 ? 'good' : mountTime < 300 ? 'needs-improvement' : 'poor',
    id: `v1-${Date.now()}-${Math.random()}`,
    delta: mountTime,
  };
  sendToAnalytics(metric);

  // Track resource loading
  const resources = performance.getEntriesByType('resource');
  const totalSize = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
  const resourceMetric = {
    name: 'RESOURCE_SIZE',
    value: totalSize,
    rating: totalSize < 1000000 ? 'good' : totalSize < 3000000 ? 'needs-improvement' : 'poor',
    id: `v1-${Date.now()}-${Math.random()}`,
    delta: totalSize,
  };
  sendToAnalytics(resourceMetric);
};

/**
 * Track long tasks (blocking main thread)
 */
const trackLongTasks = () => {
  if (!('PerformanceObserver' in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          const metric = {
            name: 'LONG_TASK',
            value: entry.duration,
            rating: entry.duration < 100 ? 'good' : entry.duration < 300 ? 'needs-improvement' : 'poor',
            id: `v1-${Date.now()}-${Math.random()}`,
            delta: entry.duration,
          };
          sendToAnalytics(metric);
        }
      }
    });

    observer.observe({ type: 'longtask', buffered: true });
  } catch (e) {}
};

/**
 * Initialize performance monitoring
 */
export const initPerformanceMonitoring = () => {
  if (!('performance' in window) || !('PerformanceObserver' in window)) {
    return;
  }

  trackFCP();
  trackLCP();
  trackCLS();
  trackFID();
  trackTTFB();

  trackCustomMetrics();
  trackLongTasks();

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      const metric = {
        name: 'PAGE_HIDDEN',
        value: performance.now(),
        rating: 'good',
        id: `v1-${Date.now()}-${Math.random()}`,
        delta: performance.now(),
      };
      sendToAnalytics(metric);
    }
  });
};

/**
 * Manual performance mark
 */
export const markPerformance = (name) => {
  if ('performance' in window && 'mark' in performance) {
    performance.mark(name);
  }
};

/**
 * Manual performance measure
 */
export const measurePerformance = (name, startMark, endMark) => {
  if ('performance' in window && 'measure' in performance) {
    try {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name)[0];
      if (measure) {
        const metric = {
          name: `CUSTOM_${name.toUpperCase()}`,
          value: measure.duration,
          rating: 'good',
          id: `v1-${Date.now()}-${Math.random()}`,
          delta: measure.duration,
        };
        sendToAnalytics(metric);
      }
    } catch (e) {}
  }
};

/**
 * Get current performance metrics
 */
export const getPerformanceMetrics = () => {
  if (!('performance' in window)) return null;

  const navigation = performance.getEntriesByType('navigation')[0];
  const paint = performance.getEntriesByType('paint');

  return {
    navigation: navigation ? {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      domInteractive: navigation.domInteractive,
      ttfb: navigation.responseStart - navigation.requestStart,
    } : null,
    paint: {
      fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime || null,
      fp: paint.find(p => p.name === 'first-paint')?.startTime || null,
    },
    memory: performance.memory ? {
      usedJSHeapSize: performance.memory.usedJSHeapSize,
      totalJSHeapSize: performance.memory.totalJSHeapSize,
      jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
    } : null,
  };
};

export default {
  initPerformanceMonitoring,
  markPerformance,
  measurePerformance,
  getPerformanceMetrics,
};
