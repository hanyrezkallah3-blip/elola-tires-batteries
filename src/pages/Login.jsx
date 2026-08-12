import { useUserStore } from "../store/userStore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWebsiteStore } from "../store/websiteStore";

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

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);


  // ================= SMART ROUTING =================

  const getRedirectPath = (user) => {

    if (!user) {
      return "/home";
    }


    // 👑 OWNER
    if (user.role === "owner") {
      return "/dashboard";
    }


    // 🏭 WAREHOUSE
    if (
      user.role === "warehouse" ||
      user.role === "branch" ||
      user.role === "shop"
    ) {

      return "/warehouse-dashboard";

    }


    // 👤 OTHER USERS
    return "/dashboard";

  };


  // ================= AUTO REDIRECT =================

  useEffect(() => {

    if (!hydrated) {
      return;
    }

    if (currentUser) {

      navigate(
        getRedirectPath(currentUser),
        { replace: true }
      );

    }

  }, [
    currentUser,
    hydrated,
    navigate
  ]);


  // ================= LOGIN =================

  const handleLogin = async () => {

    if (loading) {
      return;
    }


    setError("");


    const cleanUsername =
      username.trim();

    const cleanPassword =
      password.trim();


    if (
      !cleanUsername ||
      !cleanPassword
    ) {

      setError(
        "⚠ يرجى إدخال اسم المستخدم وكلمة المرور"
      );

      return;

    }


    setLoading(true);


    try {

      // ================= UX DELAY =================

      await new Promise(
        (resolve) =>
          setTimeout(resolve, 300)
      );


      // ================= AUTH =================

      const success =
        login(
          cleanUsername,
          cleanPassword
        );


      console.log(
        "Login success:",
        success
      );


      if (!success) {

        setError(
          "⚠ اسم المستخدم أو كلمة المرور غير صحيحة"
        );

        setLoading(false);

        return;

      }


      // ================= CURRENT USER =================

      const user =
        useUserStore
          .getState()
          .currentUser;


      console.log(
        "Current user:",
        user
      );


      if (!user) {

        setError(
          "⚠ فشل تسجيل الدخول"
        );

        setLoading(false);

        return;

      }


      // ================= WAREHOUSE LOGIN =================

      if (
        user.role === "warehouse" ||
        user.role === "branch" ||
        user.role === "shop"
      ) {

        console.log(
          "Warehouse login:",
          {
            warehouseId:
              user.warehouseId,

            warehouseName:
              user.warehouseName
          }
        );

      }


      // ================= REDIRECT =================

      navigate(
        getRedirectPath(user),
        { replace: true }
      );


    } catch (err) {

      console.error(
        "Login Error:",
        err
      );

      setError(
        "⚠ حدث خطأ غير متوقع"
      );

    } finally {

      setLoading(false);

    }

  };


  // ================= ENTER KEY =================

  const handleKeyDown = (e) => {

    if (
      e.key === "Enter"
    ) {

      handleLogin();

    }

  };


  // ================= LOADING =================

  if (!hydrated) {

    return (

      <div className="
        min-h-screen
        bg-black
        flex
        items-center
        justify-center
        text-white
        text-2xl
        font-black
      ">

        جاري التحميل...

      </div>

    );

  }


  // ================= MAINTENANCE MODE =================

  if (
    maintenanceMode &&
    currentUser?.role !== "owner"
  ) {

    return (

      <div className="
        min-h-screen
        bg-black
        flex
        items-center
        justify-center
        p-6
        text-white
      ">

        <div className="
          w-full
          max-w-md
          bg-slate-900
          border
          border-yellow-500/30
          rounded-[35px]
          p-10
          text-center
        ">

          <div className="
            text-6xl
            mb-6
          ">

            🛠

          </div>


          <h1 className="
            text-3xl
            font-black
            text-yellow-400
            mb-4
          ">

            النظام تحت الصيانة

          </h1>


          <p className="
            text-gray-400
            font-bold
          ">

            سيتم العودة قريباً

          </p>

        </div>

      </div>

    );

  }


  // ================= UI =================

  return (

    <div className="
      min-h-screen
      bg-black
      flex
      items-center
      justify-center
      p-6
    ">

      <div className="
        w-full
        max-w-md
        bg-slate-900/90
        border
        border-yellow-500/30
        rounded-[35px]
        p-10
        shadow-2xl
      ">


        {/* LOGO */}

        <div className="
          flex
          justify-center
          mb-6
        ">

          <div className="
            w-28
            h-28
            rounded-full
            overflow-hidden
            border-4
            border-yellow-400
            bg-white
          ">

            {logo ? (

              <img
                src={logo}
                alt={companyName || "Logo"}
                className="
                  w-full
                  h-full
                  object-cover
                "
              />

            ) : (

              <div className="
                w-full
                h-full
                flex
                items-center
                justify-center
                text-4xl
                text-black
              ">

                🏭

              </div>

            )}

          </div>

        </div>


        {/* TITLE */}

        <h1 className="
          text-4xl
          font-black
          text-center
          text-yellow-400
        ">

          تسجيل الدخول

        </h1>


        <p className="
          text-center
          text-gray-400
          mt-2
          mb-6
        ">

          {companyName}

        </p>


        {/* ERROR */}

        {error && (

          <div className="
            bg-red-600
            p-3
            rounded-xl
            text-center
            mb-4
            font-bold
          ">

            {error}

          </div>

        )}


        {/* USERNAME */}

        <input
          className="
            w-full
            p-4
            rounded-xl
            text-black
            mb-4
            outline-none
          "
          placeholder="اسم المستخدم"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          onKeyDown={handleKeyDown}
          autoComplete="username"
        />


        {/* PASSWORD */}

        <div className="
          relative
        ">

          <input
            className="
              w-full
              p-4
              rounded-xl
              text-black
              outline-none
            "
            placeholder="كلمة المرور"
            type={
              showPassword
                ? "text"
                : "password"
            }
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            onKeyDown={handleKeyDown}
            autoComplete="current-password"
          />


          <button
            type="button"
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-black
              font-bold
            "
          >

            {showPassword
              ? "🙈"
              : "👁"}

          </button>

        </div>


        {/* LOGIN BUTTON */}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="
            w-full
            mt-6
            bg-yellow-500
            hover:bg-yellow-600
            disabled:opacity-50
            disabled:cursor-not-allowed
            text-black
            py-4
            rounded-2xl
            font-black
            text-xl
          "
        >

          {loading
            ? "⏳ جاري الدخول..."
            : "🚀 دخول"}

        </button>


      </div>

    </div>

  );

}
