import fs from 'fs'
import path from 'path'


const reportsDirectory = path.resolve(
  'scripts/reports'
)


function ensureReportsDirectory() {

  if (!fs.existsSync(reportsDirectory)) {

    fs.mkdirSync(
      reportsDirectory,
      {
        recursive: true
      }
    )

  }

}



export function createMigrationReport(session) {


  ensureReportsDirectory()



  const duration =

    session.finishedAt && session.startedAt

      ? new Date(session.finishedAt) -
        new Date(session.startedAt)

      : 0



  const report = {

    migration:
      session.migration,


    sessionId:
      session.id,


    mode:
      session.preview
        ? 'preview'
        : 'execute',


    status:
      session.status,


    startedAt:
      session.startedAt,


    finishedAt:
      session.finishedAt,


    durationMs:
      duration,


    changedFiles:
      session.changedFiles.length,


    files:
      session.changedFiles

  }



  const filename =
    `report-${session.id}.json`



  const reportPath = path.join(

    reportsDirectory,

    filename

  )



  fs.writeFileSync(

    reportPath,

    JSON.stringify(

      report,

      null,

      2

    ),

    'utf8'

  )



  return reportPath

}