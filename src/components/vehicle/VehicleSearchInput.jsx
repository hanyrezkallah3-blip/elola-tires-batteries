import React from 'react'

export default function VehicleSearchInput({

  value,

  onChange,

  onFocus,

  onKeyDown

}) {

  return (

    <div className="relative">

      <div className="absolute inset-y-0 right-5 flex items-center text-2xl">

        🚗

      </div>

      <input

        type="text"

        value={value}

        placeholder="ابحث باسم السيارة... مثال: Toyota Corolla 2022 أو تويوتا كورولا"

        onChange={(e) =>

          onChange(

            e.target.value

          )

        }

        onFocus={onFocus}

        onKeyDown={onKeyDown}

        autoComplete="off"

        spellCheck={false}

        className="

          w-full

          rounded-3xl

          bg-slate-900

          border

          border-slate-700

          focus:border-yellow-500

          focus:ring-4

          focus:ring-yellow-500/20

          outline-none

          text-white

          text-xl

          pr-16

          pl-6

          py-5

          transition-all

        "

      />

    </div>

  )

}