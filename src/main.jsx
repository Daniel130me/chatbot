import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register the service worker only in production builds. This avoids the dev server being intercepted
// by a dev-mode service worker which can mistakenly serve the offline page during development.
if (import.meta.env.PROD) {
  try {
    // eslint-disable-next-line import/no-unresolved
    const { registerSW } = await import('virtual:pwa-register');
    registerSW({
      onNeedRefresh() {
        console.log('New content is available — please refresh.');
      },
      onOfflineReady() {
        console.log('App is ready to work offline.');
      }
    });
  } catch (e) {
    // ignore in non-Vite or missing plugin environments
  }
}
