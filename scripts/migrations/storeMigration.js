import fs from 'fs'

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

import {
  createMigrationReport
} from '../core/migrationReport.js'

import {
  validateFiles
} from '../core/migrationValidator.js'

import {
  recoverMigration
} from '../core/migrationRecovery.js'

import {
  generateDiff,
  saveDiffPreview
} from '../core/diffGenerator.js'

import {
  detectStores
} from '../core/storeDetector.js'

import {
  runWorkerPool
} from '../core/workerPool.js'

export async function storeMigration(

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



  const targets = files.filter(file => {

    try {

      return detectStores(file).length > 0

    } catch {

      return false

    }

  })



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

  const changedFiles = []

  const diffReports = []



  await runWorkerPool(

    targets,

    async file => {

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

        changedFiles.push(file)

        addChangedFile(

          session,

          file

        )



        const originalCode =

          fs.readFileSync(

            file,

            'utf8'

          )



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

        } else {

          console.log(

            'WOULD UPDATE:',

            file

          )

        }

      }

    }

  )



  let validationResults = []



  if (

    !preview &&

    changedFiles.length

  ) {

    validationResults = validateFiles(

      changedFiles

    )



    const failedValidation =

      validationResults.filter(

        item => !item.valid

      )



    if (

      failedValidation.length

    ) {

      console.log('')
      console.log('====================================')
      console.log(' VALIDATION FAILED - RECOVERY START')
      console.log('====================================')



      failedValidation.forEach(item => {

        console.log(item.file)

        console.log(item.error)

      })



      console.log('')



      const recovery = recoverMigration(

        session.id,

        validationResults

      )



      if (

        recovery.recovered

      ) {

        console.log(

          'Recovery completed'

        )



        console.log(

          `Restored: ${recovery.restoredFiles.length}`

        )

      }



      console.log('')



      throw new Error(

        'Migration aborted after validation failure'

      )

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

      console.log(

        report.file

      )



      console.log(

        `Changes: ${report.changes}`

      )



      report.diff

        .slice(0, 5)

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



  const reportFile =

    createMigrationReport(

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



  console.log(

    'Report:',

    reportFile

  )



  if (backupPath) {

    console.log(

      'Backup:',

      backupPath

    )

  }



  console.log('')

}