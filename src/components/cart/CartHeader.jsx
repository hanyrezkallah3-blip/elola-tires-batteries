// ======================================================
// Elola ERP Enterprise
// Cart Header
// ======================================================

export default function CartHeader({

  onClose

}) {

  return (

    <div className="flex justify-between mb-6">

      <h2 className="text-3xl font-bold text-yellow-400">

        سلة المشتريات

      </h2>

      <button

        onClick={onClose}

        className="bg-red-600 px-3 py-2 rounded"

      >

        ✕

      </button>

    </div>

  )

}