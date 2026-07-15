import React from 'react'

export default function AISearchTabs({

  mode,
  setMode

}) {

  const tabs = [

    {

      id: 'vehicle',

      icon: '🚗',

      title: 'البحث بالمركبة'

    },

    {

      id: 'tire',

      icon: '🛞',

      title: 'البحث بمقاس الإطار'

    },

    {

      id: 'battery',

      icon: '🔋',

      title: 'البحث بالبطارية'

    },

    {

      id: 'product',

      icon: '📦',

      title: 'اسم المنتج'

    }

  ]

  return (

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

      {

        tabs.map(tab => (

          <button

            key={tab.id}

            type="button"

            onClick={() => setMode(tab.id)}

            className={`

              rounded-2xl

              py-4

              px-4

              font-black

              transition-all

              border-2

              ${

                mode === tab.id

                  ? 'bg-yellow-500 text-black border-yellow-500'

                  : 'bg-slate-900 text-white border-slate-700 hover:border-yellow-500'

              }

            `}

          >

            <div className="text-3xl mb-2">

              {tab.icon}

            </div>

            <div>

              {tab.title}

            </div>

          </button>

        ))

      }

    </div>

  )

}