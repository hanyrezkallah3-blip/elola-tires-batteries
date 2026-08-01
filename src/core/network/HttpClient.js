// ======================================================
// EL OLA ERP
// HTTP Client
// ======================================================

export default class HttpClient {

  // ====================================================
  // CONFIG
  // ====================================================

  static timeout = 15000

  static defaultHeaders = {

    Accept: 'application/json',

    'Content-Type': 'application/json'

  }

  // ====================================================
  // BUILD URL
  // ====================================================

  static buildUrl(url, query = {}) {

    const params = new URLSearchParams()

    Object.entries(query || {}).forEach(([key, value]) => {

      if (

        value !== undefined &&

        value !== null &&

        value !== ''

      ) {

        params.append(key, value)

      }

    })

    const queryString = params.toString()

    if (!queryString)

      return url

    return `${url}${url.includes('?') ? '&' : '?'}${queryString}`

  }

  // ====================================================
  // REQUEST
  // ====================================================

  static async request({

    url,

    method = 'GET',

    query = {},

    body,

    headers = {},

    signal

  }) {

    const controller = new AbortController()

    const timer = setTimeout(

      () => controller.abort(),

      this.timeout

    )

    try {

      const response = await fetch(

        this.buildUrl(

          url,

          query

        ),

        {

          method,

          headers: {

            ...this.defaultHeaders,

            ...headers

          },

          body:

            body

              ? JSON.stringify(body)

              : undefined,

          signal:

            signal ||

            controller.signal

        }

      )

      clearTimeout(timer)

      if (!response.ok) {

        throw new Error(

          `HTTP ${response.status}`

        )

      }

      const type =

        response.headers.get(

          'content-type'

        ) || ''

      if (

        type.includes(

          'application/json'

        )

      ) {

        return await response.json()

      }

      return await response.text()

    }

    catch (error) {

      clearTimeout(timer)

      console.error(

        '[HttpClient]',

        error

      )

      return null

    }

  }

  // ====================================================
  // GET
  // ====================================================

  static get(

    url,

    query,

    headers

  ) {

    return this.request({

      url,

      query,

      headers

    })

  }

  // ====================================================
  // POST
  // ====================================================

  static post(

    url,

    body,

    headers

  ) {

    return this.request({

      url,

      method: 'POST',

      body,

      headers

    })

  }

  // ====================================================
  // PUT
  // ====================================================

  static put(

    url,

    body,

    headers

  ) {

    return this.request({

      url,

      method: 'PUT',

      body,

      headers

    })

  }

  // ====================================================
  // DELETE
  // ====================================================

  static delete(

    url,

    headers

  ) {

    return this.request({

      url,

      method: 'DELETE',

      headers

    })

  }

}