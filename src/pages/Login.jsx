import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWebsiteStore } from '../store/websiteStore'

export default function Login() {

  const navigate = useNavigate()

  const login = useWebsiteStore((state) => state.login)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // ================= LOGIN =================

  const handleLogin = () => {

    setError('')

    if (!username || !password) {
      setError('⚠ يرجى إدخال جميع البيانات')
      return
    }

    setLoading(true)

    setTimeout(() => {

      const success = login(username, password)

      if (!success) {
        setError('⚠ اسم المستخدم أو كلمة المرور غير صحيحة')
        setLoading(false)
        return
      }

      const user = useWebsiteStore.getState().currentUser

      // ================= ROUTING SYSTEM =================

      if (user.role === 'owner') {

        navigate('/dashboard')

      } else if (user.role === 'warehouse') {

        // 🔥 تحويل المخزن إلى داشبورد المخازن
        navigate('/warehouses')

      } else {

        navigate('/home')

      }

      setLoading(false)

    }, 600)
  }

  // ================= ENTER KEY =================

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-black text-white">

      <div className="bg-slate-900 p-10 rounded-3xl w-[400px] space-y-6">

        <h1 className="text-3xl font-black text-yellow-400 text-center">
          تسجيل الدخول
        </h1>

        {/* ERROR */}
        {error && (
          <div className="bg-red-600 p-3 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* USERNAME */}
        <input
          className="w-full p-3 rounded-xl text-black"
          placeholder="اسم المستخدم"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {/* PASSWORD */}
        <input
          className="w-full p-3 rounded-xl text-black"
          placeholder="كلمة المرور"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-yellow-500 text-black p-3 rounded-xl font-bold"
        >
          {loading ? 'جاري الدخول...' : 'دخول'}
        </button>

      </div>

    </div>

  )
}