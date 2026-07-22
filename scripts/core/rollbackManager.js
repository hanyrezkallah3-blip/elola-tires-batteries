import fs from 'fs'
import path from 'path'


const backupsRoot = path.resolve(
  'scripts/backups'
)


export function rollbackSession(

  sessionId

) {


  const backupPath = path.join(

    backupsRoot,

    String(sessionId)

  )


  if (!fs.existsSync(backupPath)) {

    throw new Error(

      `Backup session not found: ${sessionId}`

    )

  }



  const restoredFiles = []



  restoreDirectory(

    backupPath,

    process.cwd(),

    restoredFiles

  )



  return restoredFiles

}



function restoreDirectory(

  source,

  target,

  restoredFiles

) {


  const entries = fs.readdirSync(

    source,

    {
      withFileTypes: true
    }

  )



  for (const entry of entries) {


    const sourcePath = path.join(

      source,

      entry.name

    )


    const targetPath = path.join(

      target,

      entry.name

    )



    if (entry.isDirectory()) {


      if (!fs.existsSync(targetPath)) {

        fs.mkdirSync(

          targetPath,

          {
            recursive: true
          }

        )

      }


      restoreDirectory(

        sourcePath,

        targetPath,

        restoredFiles

      )


    } else {


      fs.copyFileSync(

        sourcePath,

        targetPath

      )


      restoredFiles.push(

        targetPath

      )


    }


  }


}