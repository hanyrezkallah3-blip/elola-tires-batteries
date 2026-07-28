// =====================================================
// EL OLA ERP
// Smart Search Engine
// Core Engine Layer
// =====================================================

class SmartSearchEngine {


  // =====================================================
  // MAIN SEARCH
  // =====================================================

  static search(
    products = [],
    query = '',
    options = {}
  ) {

    const keyword =
      this.normalize(query)


    if (!keyword) {

      return products

    }


    let results =
      products.filter(product =>

        this.matchProduct(
          product,
          keyword
        )

      )


    if (options.category) {

      results =
        results.filter(product =>

          product.category ===
          options.category

        )

    }


    if (options.brand) {

      results =
        results.filter(product =>

          product.brand ===
          options.brand

        )

    }


    if (options.availableOnly) {

      results =
        results.filter(product =>

          Number(
            product.totalStock ||
            product.stock ||
            0
          ) > 0

        )

    }


    return this.rank(
      results,
      keyword
    )

  }



  // =====================================================
// MATCH PRODUCT
// =====================================================

static matchProduct(
  product,
  keyword
) {

  const fields = [

    product.name,
    product.brand,
    product.category,
    product.barcode,
    product.sku,
    product.code,
    product.model,
    product.size,
    product.width,
    product.height,
    product.rim,
    product.pattern,
    product.capacity,
    product.cca,
    product.voltage,
    product.amper,
    product.description,
    product.vehicleCompatibility,
    product.manufacturer,
    product.country,
    product.tags,

    ...(Array.isArray(product.keywords)
      ? product.keywords
      : []),

    ...(Array.isArray(product.aliases)
      ? product.aliases
      : [])

  ]

  return fields.some(field =>

    this.normalize(field)
      .includes(keyword)

  )

}



  // =====================================================
  // RANK RESULTS
  // =====================================================

  static rank(
    products,
    keyword
  ) {


    return products

      .map(product => ({

        ...product,

        searchScore:

          this.score(
            product,
            keyword
          )

      }))


      .sort((a, b) =>

        b.searchScore -
        a.searchScore

      )

  }



  // =====================================================
  // SEARCH SCORE
  // =====================================================

  static score(
    product,
    keyword
  ) {

    let score = 0


    const name =
      this.normalize(
        product.name
      )


    const brand =
      this.normalize(
        product.brand
      )


    const sku =
      this.normalize(
        product.sku
      )


    const barcode =
      this.normalize(
        product.barcode
      )



    if (name === keyword)

      score += 100



    if (
      name.startsWith(keyword)
    )

      score += 70



    if (
      name.includes(keyword)
    )

      score += 50



    if (
      brand.includes(keyword)
    )

      score += 30



    if (
      sku.includes(keyword)
    )

      score += 40



    if (
      barcode.includes(keyword)
    )

      score += 60



    return score

  }



  // =====================================================
  // TIRE SEARCH
  // =====================================================

  static searchTires(
    products,
    size
  ) {


    const keyword =
      this.normalize(size)


    return products.filter(product =>

      product.category === 'tire' &&

      this.normalize(
        product.size
      ).includes(keyword)

    )

  }



  // =====================================================
  // BATTERY SEARCH
  // =====================================================

  static searchBatteries(
    products,
    specification
  ) {


    const keyword =
      this.normalize(
        specification
      )


    return products.filter(product =>

      product.category === 'battery' &&

      (

        this.normalize(
          product.model
        ).includes(keyword)

        ||

        this.normalize(
          product.capacity
        ).includes(keyword)

      )

    )

  }



  // =====================================================
  // NORMALIZE
  // =====================================================

  static normalize(value) {

    return String(
      value || ''
    )

      .toLowerCase()

      .trim()

  }


}


export default SmartSearchEngine