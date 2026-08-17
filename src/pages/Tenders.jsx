import {
  useEffect,
  useMemo,
  useState
} from 'react'

import { useWarehouseStore } from '../store/warehouseStore'
import { useTenderStore } from '../store/tenderStore'


const EMPTY_FORM = {

  name: '',

  referenceNumber: '',

  description: '',

  startDate: '',

  endDate: '',

  location: '',

  authority: '',

  status: 'upcoming',

  responsiblePerson: '',

  responsiblePhone: '',

  notes: '',

  warehouseId: ''

}


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
    Math.random()
      .toString(36)
      .slice(2)
  )

}


const getDocuments = tender => {

  if (
    Array.isArray(
      tender?.documents
    )
  ) {

    return tender.documents

  }

  if (
    Array.isArray(
      tender?.files
    )
  ) {

    return tender.files

  }

  return []

}


// ==================================================
// COMPONENT
// ==================================================

export default function Tenders() {

  const warehouses =
    useWarehouseStore(
      state =>
        state.warehouses || []
    )


  const tenders =
    useTenderStore(
      state =>
        state.tenders || []
    )


  const addTender =
    useTenderStore(
      state =>
        state.addTender
    )


  const updateTender =
    useTenderStore(
      state =>
        state.updateTender
    )


  const deleteTender =
    useTenderStore(
      state =>
        state.deleteTender
    )


  const uploadTenderDocument =
    useTenderStore(
      state =>
        state.uploadTenderDocument
    )


  const deleteTenderDocument =
    useTenderStore(
      state =>
        state.deleteTenderDocument
    )


  const getTenderAlerts =
    useTenderStore(
      state =>
        state.getTenderAlerts
    )


  const normalizeAllTenders =
    useTenderStore(
      state =>
        state.normalizeAllTenders
    )


  // ==================================================
  // STATE
  // ==================================================

  const [
    form,
    setForm
  ] = useState({
    ...EMPTY_FORM
  })


  const [
    showForm,
    setShowForm
  ] = useState(false)


  const [
    editingId,
    setEditingId
  ] = useState(null)


  const [
    search,
    setSearch
  ] = useState('')


  const [
    filter,
    setFilter
  ] = useState('all')


  const [
    selectedFiles,
    setSelectedFiles
  ] = useState([])


  const [
    uploading,
    setUploading
  ] = useState(false)


  // ==================================================
  // NORMALIZE OLD DATA
  // ==================================================

  useEffect(() => {

    if (
      typeof normalizeAllTenders ===
      'function'
    ) {

      normalizeAllTenders()

    }

  }, [
    normalizeAllTenders
  ])


  // ==================================================
  // FORM CHANGE
  // ==================================================

  const handleChange = e => {

    const {
      name,
      value
    } = e.target

    setForm(prev => ({
      ...prev,
      [name]:
        value
    }))

  }


  // ==================================================
  // FILE SELECT
  // ==================================================

  const handleFilesChange = e => {

    const files =
      Array.from(
        e.target.files || []
      )

    if (
      !files.length
    ) {

      return

    }

    const converted =
      files.map(file => ({

        id:
          generateId(),

        file,

        name:
          file.name,

        type:
          file.type ||
          'application/octet-stream',

        size:
          file.size

      }))


    setSelectedFiles(
      prev => [
        ...prev,
        ...converted
      ]
    )


    e.target.value = ''

  }


  // ==================================================
  // REMOVE SELECTED FILE
  // ==================================================

  const removeSelectedFile = id => {

    setSelectedFiles(
      prev =>
        prev.filter(
          file =>
            file.id !== id
        )
    )

  }


  // ==================================================
  // RESET FORM
  // ==================================================

  const resetForm = () => {

    setForm({
      ...EMPTY_FORM
    })

    setSelectedFiles([])

    setEditingId(null)

    setShowForm(false)

  }


  // ==================================================
  // EDIT TENDER
  // ==================================================

  const handleEdit = tender => {

    setForm({

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

      status:
        tender.status ||
        'upcoming',

      responsiblePerson:
        tender.responsiblePerson ||
        '',

      responsiblePhone:
        tender.responsiblePhone ||
        '',

      notes:
        tender.notes ||
        '',

      warehouseId:
        tender.warehouseId ||
        ''

    })


    setEditingId(
      tender.id
    )


    setSelectedFiles([])

    setShowForm(true)


    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })

  }


  // ==================================================
  // SUBMIT
  // ==================================================

  const handleSubmit = async e => {

    e.preventDefault()


    if (
      !form.name.trim()
    ) {

      alert(
        'اسم المناقصة مطلوب'
      )

      return

    }


    if (
      !form.startDate
    ) {

      alert(
        'تاريخ بدء المناقصة مطلوب'
      )

      return

    }


    if (
      !form.endDate
    ) {

      alert(
        'تاريخ انتهاء المناقصة مطلوب'
      )

      return

    }


    if (
      new Date(
        form.endDate
      ) <
      new Date(
        form.startDate
      )
    ) {

      alert(
        'تاريخ انتهاء المناقصة يجب أن يكون بعد تاريخ البدء'
      )

      return

    }


    const warehouse =
      warehouses.find(
        item =>
          String(item.id) ===
          String(form.warehouseId)
      )


    const data = {

      ...form,

      title:
        form.name,

      name:
        form.name,

      warehouseName:
        warehouse?.name ||
        '',

      responsiblePersons:
        form.responsiblePerson
          ? [
              {

                name:
                  form.responsiblePerson,

                phone:
                  form.responsiblePhone ||
                  ''

              }
            ]
          : []

    }


    try {

      setUploading(true)


      let tender


      // ==================================================
      // UPDATE
      // ==================================================

      if (
        editingId
      ) {

        tender =
          updateTender(
            editingId,
            data
          )

      }


      // ==================================================
      // CREATE
      // ==================================================

      else {

        tender =
          addTender(
            data
          )

      }


      // ==================================================
      // UPLOAD FILES
      // ==================================================

      if (
        tender &&
        selectedFiles.length > 0
      ) {

        for (
          const selected
          of selectedFiles
        ) {

          await uploadTenderDocument(

            tender.id,

            selected.file

          )

        }

      }


      alert(
        editingId
          ? 'تم تعديل المناقصة ورفع المستندات بنجاح'
          : 'تم إنشاء المناقصة ورفع المستندات بنجاح'
      )


      resetForm()


    } catch (error) {

      console.error(
        'Tender save error:',
        error
      )


      alert(
        error?.message ||
        'حدث خطأ أثناء حفظ المناقصة'
      )


    } finally {

      setUploading(false)

    }

  }


  // ==================================================
  // DELETE TENDER
  // ==================================================

  const handleDelete = async id => {

    if (
      !window.confirm(
        'هل تريد حذف هذه المناقصة وجميع مستنداتها؟'
      )
    ) {

      return

    }


    try {

      await deleteTender(id)

    } catch (error) {

      console.error(
        'Tender delete error:',
        error
      )


      alert(
        'حدث خطأ أثناء حذف المناقصة'
      )

    }

  }


  // ==================================================
  // DELETE DOCUMENT
  // ==================================================

  const handleDeleteDocument = async (
    tenderId,
    documentId
  ) => {

    if (
      !window.confirm(
        'هل تريد حذف هذا المستند؟'
      )
    ) {

      return

    }


    try {

      await deleteTenderDocument(

        tenderId,

        documentId

      )

    } catch (error) {

      console.error(
        'Document delete error:',
        error
      )


      alert(
        error?.message ||
        'تعذر حذف المستند'
      )

    }

  }


  // ==================================================
  // SEARCH / FILTER
  // ==================================================

  const filteredTenders =
    useMemo(() => {

      const value =
        search
          .trim()
          .toLowerCase()


      return tenders.filter(
        tender => {

          const matchesSearch =
            !value ||

            String(
              tender.name ||
              tender.title ||
              ''
            )
              .toLowerCase()
              .includes(value) ||

            String(
              tender.referenceNumber ||
              ''
            )
              .toLowerCase()
              .includes(value) ||

            String(
              tender.location ||
              ''
            )
              .toLowerCase()
              .includes(value) ||

            String(
              tender.authority ||
              ''
            )
              .toLowerCase()
              .includes(value) ||

            String(
              tender.warehouseName ||
              ''
            )
              .toLowerCase()
              .includes(value)


          const matchesFilter =
            filter === 'all' ||
            tender.status ===
              filter


          return (
            matchesSearch &&
            matchesFilter
          )

        }
      )

    }, [
      tenders,
      search,
      filter
    ])


  // ==================================================
  // ALERTS
  // ==================================================

  const upcomingTenders =
    useMemo(() => {

      if (
        typeof getTenderAlerts !==
        'function'
      ) {

        return []

      }

      return getTenderAlerts()

    }, [
      tenders,
      getTenderAlerts
    ])


  // ==================================================
  // DAYS REMAINING
  // ==================================================

  const getDaysRemaining = tender => {

    if (
      !tender.startDate
    ) {

      return null

    }


    const now =
      new Date()


    const start =
      new Date(
        tender.startDate
      )


    const difference =
      start.getTime() -
      now.getTime()


    if (
      difference < 0
    ) {

      return null

    }


    return Math.ceil(

      difference /

      (
        1000 *
        60 *
        60 *
        24
      )

    )

  }


  // ==================================================
  // STATUS
  // ==================================================

  const getStatus = tender => {

    const today =
      new Date()


    const start =
      new Date(
        tender.startDate
      )


    const end =
      new Date(
        tender.endDate
      )


    if (
      today < start
    ) {

      return {

        text:
          'قادمة',

        className:
          'bg-blue-500/20 text-blue-300 border-blue-500/30'

      }

    }


    if (
      today >= start &&
      today <= end
    ) {

      return {

        text:
          'جارية',

        className:
          'bg-green-500/20 text-green-300 border-green-500/30'

      }

    }


    return {

      text:
        'منتهية',

      className:
        'bg-red-500/20 text-red-300 border-red-500/30'

    }

  }


  // ==================================================
  // FORMAT DATE
  // ==================================================

  const formatDate = value => {

    if (
      !value
    ) {

      return '-'

    }


    return new Date(
      value
    ).toLocaleDateString(
      'ar-EG',
      {

        year:
          'numeric',

        month:
          'long',

        day:
          'numeric'

      }
    )

  }


  // ==================================================
  // FORMAT SIZE
  // ==================================================

  const formatFileSize = bytes => {

    if (
      !bytes
    ) {

      return '0 KB'

    }


    if (
      bytes < 1024
    ) {

      return `${bytes} B`

    }


    if (
      bytes <
      1024 * 1024
    ) {

      return `${(
        bytes / 1024
      ).toFixed(1)} KB`

    }


    return `${(
      bytes /
      (
        1024 *
        1024
      )
    ).toFixed(1)} MB`

  }


  // ==================================================
  // FILE ICON
  // ==================================================

  const getFileIcon = (
    type,
    name
  ) => {

    const lowerName =
      String(
        name || ''
      )
        .toLowerCase()


    if (
      type ===
        'application/pdf' ||
      lowerName.endsWith(
        '.pdf'
      )
    ) {

      return '📕'

    }


    if (
      String(
        type || ''
      ).startsWith(
        'image/'
      )
    ) {

      return '🖼️'

    }


    if (
      String(
        type || ''
      ).includes(
        'word'
      ) ||
      lowerName.endsWith(
        '.doc'
      ) ||
      lowerName.endsWith(
        '.docx'
      )
    ) {

      return '📘'

    }


    if (
      String(
        type || ''
      ).includes(
        'excel'
      ) ||
      String(
        type || ''
      ).includes(
        'spreadsheet'
      ) ||
      lowerName.endsWith(
        '.xls'
      ) ||
      lowerName.endsWith(
        '.xlsx'
      )
    ) {

      return '📗'

    }


    if (
      String(
        type || ''
      ).includes(
        'zip'
      ) ||
      String(
        type || ''
      ).includes(
        'compressed'
      )
    ) {

      return '🗜️'

    }


    return '📄'

  }


  // ==================================================
  // DOCUMENT URL
  // ==================================================

  const getDocumentUrl = document => {

    return (
      document?.downloadURL ||
      document?.dataUrl ||
      ''
    )

  }


  // ==================================================
  // UI
  // ==================================================

  return (

    <div className="
      min-h-screen
      space-y-8
    ">

      {/* HEADER */}

      <div className="
        bg-slate-900
        border
        border-slate-700
        rounded-[30px]
        p-8
        shadow-2xl
      ">

        <div className="
          flex
          items-center
          justify-between
          gap-5
          flex-wrap
        ">

          <div>

            <h1 className="
              text-4xl
              md:text-5xl
              font-black
              text-yellow-400
            ">

              📋 إدارة المناقصات

            </h1>

            <p className="
              mt-3
              text-gray-400
              text-lg
            ">

              إدارة المناقصات وربطها بالمخازن
              ومتابعة المواعيد والمسؤولين والمستندات

            </p>

          </div>


          <button
            type="button"
            onClick={() => {

              if (
                showForm
              ) {

                resetForm()

              } else {

                setShowForm(true)

              }

            }}
            className="
              bg-yellow-500
              hover:bg-yellow-400
              text-black
              px-7
              py-4
              rounded-2xl
              font-black
              text-lg
            "
          >

            {showForm
              ? 'إغلاق'
              : '➕ إضافة مناقصة'}

          </button>

        </div>

      </div>


      {/* ALERT */}

      {upcomingTenders.length > 0 && (

        <div className="
          bg-red-900/30
          border
          border-red-500
          rounded-3xl
          p-6
          shadow-xl
        ">

          <div className="
            text-red-300
            text-2xl
            font-black
          ">

            🚨 جهاز إنذار المناقصات

          </div>


          <div className="
            mt-3
            text-white
            font-bold
          ">

            توجد{' '}
            {upcomingTenders.length}
            {' '}
            مناقصة تبدأ خلال يومين أو أقل.

          </div>


          <div className="
            mt-5
            space-y-3
          ">

            {upcomingTenders.map(
              tender => {

                const days =
                  getDaysRemaining(
                    tender
                  )


                return (

                  <div
                    key={
                      tender.id
                    }
                    className="
                      bg-red-950/50
                      border
                      border-red-500/40
                      rounded-2xl
                      p-4
                      flex
                      items-center
                      justify-between
                      gap-4
                      flex-wrap
                    "
                  >

                    <div>

                      <div className="
                        font-black
                        text-white
                        text-lg
                      ">

                        {tender.name ||
                         tender.title ||
                         '-'}

                      </div>


                      <div className="
                        text-red-200
                        text-sm
                        mt-1
                      ">

                        موعد البدء:
                        {' '}
                        {formatDate(
                          tender.startDate
                        )}

                      </div>

                    </div>


                    <div className="
                      bg-red-600
                      text-white
                      px-4
                      py-2
                      rounded-xl
                      font-black
                    ">

                      {days === 0
                        ? 'اليوم'
                        : days === 1
                          ? 'باقي يوم واحد'
                          : `باقي ${days} يوم`}

                    </div>

                  </div>

                )

              }
            )}

          </div>

        </div>

      )}
      {/* FORM */}

      {showForm && (

        <form
          onSubmit={handleSubmit}
          className="
            bg-slate-900
            border
            border-slate-700
            rounded-[30px]
            p-8
            space-y-6
            shadow-2xl
          "
        >

          <div className="
            flex
            items-center
            justify-between
            gap-4
            flex-wrap
          ">

            <h2 className="
              text-3xl
              font-black
              text-yellow-400
            ">

              {editingId
                ? 'تعديل المناقصة'
                : 'بيانات المناقصة'}

            </h2>


            {editingId && (

              <button
                type="button"
                onClick={resetForm}
                className="
                  bg-slate-700
                  hover:bg-slate-600
                  px-5
                  py-3
                  rounded-xl
                  font-black
                "
              >

                إلغاء التعديل

              </button>

            )}

          </div>


          {/* BASIC DATA */}

          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-5
          ">

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="اسم المناقصة"
              className="
                p-4
                rounded-2xl
                bg-white
                text-black
                font-bold
                outline-none
                focus:ring-2
                focus:ring-yellow-400
              "
            />


            <input
              name="referenceNumber"
              value={
                form.referenceNumber
              }
              onChange={handleChange}
              placeholder="رقم المناقصة"
              className="
                p-4
                rounded-2xl
                bg-white
                text-black
                font-bold
                outline-none
                focus:ring-2
                focus:ring-yellow-400
              "
            />


            <input
              type="date"
              name="startDate"
              value={
                form.startDate
              }
              onChange={handleChange}
              className="
                p-4
                rounded-2xl
                bg-white
                text-black
                font-bold
                outline-none
                focus:ring-2
                focus:ring-yellow-400
              "
            />


            <input
              type="date"
              name="endDate"
              value={
                form.endDate
              }
              onChange={handleChange}
              className="
                p-4
                rounded-2xl
                bg-white
                text-black
                font-bold
                outline-none
                focus:ring-2
                focus:ring-yellow-400
              "
            />


            <input
              name="location"
              value={
                form.location
              }
              onChange={handleChange}
              placeholder="مكان المناقصة"
              className="
                p-4
                rounded-2xl
                bg-white
                text-black
                font-bold
                outline-none
                focus:ring-2
                focus:ring-yellow-400
              "
            />


            <input
              name="authority"
              value={
                form.authority
              }
              onChange={handleChange}
              placeholder="الجهة صاحبة المناقصة"
              className="
                p-4
                rounded-2xl
                bg-white
                text-black
                font-bold
                outline-none
                focus:ring-2
                focus:ring-yellow-400
              "
            />


            <input
              name="responsiblePerson"
              value={
                form.responsiblePerson
              }
              onChange={handleChange}
              placeholder="المسؤول عن المناقصة"
              className="
                p-4
                rounded-2xl
                bg-white
                text-black
                font-bold
                outline-none
                focus:ring-2
                focus:ring-yellow-400
              "
            />


            <input
              name="responsiblePhone"
              value={
                form.responsiblePhone
              }
              onChange={handleChange}
              placeholder="هاتف المسؤول"
              className="
                p-4
                rounded-2xl
                bg-white
                text-black
                font-bold
                outline-none
                focus:ring-2
                focus:ring-yellow-400
              "
            />


            {/* WAREHOUSE */}

            <select
              name="warehouseId"
              value={
                form.warehouseId
              }
              onChange={handleChange}
              className="
                p-4
                rounded-2xl
                bg-white
                text-black
                font-bold
                outline-none
                focus:ring-2
                focus:ring-yellow-400
              "
            >

              <option value="">
                ربط المناقصة بالمخزن
              </option>


              {warehouses.map(
                warehouse => (

                  <option
                    key={
                      warehouse.id
                    }
                    value={
                      warehouse.id
                    }
                  >

                    {warehouse.name}

                  </option>

                )
              )}

            </select>


            {/* STATUS */}

            <select
              name="status"
              value={
                form.status
              }
              onChange={handleChange}
              className="
                p-4
                rounded-2xl
                bg-white
                text-black
                font-bold
                outline-none
                focus:ring-2
                focus:ring-yellow-400
              "
            >

              <option value="upcoming">
                قادمة
              </option>

              <option value="active">
                جارية
              </option>

              <option value="closed">
                منتهية
              </option>

            </select>

          </div>


          {/* DESCRIPTION */}

          <textarea
            name="description"
            value={
              form.description
            }
            onChange={handleChange}
            placeholder="وصف المناقصة وتفاصيلها"
            rows={5}
            className="
              w-full
              p-4
              rounded-2xl
              bg-white
              text-black
              font-bold
              outline-none
              resize-y
              focus:ring-2
              focus:ring-yellow-400
            "
          />


          {/* NOTES */}

          <textarea
            name="notes"
            value={
              form.notes
            }
            onChange={handleChange}
            placeholder="ملاحظات إضافية"
            rows={4}
            className="
              w-full
              p-4
              rounded-2xl
              bg-white
              text-black
              font-bold
              outline-none
              resize-y
              focus:ring-2
              focus:ring-yellow-400
            "
          />


          {/* DOCUMENTS */}

          <div className="
            bg-black
            border
            border-slate-700
            rounded-3xl
            p-6
            space-y-5
          ">

            <div>

              <h3 className="
                text-2xl
                font-black
                text-yellow-400
              ">

                📎 مستندات المناقصة

              </h3>


              <p className="
                text-gray-400
                mt-2
                leading-7
              ">

                يمكنك رفع كراسة الشروط أو PDF
                أو الصور أو ملفات Word وExcel
                أو أي مستندات مرتبطة بالمناقصة.

              </p>

            </div>


            {/* FILE INPUT */}

            <label className="
              block
              cursor-pointer
              border-2
              border-dashed
              border-yellow-500/50
              hover:border-yellow-400
              hover:bg-yellow-500/5
              rounded-2xl
              p-8
              text-center
              transition
            ">

              <input
                type="file"
                multiple
                onChange={
                  handleFilesChange
                }
                className="hidden"
                disabled={
                  uploading
                }
              />


              <div className="
                text-5xl
                mb-3
              ">

                📤

              </div>


              <div className="
                text-xl
                font-black
              ">

                اضغط لاختيار المستندات

              </div>


              <div className="
                text-sm
                text-gray-500
                mt-2
              ">

                يمكن اختيار أكثر من ملف في نفس الوقت

              </div>

            </label>


            {/* SELECTED FILES */}

            {selectedFiles.length > 0 && (

              <div className="
                space-y-3
              ">

                <div className="
                  font-black
                  text-lg
                  text-white
                ">

                  الملفات المختارة:
                  {' '}
                  {selectedFiles.length}

                </div>


                {selectedFiles.map(
                  file => (

                    <div
                      key={
                        file.id
                      }
                      className="
                        bg-slate-900
                        border
                        border-slate-700
                        rounded-2xl
                        p-4
                        flex
                        items-center
                        justify-between
                        gap-4
                        flex-wrap
                      "
                    >

                      <div className="
                        flex
                        items-center
                        gap-3
                        min-w-0
                      ">

                        <span className="
                          text-3xl
                        ">

                          {getFileIcon(
                            file.type,
                            file.name
                          )}

                        </span>


                        <div className="
                          min-w-0
                        ">

                          <div className="
                            font-bold
                            break-all
                          ">

                            {file.name}

                          </div>


                          <div className="
                            text-sm
                            text-gray-500
                            mt-1
                          ">

                            {formatFileSize(
                              file.size
                            )}

                          </div>

                        </div>

                      </div>


                      <button
                        type="button"
                        disabled={
                          uploading
                        }
                        onClick={() =>
                          removeSelectedFile(
                            file.id
                          )
                        }
                        className="
                          bg-red-600
                          hover:bg-red-500
                          disabled:opacity-50
                          px-4
                          py-2
                          rounded-xl
                          font-black
                        "
                      >

                        حذف

                      </button>

                    </div>

                  )
                )}

              </div>

            )}

          </div>


          {/* SAVE */}

          <button
            type="submit"
            disabled={
              uploading
            }
            className="
              w-full
              bg-green-600
              hover:bg-green-500
              disabled:bg-slate-700
              disabled:text-gray-400
              py-5
              rounded-2xl
              font-black
              text-xl
              transition
            "
          >

            {uploading
              ? '⏳ جارٍ حفظ المناقصة ورفع المستندات...'
              : editingId
                ? '💾 حفظ تعديلات المناقصة'
                : '💾 حفظ المناقصة'}

          </button>

        </form>

      )}


      {/* SEARCH */}

      <div className="
        bg-slate-900
        border
        border-slate-700
        rounded-3xl
        p-6
        flex
        gap-4
        flex-wrap
      ">

        <input
          value={
            search
          }
          onChange={e =>
            setSearch(
              e.target.value
            )
          }
          placeholder="بحث عن مناقصة..."
          className="
            flex-1
            min-w-[250px]
            p-4
            rounded-2xl
            bg-white
            text-black
            font-bold
            outline-none
            focus:ring-2
            focus:ring-yellow-400
          "
        />


        <select
          value={
            filter
          }
          onChange={e =>
            setFilter(
              e.target.value
            )
          }
          className="
            p-4
            rounded-2xl
            bg-white
            text-black
            font-bold
            outline-none
            focus:ring-2
            focus:ring-yellow-400
          "
        >

          <option value="all">
            كل المناقصات
          </option>


          <option value="upcoming">
            القادمة
          </option>


          <option value="active">
            الجارية
          </option>


          <option value="closed">
            المنتهية
          </option>

        </select>

      </div>


      {/* EMPTY */}

      {filteredTenders.length === 0 ? (

        <div className="
          bg-slate-900
          border
          border-slate-700
          rounded-3xl
          p-12
          text-center
          text-gray-400
          text-2xl
          font-black
        ">

          {search
            ? 'لا توجد نتائج مطابقة للبحث'
            : 'لا توجد مناقصات حالياً'}

        </div>

      ) : (

        <div className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
        ">

          {filteredTenders.map(
            tender => {

              const status =
                getStatus(
                  tender
                )


              const tenderFiles =
                getDocuments(
                  tender
                )


              return (

                <div
                  key={
                    tender.id
                  }
                  className="
                    bg-slate-900
                    border
                    border-slate-700
                    rounded-[30px]
                    p-7
                    space-y-5
                    shadow-2xl
                  "
                >

                  {/* CARD HEADER */}

                  <div className="
                    flex
                    justify-between
                    gap-4
                    flex-wrap
                  ">

                    <div>

                      <h2 className="
                        text-2xl
                        font-black
                        text-yellow-400
                      ">

                        {tender.name ||
                         tender.title ||
                         'مناقصة بدون اسم'}

                      </h2>


                      {tender.referenceNumber && (

                        <div className="
                          text-gray-500
                          text-sm
                          mt-2
                        ">

                          رقم:
                          {' '}
                          {tender.referenceNumber}

                        </div>

                      )}

                    </div>


                    <span className={`
                      px-4
                      py-2
                      rounded-xl
                      border
                      font-black
                      h-fit
                      ${status.className}
                    `}>

                      {status.text}

                    </span>

                  </div>


                  {/* DATA */}

                  <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-4
                  ">

                    <div>

                      <span className="
                        text-gray-500
                        text-sm
                      ">

                        رقم المناقصة

                      </span>

                      <div className="
                        font-bold
                        mt-1
                      ">

                        {tender.referenceNumber ||
                         '-'}

                      </div>

                    </div>


                    <div>

                      <span className="
                        text-gray-500
                        text-sm
                      ">

                        الجهة

                      </span>

                      <div className="
                        font-bold
                        mt-1
                      ">

                        {tender.authority ||
                         '-'}

                      </div>

                    </div>


                    <div>

                      <span className="
                        text-gray-500
                        text-sm
                      ">

                        تاريخ البدء

                      </span>

                      <div className="
                        font-bold
                        mt-1
                      ">

                        {formatDate(
                          tender.startDate
                        )}

                      </div>

                    </div>


                    <div>

                      <span className="
                        text-gray-500
                        text-sm
                      ">

                        تاريخ الانتهاء

                      </span>

                      <div className="
                        font-bold
                        mt-1
                      ">

                        {formatDate(
                          tender.endDate
                        )}

                      </div>

                    </div>


                    <div>

                      <span className="
                        text-gray-500
                        text-sm
                      ">

                        المكان

                      </span>

                      <div className="
                        font-bold
                        mt-1
                      ">

                        {tender.location ||
                         '-'}

                      </div>

                    </div>


                    <div>

                      <span className="
                        text-gray-500
                        text-sm
                      ">

                        المخزن

                      </span>

                      <div className="
                        font-bold
                        text-cyan-400
                        mt-1
                      ">

                        {tender.warehouseName ||
                         '-'}

                      </div>

                    </div>


                    <div>

                      <span className="
                        text-gray-500
                        text-sm
                      ">

                        المسؤول

                      </span>

                      <div className="
                        font-bold
                        mt-1
                      ">

                        {tender.responsiblePerson ||
                         '-'}

                      </div>

                    </div>


                    <div>

                      <span className="
                        text-gray-500
                        text-sm
                      ">

                        هاتف المسؤول

                      </span>

                      <div className="
                        font-bold
                        mt-1
                      ">

                        {tender.responsiblePhone ||
                         '-'}

                      </div>

                    </div>

                  </div>


                  {/* DESCRIPTION */}

                  {tender.description && (

                    <div className="
                      bg-black
                      rounded-2xl
                      p-4
                      text-gray-300
                      leading-7
                    ">

                      {tender.description}

                    </div>

                  )}


                  {/* NOTES */}

                  {tender.notes && (

                    <div className="
                      bg-black
                      rounded-2xl
                      p-4
                      text-gray-400
                      leading-7
                    ">

                      <strong>
                        ملاحظات:
                      </strong>

                      {' '}

                      {tender.notes}

                    </div>

                  )}


                  {/* DOCUMENTS */}

                  <div className="
                    bg-black
                    border
                    border-slate-800
                    rounded-2xl
                    p-5
                    space-y-4
                  ">

                    <div className="
                      flex
                      items-center
                      justify-between
                      gap-3
                    ">

                      <div className="
                        text-xl
                        font-black
                        text-yellow-400
                      ">

                        📎 المستندات

                      </div>


                      <div className="
                        bg-slate-800
                        px-3
                        py-1
                        rounded-xl
                        text-sm
                        font-bold
                      ">

                        {tenderFiles.length}
                        {' '}
                        ملف

                      </div>

                    </div>


                    {tenderFiles.length === 0 ? (

                      <div className="
                        text-gray-500
                        text-center
                        py-3
                      ">

                        لا توجد مستندات مرفقة

                      </div>

                    ) : (

                      <div className="
                        space-y-3
                      ">

                        {tenderFiles.map(
                          file => {

                            const url =
                              getDocumentUrl(
                                file
                              )


                            return (

                              <div
                                key={
                                  file.id
                                }
                                className="
                                  bg-slate-900
                                  border
                                  border-slate-700
                                  rounded-2xl
                                  p-4
                                  flex
                                  items-center
                                  justify-between
                                  gap-4
                                  flex-wrap
                                "
                              >

                                <div className="
                                  flex
                                  items-center
                                  gap-3
                                  min-w-0
                                ">

                                  <span className="
                                    text-3xl
                                  ">

                                    {getFileIcon(
                                      file.type,
                                      file.name
                                    )}

                                  </span>


                                  <div className="
                                    min-w-0
                                  ">

                                    <div className="
                                      font-bold
                                      break-all
                                    ">

                                      {file.name ||
                                       'مستند'}

                                    </div>


                                    <div className="
                                      text-sm
                                      text-gray-500
                                      mt-1
                                    ">

                                      {formatFileSize(
                                        file.size
                                      )}

                                    </div>

                                  </div>

                                </div>


                                <div className="
                                  flex
                                  gap-2
                                  flex-wrap
                                ">

                                  {url && (

                                    <>

                                      <a
                                        href={
                                          url
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                        className="
                                          bg-blue-600
                                          hover:bg-blue-500
                                          px-4
                                          py-2
                                          rounded-xl
                                          font-black
                                        "
                                      >

                                        فتح

                                      </a>


                                      <a
                                        href={
                                          url
                                        }
                                        download={
                                          file.name
                                        }
                                        className="
                                          bg-green-600
                                          hover:bg-green-500
                                          px-4
                                          py-2
                                          rounded-xl
                                          font-black
                                        "
                                      >

                                        تنزيل

                                      </a>

                                    </>

                                  )}


                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteDocument(
                                        tender.id,
                                        file.id
                                      )
                                    }
                                    className="
                                      bg-red-600
                                      hover:bg-red-500
                                      px-4
                                      py-2
                                      rounded-xl
                                      font-black
                                    "
                                  >

                                    حذف

                                  </button>

                                </div>

                              </div>

                            )

                          }
                        )}

                      </div>

                    )}

                  </div>


                  {/* ACTIONS */}

                  <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-3
                  ">

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(
                          tender
                        )
                      }
                      className="
                        bg-blue-600
                        hover:bg-blue-500
                        py-4
                        rounded-2xl
                        font-black
                      "
                    >

                      ✏️ تعديل المناقصة

                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          tender.id
                        )
                      }
                      className="
                        bg-red-600
                        hover:bg-red-500
                        py-4
                        rounded-2xl
                        font-black
                      "
                    >

                      🗑️ حذف المناقصة

                    </button>

                  </div>

                </div>

              )

            }
          )}

        </div>

      )}

    </div>

  )

}