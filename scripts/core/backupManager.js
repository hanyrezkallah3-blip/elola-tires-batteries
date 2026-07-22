import fs from 'fs'
import path from 'path'


const backupsRoot = path.resolve(
  'scripts/backups'
)


function ensureBackupDirectory() {

  if (!fs.existsSync(backupsRoot)) {

    fs.mkdirSync(

      backupsRoot,

      {
        recursive: true
      }

    )

  }

}


export function createBackupSession(
  sessionId
) {

  ensureBackupDirectory()


  const backupPath = path.join(

    backupsRoot,

    String(sessionId)

  )


  if (!fs.existsSync(backupPath)) {

    fs.mkdirSync(

      backupPath,

      {
        recursive: true
      }

    )

  }


  return backupPath

}



export function backupFile(

  file,

  backupPath

) {


  const relativePath =

    path.relative(

      process.cwd(),

      file

    )


  const destination = path.join(

    backupPath,

    relativePath

  )


  const destinationFolder = path.dirname(

    destination

  )


  if (!fs.existsSync(destinationFolder)) {

    fs.mkdirSync(

      destinationFolder,

      {
        recursive: true
      }

    )

  }


  fs.copyFileSync(

    file,

    destination

  )


  return destination

}