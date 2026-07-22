import fs from 'fs'

import {
  createMigrationSession,
  addChangedFile,
  finishMigrationSession
} from '../core/migrationLogger.js'

import {
  createASTSession,
  finishASTSession
} from '../core/astSession.js'

import {
  createBackupSession,
  backupFile
} from '../core/backupManager.js'

import {
  transformAuthMigration
} from '../transforms/auth/transformAuthMigration.js'

import {
  generateDiff,
  saveDiffPreview
} from '../core/diffGenerator.js'


export async function authMigration(

  files,

  options = {}

) {


  const {

    preview = false

  } = options



  const session = createMigrationSession(

    'auth',

    {
      preview
    }

  )



  let backupPath = null


  let changed = 0


  const diffReports = []

  const changedFiles = []



  console.log('')

  console.log('====================================')

  console.log(

    preview

      ? ' Auth Migration Preview'

      : ' Auth Migration'

  )

  console.log('====================================')

  console.log('')



  for (const file of files) {


    if (

      !file.endsWith('.js') &&

      !file.endsWith('.jsx')

    ) {

      continue

    }


    let astSession


    try {


      astSession =

        createASTSession(file)


    } catch (error) {


      console.log(

        'SKIPPED INVALID FILE:',

        file

      )


      continue

    }



    transformAuthMigration(

      astSession

    )



    const result =

      finishASTSession(

        astSession

      )



    if (

      result.changed

    ) {


      changed++


      changedFiles.push(file)


      addChangedFile(

        session,

        file

      )



      const originalCode =

        astSession.source



      const diff =

        generateDiff(

          originalCode,

          result.code

        )



      diffReports.push(

        saveDiffPreview(

          file,

          diff

        )

      )



      if (!preview) {


        if (!backupPath) {


          backupPath =

            createBackupSession(

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


      }

      else {


        console.log(

          'WOULD UPDATE:',

          file

        )


      }


    }


  }



  if (

    preview &&

    diffReports.length

  ) {


    console.log('')

    console.log(

      '===================================='

    )

    console.log(

      ' DIFF PREVIEW'

    )

    console.log(

      '===================================='

    )



    diffReports.forEach(report => {


      console.log('')

      console.log(report.file)

      console.log(

        `Changes: ${report.changes}`

      )


      report.diff

        .slice(0,5)

        .forEach(change => {


          console.log(

            `Line ${change.line}`

          )


          console.log(

            '-',

            change.before

          )


          console.log(

            '+',

            change.after

          )


        })


    })


  }



  const logFile =

    finishMigrationSession(

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


}