import { useMemo } from 'react'
import SmartInput from "../../common/SmartInput";

import { loadCategories } from "../../../store/masterData/categories/categoryService";
import { loadBrands } from "../../../store/masterData/brands/brandService";
import { loadProductTypes } from "../../../store/masterData/productTypes/productTypeService";

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

  const productTypes = useMemo(

    () =>

      loadProductTypes(),

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

        <SmartInput

          label="الفئة"

          value={form.category}

          options={categories}

          placeholder="اختر أو اكتب الفئة"

          onChange={(value)=>

            updateField(

              'category',

              value

            )

          }

        />

        <SmartInput

          label="نوع المنتج"

          value={form.type}

          options={productTypes}

          placeholder="اختر أو اكتب نوع المنتج"

          onChange={(value)=>

            updateField(

              'type',

              value

            )

          }

        />

        <SmartInput

          label="العلامة التجارية"

          value={form.brand}

          options={brands}

          placeholder="اختر أو اكتب العلامة التجارية"

          onChange={(value)=>

            updateField(

              'brand',

              value

            )

          }

        />

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