#!/usr/bin/env node

import path from 'path'

import { scanDirectory } from './core/scanner.js'

import { storeMigration }
  from './migrations/storeMigration.js'

const migration = process.argv[2]

console.log('====================================')
console.log(' Elola Migration Engine')
console.log('====================================')
console.log('')

if (!migration) {

  console.log('Usage:')
  console.log('node scripts/migrate.js <migration>')

  process.exit(0)

}

const srcPath = path.resolve('src')

const files = scanDirectory(srcPath)

console.log(`Migration : ${migration}`)
console.log(`Files Found: ${files.length}`)

switch (migration) {

  case 'stores':

  case 'products':

  case 'orders':

  case 'users':

  case 'wallets':

    storeMigration(files)

    break

  default:

    console.log('Unknown migration')

}