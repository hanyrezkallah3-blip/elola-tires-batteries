import React from 'react'

import ReactDOM from 'react-dom/client'

import {

  BrowserRouter

} from 'react-router-dom'

import App from './App.jsx'

import './index.css'

// ================= FIREBASE =================

import {

  initializeApp

} from 'firebase/app'

// ================= FIREBASE CONFIG =================

const firebaseConfig = {

  apiKey:
    'AIzaSyAMg5Rn_T1tOdEljn1vTT28HRXnlDbUl80',

  authDomain:
    'elola-83f3c.firebaseapp.com',

  projectId:
    'elola-83f3c',

  storageBucket:
    'elola-83f3c.firebasestorage.app',

  messagingSenderId:
    '666165400516',

  appId:
    '1:666165400516:web:cd95548e1fb27211200a91',

  measurementId:
    'G-XTDWVLG4RS'

}

// ================= INITIALIZE FIREBASE =================

initializeApp(firebaseConfig)

// ================= ROOT =================

const rootElement =
  document.getElementById('root')

// ================= SAFETY CHECK =================

if (!rootElement) {

  throw new Error(

    'Root element not found'

  )

}

// ================= RENDER APP =================

ReactDOM.createRoot(rootElement).render(

  <React.StrictMode>

    <BrowserRouter>

      <App />

    </BrowserRouter>

  </React.StrictMode>

)