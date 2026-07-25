import { useUserStore } from "../store/userStore";import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebsiteStore } from '../store/websiteStore';

export default function Login() {

  const navigate = useNavigate();

  // ================= STORE =================

  const login =
  useUserStore((s) => s.login);

  const currentUser =
  useUserStore((s) => s.currentUser);

  const hydrated =
  useWebsiteStore((s) => s.hydrated);

  const companyName =
  useWebsiteStore((s) => s.companyName);

  const logo =
  useWebsiteStore((s) => s.logo);

  const maintenanceMode =
  useWebsiteStore((s) => s.maintenanceMode);

  // ================= STATE =================

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ================= SMART ROUTING =================

  const getRedirectPath = (user) => {

    if (!user) return '/home';

    // 👑 OWNER
    if (user.role === 'owner') {
      return '/dashboard';
    }

    // 🏭 WAREHOUSE / BRANCH / SHOP
    if (
    user.role === 'warehouse' ||
    user.role === 'branch' ||
    user.role === 'shop')
    {
      return '/dashboard';
    }

    return '/home';
  };

  // ================= AUTO REDIRECT =================

  useEffect(() => {

    if (!hydrated) return;

    if (currentUser) {
      navigate(getRedirectPath(currentUser));
    }

  }, [currentUser, hydrated]);

  // ================= LOGIN =================

  const handleLogin = async () => {

    if (loading) return;

    setError('');

    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    if (!cleanUsername || !cleanPassword) {
      setError('⚠ يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }

    setLoading(true);

    try {

      // fake delay (UX)
      await new Promise((r) => setTimeout(r, 300));

      const success = login(cleanUsername, cleanPassword);

console.log('Login success:', success);
console.log('Current user:', useUserStore.getState().currentUser);

      if (!success) {
        setError('⚠ اسم المستخدم أو كلمة المرور غير صحيحة');
        setLoading(false);
        return;
      }

      const user =
  useUserStore.getState().currentUser;

      if (!user) {
        setError('⚠ فشل تسجيل الدخول');
        setLoading(false);
        return;
      }

      // 🚀 REDIRECT AFTER LOGIN
      navigate(getRedirectPath(user));

    } catch (err) {
      console.error(err);
      setError('⚠ حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  // ================= ENTER KEY =================

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  // ================= LOADING =================

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-3xl font-black">
        جاري التحميل...
      </div>);

  }

  // ================= MAINTENANCE MODE =================

  if (
  maintenanceMode &&
  currentUser?.role !== 'owner')
  {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-10">
        <div className="bg-slate-900 p-10 rounded-3xl text-center border border-yellow-500">
          <div className="text-6xl mb-4">🛠</div>
          <h1 className="text-3xl font-black text-yellow-400">
            النظام تحت الصيانة
          </h1>
          <p className="text-gray-300 mt-3">
            سيتم العودة قريباً
          </p>
        </div>
      </div>);

  }

  // ================= UI =================

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-blue-950 flex items-center justify-center p-6 text-white">

      <div className="w-full max-w-md bg-slate-900/90 border border-yellow-500/30 rounded-[35px] p-10 shadow-2xl">

        {/* LOGO */}
        <div className="flex justify-center mb-6">

          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-yellow-400 bg-white">

            {logo ?
            <img src={logo} className="w-full h-full object-cover" /> :

            <div className="w-full h-full flex items-center justify-center text-4xl text-black">
                🏭
              </div>
            }

          </div>

        </div>

        {/* TITLE */}
        <h1 className="text-4xl font-black text-center text-yellow-400">
          تسجيل الدخول
        </h1>

        <p className="text-center text-gray-400 mt-2 mb-6">
          {companyName}
        </p>

        {/* ERROR */}
        {error &&
        <div className="bg-red-600 p-3 rounded-xl text-center mb-4 font-bold">
            {error}
          </div>
        }

        {/* USERNAME */}
        <input
          className="w-full p-4 rounded-xl text-black mb-4 outline-none"
          placeholder="اسم المستخدم"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown} />
        

        {/* PASSWORD */}
        <div className="relative">

          <input
            className="w-full p-4 rounded-xl text-black outline-none"
            placeholder="كلمة المرور"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown} />
          

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-black font-bold">
            
            {showPassword ? '🙈' : '👁'}
          </button>

        </div>

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-black py-4 rounded-2xl font-black text-xl">
          
          {loading ? '⏳ جاري الدخول...' : '🚀 دخول'}
        </button>

      </div>

    </div>);

}