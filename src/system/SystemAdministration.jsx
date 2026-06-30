import ResetCenter
  from './components/ResetCenter'

import SystemCard
  from './components/SystemCard'

export default function SystemAdministration() {

  return (

    <div className="p-8 space-y-8">

      <div>

        <h1 className="text-4xl font-black text-yellow-400">

          ERP System Administration

        </h1>

        <p className="text-gray-400 mt-2">

          مركز إدارة نظام Elola ERP

        </p>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

  <SystemCard
    title="Reset Center"
    description="إعادة ضبط أجزاء النظام"
  />

  <SystemCard
    title="Backup & Restore"
    description="النسخ الاحتياطي والاستعادة"
  />

  <SystemCard
    title="Developer Tools"
    description="أدوات المطور"
  />

  <SystemCard
    title="System Settings"
    description="إعدادات النظام"
  />

  <SystemCard
    title="Feature Flags"
    description="تشغيل وإيقاف الوحدات"
  />

  <SystemCard
    title="System Health"
    description="مراقبة حالة النظام"
  />

</div>

<div className="mt-10">

  <ResetCenter />

</div>

    </div>

  )

}

