// src/core/engines/order/OrderEngine.js

import OrderValidator from './OrderValidator'
import OrderInventory from './OrderInventory'
import WalletService from '../../services/WalletService'
import OrderNotifications from './OrderNotifications'
import OrderAnalytics from './OrderAnalytics'
import OrderRollback from './OrderRollback'

import OrdersRepository from '../../../repositories/OrdersRepository'

import { useOrderStore } from '../../../store/orderStore'
import { useNotificationStore } from '../../../store/notificationStore'
import WalletEngine from '../wallet/WalletEngine'

export default class OrderEngine {


  // ==================================================
  // CREATE ORDER
  // ==================================================

  static async create(order = {}) {


    const validation =
      OrderValidator.validate(order)


    if (!validation.valid) {

      return {

        success: false,

        errors: validation.errors

      }

    }


    const inventoryValidation =
      OrderInventory.validate(order)


    if (!inventoryValidation.valid) {

      return {

        success: false,

        errors: inventoryValidation.errors

      }

    }


    let createdOrder = null

    let cashback = 0


    try {


      // ==================================================
      // SAVE ORDER THROUGH REPOSITORY
      // ==================================================

      const repositoryResult =
        await OrdersRepository.create(order)


      createdOrder =
        repositoryResult?.data ||
        repositoryResult ||
        order



      // ==================================================
      // SYNC STORE
      // ==================================================

      const orderStore =
        useOrderStore.getState()


      if (
        orderStore.addOrder &&
        createdOrder
      ) {

        createdOrder =
          orderStore.addOrder(createdOrder)

      }



      // ==================================================
      // INVENTORY
      // ==================================================

      OrderInventory.decrease(
        createdOrder
      )



      // ==================================================
// CASHBACK
// ==================================================

try {

  const cashbackPercentage =
    createdOrder.cashbackPercentage ??
    createdOrder.companyCashbackPercentage ??
    0

  cashback =
    await WalletService.applyCashback(

      createdOrder,

      cashbackPercentage

    )

}
catch (error) {

  console.error(

    'Wallet Cashback Error',

    error

  )

  cashback = 0

}


      // ==================================================
      // NOTIFICATIONS
      // ==================================================

      try {


        const notificationStore =
          useNotificationStore
            ?.getState
            ?.()


        if (
          notificationStore?.addNotification
        ) {


          const notifications =
            OrderNotifications
              .onCreated(
                createdOrder
              )


          notifications.forEach(
            notification => {

              notificationStore
                .addNotification(
                  notification
                )

            }
          )


        }


      }

      catch(error) {

        console.warn(
          'Notification skipped',
          error
        )

      }



      // ==================================================
      // ANALYTICS
      // ==================================================

      const analytics =
        OrderAnalytics.build(
          orderStore.orders || []
        )



      return {

        success: true,

        order: createdOrder,

        cashback,

        analytics

      }


    }


    catch(error) {


      OrderRollback.rollback({

        order: createdOrder,

        cashback,

        reason:
          'Create order failed'

      })


      return {

        success:false,

        error

      }


    }


  }


}