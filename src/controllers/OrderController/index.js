const Order = require('../../models/Order')
const helpers = require('../../helpers')
module.exports = {
    async createOrder(req, res) {

        const bodydata = req.body;
        const { password, userName } = bodydata
        const { token } = req.headers;
        var decoded = await Helpers.decodeToken(token, { complete: true });
        const userId = decoded.payloadRequest.id

        try {
            order = await Order.findOne({ userId })

            const newOrder = await Order.create(bodydata)
            return res.status(200).json(newOrder)
        } catch (error) {
            return res.status(400).json(error.message)
        }
    },
    async getUser(req, res) {
        try {
            const users = await User.find()
            return res.status(200).json(users)
        } catch (error) {
            return res.status(400).json(error)
        }
    },
    async getUserById(req, res) {
        const { user_id } = req.params
        try {
            const user = await User.findById(user_id)
            return res.status(200).json(user)
        } catch (error) {
            return res.status(400).json(error)
        }
    },
    async deleteUser(req, res) {

        const { user_id } = req.params
        try {

            const deletedUser = await User.findByIdAndDelete(user_id)
            return res.status(200).json(deletedUser)

        } catch (error) {

            return res.status(400).json(error)
        }
    }
}