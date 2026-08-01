import {
  useEffect
} from 'react'


import {
  generateTireAIProfile
} from '../../../ai/TireIntelligenceEngine'

import TireVehicleSelector

  from './tire/TireVehicleSelector'

import TireBasicInputs
  from './tire/TireBasicInputs'


import TireAIResult
  from './tire/TireAIResult'


import TireVehicleCompatibility
  from './tire/TireVehicleCompatibility'


import TireCompatibleSizes
  from './tire/TireCompatibleSizes'



export default function ProductTireSection({

  form,

  setForm

}) {



  const updateTire = (

    key,

    value

  ) => {


    setForm(prev => ({

      ...prev,


      tire: {

        ...(prev.tire || {}),

        [key]: value

      }

    }))

  }



  useEffect(() => {


    if (

      !form.tire?.width ||

      !form.tire?.height ||

      !form.tire?.rim ||

      !form.tire?.loadIndex ||

      !form.tire?.speedRating ||

      !form.tire?.season

    ) {

      return

    }
        const aiResult =

      generateTireAIProfile({

        width:

          form.tire.width,


        profile:

          form.tire.height,


        rim:

          form.tire.rim,


        loadIndex:

          form.tire.loadIndex,


        speedRating:

          form.tire.speedRating,


        season:

          form.tire.season

      })



    setForm(prev => ({

      ...prev,


      tireAI:

        aiResult.tireDetails,


      compatibleVehicles:

        aiResult.compatibleVehicles,


      compatibleSizes:

        aiResult.compatibleSizes

    }))



  }, [

    form.tire?.width,

    form.tire?.height,

    form.tire?.rim,

    form.tire?.loadIndex,

    form.tire?.speedRating,

    form.tire?.season

  ])
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

        بيانات الإطار

      </h3>



      <TireBasicInputs

        form={form}

        updateTire={updateTire}

      />



      <TireAIResult

        tireAI={form.tireAI}

      />



      <TireVehicleCompatibility

        compatibleVehicles={

          form.compatibleVehicles

        }

      />

    <TireVehicleSelector

  compatibleVehicles={

    form.compatibleVehicles

  }

/>

      <TireCompatibleSizes

        compatibleSizes={

          form.compatibleSizes

        }

      />


    </div>

  )

}