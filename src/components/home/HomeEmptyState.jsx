export default function HomeEmptyState({

  title,

  description

}) {

  return (

    <div
      className="
        bg-slate-900
        border
        border-dashed
        border-slate-700
        rounded-3xl
        p-12
        text-center
      "
    >

      <h3
        className="
          text-2xl
          font-black
          text-yellow-400
          mb-4
        "
      >

        {title}

      </h3>

      <p
        className="
          text-gray-300
          leading-8
        "
      >

        {description}

      </p>

    </div>

  )

}