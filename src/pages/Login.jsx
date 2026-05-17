import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {

  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')

  const [loading, setLoading] = useState(false)

  const [showPassword, setShowPassword] = useState(false)

  // ================= AUTO LOGIN =================

  useEffect(() => {

    const auth = localStorage.getItem('auth')

    if (auth === 'true') {

      navigate('/dashboard')

    }

  }, [])

  // ================= LOGIN =================

  const handleLogin = () => {

    const ADMIN_USER = 'admin'

    const ADMIN_PASS = '1234'

    setError('')

    if (!username || !password) {

      setError('يرجى إدخال جميع البيانات')

      return

    }

    setLoading(true)

    setTimeout(() => {

      if (

        username === ADMIN_USER &&

        password === ADMIN_PASS

      ) {

        localStorage.setItem('auth', 'true')

        navigate('/dashboard')

      } else {

        setError('اسم المستخدم أو كلمة المرور غير صحيحة')

      }

      setLoading(false)

    }, 1200)

  }

  // ================= ENTER KEY =================

  const handleKeyDown = (e) => {

    if (e.key === 'Enter') {

      handleLogin()

    }

  }

  return (

    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gradient-to-br
        from-black
        via-blue-950
        to-slate-900
        overflow-hidden
        relative
        p-6
      "
    >

      {/* BACKGROUND */}

      <div
        className="
          absolute
          inset-0
          opacity-20
        "
      >

        <div
          className="
            absolute
            top-0
            left-0
            w-[500px]
            h-[500px]
            bg-yellow-500
            blur-[180px]
          "
        />

        <div
          className="
            absolute
            bottom-0
            right-0
            w-[500px]
            h-[500px]
            bg-blue-700
            blur-[180px]
          "
        />

      </div>

      {/* LOGIN BOX */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-[500px]

          bg-white/10
          backdrop-blur-xl

          border
          border-white/20

          rounded-[40px]

          shadow-[0_0_80px_rgba(0,0,0,0.7)]

          p-10

          text-white
        "
      >

        {/* LOGO */}

        <div className="text-center mb-10">

          <div
            className="
              w-32
              h-32
              rounded-full
              bg-yellow-400
              mx-auto
              flex
              items-center
              justify-center
              text-6xl
              shadow-2xl
              border-4
              border-white
              mb-6
            "
          >

            🔐

          </div>

          <h1
            className="
              text-5xl
              font-black
              text-yellow-400
              mb-4
            "
          >
            شركة العلا
          </h1>

          <p
            className="
              text-xl
              text-blue-200
            "
          >
            تسجيل الدخول إلى لوحة التحكم
          </p>

        </div>

        {/* ERROR */}

        {error && (

          <div
            className="
              bg-red-700
              text-white
              text-center
              py-4
              px-6
              rounded-2xl
              mb-6
              text-lg
              font-bold
              shadow-2xl
            "
          >

            ⚠ {error}

          </div>

        )}

        {/* USERNAME */}

        <div className="mb-6">

          <label
            className="
              block
              mb-3
              text-xl
              font-bold
            "
          >
            اسم المستخدم
          </label>

          <input
            type="text"
            placeholder="أدخل اسم المستخدم"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            onKeyDown={handleKeyDown}
            className="
              w-full
              p-5
              rounded-2xl

              bg-white
              text-black

              text-xl

              outline-none

              border-4
              border-transparent

              focus:border-yellow-400

              transition-all
            "
          />

        </div>

        {/* PASSWORD */}

        <div className="mb-8">

          <label
            className="
              block
              mb-3
              text-xl
              font-bold
            "
          >
            كلمة المرور
          </label>

          <div className="relative">

            <input
              type={
                showPassword
                  ? 'text'
                  : 'password'
              }
              placeholder="أدخل كلمة المرور"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              onKeyDown={handleKeyDown}
              className="
                w-full
                p-5
                rounded-2xl

                bg-white
                text-black

                text-xl

                outline-none

                border-4
                border-transparent

                focus:border-yellow-400

                transition-all
              "
            />

            <button

              type="button"

              onClick={() =>
                setShowPassword(!showPassword)
              }

              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2

                text-2xl
              "
            >

              {showPassword ? '🙈' : '👁'}

            </button>

          </div>

        </div>

        {/* LOGIN BUTTON */}

        <button

          onClick={handleLogin}

          disabled={loading}

          className={`
            w-full

            py-5

            rounded-3xl

            text-2xl
            font-black

            transition-all
            duration-300

            shadow-2xl

            ${
              loading

                ? `
                    bg-gray-700
                    text-gray-300
                    cursor-not-allowed
                  `

                : `
                    bg-yellow-400
                    hover:bg-yellow-500
                    text-black
                    hover:scale-105
                  `
            }
          `}
        >

          {loading

            ? 'جاري تسجيل الدخول...'

            : 'دخول إلى لوحة التحكم'}

        </button>

        {/* INFO */}

        <div
          className="
            mt-10
            text-center
            text-gray-300
            text-lg
          "
        >

          نظام إدارة احترافي لشركة العلا للإطارات والبطاريات

        </div>

      </div>

    </div>

  )

}