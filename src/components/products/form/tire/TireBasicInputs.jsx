export default function TireBasicInputs({

  form,

  updateTire

}) {


  return (

    <div

      className="
        grid
        md:grid-cols-3
        gap-4
      "

    >


      <input

        value={
          form.tire?.width || ''
        }

        onChange={(e) =>

          updateTire(

            'width',

            e.target.value

          )

        }

        placeholder="العرض مثال 205"

        className="
          p-4
          rounded-2xl
          bg-white
          text-black
          font-bold
        "

      />



      <input

        value={
          form.tire?.height || ''
        }

        onChange={(e) =>

          updateTire(

            'height',

            e.target.value

          )

        }

        placeholder="الارتفاع مثال 55"

        className="
          p-4
          rounded-2xl
          bg-white
          text-black
          font-bold
        "

      />
            <input

        value={
          form.tire?.rim || ''
        }

        onChange={(e) =>

          updateTire(

            'rim',

            e.target.value

          )

        }

        placeholder="الجنط مثال 16"

        className="
          p-4
          rounded-2xl
          bg-white
          text-black
          font-bold
        "

      />



      <input

        value={
          form.tire?.loadIndex || ''
        }

        onChange={(e) =>

          updateTire(

            'loadIndex',

            e.target.value

          )

        }

        placeholder="Load Index"

        className="
          p-4
          rounded-2xl
          bg-white
          text-black
          font-bold
        "

      />



      <input

        value={
          form.tire?.speedRating || ''
        }

        onChange={(e) =>

          updateTire(

            'speedRating',

            e.target.value

          )

        }

        placeholder="Speed Rating"

        className="
          p-4
          rounded-2xl
          bg-white
          text-black
          font-bold
        "

      />
            <select

        value={
          form.tire?.season || ''
        }

        onChange={(e) =>

          updateTire(

            'season',

            e.target.value

          )

        }

        className="
          p-4
          rounded-2xl
          bg-white
          text-black
          font-bold
        "

      >

        <option value="">

          الموسم

        </option>


        <option value="Summer">

          صيفي

        </option>


        <option value="Winter">

          شتوي

        </option>


        <option value="All Season">

          كل المواسم

        </option>


      </select>


    </div>

  )

}