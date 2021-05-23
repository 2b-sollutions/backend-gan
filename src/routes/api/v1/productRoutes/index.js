const { Router } = require('express')
const routes = Router()

const productController = require('../../../../controllers/productController')

routes.post('/', productController.createProduct)
routes.get('/:store_id/store/', productController.getUserProducts)
routes.put('/:store_id/:product_id', productController.updateProduct)
routes.delete('/:store_id/:product_id', productController.deleteProduct)

routes.get('/', productController.getProducts)
routes.get('/:product_id/product', productController.getProductById)
routes.post('/color/color', productController.createColor)
routes.post('/size/size', productController.createSize)
routes.get('/size/size', productController.getSize)
routes.get('/color/color', productController.getColor)

module.exports = routes
