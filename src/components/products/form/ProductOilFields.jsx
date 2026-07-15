import React from 'react'

export default function ProductOilFields({
  form,
  setForm
}) {


  const update = (key, value) => {

    setForm(prev => ({

      ...prev,

      oil: {

        ...prev.oil,

        [key]: value

      }

    }))

  }


  if (
    form.type !== 'oil'
  )
    return null


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

        بيانات الزيت

      </h3>


      <div className="
        grid
        md:grid-cols-2
        gap-5
      ">


        {
          [

            ['viscosity','اللزوجة'],

            ['api','API'],

            ['acea','ACEA'],

            ['volume','الحجم']

          ].map(([key,label]) => (

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
                  form.oil?.[key] || ''
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
                  font-bold
                "

              />


            </div>

          ))

        }


      </div>


    </div>

  )

}