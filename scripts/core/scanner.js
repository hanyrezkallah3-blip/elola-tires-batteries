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
  'build'
])

export function scanDirectory(directory) {

  const files = []

  function walk(currentPath) {

    const entries = fs.readdirSync(currentPath, {
      withFileTypes: true
    })

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