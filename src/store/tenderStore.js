import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'

import { storage } from '../lib/firebase'

const STORAGE_KEY = 'elola_tenders'

// ==================================================
// HELPERS
// ==================================================

const generateId = () => {

  if (
    typeof crypto !== 'undefined' &&
    crypto.randomUUID
  ) {
    return crypto.randomUUID()
  }

  return (
    Date.now().toString() +
    Math.random().toString(36).slice(2)
  )
}

const now = () =>
  new Date().toISOString()


// ==================================================
// NORMALIZE DOCUMENT
// ==================================================

const normalizeDocument = (document = {}) => {

  return {

    id:
      document.id ||
      generateId(),

    name:
      document.name ||
      document.fileName ||
      '',

    size:
      Number(
        document.size ||
        0
      ),

    type:
      document.type ||
      'application/octet-stream',

    downloadURL:
      document.downloadURL ||
      document.dataUrl ||
      '',

    dataUrl:
      document.dataUrl ||
      document.downloadURL ||
      '',

    storagePath:
      document.storagePath ||
      '',

    uploadedAt:
      document.uploadedAt ||
      now()

  }

}


// ==================================================
// NORMALIZE TENDER
// ==================================================

const normalizeTender = (tender = {}) => {

  const oldFiles =
    Array.isArray(tender.files)
      ? tender.files
      : []

  const documents =
    Array.isArray(tender.documents)
      ? tender.documents
      : []

  /*
   * نحافظ على المستندات الموجودة سواء كانت
   * مخزنة باسم files أو documents.
   */

  const normalizedDocuments = [
    ...documents,
    ...oldFiles
      .filter(oldFile => {

        return !documents.some(
          document =>
            document.id &&
            oldFile.id &&
            document.id === oldFile.id
        )

      })
  ].map(
    normalizeDocument
  )

  return {

    ...tender,

    id:
      tender.id ||
      generateId(),

    title:
      tender.title ||
      tender.name ||
      '',

    name:
      tender.name ||
      tender.title ||
      '',

    referenceNumber:
      tender.referenceNumber ||
      '',

    description:
      tender.description ||
      '',

    startDate:
      tender.startDate ||
      '',

    endDate:
      tender.endDate ||
      '',

    location:
      tender.location ||
      '',

    authority:
      tender.authority ||
      '',

    responsiblePersons:
      Array.isArray(
        tender.responsiblePersons
      )
        ? tender.responsiblePersons
        : tender.responsiblePerson
          ? [
              tender.responsiblePerson
            ]
          : [],

    responsiblePerson:
      tender.responsiblePerson ||
      '',

    responsiblePhone:
      tender.responsiblePhone ||
      '',

    warehouseId:
      tender.warehouseId ||
      '',

    warehouseName:
      tender.warehouseName ||
      '',

    products:
      Array.isArray(
        tender.products
      )
        ? tender.products
        : [],

    estimatedQuantity:
      Number(
        tender.estimatedQuantity ||
        0
      ),

    status:
      tender.status ||
      'upcoming',

    notes:
      tender.notes ||
      '',

    documents:
      normalizedDocuments,

    /*
     * الاحتفاظ بـ files حتى لا تنكسر
     * أي بيانات أو واجهة قديمة تعتمد عليها.
     */

    files:
      normalizedDocuments,

    createdAt:
      tender.createdAt ||
      now(),

    updatedAt:
      tender.updatedAt ||
      now()

  }

}


// ==================================================
// STORE
// ==================================================

