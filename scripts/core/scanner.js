import fs from 'fs'
import path from 'path'


const VALID_EXTENSIONS = new Set([

  '.js',

  '.jsx',

  '.ts',

  '.tsx'

])


const IGNORED_FOLDERS = new Set([

  'node_modules',

  '.git',

  'dist',

  'build',

  '.next',

  'coverage'

])


const IGNORED_FILES = new Set([

  'vite.config.js',

  'vite.config.ts',

  'tailwind.config.js',

  'tailwind.config.cjs',

  'postcss.config.js',

  'postcss.config.cjs',

  'eslint.config.js',

  'babel.config.js'

])


function shouldIgnoreFile(fileName) {


  if (IGNORED_FILES.has(fileName)) {

    return true

  }


  if (

    fileName.endsWith('.config.js') ||

    fileName.endsWith('.config.ts') ||

    fileName.endsWith('.config.cjs')

  ) {

    return true

  }


  if (

    fileName.includes('.test.') ||

    fileName.includes('.spec.')

  ) {

    return true

  }


  return false

}



export function scanDirectory(directory) {


  const files = []


  function walk(currentPath) {


    const entries = fs.readdirSync(

      currentPath,

      {
        withFileTypes: true
      }

    )


    for (const entry of entries) {


      if (

        entry.isDirectory() &&

        IGNORED_FOLDERS.has(entry.name)

      ) {

        continue

      }



      const fullPath = path.join(

        currentPath,

        entry.name

      )



      if (entry.isDirectory()) {


        walk(fullPath)


        continue

      }



      if (

        shouldIgnoreFile(entry.name)

      ) {

        continue

      }



      if (

        VALID_EXTENSIONS.has(

          path.extname(entry.name)

        )

      ) {


        files.push(fullPath)


      }


    }


  }


  walk(directory)


  return files

}