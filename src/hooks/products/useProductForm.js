import {
  useCallback,
  useState
} from 'react'


const INITIAL_PRODUCT = {

  name: '',

  type: 'tire',

  category: 'tire',

  brand: '',

  model: '',

  sku: '',

  barcode: '',

  code: '',

  keywords: '',

  description: '',

  vehicleCompatibility: '',


  purchasePrice: 0,

  salePrice: 0,

  discountPrice: 0,

  cost: 0,


  warehouseId: '',


  tire: {

    width: '',

    height: '',

    rim: '',

    loadIndex: '',

    speedRating: '',

    season: '',

    size: ''

  },


  battery: {

    capacity: '',

    cca: '',

    voltage: '',

    polarity: '',

    length: '',

    width: '',

    height: '',

    model: ''

  },


  oil: {

    viscosity: '',

    api: '',

    acea: '',

    volume: ''

  },


  compatibleVehicles: [],

  compatibleSizes: [],


  image: '',

  images: [],


  active: true,

  createdAt: ''

}


export default function useProductForm() {

  const [

    form,

    setForm

  ] = useState(

    INITIAL_PRODUCT

  )


  const resetForm = useCallback(() => {

    setForm(

      INITIAL_PRODUCT

    )

  }, [])


  return {

    form,

    setForm,

    resetForm

  }

}