import ProductImageUpload
  from './ProductImageUpload'

export default function ProductMediaSection({

  form,

  setForm

}) {

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

        صور المنتج

      </h3>

      <ProductImageUpload

        form={form}

        setForm={setForm}

      />

      {

        Array.isArray(form.images) &&

        form.images.length > 0 &&

        (

          <div

            className="
              grid
              grid-cols-2
              md:grid-cols-4
              gap-4
              mt-4
            "

          >

            {

              form.images.map(

                (image, index) => (

                  <img

                    key={index}

                    src={image}

                    alt={`product-${index}`}

                    className="
                      w-full
                      h-40
                      rounded-2xl
                      object-cover
                      border
                      border-slate-700
                    "

                  />

                )

              )

            }

          </div>

        )

      }

    </div>

  )

}