const { Router } = require('express')
const routes = Router()
const authenticationn = require('../../../../middlewares')
const productController = require('../../../../controllers/productController')

routes.post('/', productController.createProduct)
// routes.get('/:store_id/store/', productController.getUserProducts)
routes.put('/:product_id/products', authenticationn.verifyToken, productController.updateProduct)
routes.delete('/:product_id/products', authenticationn.verifyToken , productController.deleteProduct)

routes.get('/', productController.getProducts)
routes.get('/:product_id/product', productController.getProductById)
routes.post('/color', productController.createColor)
routes.post('/size', productController.createSize)
routes.post('/categories', productController.createCategory)
routes.get('/size', productController.getSize)
routes.get('/colors', productController.getColor)
routes.get('/categories', productController.getCategory)

module.exports = routes
