import {
  initializeApp,
  getApps,
  getApp
} from 'firebase/app'

import {
  getFirestore
} from 'firebase/firestore'

import {
  getStorage
} from 'firebase/storage'

import {
  getAuth,
  signInAnonymously
} from 'firebase/auth'


// ==================================================
// FIREBASE CONFIG
// ==================================================

const firebaseConfig = {

  apiKey:
    'AIzaSyAMg5Rn_T1tOdEljn1vTT28HRXnlDbUl80',

  authDomain:
    'elola-83f3c.firebaseapp.com',

  projectId:
    'elola-83f3c',

  storageBucket:
    'elola-83f3c.appspot.com',

  messagingSenderId:
    '666165400516',

  appId:
    '1:666165400516:web:cd95548e1fb27211200a91',

  measurementId:
    'G-XTDWVLG4RS'

}


// ==================================================
// INITIALIZE FIREBASE
// ==================================================

const app =
  getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)


// ==================================================
// FIREBASE SERVICES
// ==================================================

const db =
  getFirestore(app)

const storage =
  getStorage(app)

const auth =
  getAuth(app)


// ==================================================
// ANONYMOUS AUTHENTICATION
// ==================================================

let anonymousAuthPromise = null


export const ensureAnonymousAuth = async () => {

  if (auth.currentUser) {

    return auth.currentUser

  }


  if (!anonymousAuthPromise) {

    anonymousAuthPromise =
      signInAnonymously(auth)

        .then(
          credential =>
            credential.user
        )

        .catch(error => {

          anonymousAuthPromise =
            null

          console.error(
            'Firebase Anonymous Authentication Error:',
            error
          )

          throw error

        })

  }


  return anonymousAuthPromise

}


// ==================================================
// EXPORTS
// ==================================================

export {

  app,

  db,

  storage,

  auth

}

export default app