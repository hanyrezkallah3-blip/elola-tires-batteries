export default function ProductSubmitButton({

  onSubmit

}) {

  return (

    <button

      type="button"

      onClick={onSubmit}

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

  )

}