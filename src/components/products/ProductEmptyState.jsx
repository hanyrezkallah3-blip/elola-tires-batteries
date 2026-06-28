export default function ProductEmptyState() {

  return (

    <div className="
      bg-slate-900
      border
      border-slate-700
      rounded-[40px]
      p-16
      text-center
      shadow-2xl
    ">

      {/* ICON */}

      <div className="
        text-8xl
        mb-8
      ">

        📦

      </div>

      {/* TITLE */}

      <h2 className="
        text-4xl
        font-black
        mb-6
        text-yellow-400
      ">

        لا توجد منتجات

      </h2>

      {/* DESCRIPTION */}

      <p className="
        text-xl
        text-gray-400
        leading-loose
        max-w-2xl
        mx-auto
      ">

        لم يتم العثور على أي منتجات حالياً.
        يمكنك إضافة منتجات جديدة لتظهر هنا
        داخل لوحة التحكم.

      </p>

    </div>

  )

}