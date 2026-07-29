// ======================================================
// EL OLA ERP
// Smart Vehicle Search
// ======================================================

import {
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

import VehicleAIEngine
from '../../engines/VehicleAIEngine'

export default function SmartVehicleSearch({

  onSelect

}) {

  const rootRef = useRef(null)

  const [

    text,

    setText

  ] = useState('')

  const [

    query,

    setQuery

  ] = useState('')

  const [

    opened,

    setOpened

  ] = useState(false)

  const [

    highlighted,

    setHighlighted

  ] = useState(0)

  // ======================================================
  // DEBOUNCE
  // ======================================================

  useEffect(() => {

    const timer = setTimeout(() => {

      setQuery(text)

    }, 250)

    return () =>

      clearTimeout(timer)

  }, [

    text

  ])

  // ======================================================
  // CLOSE OUTSIDE
  // ======================================================

  useEffect(() => {

    function handleClick(event) {

      if (

        rootRef.current &&

        !rootRef.current.contains(

          event.target

        )

      ) {

        setOpened(false)

      }

    }

    document.addEventListener(

      'mousedown',

      handleClick

    )

    return () =>

      document.removeEventListener(

        'mousedown',

        handleClick

      )

  }, [])

  // ======================================================
  // SEARCH
  // ======================================================

  const suggestions = useMemo(() => {

    if (!query.trim())

      return []

    return VehicleAIEngine.suggestions(

      query

    )

  }, [

    query

  ])

  useEffect(() => {

    setHighlighted(0)

  }, [

    suggestions

  ])

  // ======================================================
  // SELECT
  // ======================================================

  function choose(vehicle) {

    setText(

      `${vehicle.make} ${vehicle.model}`

    )

    setOpened(false)

    onSelect?.({

      vehicleType:

        vehicle.vehicleType ??

        vehicle.type,

      make:

        vehicle.make,

      model:

        vehicle.model,

      year:

        vehicle.yearFrom,

      vehicle

    })

  }

  // ======================================================
  // KEYBOARD
  // ======================================================

  function onKeyDown(event) {

    if (!opened)

      return

    if (

      event.key === 'ArrowDown'

    ) {

      event.preventDefault()

      setHighlighted(value =>

        Math.min(

          value + 1,

          suggestions.length - 1

        )

      )

    }

    if (

      event.key === 'ArrowUp'

    ) {

      event.preventDefault()

      setHighlighted(value =>

        Math.max(

          value - 1,

          0

        )

      )

    }

    if (

      event.key === 'Enter'

    ) {

      event.preventDefault()

      if (

        suggestions[highlighted]

      ) {

        choose(

          suggestions[highlighted]

        )

      }

    }

    if (

      event.key === 'Escape'

    ) {

      setOpened(false)

    }

  }

  return (

    <div

      ref={rootRef}

      className="relative space-y-4"

    >

      <input

        value={text}

        onChange={e => {

          setText(

            e.target.value

          )

          setOpened(true)

        }}

        onFocus={() =>

          setOpened(true)

        }

        onKeyDown={onKeyDown}

        placeholder="ابحث باسم السيارة مثل Corolla أو تويوتا كورولا"

        className="

          w-full

          p-4

          rounded-2xl

          bg-slate-900

          border

          border-slate-700

          text-white

          focus:border-yellow-500

          outline-none

        "

      />

      {

        opened &&

        suggestions.length > 0 &&

        <div

          className="

            absolute

            left-0

            right-0

            z-50

            rounded-2xl

            overflow-hidden

            border

            border-slate-700

            bg-slate-800

            shadow-2xl

          "

        >

          {

            suggestions.map(

              (

                vehicle,

                index

              ) => (

                <button

                  key={

                    vehicle.id ??

                    `${vehicle.make}-${vehicle.model}-${vehicle.yearFrom}`

                  }

                  type="button"

                  onMouseEnter={() =>

                    setHighlighted(

                      index

                    )

                  }

                  onClick={() =>

                    choose(

                      vehicle

                    )

                  }

                  className={

                    `

                    w-full

                    text-left

                    p-4

                    border-b

                    border-slate-700

                    transition-colors

                    ${

                      highlighted === index

                        ? 'bg-yellow-500 text-black'

                        : 'bg-slate-800 hover:bg-slate-700 text-white'

                    }

                    `

                  }

                >

                  <div className="font-black">

                    {vehicle.make}

                    {' '}

                    {vehicle.model}

                  </div>

                  <div className="text-xs opacity-70 mt-1">

                    {

                      vehicle.yearFrom

                    }

                    {

                      vehicle.yearTo

                      ?

                      ` - ${vehicle.yearTo}`

                      :

                      ''

                    }

                  </div>

                </button>

              )

            )

          }

        </div>

      }

    </div>

  )

}