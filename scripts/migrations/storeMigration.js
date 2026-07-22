import fs from 'fs'

import { filterFiles } from '../core/fileFilter.js'

import {
  createMigrationSession,
  addChangedFile,
  finishMigrationSession
} from '../core/migrationLogger.js'

import {
  createBackupSession,
  backupFile
} from '../core/backupManager.js'

import {
  transformAllStores
} from '../transforms/shared/transformAllStores.js'


export function storeMigration(

  files,

  options = {}

) {


  const {

    preview = false

  } = options



  const session = createMigrationSession(

    'stores',

    {
      preview
    }

  )



  let backupPath = null



  const keywords = [

    'useWebsiteStore',

    'products',

    'orders',

    'wallet',

    'wallets',

    'walletTransactions',

    'walletEnabled',

    'cashbackPercentage',

    'users',

    'currentUser',

    'login',

    'logout',

    'register',

    'permissions',

    'setCurrentUser',

    'logoutUser',

    'setUsers',

    'addUser',

    'updateUser',

    'deleteUser',

    'enableUser',

    'disableUser',

    'getUserById',

    'getUserByUsername',

    'searchUsers',

    'getStatistics'

  ]



  const targets = filterFiles(

    files,

    keywords

  )



  console.log('')

  console.log('====================================')

  console.log(

    preview

      ? ' Store Migration Preview'

      : ' Store Migration'

  )

  console.log('====================================')

  console.log('')



  let changed = 0



  for (const file of targets) {


    console.log(

      'CHECKING:',

      file

    )



    const result = transformAllStores(file)



    if (

      result &&

      result.changed

    ) {



      changed++



      addChangedFile(

        session,

        file

      )



      if (!preview) {


        if (!backupPath) {

          backupPath = createBackupSession(

            session.id

          )

        }



        backupFile(

          file,

          backupPath

        )



        fs.writeFileSync(

          file,

          result.code,

          'utf8'

        )


        console.log(

          'UPDATED:',

          file

        )



      } else {


        console.log(

          'WOULD UPDATE:',

          file

        )


      }



    }


  }



  const logFile = finishMigrationSession(

    session

  )



  console.log('')

  console.log(

    preview

      ? `Would Change: ${changed}`

      : `Changed: ${changed}`

  )


  console.log(

    'Log:',

    logFile

  )



  if (backupPath) {


    console.log(

      'Backup:',

      backupPath

    )


  }



  console.log('')


}