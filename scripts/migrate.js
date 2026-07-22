#!/usr/bin/env node

import path from 'path'

import { scanDirectory } from './core/scanner.js'

import { productsMigration }
  from './migrations/products.js'

import { ordersMigration }
  from './migrations/orders.js'

import { walletsMigration }
  from './migrations/wallets.js'

import { usersMigration }
  from './migrations/users.js'

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

  case 'products':

    productsMigration(files)

    break

  case 'orders':

    ordersMigration(files)

    break

  case 'wallets':

    walletsMigration(files)

    break

  case 'users':

    usersMigration(files)

    break

  default:

    console.log('Unknown migration')

}