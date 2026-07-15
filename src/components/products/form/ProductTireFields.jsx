import React from 'react'

export default function ProductTireFields({
  form,
  setForm
}) {

  if (form.type !== 'tire')
    return null

  const update = (key, value) => {

    setForm(prev => ({

      ...prev,

      tire: {

        ...prev.tire,

        [key]: value

      }

    }))

  }

  return (

    <div className="
      bg-slate-900
      border
      border-slate-700
      rounded-3xl
      p-6
      space-y-6
    ">

      <h3 className="
        text-2xl
        font-black
        text-yellow-400
      ">

        بيانات الإطار

      </h3>

      <div className="
        grid
        md:grid-cols-3
        gap-5
      ">

        {

          [

            ['width','العرض'],

            ['height','الارتفاع'],

            ['rim','الجنط'],

            ['loadIndex','Load Index'],

            ['speedRating','Speed Rating'],

            ['season','الموسم']

          ].map(([key,label])=>(

            <div key={key}>

              <label className="
                block
                mb-2
                font-black
              ">

                {label}

              </label>

              <input

                value={
                  form.tire?.[key] || ''
                }

                onChange={(e)=>

                  update(
                    key,
                    e.target.value
                  )

                }

                className="
                  w-full
                  p-4
                  rounded-2xl
                  bg-white
                  text-black
                "

              />

            </div>

          ))

        }

      </div>

    </div>

  )

}