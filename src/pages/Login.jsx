export default function Login() {

  return (

    <div className="min-h-screen flex items-center justify-center bg-blue-950">

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-[450px]">

        <h1 className="text-4xl font-black text-center mb-8">

          تسجيل الدخول

        </h1>

        <input
          type="text"
          placeholder="اسم المستخدم"
          className="w-full border p-4 rounded-2xl mb-4"
        />

        <input
          type="password"
          placeholder="كلمة المرور"
          className="w-full border p-4 rounded-2xl mb-6"
        />

        <button
          className="w-full bg-blue-800 text-white py-4 rounded-2xl font-black"
        >

          دخول

        </button>

      </div>

    </div>

  )

}