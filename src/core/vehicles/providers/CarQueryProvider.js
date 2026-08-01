// ======================================================
// EL OLA ERP
// CarQuery Provider
// ======================================================

import HttpClient
from '../../network/HttpClient'

import VehicleMapper
from '../VehicleMapper'

export default class CarQueryProvider {

  static baseUrl =

    'https://www.carqueryapi.com/api/0.3/'

  // ====================================================
  // REQUEST
  // ====================================================

  static async request(query = {}) {

    const response = await HttpClient.get(

      this.baseUrl,

      {

        cmd: query.cmd,

        ...query

      }

    )

    if (!response)

      return null

    if (

      typeof response === 'string'

    ) {

      return this.parseJsonp(

        response

      )

    }

    return response

  }

  // ====================================================
  // PARSE JSONP
  // ====================================================

  static parseJsonp(text = '') {

    try {

      const start =

        text.indexOf('(')

      const end =

        text.lastIndexOf(')')

      if (

        start === -1 ||

        end === -1

      ) {

        return null

      }

      return JSON.parse(

        text.substring(

          start + 1,

          end

        )

      )

    }

    catch (error) {

      console.error(

        '[CarQueryProvider]',

        error

      )

      return null

    }

  }

  // ====================================================
  // TYPES
  // ====================================================

  static async getVehicleTypes() {

    return []

  }

  // ====================================================
  // BRANDS
  // ====================================================

  static async getBrands() {

    const result =

      await this.request({

        cmd: 'getMakes'

      })

    const makes =

      result?.Makes || []

    return makes.map(item => ({

      id:

        item.make_id ||

        item.make_display,

      name:

        item.make_display

    }))

  }

  // ====================================================
  // MODELS
  // ====================================================

  static async getModels({

    brand

  }) {

    if (!brand)

      return []

    const result =

      await this.request({

        cmd: 'getModels',

        make: brand

      })

    const models =

      result?.Models || []

    return VehicleMapper.mapArray(

      models,

      VehicleMapper.fromCarQuery

    )

  }

  // ====================================================
  // YEARS
  // ====================================================

  static async getYears() {

    const years = []

    const current =

      new Date().getFullYear()

    for (

      let year = 1980;

      year <= current;

      year++

    ) {

      years.push(year)

    }

    return years.reverse()

  }

  // ====================================================
  // VEHICLE
  // ====================================================

  static async findVehicle({

    make,

    model,

    year

  }) {

    const vehicles =

      await this.getModels({

        brand: make

      })

    const vehicle =

      vehicles.find(item =>

        item.make === make &&

        item.model === model

      )

    if (!vehicle)

      return null

    return {

      ...vehicle,

      year

    }

  }

}