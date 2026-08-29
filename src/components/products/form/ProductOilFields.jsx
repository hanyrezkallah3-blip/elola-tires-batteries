import React from 'react'


// ======================================================
// EL OLA ERP
// Product Oil Fields
// ======================================================

export default function ProductOilFields({
  form,
  setForm
}) {


  // ====================================================
  // NORMALIZE TYPE
  // ====================================================

  const normalizedType =
    String(
      form?.type ?? ''
    )
      .trim()
      .toLowerCase()


  // ====================================================
  // IS OIL
  // ====================================================

  const isOil =
    [

      'oil',
      'oils',
      'زيت',
      'زيوت'

    ].includes(
      normalizedType
    )


  // ====================================================
  // UPDATE
  // ====================================================

  const update = (
    key,
    value
  ) => {

    setForm(
      prev => ({

        ...prev,

        oil: {

          ...(prev?.oil || {}),

          [key]:
            value

        }

      })
    )

  }


  // ====================================================
  // NOT OIL
  // ====================================================

  if (
    !isOil
  ) {

    return null

  }


  // ====================================================
  // RENDER
  // ====================================================

  return (

    <div
      className="
        bg-slate-900
        border
        border-slate-700
        rounded-3xl
        p-6
        space-y-6
      "
    >

      <h3
        className="
          text-2xl
          font-black
          text-yellow-400
        "
      >

        بيانات الزيت

      </h3>


      <div
        className="
          grid
          md:grid-cols-2
          gap-5
        "
      >

        {

          [

            [
              'viscosity',
              'اللزوجة',
              'مثال: 5W-30'
            ],

            [
              'api',
              'API',
              'مثال: SN / SP'
            ],

            [
              'acea',
              'ACEA',
              'مثال: A3/B4'
            ],

            [
              'volume',
              'الحجم',
              'مثال: 4 لتر'
            ]

          ].map(
            ([
              key,
              label,
              placeholder
            ]) => (

              <div
                key={key}
              >

                <label
                  className="
                    block
                    mb-2
                    font-black
                    text-white
                  "
                >

                  {label}

                  {

                    key ===
                    'viscosity' && (

                      <span
                        className="
                          text-yellow-400
                          mr-2
                        "
                      >

                        *

                      </span>

                    )

                  }

                </label>


                <input

                  type="text"

                  value={
                    form?.oil?.[key] ??
                    ''
                  }

                  onChange={
                    event => {

                      update(

                        key,

                        event.target.value

                      )

                    }
                  }

                  placeholder={
                    placeholder
                  }

                  className="
                    w-full
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

              </div>

            )
          )

        }

      </div>


      {/* ==================================================
          VISIBILITY CONFIRMATION
      ================================================== */}

      <div
        className="
          rounded-2xl
          bg-slate-800
          border
          border-slate-700
          p-4
          text-gray-300
        "
      >

        <div
          className="
            font-black
            text-white
            mb-1
          "
        >

          بيانات البحث

        </div>


        <div
          className="text-sm"
        >

          سيتم استخدام اللزوجة في البحث عن الزيت.

        </div>

      </div>

    </div>

  )

}