const { Router } = require('express')
const routes = Router()

const productController = require('../../../../controllers/productController')

routes.post('/:store_id', productController.createProduct)
routes.get('/store/:store_id', productController.getUserProducts)
routes.put('/:store_id/:product_id', productController.updateProduct)
routes.delete('/:store_id/:product_id', productController.deleteProduct)

routes.get('/', productController.getProducts)
routes.get('/:product_id', productController.getProductById)
routes.get('/post/:post_id', productController.getProductByPostId)

module.exports = routes
