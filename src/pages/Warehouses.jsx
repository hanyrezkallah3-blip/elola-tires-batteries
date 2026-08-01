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


  const submit = () => {


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

          إدارة الفروع والمخازن والكميات

        </p>


      </div>



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

          onChange={(e) =>

            setForm({

              ...form,

              name:

                e.target.value

            })

          }

          placeholder="اسم المخزن"

          className="
            w-full
            p-4
            rounded-2xl
            text-black
            font-bold
          "

        />



        <select

          value={
            form.type
          }

          onChange={(e) =>

            setForm({

              ...form,

              type:

                e.target.value

            })

          }

          className="
            w-full
            p-4
            rounded-2xl
            text-black
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

          onChange={(e) =>

            setForm({

              ...form,

              location:

                e.target.value

            })

          }

          placeholder="الموقع"

          className="
            w-full
            p-4
            rounded-2xl
            text-black
            font-bold
          "

        />



        <input

          value={
            form.manager
          }

          onChange={(e) =>

            setForm({

              ...form,

              manager:

                e.target.value

            })

          }

          placeholder="المسؤول"

          className="
            w-full
            p-4
            rounded-2xl
            text-black
            font-bold
          "

        />



        <button

          onClick={submit}

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

          onChange={(e) =>

            setSearch(

              e.target.value

            )

          }

          placeholder="
            🔍 البحث عن مخزن
          "

          className="
            w-full
            p-4
            rounded-2xl
            text-black
            font-bold
          "

        />

      </div>



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

            warehouse => (

              <div

                key={
                  warehouse.id
                }

                className="
                  bg-slate-900
                  border
                  border-slate-700
                  rounded-3xl
                  p-6
                  space-y-4
                "

              >

                <h3

                  className="
                    text-3xl
                    font-black
                    text-yellow-400
                  "

                >

                  {
                    warehouse.name
                  }

                </h3>



                <p>

                  النوع:

                  {

                    warehouse.type

                  }

                </p>



                <p>

                  الموقع:

                  {

                    warehouse.location ||

                    'غير محدد'

                  }

                </p>



                <p>

                  المسؤول:

                  {

                    warehouse.manager ||

                    'غير محدد'

                  }

                </p>



                <div

                  className="
                    flex
                    gap-3
                  "

                >

                  <button

                    onClick={() =>

                      navigate(

                        `/warehouses/${warehouse.id}`

                      )

                    }

                    className="
                      flex-1
                      bg-blue-600
                      p-3
                      rounded-xl
                      font-black
                    "

                  >

                    التفاصيل

                  </button>



                  <button

                    onClick={() =>

                      deleteWarehouse(

                        warehouse.id

                      )

                    }

                    className="
                      flex-1
                      bg-red-600
                      p-3
                      rounded-xl
                      font-black
                    "

                  >

                    حذف

                  </button>


                </div>


              </div>

            )

          )

        }


      </div>


    </div>

  )

}