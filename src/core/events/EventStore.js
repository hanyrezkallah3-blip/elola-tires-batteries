// ======================================================
// EL OLA ERP
// Event Store
// ======================================================

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const generateId = () =>

  Date.now().toString() +

  Math.random().toString(36).slice(2)

export const useEventStore = create(

  persist(

    (set, get) => ({

      // ==================================================
      // STATE
      // ==================================================

      events: [],

      maxEvents: 50000,

      // ==================================================
      // ADD
      // ==================================================

      addEvent(event) {

        const record = {

          id: generateId(),

          createdAt:

            new Date().toISOString(),

          ...event

        }

        const events = [

          record,

          ...get().events

        ]

        set({

          events:

            events.slice(

              0,

              get().maxEvents

            )

        })

      },

      // ==================================================
      // GET
      // ==================================================

      getEvents() {

        return get().events

      },

      getEventsByType(type) {

        return get().events.filter(

          event =>

            event.type === type

        )

      },

      // ==================================================
      // SEARCH
      // ==================================================

      search(predicate) {

        return get().events.filter(

          predicate

        )

      },

      // ==================================================
      // CLEAN
      // ==================================================

      clearEvents() {

        set({

          events: []

        })

      },

      removeEvent(id) {

        set(state => ({

          events:

            state.events.filter(

              event =>

                event.id !== id

            )

        }))

      },

      // ==================================================
      // SETTINGS
      // ==================================================

      setMaxEvents(value) {

        set({

          maxEvents:

            Number(value) || 50000

        })

      }

    }),

    {

      name:

        'elola-event-store',

      partialize:

        state => ({

          events:

            state.events,

          maxEvents:

            state.maxEvents

        })

    }

  )

)

export default useEventStore