import { useState } from 'react'
import { useWebsiteStore } from '../store/websiteStore'

export default function WalletSettings() {

  const {
    cashbackPercentage,
    setCashbackPercentage
  } = useWebsiteStore()

  const [value, setValue] = useState(cashbackPercentage * 100)

  const handleSave = () => {
    setCashbackPercentage(value / 100)
    alert('تم تحديث نسبة العمولة بنجاح')
  }

  return (
    <div style={{ padding: 20 }}>

      <h2>إعدادات المحفظة</h2>

      <div style={{ marginTop: 20 }}>

        <label>نسبة العمولة (%)</label>

        <input
          type="number"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          style={{
            display: 'block',
            marginTop: 10,
            padding: 8,
            width: 200
          }}
        />

        <button
          onClick={handleSave}
          style={{
            marginTop: 15,
            padding: 10,
            background: 'green',
            color: 'white',
            border: 'none'
          }}
        >
          حفظ
        </button>

      </div>

      <hr />

      <p>
        النسبة الحالية: <b>{cashbackPercentage * 100}%</b>
      </p>

    </div>
  )
}