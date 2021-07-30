const Store = require('../../models/Store')
const User = require('../../models/Store')
const Product = require('../../models/Product')

module.exports = {
  async searchStoreByProductList (productLists) {
    try {
      const productListForStore = []
      const storeListArr = []
      const productList = []
      for (const productItem of productLists) {
        const product = await Product.findById(productItem.productId)
        const storeProduct = await Store.find({ userId: product.store.userId })
        const userModel = await User.findById({ _id: product.store.userId })
        if (!storeListArr.includes(storeProduct.userId)) {
          storeListArr.push(storeProduct.userId)
          productList.push(productItem)
          const storeList = {
            storeId: storeProduct.userId,
            storeName: userModel.userName,
            storeImage: userModel.image,
            productList
          }
          productListForStore.push(storeList)
        } else {
          productListForStore.map((item) => {
            if (item.userId === product.store.userId) {
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
