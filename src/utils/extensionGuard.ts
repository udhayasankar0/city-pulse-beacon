// Extension conflict detection and mitigation utilities

// Extend Window interface for extension properties
declare global {
  interface Window {
    GingerAEHelper?: any;
    grammarly?: any;
    adblock?: any;
    adBlock?: any;
  }
}

export const detectBrowserExtensions = () => {
  const extensions = {
    ginger: !!(window as any).GingerAEHelper || !!document.querySelector('[data-ginger]'),
    grammarly: !!(window as any).grammarly || !!document.querySelector('grammarly-extension'),
    adblock: !!(window as any).adblock || !!(window as any).adBlock,
  };
  
  return extensions;
};

export const initExtensionSafeMode = () => {
  // Store original functions that extensions might override
  const originalFunctions = {
    setTimeout: window.setTimeout,
    setInterval: window.setInterval,
    addEventListener: window.addEventListener,
    removeEventListener: window.removeEventListener,
  };

  // Detect if functions have been wrapped/modified
  const checkFunctionIntegrity = () => {
    const issues = [];
    
    if (window.setTimeout.toString().includes('native code') === false) {
      issues.push('setTimeout has been modified');
    }
    
    if (window.setInterval.toString().includes('native code') === false) {
      issues.push('setInterval has been modified');
    }
    
    return issues;
  };

  // Restore original functions if needed
  const restoreOriginalFunctions = () => {
    try {
      window.setTimeout = originalFunctions.setTimeout;
      window.setInterval = originalFunctions.setInterval;
      window.addEventListener = originalFunctions.addEventListener;
      window.removeEventListener = originalFunctions.removeEventListener;
    } catch (error) {
      console.warn('Could not restore original functions:', error);
    }
  };

  return {
    checkFunctionIntegrity,
    restoreOriginalFunctions,
    originalFunctions,
  };
};

// Initialize Ginger widget safely
export const initGingerSafely = () => {
  try {
    // Disable Ginger if it's causing issues
    if (window.GingerAEHelper) {
      window.GingerAEHelper.isEnabled = false;
    }
    
    // Remove Ginger elements that might interfere
    const gingerElements = document.querySelectorAll('[data-ginger], .ginger-module');
    gingerElements.forEach(el => el.remove());
    
    // Set meta tag to disable Ginger
    const meta = document.createElement('meta');
    meta.name = 'ginger';
    meta.content = 'disabled';
    document.head.appendChild(meta);
    
  } catch (error) {
    console.warn('Error initializing Ginger safely:', error);
  }
};

// Error boundary for extension-related errors
export const createExtensionErrorBoundary = () => {
  const originalError = window.onerror;
  const originalUnhandledRejection = window.onunhandledrejection;
  
  window.onerror = (message, source, lineno, colno, error) => {
    // Check if error is from extension
    if (
      (typeof source === 'string' && source.includes('extension://')) ||
      (typeof message === 'string' && message.includes('Ginger')) ||
      (typeof message === 'string' && message.includes('grammarly')) ||
      error?.stack?.includes('extension://')
    ) {
      console.warn('Extension-related error detected:', { message, source });
      return true; // Prevent error from bubbling up
    }
    
    if (originalError) {
      return originalError(message, source, lineno, colno, error);
    }
    return false;
  };
  
  window.onunhandledrejection = function(event) {
    if (
      event.reason?.stack?.includes('extension://') ||
      event.reason?.message?.includes('Ginger') ||
      event.reason?.message?.includes('grammarly')
    ) {
      console.warn('Extension-related promise rejection:', event.reason);
      event.preventDefault();
      return;
    }
    
    if (originalUnhandledRejection) {
      originalUnhandledRejection.call(this, event);
    }
  };
};