import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App.jsx'

import './index.css'


// ==================================================
// ROOT
// ==================================================

const rootElement =
  document.getElementById('root')


if (!rootElement) {

  throw new Error(
    'Root element not found'
  )

}


// ==================================================
// VEHDB ENV TEST
// ==================================================
//
// IMPORTANT
// --------------------------------------------------
// This test intentionally does NOT print the API key.
// It only verifies whether Vite exposes the variable
// to browser-side application code.
// ==================================================

const vehDBApiKey =
  String(
    import.meta.env.VITE_VEHDB_API_KEY ?? ''
  ).trim()


console.log(
  '[ENV TEST] VITE_VEHDB_API_KEY:',
  vehDBApiKey
    ? 'AVAILABLE'
    : 'MISSING'
)


console.log(
  '[ENV TEST] LENGTH:',
  vehDBApiKey.length
)


// ==================================================
// RENDER
// ==================================================

ReactDOM
  .createRoot(rootElement)
  .render(

    <BrowserRouter>

      <App />

    </BrowserRouter>

  )