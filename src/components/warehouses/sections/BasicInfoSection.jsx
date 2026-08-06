import { useMemo } from 'react'

import { loadCategories } from "../../../store/masterData/categories/categoryService";
import { loadBrands } from "../../../store/masterData/brands/brandService";

export default function BasicInfoSection({

  form,

  updateField

}) {

  const categories = useMemo(

    () =>

      loadCategories(),

    []

  )

  const brands = useMemo(

    () =>

      loadBrands(),

    []

  )

  return (

    <div
      className="
        bg-slate-900
        rounded-3xl
        p-6
        border
        border-slate-700
      "
    >

      <h2
        className="
          text-2xl
          font-black
          text-yellow-400
          mb-6
        "
      >

        البيانات الأساسية

      </h2>

      <div
        className="
          grid
          md:grid-cols-2
          xl:grid-cols-3
          gap-5
        "
      >

        <div>

          <label className="block mb-2 font-bold">

            اسم المنتج

          </label>

          <input

            value={form.name}

            onChange={(e)=>

              updateField(

                'name',

                e.target.value

              )

            }

            className="
              w-full
              p-4
              rounded-2xl
              bg-slate-800
              text-white
            "

          />

        </div>

        <div>

          <label className="block mb-2 font-bold">

            الاسم المختصر

          </label>

          <input

            value={form.shortName}

            onChange={(e)=>

              updateField(

                'shortName',

                e.target.value

              )

            }

            className="
              w-full
              p-4
              rounded-2xl
              bg-slate-800
              text-white
            "

          />

        </div>

        <div>

          <label className="block mb-2 font-bold">

            الفئة

          </label>

          <select

            value={form.category}

            onChange={(e)=>

              updateField(

                'category',

                e.target.value

              )

            }

            className="
              w-full
              p-4
              rounded-2xl
              bg-slate-800
              text-white
            "

          >

            <option value="">

              اختر التصنيف

            </option>

            {

              categories.map(category => (

                <option

                  key={category.id}

                  value={category.id}

                >

                  {category.name}

                </option>

              ))

            }

          </select>

        </div>

        <div>

          <label className="block mb-2 font-bold">

            نوع المنتج

          </label>

          <select

            value={form.type}

            onChange={(e)=>

              updateField(

                'type',

                e.target.value

              )

            }

            className="
              w-full
              p-4
              rounded-2xl
              bg-slate-800
              text-white
            "

          >

            <option value="">اختر النوع</option>
            <option value="tire">إطار</option>
            <option value="battery">بطارية</option>
            <option value="oil">زيت</option>
            <option value="spare-part">قطعة غيار</option>
            <option value="service">خدمة</option>

          </select>

        </div>

        <div>

          <label className="block mb-2 font-bold">

            العلامة التجارية

          </label>

          <select

            value={form.brand}

            onChange={(e)=>

              updateField(

                'brand',

                e.target.value

              )

            }

            className="
              w-full
              p-4
              rounded-2xl
              bg-slate-800
              text-white
            "

          >

            <option value="">

              اختر العلامة التجارية

            </option>

            {

              brands.map(brand => (

                <option

                  key={brand.id}

                  value={brand.id}

                >

                  {brand.name}

                </option>

              ))

            }

          </select>

        </div>

        <div>

          <label className="block mb-2 font-bold">

            الموديل

          </label>

          <input

            value={form.model}

            onChange={(e)=>

              updateField(

                'model',

                e.target.value

              )

            }

            className="
              w-full
              p-4
              rounded-2xl
              bg-slate-800
              text-white
            "

          />

        </div>

      </div>

    </div>

  )

}