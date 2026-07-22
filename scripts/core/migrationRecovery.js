import {
  rollbackSession
} from './rollbackManager.js'



export function recoverMigration(

  sessionId,

  validationResults

) {


  const failedFiles =

    validationResults.filter(

      item => !item.valid

    )



  if (!failedFiles.length) {


    return {

      recovered: false,

      reason: 'No validation errors'

    }


  }



  const restoredFiles = rollbackSession(

    sessionId

  )



  return {


    recovered: true,


    restoredFiles,


    failedFiles

  }


}