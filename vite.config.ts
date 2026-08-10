import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Für GitHub Pages liegt die App unter /<repo-name>/, hier also /Lingua-/.
 * Build und `vite preview` nutzen diese Basis, der Dev-Server bleibt auf /,
 * damit localhost:5173 direkt funktioniert.
 * Überschreibbar per BASE_PATH (z.B. "/" für Vercel, Netlify oder eigene Domain).
 */
export default defineConfig(({ command, isPreview }) => ({
  base: process.env.BASE_PATH ?? (command === 'build' || isPreview ? '/Lingua-/' : '/'),
  plugins: [react()],
}));
