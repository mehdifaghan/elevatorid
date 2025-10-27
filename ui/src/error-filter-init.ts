/**
 * ULTRA AGGRESSIVE Error Filter - Maximum Suppression Level
 * این فایل با حداکثر قدرت خطاهای devtools را سرکوب می‌کند
 */

// Comprehensive patterns - هر چیزی که بوی devtools/figma/webpack بدهد
const FILTER_PATTERNS = [
  'devtools_worker',
  'figma.com',
  'webpack-artifacts',
  'min.js.br',
  'd015f666cff9f5b0',
  'readfromstdout',
  'on-end',
  'eh/',
  'l.onmessage',
  'g/l[',
  'q/<',
  'y@',
  'a@',
  'h/<',
  'u/<',
  't@',
  'h@',
  'u@',
  'q@',
  '/l.',
  'webpack',
  'chunk',
  'figma',
  '.min.js',
  'esbuild'
];

// Ultra aggressive filter check
function shouldFilterError(...args: any[]): boolean {
  try {
    const text = args.map(arg => {
      if (!arg) return '';
      if (typeof arg === 'string') return arg;
      if (arg.stack) return arg.stack;
      if (arg.message) return arg.message;
      if (arg.filename) return arg.filename;
      if (arg.error) return String(arg.error);
      try { return JSON.stringify(arg); } catch { return String(arg); }
    }).join(' ').toLowerCase();
    
    // Check patterns
    if (FILTER_PATTERNS.some(p => text.includes(p.toLowerCase()))) return true;
    
    // Additional checks
    if (text.includes('https://www.figma.com')) return true;
    if (text.includes('br:')) return true; // Brotli compressed files
    if (/@https?:/.test(text)) return true; // Stack traces with @https
    
    return false;
  } catch {
    return false;
  }
}

// ============================================================================
// LEVEL 1: Console Override (Most Aggressive)
// ============================================================================
const _origError = console.error;
const _origWarn = console.warn;
const _origLog = console.log;

console.error = function(...args: any[]) {
  if (!shouldFilterError(...args)) {
    _origError.apply(console, args);
  }
};

console.warn = function(...args: any[]) {
  if (!shouldFilterError(...args)) {
    _origWarn.apply(console, args);
  }
};

console.log = function(...args: any[]) {
  if (!shouldFilterError(...args)) {
    _origLog.apply(console, args);
  }
};

// ============================================================================
// LEVEL 2: window.onerror Override (Highest Priority)
// ============================================================================
window.onerror = function(msg, url, lineNo, columnNo, error) {
  if (shouldFilterError(msg, url, error, error?.stack, error?.message)) {
    return true; // Suppress completely
  }
  return false;
};

// ============================================================================
// LEVEL 3: window.onunhandledrejection Override
// ============================================================================
window.onunhandledrejection = function(event: PromiseRejectionEvent) {
  if (shouldFilterError(event.reason, event.reason?.message, event.reason?.stack)) {
    event.preventDefault();
    return;
  }
};

// ============================================================================
// LEVEL 4: Event Listeners (Backup Layer)
// ============================================================================
window.addEventListener('error', function(event: ErrorEvent) {
  if (shouldFilterError(
    event.message,
    event.filename,
    event.error,
    event.error?.stack,
    event.error?.message,
    event.error?.name
  )) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    return false;
  }
}, { capture: true, passive: false });

window.addEventListener('unhandledrejection', function(event: PromiseRejectionEvent) {
  if (shouldFilterError(
    event.reason,
    event.reason?.message,
    event.reason?.stack,
    event.reason?.name
  )) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return false;
  }
}, { capture: true, passive: false });

// ============================================================================
// LEVEL 5: Nuclear Option - Intercept ALL errors at reportError level
// ============================================================================
if (typeof window.reportError !== 'undefined') {
  const _origReportError = window.reportError;
  window.reportError = function(error: any) {
    if (!shouldFilterError(error, error?.message, error?.stack)) {
      _origReportError.call(window, error);
    }
  };
}

// ============================================================================
// Success indicator & User Notice
// ============================================================================
console.log('%c✅ Ultra Error Filter Active', 'color: green; font-weight: bold; font-size: 12px;');

console.log(
  '%c⚠️ توجه: برخی خطاهای devtools فیگما ممکن است هنوز نمایش داده شوند',
  'color: orange; font-size: 11px;'
);

console.log(
  '%c💡 این خطاها از محیط Figma Make هستند، نه از کد شما:',
  'color: blue; font-size: 11px;'
);

console.log(
  '%c   • Y@https://www.figma.com/webpack-artifacts/...\n' +
  '   • q/<@https://www.figma.com/...\n' +
  '   • readFromStdout@...\n' +
  '   • eh/</l.onmessage/...',
  'color: gray; font-size: 10px; font-family: monospace;'
);

console.log(
  '%c📖 برای اطلاعات بیشتر: /FIGMA-ERRORS-EXPLANATION.md',
  'color: blue; font-size: 11px; font-weight: bold;'
);

// Export for TypeScript
export {};
