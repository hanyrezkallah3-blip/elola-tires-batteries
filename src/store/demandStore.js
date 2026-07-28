import { create } from 'zustand'
import { persist } from 'zustand/middleware'


const generateId = () =>

  Date.now().toString() +
  Math.random()
    .toString(36)
    .slice(2)



export const useDemandStore = create(

  persist(

    (set, get) => ({


      // ==========================================
      // CUSTOMER VEHICLE SEARCH HISTORY
      // ==========================================

      searches: [],



      addSearch: (data) =>

        set((state) => ({

          searches: [

            {

              id: generateId(),

              createdAt:
                new Date()
                  .toISOString(),

              ...data

            },

            ...state.searches

          ]

        })),



      // ==========================================
      // MISSING PRODUCTS
      // ==========================================

      missingRequests: [],



      addMissingRequest: (data) =>

        set((state) => ({

          missingRequests: [

            {

              id: generateId(),

              createdAt:
                new Date()
                  .toISOString(),

              ...data

            },

            ...state.missingRequests

          ]

        })),



      // ==========================================
      // STATISTICS
      // ==========================================

      getStatistics: () => {

        const searches =
          get().searches


        const missing =
          get().missingRequests



        return {

          totalSearches:
            searches.length,


          successfulSearches:

            searches.filter(

              item =>
                item.found

            ).length,


          missingProducts:

            missing.length,


          topVehicles:

            Object.values(

              searches.reduce(

                (acc,item)=>{

                  const key =
                    `${item.make} ${item.model}`


                  acc[key] =
                    (acc[key] || 0) + 1


                  return acc

                },

                {}

              )

            )
            .sort(
              (a,b)=>b-a
            )

        }

      }


    }),


    {

      name:
        'elola-demand-ai'

    }

  )

)