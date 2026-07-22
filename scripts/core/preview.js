import { readFile } from './fileReader.js'

export function previewReplacement(
  file,
  search,
  replace
) {

  const content = readFile(file)

  if (!content.includes(search)) {

    return false

  }

  console.log('')
  console.log('====================================')
  console.log(file)
  console.log('------------------------------------')

  console.log('OLD:')
  console.log(search)

  console.log('')

  console.log('NEW:')
  console.log(replace)

  console.log('====================================')

  return true

}