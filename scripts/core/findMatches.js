import { readFile } from './fileReader.js'

export function findMatches(file, keywords) {

  const content = readFile(file)

  const matches = []

  for (const keyword of keywords) {

    if (content.includes(keyword)) {

      matches.push(keyword)

    }

  }

  return matches

}