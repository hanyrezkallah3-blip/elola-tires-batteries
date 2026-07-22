import fs from 'fs'

export function readFile(filePath) {

  return fs.readFileSync(
    filePath,
    'utf8'
  )

}