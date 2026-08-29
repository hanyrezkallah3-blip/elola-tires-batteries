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
// RENDER
// ==================================================

ReactDOM
  .createRoot(rootElement)
  .render(

    <BrowserRouter>

      <App />

    </BrowserRouter>

  )