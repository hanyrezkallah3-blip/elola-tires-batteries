import { useState } from 'react'

export default function Login() {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {

    // 🔒 بيانات مؤقتة (يمكن تغييرها لاحقاً أو ربطها بـ backend)
    const ADMIN_USER = 'admin'
    const ADMIN_PASS = '1234'

    if (!username || !password) {
      setError('يرجى إدخال البيانات')
      return
    }

    if (username === ADMIN_USER && password === ADMIN_PASS) {

      // حفظ تسجيل الدخول
      localStorage.setItem('auth', 'true')

      // تحويل للداشبورد
      window.location.href = '/dashboard'

    } else {
      setError('بيانات الدخول غير صحيحة')
    }

  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-blue-950">

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-[450px]">

        <h1 className="text-4xl font-black text-center mb-8">
          تسجيل الدخول
        </h1>

        {/* ERROR */}
        {error && (
          <p className="text-red-600 text-center mb-4 font-bold">
            {error}
          </p>
        )}

        <input
          type="text"
          placeholder="اسم المستخدم"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-4 rounded-2xl mb-4"
        />

        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-4 rounded-2xl mb-6"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-800 hover:bg-blue-900 text-white py-4 rounded-2xl font-black"
        >
          دخول
        </button>

      </div>

    </div>

  )

}