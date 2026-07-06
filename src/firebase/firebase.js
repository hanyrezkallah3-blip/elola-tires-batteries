import { initializeApp } from 'firebase/app'

import { getFirestore } from 'firebase/firestore'

import { getStorage } from 'firebase/storage'

import { getAuth } from 'firebase/auth'

const firebaseConfig = {

  apiKey: "AIzaSyAMg5Rn_T1tOdEljn1vTT28HRXnlDbUl80",

  authDomain: "elola-83f3c.firebaseapp.com",

  projectId: "elola-83f3c",

  storageBucket: "elola-83f3c.firebasestorage.app",

  messagingSenderId: "666165400516",

  appId: "1:666165400516:web:cd95548e1fb27211200a91",

  measurementId: "G-XTDWVLG4RS"

}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)

export const storage = getStorage(app)

export const auth = getAuth(app)

export default app