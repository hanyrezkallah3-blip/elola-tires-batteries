export default function SystemCard({

  title,

  description,

  color = 'yellow',

  onClick

}) {

  return (

    <button

      type="button"

      onClick={onClick}

      className={`
        w-full
        text-right
        rounded-3xl
        border
        p-6
        transition-all
        hover:scale-[1.02]
        ${
          color === 'red'
            ? 'bg-red-950 border-red-700 hover:border-red-500'
            : color === 'green'
            ? 'bg-green-950 border-green-700 hover:border-green-500'
            : color === 'blue'
            ? 'bg-blue-950 border-blue-700 hover:border-blue-500'
            : 'bg-slate-900 border-slate-700 hover:border-yellow-500'
        }
      `}

    >

      <h2 className="text-2xl font-black mb-3">

        {title}

      </h2>

      <p className="text-gray-300">

        {description}

      </p>

    </button>

  )

}