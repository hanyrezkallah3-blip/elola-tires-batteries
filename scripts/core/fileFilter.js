import path from 'path'

import { readFile } from './fileReader.js'

export function filterFiles(files, keywords = []) {

  return files.filter(file => {

    const name = path.basename(file).toLowerCase()

    // تجاهل النسخ الاحتياطية والملفات القديمة
    if (

      name.includes('.before') ||
      name.includes('.backup') ||
      name.includes('.bak') ||
      name.includes('.old') ||
      name.includes('.copy') ||
      name.includes('.tmp')

    ) {

      return false

    }

    const content = readFile(file)

    return keywords.some(keyword =>

      content.includes(keyword)

    )

  })

}