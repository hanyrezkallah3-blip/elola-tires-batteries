import ProductBasicSection
  from './form/ProductBasicSection'

import ProductTypeSection
  from './form/ProductTypeSection'

import ProductPricingSection
  from './form/ProductPricingSection'

import ProductWarehouseSection
  from './form/ProductWarehouseSection'

import ProductTireSection
  from './form/ProductTireSection'

import ProductBatterySection
  from './form/ProductBatterySection'

import ProductOilSection
  from './form/ProductOilSection'

import ProductCompatibilitySection
  from './form/ProductCompatibilitySection'

import ProductMediaSection
  from './form/ProductMediaSection'

import ProductSubmitButton
  from './form/ProductSubmitButton'


import {
  useWarehouseStore
} from '../../store/warehouseStore'


import useProductForm
  from '../../hooks/products/useProductForm'


import {
  useCallback
} from 'react'


export default function ProductForm({

  onAddProduct

}) {


  const {

    form,

    setForm,

    resetForm

  } = useProductForm()
    const submit = useCallback(async () => {


    if (!form.name.trim()) {


      alert(

        'اسم المنتج مطلوب'

      )


      return

    }



    if (

      Number(form.salePrice || 0) <= 0

    ) {


      alert(

        'سعر البيع غير صحيح'

      )


      return

    }



    if (!form.warehouseId) {


      alert(

        'اختر المخزن أولاً'

      )


      return

    }



    const quantity =

      Number(

        form.quantity ||

        form.stock ||

        0

      )



    const product = {


      ...form,


      stock: 0,


      sold: 0,


      quantity: 0,


      category:

        form.type,



      keywords:


        [

          form.name,

          form.brand,

          form.model,

          form.sku,

          form.barcode

        ]

        .filter(Boolean)

        .join(' '),



      createdAt:


        new Date()

          .toISOString()

    }



    const createdProduct =
  await onAddProduct(product)



    if (

      quantity > 0 &&

      createdProduct?.id

    ) {


      const {

        addTransaction

      } = useWarehouseStore.getState()



      addTransaction(


        form.warehouseId,


        {


          type: 'in',


          quantity,


          productId:

            createdProduct.id,


          productName:

            createdProduct.name


        }

      )

    }



    resetForm()



    alert(

      'تم إضافة المنتج بنجاح'

    )


  }, [

    form,

    onAddProduct,

    resetForm

  ])
    return (

    <div

      className="
        space-y-8
        mb-12
      "

    >

      <ProductBasicSection

        form={form}

        setForm={setForm}

      />


      <ProductTypeSection

        form={form}

        setForm={setForm}

      />


      <ProductPricingSection

        form={form}

        setForm={setForm}

      />


      <ProductWarehouseSection

        form={form}

        setForm={setForm}

      />


      {

        form.type === 'tire' &&

        (

          <ProductTireSection

            form={form}

            setForm={setForm}

          />

        )

      }



      {

        form.type === 'battery' &&

        (

          <ProductBatterySection

            form={form}

            setForm={setForm}

          />

        )

      }



      {

        form.type === 'oil' &&

        (

          <ProductOilSection

            form={form}

            setForm={setForm}

          />

        )

      }



      <ProductCompatibilitySection

        form={form}

        setForm={setForm}

      />



      <ProductMediaSection

        form={form}

        setForm={setForm}

      />



      <ProductSubmitButton

        onSubmit={submit}

      />


    </div>

  )

}