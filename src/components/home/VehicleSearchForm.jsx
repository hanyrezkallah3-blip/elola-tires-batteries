// ======================================================
// EL OLA ERP
// Vehicle Search Form
//
// AI-FIRST VEHICLE SEARCH
// ======================================================

import React from 'react'


export default function VehicleSearchForm({

  form = {},
  setForm,

  onSearch

}) {


  // ====================================================
  // AI QUERY
  // ====================================================

  const vehicleQuery =
    form?.vehicleQuery || ''


  // ====================================================
  // UPDATE AI QUERY
  // ====================================================

  const updateQuery = value => {

    if (
      typeof setForm !== 'function'
    ) {

      return

    }


    setForm({

      ...form,

      // ------------------------------------------------
      // AI vehicle search uses vehicleQuery.
      //
      // Do NOT put the complete sentence in model.
      // The useVehicleSearch hook detects vehicleQuery
      // and sends it through the AI vehicle-search path.
      // ------------------------------------------------

      vehicleType: '',

      brand: '',

      model: '',

      year: '',

      vehicleQuery: value

    })

  }


  // ====================================================
  // SEARCH
  // ====================================================

  const submitSearch = () => {

    const query =
      String(
        vehicleQuery ?? ''
      ).trim()


    if (!query) {

      return

    }


    if (
      typeof onSearch === 'function'
    ) {

      onSearch()

    }

  }


  // ====================================================
  // KEYBOARD SEARCH
  // ====================================================

  const handleKeyDown = event => {

    if (
      event.key !== 'Enter'
    ) {

      return

    }


    event.preventDefault()

    submitSearch()

  }


  // ====================================================
  // RENDER
  // ====================================================

  return (

    <div
      className="
        w-full
        max-w-5xl
        mx-auto
      "
    >

      {/* ==================================================
          AI SEARCH INTRO
      ================================================== */}

      <div
        className="
          text-center
          mb-6
        "
      >

        <div
          className="
            inline-flex
            items-center
            justify-center
            rounded-full
            bg-yellow-500/10
            border
            border-yellow-500/30
            px-5
            py-2
            text-yellow-400
            font-black
            text-sm
            mb-4
          "
        >

          🤖 البحث بالذكاء الاصطناعي

        </div>


        <h3
          className="
            text-2xl
            md:text-3xl
            font-black
            text-white
          "
        >

          اكتب بيانات مركبتك

        </h3>


        <p
          className="
            text-gray-400
            mt-3
            text-base
            md:text-lg
          "
        >

          اكتب نوع المركبة والماركة والموديل والسنة
          بأي طريقة طبيعية، والذكاء الاصطناعي سيحدد المركبة المناسبة.

        </p>

      </div>


      {/* ==================================================
          AI INPUT
      ================================================== */}

      <div
        className="
          space-y-4
        "
      >

        <label
          htmlFor="vehicle-ai-search"
          className="
            block
            text-white
            font-black
            text-lg
            text-right
          "
        >

          بيانات المركبة

        </label>


        <input
          id="vehicle-ai-search"
          type="text"
          value={vehicleQuery}
          onChange={event =>
            updateQuery(
              event.target.value
            )
          }
          onKeyDown={
            handleKeyDown
          }
          placeholder="
            مثال: تويوتا كورولا 2020
          "
          autoComplete="off"
          dir="auto"
          className="
            w-full
            p-5
            md:p-6
            rounded-2xl
            bg-slate-950
            border-2
            border-slate-700
            hover:border-slate-600
            focus:border-yellow-400
            text-white
            text-lg
            md:text-xl
            font-bold
            outline-none
            transition
            placeholder:text-gray-500
          "
        />


        {/* ==================================================
            EXAMPLES
        ================================================== */}

        <div
          className="
            text-gray-400
            text-sm
            md:text-base
            text-center
            leading-8
          "
        >

          أمثلة:

          <span
            className="
              text-yellow-400
              font-bold
              mx-1
            "
          >
            تويوتا كورولا 2020
          </span>

          أو

          <span
            className="
              text-yellow-400
              font-bold
              mx-1
            "
          >
            BMW X5 2019
          </span>

          أو

          <span
            className="
              text-yellow-400
              font-bold
              mx-1
            "
          >
            شيفروليه أوبترا 2021
          </span>

        </div>


        {/* ==================================================
            SEARCH BUTTON
        ================================================== */}

        <button
          type="button"
          onClick={
            submitSearch
          }
          disabled={
            !String(
              vehicleQuery ?? ''
            ).trim()
          }
          className="
            w-full
            rounded-2xl
            bg-yellow-500
            hover:bg-yellow-400
            disabled:bg-slate-700
            disabled:text-gray-500
            disabled:cursor-not-allowed
            text-black
            py-5
            md:py-6
            font-black
            text-xl
            transition
            shadow-lg
          "
        >

          🤖 ابحث عن مركبتي بالذكاء الاصطناعي

        </button>


        {/* ==================================================
            AI EXPLANATION
        ================================================== */}

        <div
          className="
            rounded-2xl
            bg-slate-800/60
            border
            border-slate-700
            p-4
            text-center
          "
        >

          <div
            className="
              text-yellow-400
              font-black
              mb-1
            "
          >

            لا تحتاج إلى اختيار الماركة أو الموديل يدويًا

          </div>


          <div
            className="
              text-gray-400
              text-sm
              leading-7
            "
          >

            اكتب معلومات المركبة فقط، وسيقوم النظام
            بتحليلها وتحديد المركبة ثم البحث عن
            الإطارات والبطاريات والزيوت المتوافقة معها.

          </div>

        </div>

      </div>

    </div>

  )

}