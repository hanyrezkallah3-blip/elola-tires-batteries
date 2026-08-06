export function prepareWarehouseProduct(form, realCost) {

  return {

    ...form,

    realCost,

    serialNumbers:

      typeof form.serialNumbers === 'string'

        ? form.serialNumbers

            .split(',')

            .map(item => item.trim())

            .filter(Boolean)

        : form.serialNumbers

  }

}