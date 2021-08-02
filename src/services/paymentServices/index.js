const Store = require('../../models/Store')
const User = require('../../models/User')
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
        const userProperties = await User.findById(storeProduct[0].userId)
        if (!storeListArr.includes(storeProduct[0].userId)) {
          storeListArr.push(storeProduct[0].userId)
          productList.push(productItem)
          const storeList = {
            storeId: storeProduct[0].userId,
            storeName: userProperties.userName,
            storeImage: userProperties.userImage,
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
