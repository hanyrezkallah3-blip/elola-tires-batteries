export default function getPublicProductData(

  warehouses = [],

  productId

) {

  for (const warehouse of warehouses) {

    const product =

      (warehouse.products || []).find(

        item =>

          item.productId === productId &&

          Number(item.quantity) > 0

      )

    if (!product)

      continue

    return {

      productId:

        product.productId,

      name:

        product.productName,

      image:

        product.image,

      description:

        product.description,

      specifications:

        product.specifications,

      brand:

        product.brand,

      category:

        product.category,

      salePrice:

        product.salePrice,

      available:

        true,

      warehouseId:

        warehouse.id,

      warehouseName:

        warehouse.name

    }

  }

  return null

}