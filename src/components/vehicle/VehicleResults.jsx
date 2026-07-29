// ======================================================
// EL OLA ERP
// Vehicle Results
// ======================================================

import VehicleResultSection
from './VehicleResultSection'

export default function VehicleResults({

  result

}) {

  if (!result)

    return null

  return (

    <div

      className="

        mt-10

        space-y-10

      "

    >

      <VehicleResultSection

        icon="🛞"

        title="الإطارات المناسبة"

        products={

          result.tires || []

        }

      />

      <VehicleResultSection

        icon="🔋"

        title="البطاريات المناسبة"

        products={

          result.batteries || []

        }

      />

      <VehicleResultSection

        icon="🛢️"

        title="الزيوت المناسبة"

        products={

          result.oils || []

        }

      />

    </div>

  )

}