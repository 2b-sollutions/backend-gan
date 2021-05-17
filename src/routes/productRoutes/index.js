const { Router } = require('express')
const routes = Router()

const productController = require('../../controllers/productController')

routes.post('/products/:store_id', productController.createProduct)
routes.get('/products/store/:store_id', productController.getUserProducts)
routes.put('/products/:store_id/:product_id', productController.updateProduct)
routes.delete('/products/:store_id/:product_id', productController.deleteProduct)

routes.get('/products', productController.getProducts)
routes.get('/products/:product_id', productController.getProductById)
routes.get('/products/post/:post_id', productController.getProductByPostId)

module.exports = routes
