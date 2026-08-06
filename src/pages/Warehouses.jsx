import {
  useMemo,
  useState
} from 'react'

import {
  useWarehouseStore
} from '../store/warehouseStore'


import {
  useNavigate
} from 'react-router-dom'

import WarehouseProductForm from '../components/warehouses/WarehouseProductForm'


export default function Warehouses() {


  const navigate =
    useNavigate()


  const warehouses =
    useWarehouseStore(
      state => state.warehouses || []
    )


  const addWarehouse =
    useWarehouseStore(
      state => state.addWarehouse
    )


  const deleteWarehouse =
    useWarehouseStore(
      state => state.deleteWarehouse
    )


  const addProductToWarehouse =
    useWarehouseStore(
      state => state.addProductToWarehouse
    )


  const [search, setSearch] =
    useState('')


  const [form, setForm] =
    useState({

      name: '',

      type: 'main',

      location: '',

      phone: '',

      manager: ''

    })


  const [productForm, setProductForm] =
  useState({

    // =====================
    // المخزن
    // =====================

    warehouseId: '',

    // =====================
    // البيانات الأساسية
    // =====================

    name: '',
    image: '',
    description: '',

    type: 'tire',

    category: '',
    brand: '',
    model: '',

    sku: '',
    barcode: '',

    // =====================
    // الكميات
    // =====================

    quantity: 0,

    minimumStock: 0,
    maximumStock: 0,
    reorderPoint: 0,

    unit: 'piece',

    // =====================
    // الأسعار
    // =====================

    purchasePrice: 0,
    salePrice: 0,
    wholesalePrice: 0,

    // =====================
    // التكاليف
    // =====================

    shippingCost: 0,
    customsCost: 0,
    transportCost: 0,
    otherCosts: 0,

    // =====================
    // المورد
    // =====================

    supplierId: '',
    supplierName: '',

    // =====================
    // بلد المنشأ
    // =====================

    countryOfOrigin: '',

    // =====================
    // الموقع داخل المخزن
    // =====================

    location: '',
    shelf: '',
    rack: '',
    bin: '',

    // =====================
    // الدفعات
    // =====================

    batchNumber: '',
    lotNumber: '',

    // =====================
    // التواريخ
    // =====================

    productionDate: '',
    expiryDate: '',

    warranty: '',

    // =====================
    // الأرقام التسلسلية
    // =====================

    serialNumbers: [],

    // =====================
    // المواصفات
    // =====================

    specifications: {},

    // =====================
    // الملاحظات
    // =====================

    notes: '',

    // =====================
    // النشر
    // =====================

    publishToHome: true,
    publishToProducts: true,
    publishToOffers: false,

    featured: false,
    hidden: false

  })


  const filteredWarehouses =
    useMemo(() => {


      if (!search.trim())

        return warehouses



      return warehouses.filter(

        warehouse =>

          warehouse.name

            .toLowerCase()

            .includes(

              search.toLowerCase()

            )

      )


    }, [

      warehouses,

      search

    ])



  const submitWarehouse = () => {


    if (!form.name.trim())

      return


    addWarehouse(form)


    setForm({

      name: '',

      type: 'main',

      location: '',

      phone: '',

      manager: ''

    })


  }



  const submitProduct = () => {


    if (

      !productForm.warehouseId ||

      !productForm.productName.trim()

    )

      return



    addProductToWarehouse(

  productForm.warehouseId,

  productForm

)


    setProductForm({

      // =====================
    // المخزن
    // =====================

    warehouseId: '',

    // =====================
    // البيانات الأساسية
    // =====================

    name: '',
    image: '',
    description: '',

    type: 'tire',

    category: '',
    brand: '',
    model: '',

    sku: '',
    barcode: '',

    // =====================
    // الكميات
    // =====================

    quantity: 0,

    minimumStock: 0,
    maximumStock: 0,
    reorderPoint: 0,

    unit: 'piece',

    // =====================
    // الأسعار
    // =====================

    purchasePrice: 0,
    salePrice: 0,
    wholesalePrice: 0,

    // =====================
    // التكاليف
    // =====================

    shippingCost: 0,
    customsCost: 0,
    transportCost: 0,
    otherCosts: 0,

    // =====================
    // المورد
    // =====================

    supplierId: '',
    supplierName: '',

    // =====================
    // بلد المنشأ
    // =====================

    countryOfOrigin: '',

    // =====================
    // الموقع داخل المخزن
    // =====================

    location: '',
    shelf: '',
    rack: '',
    bin: '',

    // =====================
    // الدفعات
    // =====================

    batchNumber: '',
    lotNumber: '',

    // =====================
    // التواريخ
    // =====================

    productionDate: '',
    expiryDate: '',

    warranty: '',

    // =====================
    // الأرقام التسلسلية
    // =====================

    serialNumbers: [],

    // =====================
    // المواصفات
    // =====================

    specifications: {},

    // =====================
    // الملاحظات
    // =====================

    notes: '',

    // =====================
    // النشر
    // =====================

    publishToHome: true,
    publishToProducts: true,
    publishToOffers: false,

    featured: false,
    hidden: false

  })


  }
    return (

    <div

      className="
        min-h-screen
        bg-black
        text-white
        p-6
        lg:p-10
      "

    >


      <div

        className="
          bg-gradient-to-r
          from-blue-950
          via-blue-700
          to-yellow-500
          rounded-[40px]
          p-8
          mb-10
        "

      >

        <h1

          className="
            text-5xl
            font-black
          "

        >

          إدارة المخازن

        </h1>


        <p

          className="
            text-lg
            mt-3
            font-bold
          "

        >

          إدارة المخازن والمنتجات والكميات

        </p>


      </div>




      {/* ======================================
          CREATE WAREHOUSE
      ====================================== */}


      <div

        className="
          bg-slate-900
          rounded-3xl
          p-6
          mb-10
          space-y-5
        "

      >

        <h2

          className="
            text-3xl
            font-black
            text-yellow-400
          "

        >

          إنشاء مخزن جديد

        </h2>



        <input

          value={
            form.name
          }

          onChange={(e)=>

            setForm({

              ...form,

              name:e.target.value

            })

          }

          placeholder="اسم المخزن"

          className="
            w-full
            p-4
            rounded-2xl
            text-white
            font-bold
          "

        />



        <select

          value={
            form.type
          }

          onChange={(e)=>

            setForm({

              ...form,

              type:e.target.value

            })

          }

          className="
            w-full
            p-4
            rounded-2xl
            text-white
            font-bold
          "

        >

          <option value="main">

            مخزن رئيسي

          </option>


          <option value="branch">

            فرع

          </option>


          <option value="showroom">

            معرض

          </option>


          <option value="service">

            مركز خدمة

          </option>


        </select>



        <input

          value={
            form.location
          }

          onChange={(e)=>

            setForm({

              ...form,

              location:e.target.value

            })

          }

          placeholder="الموقع"

          className="
            w-full
            p-4
            rounded-2xl
            text-white
            font-bold
          "

        />



        <input

          value={
            form.phone
          }

          onChange={(e)=>

            setForm({

              ...form,

              phone:e.target.value

            })

          }

          placeholder="رقم الهاتف"

          className="
            w-full
            p-4
            rounded-2xl
            text-white
            font-bold
          "

        />



        <input

          value={
            form.manager
          }

          onChange={(e)=>

            setForm({

              ...form,

              manager:e.target.value

            })

          }

          placeholder="المسؤول"

          className="
            w-full
            p-4
            rounded-2xl
            text-white
            font-bold
          "

        />



        <button

          onClick={submitWarehouse}

          className="
            w-full
            bg-yellow-500
            text-black
            p-4
            rounded-2xl
            font-black
            text-xl
          "

        >

          ➕ إضافة المخزن

        </button>


      </div>




      {/* ======================================
          ADD PRODUCT TO WAREHOUSE
      ====================================== */}

<div
  className="
    bg-slate-900
    rounded-3xl
    p-6
    mb-10
  "
>

  <WarehouseProductForm

  warehouses={warehouses}

  onSubmit={(product) => {

    addProductToWarehouse(

      product.warehouseId,

      product

    )

  }}

  onCancel={() => {}}

/>

</div>
        




      {/* ======================================
          SEARCH
      ====================================== */}

      <div

        className="
          bg-slate-900
          rounded-3xl
          p-6
          mb-10
        "

      >

        <input

          value={search}

          onChange={(e)=>

            setSearch(

              e.target.value

            )

          }

          placeholder="🔍 البحث عن مخزن"

          className="
            w-full
            p-4
            rounded-2xl
            text-white
            font-bold
          "

        />

      </div>




      {/* ======================================
          WAREHOUSES
      ====================================== */}

      <div

        className="
          grid
          md:grid-cols-2
          xl:grid-cols-3
          gap-8
        "

      >

        {

          filteredWarehouses.map(

            warehouse => {

              const totalQuantity =

                (warehouse.products || [])

                  .reduce(

                    (sum, product)=>

                      sum +

                      Number(

                        product.quantity || 0

                      ),

                    0

                  )


              const totalValue =

                (warehouse.products || [])

                  .reduce(

                    (sum, product)=>

                      sum +

                      (

                        Number(product.quantity || 0)

                        *

                        Number(product.purchasePrice || 0)

                      ),

                    0

                  )


              return (

                <div

                  key={warehouse.id}

                  className="
                    bg-slate-900
                    border
                    border-slate-700
                    rounded-3xl
                    p-6
                  "

                >

                  <h3 className="text-3xl font-white text-yellow-400">

                    {warehouse.name}

                  </h3>

                  <div className="mt-4 space-y-2 text-sm">

                    <div>النوع : {warehouse.type}</div>

                    <div>الموقع : {warehouse.location}</div>

                    <div>المسؤول : {warehouse.manager}</div>

                    <div>عدد المنتجات : {(warehouse.products || []).length}</div>

                    <div>إجمالي الكمية : {totalQuantity}</div>

                    <div>قيمة المخزون : {totalValue} ج</div>

                  </div>

                  <div className="mt-6 space-y-3">

                    {

                      (warehouse.products || []).map(product=>(

                        <div

                          key={product.productId}

                          className="
                            bg-slate-800
                            rounded-xl
                            p-3
                            border
                            border-slate-700
                          "

                        >

                          <div className="font-bold">

                            {product.productName}

                          </div>

                          <div className="text-gray-400">

                            الكمية :

                            {product.quantity}

                          </div>

                          <div className="text-green-400">

                            البيع :

                            {product.salePrice} ج

                          </div>

                        </div>

                      ))

                    }

                  </div>

                  <div className="flex gap-3 mt-6">

                    <button

                      onClick={()=>

                        navigate(

                          `/warehouses/${warehouse.id}`

                        )

                      }

                      className="
                        flex-1
                        bg-blue-600
                        p-3
                        rounded-xl
                        font-white
                      "

                    >

                      التفاصيل

                    </button>

                    <button

                      onClick={()=>

                        deleteWarehouse(

                          warehouse.id

                        )

                      }

                      className="
                        flex-1
                        bg-red-600
                        p-3
                        rounded-xl
                        font-white
                      "

                    >

                      حذف

                    </button>

                  </div>

                </div>

              )

            }

          )

        }

      </div>

    </div>

  )

}