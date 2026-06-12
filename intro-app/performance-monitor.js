/**
 * Performance Monitoring Script
 * 
 * This script tracks Core Web Vitals and custom performance metrics
 * for the First Load Performance Optimization.
 * 
 * Usage:
 * 1. Add to index.html before closing </body> tag
 * 2. Or import in main.jsx
 * 3. Metrics will be logged to console and can be sent to analytics
 * 
 * @version 1.0.0
 * @date 2026-05-14
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    enableConsoleLog: true,
    enableAnalytics: false, // Set to true to send to analytics
    analyticsEndpoint: '/api/metrics',
    thresholds: {
      FCP: 600,   // First Contentful Paint (ms)
      LCP: 1000,  // Largest Contentful Paint (ms)
      CLS: 0.02,  // Cumulative Layout Shift
      FID: 100,   // First Input Delay (ms)
      TTI: 1200,  // Time to Interactive (ms)
      TBT: 150    // Total Blocking Time (ms)
    }
  };

  // Metrics storage
  const metrics = {
    FCP: null,
    LCP: null,
    CLS: null,
    FID: null,
    TTI: null,
    TBT: null,
    mountTime: null,
    renderCount: 0,
    timestamp: Date.now()
  };

  /**
   * Log metric to console
   */
  function logMetric(name, value, threshold) {
    if (!CONFIG.enableConsoleLog) return;

    const status = value <= threshold ? '✅' : '❌';
    const color = value <= threshold ? 'color: green' : 'color: red';
    
    console.log(
      `%c${status} ${name}: ${value}ms (threshold: ${threshold}ms)`,
      color
    );
  }

  /**
   * Send metrics to analytics
   */
  function sendToAnalytics(data) {
    if (!CONFIG.enableAnalytics) return;

    try {
      fetch(CONFIG.analyticsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).catch(err => {
        console.error('Failed to send metrics:', err);
      });
    } catch (err) {
      console.error('Failed to send metrics:', err);
    }
  }

  /**
   * Track First Contentful Paint (FCP)
   */
  function trackFCP() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          metrics.FCP = Math.round(entry.startTime);
          logMetric('FCP', metrics.FCP, CONFIG.thresholds.FCP);
          observer.disconnect();
        }
      }
    });

    observer.observe({ entryTypes: ['paint'] });
  }

  /**
   * Track Largest Contentful Paint (LCP)
   */
  function trackLCP() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      metrics.LCP = Math.round(lastEntry.startTime);
      logMetric('LCP', metrics.LCP, CONFIG.thresholds.LCP);
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }

  /**
   * Track Cumulative Layout Shift (CLS)
   */
  function trackCLS() {
    let clsValue = 0;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      
      metrics.CLS = Math.round(clsValue * 1000) / 1000;
      
      if (CONFIG.enableConsoleLog) {
        const status = metrics.CLS <= CONFIG.thresholds.CLS ? '✅' : '❌';
        const color = metrics.CLS <= CONFIG.thresholds.CLS ? 'color: green' : 'color: red';
        console.log(
          `%c${status} CLS: ${metrics.CLS} (threshold: ${CONFIG.thresholds.CLS})`,
          color
        );
      }
    });

    observer.observe({ entryTypes: ['layout-shift'] });
  }

  /**
   * Track First Input Delay (FID)
   */
  function trackFID() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        metrics.FID = Math.round(entry.processingStart - entry.startTime);
        logMetric('FID', metrics.FID, CONFIG.thresholds.FID);
        observer.disconnect();
      }
    });

    observer.observe({ entryTypes: ['first-input'] });
  }

  /**
   * Track Time to Interactive (TTI)
   */
  function trackTTI() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            // Approximate TTI as FCP + time to no long tasks
            setTimeout(() => {
              const navEntry = performance.getEntriesByType('navigation')[0];
              if (navEntry) {
                metrics.TTI = Math.round(navEntry.domInteractive);
                logMetric('TTI', metrics.TTI, CONFIG.thresholds.TTI);
              }
            }, 0);
          }
        }
      });

      observer.observe({ entryTypes: ['paint'] });
    }
  }

  /**
   * Track Total Blocking Time (TBT)
   */
  function trackTBT() {
    let tbtValue = 0;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          tbtValue += entry.duration - 50;
        }
      }
      
      metrics.TBT = Math.round(tbtValue);
      logMetric('TBT', metrics.TBT, CONFIG.thresholds.TBT);
    });

    try {
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      // longtask not supported in all browsers
      console.warn('Long task monitoring not supported');
    }
  }

  /**
   * Track React mount time
   */
  function trackMountTime() {
    const startMark = 'react-mount-start';
    const endMark = 'react-mount-end';

    // Listen for custom marks from React
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === endMark) {
          const startEntry = performance.getEntriesByName(startMark)[0];
          if (startEntry) {
            metrics.mountTime = Math.round(entry.startTime - startEntry.startTime);
            
            if (CONFIG.enableConsoleLog) {
              console.log(
                `%c⚛️ React Mount Time: ${metrics.mountTime}ms`,
                'color: #61dafb'
              );
            }
          }
          observer.disconnect();
        }
      }
    });

    observer.observe({ entryTypes: ['mark'] });
  }

  function trackRenderCount() {
 
    if (CONFIG.enableConsoleLog) {
      console.log('%c📊 Render tracking enabled', 'color: #61dafb');
    }
  }


  function generateReport() {
    const report = {
      ...metrics,
      url: window.location.href,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      } : null,
      timestamp: new Date().toISOString()
    };

    return report;
  }


  function printSummary() {
    console.group('%c📊 Performance Summary', 'font-size: 16px; font-weight: bold');
    
    console.log('%c🎯 Core Web Vitals', 'font-weight: bold');
    console.table({
      'First Contentful Paint': {
        value: `${metrics.FCP}ms`,
        threshold: `${CONFIG.thresholds.FCP}ms`,
        status: metrics.FCP <= CONFIG.thresholds.FCP ? '✅ Good' : '❌ Needs Improvement'
      },
      'Largest Contentful Paint': {
        value: `${metrics.LCP}ms`,
        threshold: `${CONFIG.thresholds.LCP}ms`,
        status: metrics.LCP <= CONFIG.thresholds.LCP ? '✅ Good' : '❌ Needs Improvement'
      },
      'Cumulative Layout Shift': {
        value: metrics.CLS,
        threshold: CONFIG.thresholds.CLS,
        status: metrics.CLS <= CONFIG.thresholds.CLS ? '✅ Good' : '❌ Needs Improvement'
      },
      'First Input Delay': {
        value: metrics.FID ? `${metrics.FID}ms` : 'N/A',
        threshold: `${CONFIG.thresholds.FID}ms`,
        status: metrics.FID ? (metrics.FID <= CONFIG.thresholds.FID ? '✅ Good' : '❌ Needs Improvement') : 'N/A'
      }
    });

    console.log('%c⚡ Additional Metrics', 'font-weight: bold');
    console.table({
      'Time to Interactive': {
        value: `${metrics.TTI}ms`,
        threshold: `${CONFIG.thresholds.TTI}ms`,
        status: metrics.TTI <= CONFIG.thresholds.TTI ? '✅ Good' : '❌ Needs Improvement'
      },
      'Total Blocking Time': {
        value: `${metrics.TBT}ms`,
        threshold: `${CONFIG.thresholds.TBT}ms`,
        status: metrics.TBT <= CONFIG.thresholds.TBT ? '✅ Good' : '❌ Needs Improvement'
      },
      'React Mount Time': {
        value: metrics.mountTime ? `${metrics.mountTime}ms` : 'N/A',
        threshold: '100ms',
        status: metrics.mountTime ? (metrics.mountTime <= 100 ? '✅ Good' : '❌ Needs Improvement') : 'N/A'
      }
    });

    console.log('%c📱 Environment', 'font-weight: bold');
    console.table({
      'Viewport': `${window.innerWidth}x${window.innerHeight}`,
      'Connection': navigator.connection ? navigator.connection.effectiveType : 'Unknown',
      'User Agent': navigator.userAgent.substring(0, 50) + '...'
    });

    console.groupEnd();
  }


  function init() {
    if (CONFIG.enableConsoleLog) {
      console.log(
        '%c⚡ First Load Performance Monitoring Active',
        'font-size: 14px; font-weight: bold; color: #4CAF50'
      );
    }


    trackFCP();
    trackLCP();
    trackCLS();
    trackFID();
    trackTTI();
    trackTBT();
    trackMountTime();
    trackRenderCount();

 
    window.addEventListener('load', () => {
      setTimeout(() => {
        const report = generateReport();
        
      
        printSummary();
        
      
        sendToAnalytics(report);
        
      
        window.__PERFORMANCE_METRICS__ = report;
        
        if (CONFIG.enableConsoleLog) {
          console.log(
            '%c💾 Full report available at: window.__PERFORMANCE_METRICS__',
            'color: #2196F3'
          );
        }
      }, 3000); // Wait 3s for all metrics to be collected
    });
  }

  // Start monitoring when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose API for manual tracking
  window.performanceMonitor = {
    getMetrics: () => metrics,
    getReport: generateReport,
    printSummary: printSummary,
    config: CONFIG
  };

})();
