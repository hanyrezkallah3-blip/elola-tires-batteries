import fs from 'fs'
import path from 'path'


const logsDirectory = path.resolve(
  'scripts/logs'
)


function ensureLogsDirectory() {

  if (!fs.existsSync(logsDirectory)) {

    fs.mkdirSync(

      logsDirectory,

      {
        recursive: true
      }

    )

  }

}


export function createMigrationSession(
  migration,
  options = {}
) {

  return {

    id:
      Date.now(),

    migration,

    preview:
      options.preview || false,

    startedAt:
      new Date().toISOString(),

    changedFiles: [],

    status:
      'running'

  }

}


export function addChangedFile(
  session,
  file
) {

  session.changedFiles.push(

    file

  )

}


export function finishMigrationSession(
  session
) {

  ensureLogsDirectory()


  session.finishedAt =
    new Date().toISOString()


  session.status =
    'completed'


  const filename =

    `migration-${session.id}.json`


  const filePath = path.join(

    logsDirectory,

    filename

  )


  fs.writeFileSync(

    filePath,

    JSON.stringify(

      session,

      null,

      2

    ),

    'utf8'

  )


  return filePath

}