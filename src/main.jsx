import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

import { initializeApp, getApps } from 'firebase/app'

// ================= FIREBASE =================

const firebaseConfig = {
  apiKey: 'AIzaSyAMg5Rn_T1tOdEljn1vTT28HRXnlDbUl80',
  authDomain: 'elola-83f3c.firebaseapp.com',
  projectId: 'elola-83f3c',
  storageBucket: 'elola-83f3c.appspot.com',
  messagingSenderId: '666165400516',
  appId: '1:666165400516:web:cd95548e1fb27211200a91',
  measurementId: 'G-XTDWVLG4RS'
}

// ================= SAFE FIREBASE INIT =================

if (getApps().length === 0) {

  try {

    initializeApp(firebaseConfig)

  } catch (error) {

    console.log('Firebase Error:', error)

  }

}

// ================= ROOT =================

const rootElement =
  document.getElementById('root')

if (!rootElement) {

  throw new Error(
    'Root element not found'
  )

}

// ================= RENDER =================

ReactDOM
  .createRoot(rootElement)
  .render(

    <BrowserRouter>

      <App />

    </BrowserRouter>

  )