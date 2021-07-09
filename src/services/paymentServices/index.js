const Store = require('../../models/Store')
const Product = require('../../models/Product')

module.exports = {
  async searchStoreByProductList (productLists) {
    try {
      const productListForStore = []
      const storeListArr = []
      const productList = []
      for (const productItem of productLists) {
        const product = await Product.findById(productItem._id)
        const storeProduct = await Store.findById(product.store.idStore)

        if (!storeListArr.includes(storeProduct.id)) {
          storeListArr.push(storeProduct.id)
          productList.push(productItem)
          const storeList = {
            storeId: storeProduct.id,
            storeName: storeProduct.razaoSocial,
            storeImage: 'storeProduct.storeImage',
            productList
          }
          productListForStore.push(storeList)
        } else {
          productListForStore.map((item) => {
            if (item.storeId === product.store.idStore) {
              item.productList.push(productItem)
            }
            return item
          })
        }
      }
      return productListForStore
    } catch (error) {
      throw error.message
    }
  }
}
