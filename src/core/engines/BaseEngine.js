// ======================================================
// Elola ERP Enterprise
// Base Engine
// ======================================================

export default class BaseEngine {

  // ======================================================
  // SUCCESS
  // ======================================================

  success(

    data = null,

    message = ''

  ) {

    return {

      success: true,

      data,

      message,

      errors: []

    }

  }

  // ======================================================
  // FAILURE
  // ======================================================

  failure(

    message = 'حدث خطأ',

    errors = [],

    data = null

  ) {

    return {

      success: false,

      data,

      message,

      errors:

        Array.isArray(errors)

          ? errors

          : [errors]

    }

  }

  // ======================================================
  // TRY EXECUTE
  // ======================================================

  async execute(callback) {

    try {

      return await callback()

    }

    catch (error) {

      console.error(

        '[Engine Error]',

        error

      )

      return this.failure(

        error.message ||

        'خطأ غير معروف',

        error

      )

    }

  }

  // ======================================================
  // VALIDATION
  // ======================================================

  validate(condition, message) {

    if (condition)

      return this.failure(message)

    return null

  }

  // ======================================================
  // LOG
  // ======================================================

  log(...args) {

    console.log(

      '[Elola ERP]',

      ...args

    )

  }

  warn(...args) {

    console.warn(

      '[Elola ERP]',

      ...args

    )

  }

  error(...args) {

    console.error(

      '[Elola ERP]',

      ...args

    )

  }

}