import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './i18n'                     // ← ensure i18n is loaded before App

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)