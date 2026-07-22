#!/usr/bin/env node

import path from 'path'

import { scanDirectory } from './core/scanner.js'

import {
  rollbackSession
} from './core/rollbackManager.js'

import {
  storeMigration
} from './migrations/storeMigration.js'

import {
  authMigration
} from './migrations/authMigration.js'



async function main() {


  const command = process.argv[2]

  const argument = process.argv[3]

  const preview =
    process.argv.includes('--preview')



  console.log('====================================')

  console.log(' Elola Migration Engine')

  console.log('====================================')

  console.log('')



  if (!command) {


    console.log('Usage:')

    console.log(
      'node scripts/migrate.js <migration>'
    )

    console.log('')

    console.log('Commands:')

    console.log('stores')

    console.log('auth')

    console.log(
      'rollback <session-id>'
    )

    process.exit(0)

  }




  // ================= ROLLBACK =================


  if (command === 'rollback') {


    if (!argument) {


      console.log(
        'Missing session id'
      )


      process.exit(1)

    }



    try {


      const restoredFiles =

        rollbackSession(argument)



      console.log(
        'Rollback completed'
      )


      console.log(
        `Restored: ${restoredFiles.length}`
      )



      restoredFiles.forEach(file => {


        console.log(file)


      })


    } catch (error) {


      console.log(
        'Rollback failed'
      )


      console.log(
        error.message
      )


      process.exit(1)


    }


    return


  }





  // ================= MIGRATION =================



  const srcPath =

    path.resolve('src')



  const files =

    scanDirectory(srcPath)



  console.log(

    `Migration : ${command}`

  )


  console.log(

    `Files Found: ${files.length}`

  )



  if (preview) {


    console.log(

      'Mode      : PREVIEW'

    )


  }




  switch (command) {



    case 'stores':


    case 'products':


    case 'orders':


    case 'users':


    case 'wallets':



      await storeMigration(


        files,


        {

          preview

        }


      )


      break




    case 'auth':



      await authMigration(


        files,


        {

          preview

        }


      )


      break





    default:



      console.log(

        'Unknown command'

      )


  }


}




await main()