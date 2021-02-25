const Cart = require('../../models/Cart')
const Helpers = require('../../helpers')
module.exports = {

    async createCart(req, res) {

        const bodyData = req.body

        const { token } = req.headers

        var decoded = await Helpers.decodeToken(token, { complete: true });

        const userId = decoded.payloadRequest.id

        try {
            const createdCart = await Cart.create({ userId, ...bodyData })

            await createdCart.populate('products').execPopulate()

            return res.status(200).json(createdCart)

        } catch (error) {
            return res.status(400).json(error)
        }
    },
    async getUserCarts(req, res) {

        const { user_id } = req.params

        try {

            const userCart = await Cart.findById({ userName: user_id })

            await userCart.populate('products').execPopulate()

            return res.status(200).json(userCart)

        } catch (error) {

            return res.status(400).json(error)

        }
    },
    async getMyCart(req, res) {

        const { token } = req.headers;

        var decoded = await Helpers.decodeToken(token, { complete: true });

        try {

            const userId = decoded.payloadRequest.id

            const myCart = await Cart.findOne({ userId })

            await myCart.populate('products').execPopulate()

            return res.status(200).json(myCart)

        } catch (error) {

            return res.status(400).json(error)
        }
    },
    async getCarts(req, res) {

        try {

            const listCart = await Cart.find()

            await listCart.populate('products').execPopulate()

            return res.status(200).json(listCart)

        } catch (error) {

            return res.status(400).json(error)

        }
    }
}