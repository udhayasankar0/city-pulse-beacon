import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createExtensionErrorBoundary, initGingerSafely, detectBrowserExtensions } from './utils/extensionGuard'

// Initialize extension protection before React renders
createExtensionErrorBoundary();
initGingerSafely();

// Log detected extensions for debugging
const extensions = detectBrowserExtensions();
if (Object.values(extensions).some(Boolean)) {
  console.log('Detected browser extensions:', extensions);
}

createRoot(document.getElementById("root")!).render(<App />);
