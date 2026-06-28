import ERPBridge from '../erp/erpBridge'
import AutoPilotEngine from '../erp/AutoPilotEngine'
import WarehouseIntelligence from './WarehouseIntelligence'

class AICommandCenter {

  static running = false

  // ================= START =================

  static start() {

    if (this.running)
      return

    this.running = true

    console.log(
      '🧠 AI Command Center Started'
    )

    try {

      ERPBridge.start()

      AutoPilotEngine.start()

      WarehouseIntelligence.start()

      this.startHeartbeat()

    }

    catch (error) {

      console.error(
        'AI Command Center Startup Error',
        error
      )

    }

  }

  // ================= STOP =================

  static stop() {

    this.running = false

    ERPBridge.stop()

    AutoPilotEngine.stop()

    WarehouseIntelligence.stop()

    if (
      typeof window !== 'undefined' &&
      window.aiCommandHeartbeat
    ) {

      clearInterval(
        window.aiCommandHeartbeat
      )

      window.aiCommandHeartbeat =
        null

    }

    console.log(
      '🛑 AI Command Center Stopped'
    )

  }

  // ================= HEARTBEAT =================

  static startHeartbeat() {

    if (
      typeof window === 'undefined'
    ) return

    if (
      window.aiCommandHeartbeat
    ) {

      clearInterval(
        window.aiCommandHeartbeat
      )

    }

    window.aiCommandHeartbeat =
      setInterval(() => {

        try {

          ERPBridge.runFullSync()

        }

        catch (error) {

          console.error(
            'Heartbeat Error',
            error
          )

        }

      }, 30000)

  }

  // ================= STATUS =================

  static getStatus() {

    return {

      running:
        this.running,

      bridge:
        typeof window !== 'undefined'
          ? !!window.erpBridgeInterval
          : false,

      autoPilot:
        typeof window !== 'undefined'
          ? !!window.autoPilotInterval
          : false,

      warehouseAI:
        typeof window !== 'undefined'
          ? !!window.warehouseAIInterval
          : false

    }

  }

  // ================= RESTART =================

  static restart() {

    this.stop()

    setTimeout(() => {

      this.start()

    }, 1000)

  }

}

export default AICommandCenter