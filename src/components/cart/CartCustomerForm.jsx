// ======================================================
// Elola ERP Enterprise
// Cart Customer Form
// ======================================================

export default function CartCustomerForm({

  customerName,

  setCustomerName,

  phone,

  setPhone,

  address,

  setAddress,

  loading,

  onSubmit

}) {

  return (

    <form

      onSubmit={onSubmit}

      className="space-y-4"

    >

      <input

        value={customerName}

        onChange={(e) =>

          setCustomerName(

            e.target.value

          )

        }

        placeholder="اسم العميل"

        className="w-full p-3 rounded bg-white text-black"

      />

      <input

        value={phone}

        onChange={(e) =>

          setPhone(

            e.target.value

          )

        }

        placeholder="رقم الهاتف"

        className="w-full p-3 rounded bg-white text-black"

      />

      <textarea

        value={address}

        onChange={(e) =>

          setAddress(

            e.target.value

          )

        }

        placeholder="العنوان"

        className="w-full p-3 rounded bg-white text-black h-24"

      />

      <button

        type="submit"

        disabled={loading}

        className="w-full bg-yellow-500 py-3 rounded font-bold"

      >

        {

          loading

            ? 'جاري التنفيذ...'

            : 'تأكيد الطلب'

        }

      </button>

    </form>

  )

}