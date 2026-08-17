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
  getAuth
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
// INITIALIZE FIREBASE SAFELY
// ==================================================
//
// إذا كان Firebase قد تم تهيئته بالفعل في مكان آخر
// نستخدم التطبيق الموجود بدلاً من إنشاء DEFAULT APP جديد.
// هذا يمنع:
// FirebaseError: app/duplicate-app
//

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
// EXPORTS
// ==================================================

export {
  app,
  db,
  storage,
  auth
}

export default app