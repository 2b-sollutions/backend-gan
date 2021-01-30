const Cart = require('../../models/Cart')
module.exports = {
    async createCart(req, res) {
        const bodyData = req.body
        const { user_id } = req.params
        try {
            const createdCart = await Cart.create({ userName: user_id, ...bodyData })
            await createdCart.populate('products').execPopulate()
            return res.status(200).json(createdCart)
        } catch (error) {
            return res.status(400).json(error)
        }
    },
    async getUserCarts(req, res) {
        const bodyData = req.body
        const { user_id } = req.params
        try {
            const createdCart = await Cart.create({ userName: user_id, ...bodyData })
            await createdCart.populate('products').execPopulate()
            return res.status(200).json(createdCart)
        } catch (error) {
            return res.status(400).json(error)
        }
    },
    async getCart(req, res) {
        const bodyData = req.body
        const { user_id } = req.params
        try {
            const createdCart = await Cart.create({ userName: user_id, ...bodyData })
            await createdCart.populate('products').execPopulate()
            return res.status(200).json(createdCart)
        } catch (error) {
            return res.status(400).json(error)
        }
    }
}