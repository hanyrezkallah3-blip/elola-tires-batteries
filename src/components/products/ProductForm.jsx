import {
  useCallback,
  useState
} from 'react'

import ProductBasicInfo
  from './form/ProductBasicInfo'

import ProductPricing
  from './form/ProductPricing'

import ProductInventory
  from './form/ProductInventory'

import ProductTireFields
  from './form/ProductTireFields'

import ProductBatteryFields
  from './form/ProductBatteryFields'

import ProductOilFields
  from './form/ProductOilFields'

import ProductImageUpload
  from './form/ProductImageUpload'

import ProductVehicleCompatibility
  from './vehicle/ProductVehicleCompatibility'

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

  quantity: 0,

  minimumStock: 0,

  maximumStock: 0,

  reorderPoint: 0,

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


export default function ProductForm({

  onAddProduct

}) {


  const [form,setForm] =

    useState(INITIAL_PRODUCT)



  const submit = useCallback(()=>{


    if(
      !form.name.trim()
    ){

      alert(
        'اسم المنتج مطلوب'
      )

      return

    }


    if(
      Number(form.salePrice) <= 0
    ){

      alert(
        'سعر البيع غير صحيح'
      )

      return

    }



    const product = {

  ...form,

  category: form.type,

  size:

    form.type === 'tire'

      ? `${form.tire.width}/${form.tire.height}R${form.tire.rim}`

      : '',

  capacity: form.battery.capacity,

  cca: form.battery.cca,

  model:

    form.type === 'battery'

      ? form.battery.model || form.model

      : form.model,

  vehicleCompatibility:

    Array.isArray(form.compatibleVehicles)

      ? form.compatibleVehicles.join(' ')

      : '',

  keywords:

    [
      form.name,
      form.brand,
      form.model,
      form.sku,
      form.barcode,
      form.code,
      form.tire.width,
      form.tire.height,
      form.tire.rim,
      form.battery.capacity,
      form.battery.cca
    ]
      .filter(Boolean)
      .join(' '),


      profit:

        Number(form.salePrice || 0)
        -
        Number(form.purchasePrice || 0),


      profitMargin:

        form.purchasePrice > 0

        ?

        (

          (

            form.salePrice -
            form.purchasePrice

          )

          /

          form.purchasePrice

        )

        * 100

        :

        0,


      createdAt:

        new Date()
        .toISOString()

    }



    onAddProduct(product)



    setForm(
      INITIAL_PRODUCT
    )


    alert(
      'تم إضافة المنتج بنجاح'
    )


  },[
    form,
    onAddProduct
  ])




  return (

    <div className="
      space-y-8
      mb-12
    ">


      <ProductBasicInfo

        form={form}

        setForm={setForm}

      />



      <ProductPricing

        form={form}

        setForm={setForm}

      />



      <ProductInventory

        form={form}

        setForm={setForm}

      />



      <ProductTireFields

        form={form}

        setForm={setForm}

      />



      <ProductBatteryFields

        form={form}

        setForm={setForm}

      />



      <ProductOilFields

        form={form}

        setForm={setForm}

      />

      <ProductVehicleCompatibility

        form={form}

        setForm={setForm}

      />



      <ProductImageUpload

        form={form}

        setForm={setForm}

      />




      <button

        type="button"

        onClick={submit}

        className="
          w-full
          bg-yellow-500
          hover:bg-yellow-600
          text-black
          py-5
          rounded-3xl
          text-2xl
          font-black
          shadow-xl
        "

      >

        ➕ إضافة المنتج

      </button>


    </div>

  )

}