import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy
} from 'firebase/firestore'

import { db } from '../firebase/firebase'

export default class BaseRepository {

  constructor(collectionName) {

    this.collectionName = collectionName

  }

  // ======================================================
  // COLLECTION
  // ======================================================

  getCollection() {

    return collection(

      db,

      this.collectionName

    )

  }

  // ======================================================
  // LIFE CYCLE
  // ======================================================

  async beforeCreate(data) {

    return data

  }

  async afterCreate(result, data) {

    return result

  }

  async beforeUpdate(id, data) {

    return data

  }

  async afterUpdate(result, id, data) {

    return result

  }

  async beforeDelete(id) {

    return id

  }

  async afterDelete(result, id) {

    return result

  }

  // ======================================================
  // CREATE
  // ======================================================

  async create(data) {

    try {

      const payload =
        await this.beforeCreate(data)

      const ref = await addDoc(

        this.getCollection(),

        {

          ...payload,

          createdAt:

            payload.createdAt ||

            new Date().toISOString()

        }

      )

      const result = {

        success: true,

        data: {

          id: ref.id

        },

        message: 'تم الحفظ بنجاح',

        errors: []

      }

      return await this.afterCreate(

        result,

        payload

      )

    }

    catch (error) {

      return {

        success: false,

        data: null,

        message:

          error.message,

        errors: [error]

      }

    }

  }

  // ======================================================
  // GET ALL
  // ======================================================

  async getAll(

    field = 'createdAt',

    direction = 'desc'

  ) {

    try {

      const q = query(

        this.getCollection(),

        orderBy(

          field,

          direction

        )

      )

      const snapshot =

        await getDocs(q)

      return {

        success: true,

        data:

          snapshot.docs.map(

            document => ({

              id:

                document.id,

              ...document.data()

            })

          ),

        message: '',

        errors: []

      }

    }

    catch (error) {

      return {

        success: false,

        data: [],

        message:

          error.message,

        errors: [error]

      }

    }

  }

  // ======================================================
  // GET BY ID
  // ======================================================

  async getById(id) {

    try {

      const snapshot =

        await getDoc(

          doc(

            db,

            this.collectionName,

            id

          )

        )

      if (

        !snapshot.exists()

      ) {

        return {

          success: false,

          data: null,

          message:

            'العنصر غير موجود',

          errors: []

        }

      }

      return {

        success: true,

        data: {

          id:

            snapshot.id,

          ...snapshot.data()

        },

        message: '',

        errors: []

      }

    }

    catch (error) {

      return {

        success: false,

        data: null,

        message:

          error.message,

        errors: [error]

      }

    }

  }

  // ======================================================
  // UPDATE
  // ======================================================

  async update(id, data) {

    try {

      const payload =

        await this.beforeUpdate(

          id,

          data

        )

      await updateDoc(

        doc(

          db,

          this.collectionName,

          id

        ),

        payload

      )

      const result = {

        success: true,

        data: null,

        message:

          'تم التحديث بنجاح',

        errors: []

      }

      return await this.afterUpdate(

        result,

        id,

        payload

      )

    }

    catch (error) {

      return {

        success: false,

        data: null,

        message:

          error.message,

        errors: [error]

      }

    }

  }

  // ======================================================
  // DELETE
  // ======================================================

  async delete(id) {

    try {

      await this.beforeDelete(id)

      await deleteDoc(

        doc(

          db,

          this.collectionName,

          id

        )

      )

      const result = {

        success: true,

        data: null,

        message:

          'تم الحذف بنجاح',

        errors: []

      }

      return await this.afterDelete(

        result,

        id

      )

    }

    catch (error) {

      return {

        success: false,

        data: null,

        message:

          error.message,

        errors: [error]

      }

    }

  }

}