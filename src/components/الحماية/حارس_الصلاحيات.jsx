import { usePermissionsStore } from '../../store/الصلاحيات_العربية'

export default function حارس_الصلاحيات({
  children,
  الميزة
}) {

  const يملك_صلاحية =
    usePermissionsStore((s) =>
      s.يملك_صلاحية
    )

  const مسموح =
    يملك_صلاحية(الميزة)

  if (!مسموح) {

    return (

      <div className="p-10 text-red-500 text-2xl">

        🚫 ليس لديك صلاحية لعرض هذا الجزء

      </div>

    )

  }

  return children

}