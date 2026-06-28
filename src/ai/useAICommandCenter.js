import { useEffect } from 'react'

import AICommandCenter
  from './AICommandCenter'

export function useAICommandCenter() {

  useEffect(() => {

    try {

      AICommandCenter.start()

      console.log(
        '🚀 AI Command Center Activated'
      )

    } catch (error) {

      console.error(
        'AI Command Center Start Error',
        error
      )

    }

    return () => {

      try {

        AICommandCenter.stop()

      } catch (error) {

        console.error(
          'AI Command Center Stop Error',
          error
        )

      }

    }

  }, [])

}