export const useTenderStore = create(

  persist(

    (set, get) => ({

      // ==================================================
      // STATE
      // ==================================================

      tenders: [],


      // ==================================================
      // NORMALIZE ALL TENDERS
      // ==================================================

      normalizeAllTenders: () => {

        const currentTenders =
          get().tenders

        if (
          !Array.isArray(
            currentTenders
          )
        ) {

          set({
            tenders: []
          })

          return []

        }

        const normalizedTenders =
          currentTenders.map(
            normalizeTender
          )

        set({
          tenders:
            normalizedTenders
        })

        return normalizedTenders
      },


      // ==================================================
      // CREATE
      // ==================================================

      addTender: (tender = {}) => {

        const newTender =
          normalizeTender({

            ...tender,

            id:
              tender.id ||
              generateId(),

            createdAt:
              tender.createdAt ||
              now(),

            updatedAt:
              now()

          })

        set(state => ({

          tenders: [

            newTender,

            ...state.tenders

          ]

        }))

        return newTender
      },


      // ==================================================
      // UPDATE
      // ==================================================

      updateTender: (
        id,
        updates = {}
      ) => {

        set(state => ({

          tenders:
            state.tenders.map(
              tender => {

                if (
                  tender.id !== id
                ) {
                  return tender
                }

                return normalizeTender({

                  ...tender,

                  ...updates,

                  id:

                    tender.id,

                  updatedAt:
                    now()

                })

              }
            )

        }))

      },


      // ==================================================
      // DELETE
      // ==================================================

      deleteTender: async (id) => {

        const tender =
          get()
            .tenders
            .find(
              item =>
                item.id === id
            )

        // ----------------------------------------------
        // DOCUMENTS
        // ----------------------------------------------

        const documents = [

          ...(Array.isArray(
            tender?.documents
          )
            ? tender.documents
            : []),

          ...(Array.isArray(
            tender?.files
          )
            ? tender.files.filter(
                oldFile =>
                  !(
                    Array.isArray(
                      tender?.documents
                    ) &&
                    tender.documents.some(
                      document =>
                        document.id ===
                        oldFile.id
                    )
                  )
              )
            : [])

        ]

        // ----------------------------------------------
        // DELETE FROM FIREBASE STORAGE
        // ----------------------------------------------

        for (
          const document
          of documents
        ) {

          if (
            !document.storagePath
          ) {
            continue
          }

          try {

            const fileRef =
              ref(
                storage,
                document.storagePath
              )

            await deleteObject(
              fileRef
            )

          } catch (error) {

            console.error(
              'Tender document delete error:',
              error
            )

          }

        }

        // ----------------------------------------------
        // DELETE TENDER
        // ----------------------------------------------

        set(state => ({

          tenders:
            state.tenders.filter(
              tender =>
                tender.id !== id
            )

        }))

      },


      // ==================================================
      // GET
      // ==================================================

      getTender: (id) => {

        return (

          get()
            .tenders
            .find(
              tender =>
                tender.id === id
            ) || null

        )

      },


      // ==================================================
      // SEARCH
      // ==================================================

      searchTenders: (
        query = ''
      ) => {

        const value =
          String(query)
            .trim()
            .toLowerCase()

        if (!value) {

          return get().tenders

        }

        return get()
          .tenders
          .filter(tender => {

            return [

              tender.title,

              tender.name,

              tender.referenceNumber,

              tender.location,

              tender.description,

              tender.authority,

              tender.warehouseName,

              tender.responsiblePerson

            ]
              .join(' ')
              .toLowerCase()
              .includes(value)

          })

      },


      // ==================================================
      // UPLOAD TENDER DOCUMENT
      // ==================================================

      uploadTenderDocument: async (
        tenderId,
        file
      ) => {

        if (!file) {

          throw new Error(
            'لم يتم اختيار ملف'
          )

        }

        const tender =
          get()
            .tenders
            .find(
              item =>
                item.id === tenderId
            )

        if (!tender) {

          throw new Error(
            'المناقصة غير موجودة'
          )

        }

        // ----------------------------------------------
        // UNIQUE STORAGE PATH
        // ----------------------------------------------

        const documentId =
          generateId()

        const safeFileName =
          String(
            file.name || 'file'
          )
            .replace(
              /[^\w\u0600-\u06FF.\- ]/g,
              '_'
            )

        const storagePath =
          `tenders/${tenderId}/documents/${documentId}_${safeFileName}`

        // ----------------------------------------------
        // FIREBASE STORAGE
        // ----------------------------------------------

        const fileRef =
          ref(
            storage,
            storagePath
          )

        const snapshot =
          await uploadBytes(
            fileRef,
            file,
            {
              contentType:
                file.type ||
                'application/octet-stream'
            }
          )

        const downloadURL =
          await getDownloadURL(
            snapshot.ref
          )

        // ----------------------------------------------
        // DOCUMENT
        // ----------------------------------------------

        const document = {

          id:
            documentId,

          name:
            file.name,

          size:
            file.size,

          type:
            file.type ||
            'application/octet-stream',

          downloadURL,

          dataUrl:
            downloadURL,

          storagePath,

          uploadedAt:
            now()

        }

        // ----------------------------------------------
        // UPDATE TENDER
        // ----------------------------------------------

        set(state => ({

          tenders:
            state.tenders.map(
              item => {

                if (
                  item.id !== tenderId
                ) {
                  return item
                }

                const currentDocuments = [

                  ...(Array.isArray(
                    item.documents
                  )
                    ? item.documents
                    : []),

                  ...(Array.isArray(
                    item.files
                  )
                    ? item.files.filter(
                        oldFile =>
                          !(
                            Array.isArray(
                              item.documents
                            ) &&
                            item.documents.some(
                              existing =>
                                existing.id ===
                                oldFile.id
                            )
                          )
                      )
                    : [])

                ]

                const nextDocuments = [

                  ...currentDocuments,

                  document

                ]

                return {

                  ...item,

                  documents:
                    nextDocuments,

                  files:
                    nextDocuments,

                  updatedAt:
                    now()

                }

              }
            )

        }))

        return document
      },


      // ==================================================
      // DELETE TENDER DOCUMENT
      // ==================================================

      deleteTenderDocument: async (
        tenderId,
        documentId
      ) => {

        const tender =
          get()
            .tenders
            .find(
              item =>
                item.id === tenderId
            )

        if (!tender) {

          throw new Error(
            'المناقصة غير موجودة'
          )

        }

        const documents = [

          ...(Array.isArray(
            tender.documents
          )
            ? tender.documents
            : []),

          ...(Array.isArray(
            tender.files
          )
            ? tender.files.filter(
                oldFile =>
                  !(
                    Array.isArray(
                      tender.documents
                    ) &&
                    tender.documents.some(
                      document =>
                        document.id ===
                        oldFile.id
                    )
                  )
              )
            : [])

        ]

        const document =
          documents.find(
            item =>
              item.id === documentId
          )

        if (!document) {

          throw new Error(
            'المستند غير موجود'
          )

        }

        // ----------------------------------------------
        // FIREBASE STORAGE
        // ----------------------------------------------

        if (
          document.storagePath
        ) {

          try {

            const fileRef =
              ref(
                storage,
                document.storagePath
              )

            await deleteObject(
              fileRef
            )

          } catch (error) {

            console.error(
              'Firebase document delete error:',
              error
            )

          }

        }

        // ----------------------------------------------
        // DELETE LOCAL RECORD
        // ----------------------------------------------

        set(state => ({

          tenders:
            state.tenders.map(
              item => {

                if (
                  item.id !== tenderId
                ) {
                  return item
                }

                const nextDocuments = [

                  ...(Array.isArray(
                    item.documents
                  )
                    ? item.documents
                    : item.files || [])

                ].filter(
                  document =>
                    document.id !==
                    documentId
                )

                return {

                  ...item,

                  documents:
                    nextDocuments,

                  files:
                    nextDocuments,

                  updatedAt:
                    now()

                }

              }
            )

        }))

      },


      // ==================================================
      // UPCOMING TENDERS
      // ==================================================

      getUpcomingTenders: () => {

        const today =
          new Date()

        return get()
          .tenders
          .filter(tender => {

            if (
              !tender.startDate
            ) {
              return false
            }

            const start =
              new Date(
                tender.startDate
              )

            return (

              start >= today &&

              tender.status !==
                'cancelled'

            )

          })

      },


      // ==================================================
      // TENDER ALERTS
      // ==================================================

      getTenderAlerts: () => {

        const nowDate =
          new Date()

        return get()
          .tenders
          .filter(tender => {

            if (
              !tender.startDate
            ) {
              return false
            }

            if (
              tender.status ===
              'cancelled'
            ) {
              return false
            }

            const start =
              new Date(
                tender.startDate
              )

            const difference =
              start.getTime() -
              nowDate.getTime()

            const days =
              difference /
              (
                1000 *
                60 *
                60 *
                24
              )

            return (

              days >= 0 &&

              days <= 2

            )

          })

      },


      // ==================================================
      // CLEAR
      // ==================================================

      clearTenders: () =>
        set({
          tenders: []
        })

    }),

    {

      name:
        STORAGE_KEY,

      partialize:
        state => ({

          tenders:
            state.tenders

        })

    }

  )

)


// ==================================================
// OPTIONAL HELPERS EXPORT
// ==================================================

export {
  normalizeTender,
  normalizeDocument
}