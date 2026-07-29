import React from 'react'

export default function VehicleSearchForm({

  vehicleTypes = [],
  brands = [],
  models = [],
  years = [],

  form,
  setForm,

  onSearch

}) {

  const update = (key, value) => {

    const next = {

      ...form,

      [key]: value

    }

    // ====================================================
    // RESET DEPENDENT FIELDS
    // ====================================================

    if (key === 'vehicleType') {

      next.brand = ''
      next.model = ''
      next.year = ''

    }

    if (key === 'brand') {

      next.model = ''
      next.year = ''

    }

    if (key === 'model') {

      next.year = ''

    }

    setForm(next)

  }

  return (

    <div className="grid lg:grid-cols-5 gap-4">

      <select

        value={form.vehicleType || ''}

        onChange={(e) => update('vehicleType', e.target.value)}

        className="p-4 rounded-2xl bg-slate-900 border border-slate-700"

      >

        <option value="">نوع المركبة</option>

        {

          vehicleTypes.map(item => (

            <option

              key={item.id}

              value={item.id}

            >

              {item.name}

            </option>

          ))

        }

      </select>

      <select

        value={form.brand || ''}

        onChange={(e) => update('brand', e.target.value)}

        className="p-4 rounded-2xl bg-slate-900 border border-slate-700"

      >

        <option value="">الشركة المصنعة</option>

        {

          brands.map(item => (

            <option

              key={item.id}

              value={item.id}

            >

              {item.name}

            </option>

          ))

        }

      </select>

      <select

        value={form.model || ''}

        onChange={(e) => update('model', e.target.value)}

        className="p-4 rounded-2xl bg-slate-900 border border-slate-700"

      >

        <option value="">الموديل</option>

        {

          models.map(item => (

            <option

              key={item}

              value={item}

            >

              {item}

            </option>

          ))

        }

      </select>

      <select

        value={form.year || ''}

        onChange={(e) => update('year', e.target.value)}

        className="p-4 rounded-2xl bg-slate-900 border border-slate-700"

      >

        <option value="">سنة الصنع</option>

        {

          years.map(item => (

            <option

              key={item}

              value={item}

            >

              {item}

            </option>

          ))

        }

      </select>

      <button

        type="button"

        onClick={onSearch}

        className="rounded-2xl bg-yellow-500 hover:bg-yellow-600 text-black font-black"

      >

        🔍 بحث

      </button>

    </div>

  )

}