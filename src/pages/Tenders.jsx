import { useMemo, useState } from 'react'
import { useWarehouseStore } from '../store/warehouseStore'

const STORAGE_KEY = 'elola-tenders'

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

export default function Tenders() {

  const warehouses =
    useWarehouseStore(
      state => state.warehouses || []
    )

  // ==================================================
  // TENDERS
  // ==================================================

  const [tenders, setTenders] = useState(() => {

    try {

      const saved =
        localStorage.getItem(
          STORAGE_KEY
        )

      if (!saved) {
        return []
      }

      const parsed =
        JSON.parse(saved)

      return Array.isArray(parsed)
        ? parsed
        : []

    } catch (error) {

      console.error(
        'Failed to load tenders:',
        error
      )

      return []

    }

  })

  // ==================================================
  // FORM
  // ==================================================

  const [form, setForm] =
    useState({
      ...EMPTY_FORM
    })

  const [showForm, setShowForm] =
    useState(false)

  const [search, setSearch] =
    useState('')

  const [filter, setFilter] =
    useState('all')

  // ==================================================
  // FILES
  // ==================================================

  const [selectedFiles, setSelectedFiles] =
    useState([])

  // ==================================================
  // SAVE TENDERS
  // ==================================================

  const saveTenders = (nextTenders) => {

    setTenders(nextTenders)

    try {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          nextTenders
        )
      )

    } catch (error) {

      console.error(
        'Failed to save tenders:',
        error
      )

      alert(
        'تعذر حفظ المناقصة. قد تكون الملفات المرفوعة كبيرة جداً بالنسبة للتخزين المحلي.'
      )

    }

  }

  // ==================================================
  // FORM CHANGE
  // ==================================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target

    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // ==================================================
  // FILE TO DATA URL
  // ==================================================

  const fileToDataUrl = (file) => {

    return new Promise(
      (resolve, reject) => {

        const reader =
          new FileReader()

        reader.onload = () =>
          resolve(
            reader.result
          )

        reader.onerror = () =>
          reject(
            reader.error
          )

        reader.readAsDataURL(
          file
        )

      }
    )
  }

  // ==================================================
  // ADD FILES
  // ==================================================

  const handleFilesChange = async (e) => {

    const files =
      Array.from(
        e.target.files || []
      )

    if (!files.length) {
      return
    }

    try {

      const convertedFiles =
        await Promise.all(

          files.map(
            async file => {

              const dataUrl =
                await fileToDataUrl(
                  file
                )

              return {

                id:
                  crypto.randomUUID(),

                name:
                  file.name,

                type:
                  file.type ||
                  'application/octet-stream',

                size:
                  file.size,

                dataUrl

              }

            }
          )

        )

      setSelectedFiles(
        prev => [
          ...prev,
          ...convertedFiles
        ]
      )

    } catch (error) {

      console.error(
        'File upload error:',
        error
      )

      alert(
        'حدث خطأ أثناء قراءة أحد الملفات.'
      )

    }

    e.target.value = ''

  }

  // ==================================================
  // REMOVE SELECTED FILE
  // ==================================================

  const removeSelectedFile = (fileId) => {

    setSelectedFiles(
      prev =>
        prev.filter(
          file =>
            file.id !== fileId
        )
    )

  }

  // ==================================================
  // REMOVE SAVED TENDER FILE
  // ==================================================

  const removeTenderFile = (
    tenderId,
    fileId
  ) => {

    const nextTenders =
      tenders.map(
        tender => {

          if (
            tender.id !== tenderId
          ) {
            return tender
          }

          return {

            ...tender,

            files:
              (tender.files || [])
                .filter(
                  file =>
                    file.id !== fileId
                ),

            updatedAt:
              new Date().toISOString()

          }

        }
      )

    saveTenders(
      nextTenders
    )

  }

  // ==================================================
  // CREATE TENDER
  // ==================================================

  const handleSubmit = (e) => {

    e.preventDefault()

    if (!form.name.trim()) {

      alert(
        'اسم المناقصة مطلوب'
      )

      return
    }

    if (!form.startDate) {

      alert(
        'تاريخ بدء المناقصة مطلوب'
      )

      return
    }

    if (!form.endDate) {

      alert(
        'تاريخ انتهاء المناقصة مطلوب'
      )

      return
    }

    if (
      new Date(form.endDate) <
      new Date(form.startDate)
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

    const tender = {

      id:
        crypto.randomUUID(),

      ...form,

      warehouseName:
        warehouse?.name || '',

      files:
        selectedFiles,

      createdAt:
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString()

    }

    const nextTenders = [
      tender,
      ...tenders
    ]

    saveTenders(
      nextTenders
    )

    setForm({
      ...EMPTY_FORM
    })

    setSelectedFiles([])

    setShowForm(false)

    alert(
      'تم إنشاء المناقصة بنجاح'
    )

  }

  // ==================================================
  // DELETE TENDER
  // ==================================================

  const handleDelete = (id) => {

    if (
      !window.confirm(
        'هل تريد حذف هذه المناقصة؟'
      )
    ) {
      return
    }

    const nextTenders =
      tenders.filter(
        tender =>
          tender.id !== id
      )

    saveTenders(
      nextTenders
    )

  }

  // ==================================================
  // FILTER
  // ==================================================

  const filteredTenders =
    useMemo(() => {

      const value =
        search
          .toLowerCase()
          .trim()

      return tenders.filter(
        tender => {

          const matchesSearch =
            !value ||
            String(
              tender.name || ''
            )
              .toLowerCase()
              .includes(value) ||
            String(
              tender.referenceNumber || ''
            )
              .toLowerCase()
              .includes(value) ||
            String(
              tender.location || ''
            )
              .toLowerCase()
              .includes(value) ||
            String(
              tender.authority || ''
            )
              .toLowerCase()
              .includes(value)

          const matchesFilter =
            filter === 'all' ||
            tender.status === filter

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
  // UPCOMING ALERT
  // ==================================================

  const upcomingTenders =
    useMemo(() => {

      const now =
        new Date()

      const twoDays =
        new Date()

      twoDays.setDate(
        twoDays.getDate() + 2
      )

      return tenders.filter(
        tender => {

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
            start >= now &&
            start <= twoDays
          )

        }
      )

    }, [tenders])

  // ==================================================
  // STATUS
  // ==================================================

  const getStatus = (
    tender
  ) => {

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

    if (today < start) {

      return {

        text: 'قادمة',

        className:
          'bg-blue-500/20 text-blue-300 border-blue-500/30'

      }

    }

    if (
      today >= start &&
      today <= end
    ) {

      return {

        text: 'جارية',

        className:
          'bg-green-500/20 text-green-300 border-green-500/30'

      }

    }

    return {

      text: 'منتهية',

      className:
        'bg-red-500/20 text-red-300 border-red-500/30'

    }

  }

  // ==================================================
  // FORMAT DATE
  // ==================================================

  const formatDate = (
    value
  ) => {

    if (!value) {
      return '-'
    }

    return new Date(
      value
    ).toLocaleDateString(
      'ar-EG',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }
    )

  }

  // ==================================================
  // FORMAT FILE SIZE
  // ==================================================

  const formatFileSize = (
    bytes
  ) => {

    if (!bytes) {
      return '0 KB'
    }

    if (bytes < 1024) {
      return `${bytes} B`
    }

    if (bytes < 1024 * 1024) {

      return `${(
        bytes / 1024
      ).toFixed(1)} KB`

    }

    return `${(
      bytes /
      (1024 * 1024)
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
      ).toLowerCase()

    if (
      type === 'application/pdf' ||
      lowerName.endsWith('.pdf')
    ) {
      return '📕'
    }

    if (
      type.startsWith('image/')
    ) {
      return '🖼️'
    }

    if (
      type.includes('word') ||
      lowerName.endsWith('.doc') ||
      lowerName.endsWith('.docx')
    ) {
      return '📘'
    }

    if (
      type.includes('excel') ||
      type.includes('spreadsheet') ||
      lowerName.endsWith('.xls') ||
      lowerName.endsWith('.xlsx')
    ) {
      return '📗'
    }

    if (
      type.includes('zip') ||
      type.includes('compressed')
    ) {
      return '🗜️'
    }

    return '📄'

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
            onClick={() =>
              setShowForm(
                prev => !prev
              )
            }
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
        ">

          <div className="
            text-red-300
            text-2xl
            font-black
          ">

            🔔 تنبيه المناقصات

          </div>

          <div className="
            mt-3
            text-white
            font-bold
          ">

            توجد {upcomingTenders.length}
            {' '}
            مناقصة تبدأ خلال يومين.

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
          "
        >

          <h2 className="
            text-3xl
            font-black
            text-yellow-400
          ">

            بيانات المناقصة

          </h2>

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
              "
            />

            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="
                p-4
                rounded-2xl
                bg-white
                text-black
                font-bold
              "
            />

            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="
                p-4
                rounded-2xl
                bg-white
                text-black
                font-bold
              "
            />

            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="مكان المناقصة"
              className="
                p-4
                rounded-2xl
                bg-white
                text-black
                font-bold
              "
            />

            <input
              name="authority"
              value={form.authority}
              onChange={handleChange}
              placeholder="الجهة صاحبة المناقصة"
              className="
                p-4
                rounded-2xl
                bg-white
                text-black
                font-bold
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
              "
            />

            <select
              name="warehouseId"
              value={form.warehouseId}
              onChange={handleChange}
              className="
                p-4
                rounded-2xl
                bg-white
                text-black
                font-bold
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

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="
                p-4
                rounded-2xl
                bg-white
                text-black
                font-bold
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

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="وصف المناقصة وتفاصيلها"
            rows={4}
            className="
              w-full
              p-4
              rounded-2xl
              bg-white
              text-black
              font-bold
            "
          />

          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="ملاحظات إضافية"
            rows={3}
            className="
              w-full
              p-4
              rounded-2xl
              bg-white
              text-black
              font-bold
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
              ">

                يمكنك رفع كراسة الشروط أو PDF
                أو الصور أو أي مستندات مرتبطة بالمناقصة.

              </p>

            </div>

            <label className="
              block
              cursor-pointer
              border-2
              border-dashed
              border-yellow-500/50
              hover:border-yellow-400
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
              />

              <div className="
                text-4xl
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

                يمكن اختيار أكثر من ملف

              </div>

            </label>

            {selectedFiles.length > 0 && (

              <div className="
                space-y-3
              ">

                <div className="
                  font-black
                  text-lg
                ">

                  الملفات المختارة:
                  {' '}
                  {selectedFiles.length}

                </div>

                {selectedFiles.map(
                  file => (

                    <div
                      key={file.id}
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
                      ">

                        <span className="text-3xl">

                          {getFileIcon(
                            file.type,
                            file.name
                          )}

                        </span>

                        <div>

                          <div className="
                            font-bold
                            break-all
                          ">

                            {file.name}

                          </div>

                          <div className="
                            text-sm
                            text-gray-500
                          ">

                            {formatFileSize(
                              file.size
                            )}

                          </div>

                        </div>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeSelectedFile(
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

                  )
                )}

              </div>

            )}

          </div>

          <button
            type="submit"
            className="
              w-full
              bg-green-600
              hover:bg-green-500
              py-5
              rounded-2xl
              font-black
              text-xl
            "
          >

            حفظ المناقصة

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
          value={search}
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
          "
        />

        <select
          value={filter}
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

      {/* TENDERS */}

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

          لا توجد مناقصات حالياً

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
                tender.files || []

              return (

                <div
                  key={tender.id}
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

                  <div className="
                    flex
                    justify-between
                    gap-4
                    flex-wrap
                  ">

                    <h2 className="
                      text-2xl
                      font-black
                      text-yellow-400
                    ">

                      {tender.name}

                    </h2>

                    <span className={`
                      px-4
                      py-2
                      rounded-xl
                      border
                      font-black
                      ${status.className}
                    `}>

                      {status.text}

                    </span>

                  </div>

                  <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-4
                  ">

                    <div>
                      <span className="text-gray-500">
                        رقم المناقصة
                      </span>
                      <div className="font-bold">
                        {tender.referenceNumber || '-'}
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-500">
                        الجهة
                      </span>
                      <div className="font-bold">
                        {tender.authority || '-'}
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-500">
                        تاريخ البدء
                      </span>
                      <div className="font-bold">
                        {formatDate(
                          tender.startDate
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-500">
                        تاريخ الانتهاء
                      </span>
                      <div className="font-bold">
                        {formatDate(
                          tender.endDate
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-500">
                        المكان
                      </span>
                      <div className="font-bold">
                        {tender.location || '-'}
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-500">
                        المخزن
                      </span>
                      <div className="
                        font-bold
                        text-cyan-400
                      ">
                        {tender.warehouseName || '-'}
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-500">
                        المسؤول
                      </span>
                      <div className="font-bold">
                        {tender.responsiblePerson || '-'}
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-500">
                        هاتف المسؤول
                      </span>
                      <div className="font-bold">
                        {tender.responsiblePhone || '-'}
                      </div>
                    </div>

                  </div>

                  {tender.description && (

                    <div className="
                      bg-black
                      rounded-2xl
                      p-4
                      text-gray-300
                    ">

                      {tender.description}

                    </div>

                  )}

                  {tender.notes && (

                    <div className="
                      bg-black
                      rounded-2xl
                      p-4
                      text-gray-400
                    ">

                      <strong>
                        ملاحظات:
                      </strong>

                      {' '}

                      {tender.notes}

                    </div>

                  )}

                  {/* SAVED DOCUMENTS */}

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
                          file => (

                            <div
                              key={file.id}
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

                                <div className="min-w-0">

                                  <div className="
                                    font-bold
                                    break-all
                                  ">

                                    {file.name}

                                  </div>

                                  <div className="
                                    text-sm
                                    text-gray-500
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

                                <a
                                  href={
                                    file.dataUrl
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
                                    file.dataUrl
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

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeTenderFile(
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
                        )}

                      </div>

                    )}

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(
                        tender.id
                      )
                    }
                    className="
                      w-full
                      bg-red-600
                      hover:bg-red-500
                      py-4
                      rounded-2xl
                      font-black
                    "
                  >

                    حذف المناقصة

                  </button>

                </div>

              )

            }
          )}

        </div>

      )}

    </div>

  )

}