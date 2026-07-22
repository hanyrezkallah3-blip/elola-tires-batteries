import fs from 'fs'

import {
  parseFile
} from './ast.js'



export function validateMigrationFile(

  file

) {


  try {


    if (!fs.existsSync(file)) {

      return {

        valid: false,

        error: 'File not found'

      }

    }



    parseFile(file)



    return {

      valid: true,

      file

    }



  } catch (error) {


    return {

      valid: false,

      file,

      error:

        error.message

    }


  }


}



export function validateFiles(

  files

) {


  const results = []


  for (const file of files) {


    results.push(

      validateMigrationFile(

        file

      )

    )


  }



  return results

}