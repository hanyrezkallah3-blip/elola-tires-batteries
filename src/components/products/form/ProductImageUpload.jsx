import React, { useCallback } from 'react'
import { uploadImageToCloudinary } from '../../../lib/cloudinaryMedia'

export default function ProductImageUpload({
  form,
  setForm
}) {

  const handleImage =
    useCallback(async (e)=>{

      const file =
        e.target.files?.[0]

      if(!file)
        return

      try {

        const imageUrl =
          await uploadImageToCloudinary(
            file,
            'product'
          )

        setForm(prev=>({

          ...prev,

          image:
            imageUrl,

          images:[
            imageUrl
          ]

        }))

      } catch(error) {

        console.error(
          '[ProductImageUpload] Cloudinary upload failed:',
          error
        )

        alert(
          'فشل رفع صورة المنتج. حاول مرة أخرى.'
        )

      }

    },[setForm])

  return (

    <div className="
      bg-slate-900
      border
      border-slate-700
      rounded-3xl
      p-6
    ">

      <h3 className="
        text-2xl
        font-black
        text-yellow-400
        mb-5
      ">

        صورة المنتج

      </h3>

      <input

        type="file"

        accept="image/*"

        onChange={handleImage}

        className="
          mb-5
          w-full
        "

      />

      {

        form.image && (

          <img

            src={form.image}

            alt="product"

            className="
              w-full
              h-72
              object-cover
              rounded-3xl
            "

          />

        )

      }

    </div>

  )

}