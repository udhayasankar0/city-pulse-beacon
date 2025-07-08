import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Better source maps for debugging extension conflicts
    sourcemap: true, // Always enable sourcemaps for debugging
    // Use more readable variable names to avoid conflicts
    minify: mode === 'production' ? 'terser' : false,
    terserOptions: mode === 'production' ? {
      mangle: {
        // Preserve some common variable names to avoid conflicts
        reserved: ['r', 'React', 'ReactDOM', 'window', 'document']
      }
    } : undefined,
  },
  define: {
    // Helps with extension detection
    __DEV__: mode === 'development',
  }
}));
