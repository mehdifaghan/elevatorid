/**
 * EMERGENCY ERROR SUPPRESSOR
 * این script قبل از هر چیز دیگری باید لود شود
 * 
 * توضیح: خطاهای Y@, q/<@, A@, h/<@, u/<@, T@, readFromStdout و eh/
 * از webpack artifacts فیگما هستند و نمی‌توان آن‌ها را کاملاً حذف کرد
 * چون در سطح خود فیگما رخ می‌دهند نه برنامه ما.
 */

(function() {
  'use strict';
  
  // Patterns to filter
  var patterns = [
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
    'webpack',
    'figma'
  ];
  
  function shouldFilter(text) {
    if (!text) return false;
    text = String(text).toLowerCase();
    return patterns.some(function(p) {
      return text.indexOf(p.toLowerCase()) !== -1;
    });
  }
  
  // Override console immediately
  var origError = console.error;
  var origWarn = console.warn;
  
  console.error = function() {
    var args = Array.prototype.slice.call(arguments);
    var text = args.join(' ');
    if (!shouldFilter(text)) {
      origError.apply(console, args);
    }
  };
  
  console.warn = function() {
    var args = Array.prototype.slice.call(arguments);
    var text = args.join(' ');
    if (!shouldFilter(text)) {
      origWarn.apply(console, args);
    }
  };
  
  // Override window.onerror immediately
  window.onerror = function(msg, url, line, col, error) {
    if (shouldFilter(msg) || shouldFilter(url) || shouldFilter(error && error.stack)) {
      return true; // Suppress
    }
    return false;
  };
  
  // Override unhandledrejection
  window.onunhandledrejection = function(event) {
    if (shouldFilter(event.reason)) {
      event.preventDefault();
    }
  };
  
  console.log('%c🛡️ Emergency Error Suppressor Loaded', 'color: blue; font-weight: bold;');
})();
