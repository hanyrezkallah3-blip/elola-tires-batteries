import { useState } from 'react'
import {
  useSystemStore
} from '../systemStore'

export default function BackupRestore() {

  
const backups =
  useSystemStore(
    (s) => s.backups
  )

const createBackup =
  useSystemStore(
    (s) => s.createBackup
  )

const lastBackup =
  backups.length
    ? backups[0].createdAt
    : null

const handleCreateBackup = () => {

  createBackup({

    name:
      `Backup ${new Date().toLocaleString()}`

  })

}

  return (

    <div className="space-y-5">

      <h2 className="text-3xl font-black text-green-400">

        Backup & Restore

      </h2>

      <div className="
        bg-slate-900
        border
        border-slate-700
        rounded-3xl
        p-6
      ">

        <div className="text-gray-400 mb-5">

          آخر نسخة احتياطية:

        </div>

        <div className="text-xl font-black mb-8">

          {

            lastBackup
  ? new Date(lastBackup).toLocaleString()
  : 'لا توجد نسخة احتياطية'

          }

        </div>

        <div className="flex flex-wrap gap-4">

          <button

            type="button"

            onClick={handleCreateBackup}

            className="
              bg-green-600
              hover:bg-green-700
              rounded-2xl
              px-8
              py-4
              font-black
            "

          >

            إنشاء Backup

          </button>

          <button

            type="button"

            onClick={restoreBackup}

            className="
              bg-blue-600
              hover:bg-blue-700
              rounded-2xl
              px-8
              py-4
              font-black
            "

          >

            Restore

          </button>

        </div>

      </div>

    </div>

  )

}