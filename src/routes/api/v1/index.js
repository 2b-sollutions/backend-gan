const router = require('express').Router()

router.use('/users', require('./userRoutes'))
router.use('/carts', require('./cartRoutes'))
router.use('/login', require('./loginRoutes'))
router.use('/products', require('./productRoutes'))
router.use('/stores', require('./storeRoutes'))
router.use('/influencers', require('./influencerRoutes'))
router.use('/post', require('./postRoutes'))
router.use('/payment', require('./paymentRoutes'))
router.use('/orders', require('./orderRoutes'))

module.exports = router
