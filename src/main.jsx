import "./three-fix.js";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Remove all device capability detection to ensure stars always appear
window.deviceCapabilities = {
  isMobile: false,
  prefersReducedMotion: false,
  isLowEndDevice: false,
  performanceTier: 3
};

// Add critical inline CSS
const style = document.createElement('style');
style.innerHTML = `
  body {
    margin: 0;
    padding: 0;
    background-color: #000;
    color: #fff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  .loading-placeholder {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #000;
    z-index: 9999;
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255,255,255,0.1);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

// Create loading placeholder
const loadingElement = document.createElement('div');
loadingElement.className = 'loading-placeholder';
loadingElement.innerHTML = '<div class="loading-spinner"></div>';
document.body.appendChild(loadingElement);

// Function to remove loading element
const removeLoading = () => {
  const loader = document.querySelector('.loading-placeholder');
  if (loader) {
    loader.style.opacity = '0';
    loader.style.transition = 'opacity 0.3s ease';
    setTimeout(() => loader.remove(), 300);
  }
};

// Create and render the React root
const startApp = () => {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  // Remove loading element after app renders
  setTimeout(removeLoading, 500);
};

// Load app asynchronously
if (document.readyState === 'complete') {
  startApp();
} else {
  window.addEventListener('load', startApp);
}

// Fix for iOS vh units
const setVhProperty = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

setVhProperty();
window.addEventListener('resize', setVhProperty);