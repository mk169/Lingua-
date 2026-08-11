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
  build: {
    /**
     * Explizit statt Vites Voreinstellung `baseline-widely-available`. Die steht
     * in Vite 8 auf Safari 16.4 und verschiebt sich mit jedem Update – ein
     * Lernprogramm, das auf einem zwei Jahre alten iPhone weiß bleibt, ist für
     * seinen Nutzer schlicht kaputt. Diese Liste hält die Untergrenze fest.
     *
     * Achtung: Das betrifft nur Syntax. Vite fügt keine Polyfills hinzu –
     * fehlende Methoden muss der Code selbst abfangen.
     */
    target: ['es2020', 'safari14', 'chrome90', 'firefox90', 'edge90'],
  },
}));
