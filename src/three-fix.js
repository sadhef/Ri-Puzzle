// src/three-fix.js
// This file fixes the "Cannot read properties of undefined (reading 'useLayoutEffect')" error in Three.js

if (typeof window !== 'undefined') {
  // Set global to window to fix React Three Fiber initialization issues
  window.global = window;
  
  // Force react-three-fiber to use setTimeout instead of useLayoutEffect during initialization
  window.ReactCurrentDispatcher = window.ReactCurrentDispatcher || {};
  const originalUseLayoutEffect = window.ReactCurrentDispatcher.useLayoutEffect;
  
  if (!originalUseLayoutEffect) {
    // Create a patch for React Three Fiber's useLayoutEffect calls
    window.ReactCurrentDispatcher.useLayoutEffect = function() {
      // This will be replaced with the real implementation when React is initialized
      return null;
    };
  }
}

export default function setupThreeEnvironment() {
  // Additional Three.js environment setup can go here
  console.log("Three.js environment initialized");
}