// main.jsx
import React, { StrictMode, Suspense } from 'react'
import { createRoot }      from 'react-dom/client'
import App                  from './App.jsx'
import './i18n'             // ← Make sure this import is here!

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<div>Loading translations…</div>}>
      <App />
    </Suspense>
  </StrictMode>
)
