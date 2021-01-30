const Product = require('../../models/Product')
module.exports = {
    async createProduct(req, res) {
        const bodydata = req.body;
        const { store_id } = req.params
        try {
            const data = { store_id, ...bodydata }

            const newProduct = await Product.create(data)

            await newProduct.populate('userName').execPopulate()

            return res.status(200).json(newProduct)

        } catch (error) {

            return res.status(400).json(error)

        }
    },
    async getUserProducts(req, res) {

        const { store_id } = req.params

        try {
            const producs = await Product.find({ userName: store_id })

            return res.status(200).json(producs)

        } catch (error) {

            return res.status(400).json(error)

        }
    },
    async updateProduct(req, res) {

        const bodydata = req.body

        const { product_id, store_id } = req.params

        try {

            const updatedProduct = await Product.findByIdAndUpdate(product_id, bodydata, { new: true })

            return res.status(200).json(updatedProduct)

        } catch (error) {

            return res.status(400).json(error)
        }
    },
    async getProducts(req, res) {
        try {
            const producs = await Product.find()

            return res.status(200).json(producs)

        } catch (error) {
            return res.status(400).json(error)
        }
    },
    async deleteProduct(req, res) {

        const { product_id, user_id } = req.params
        try {

            const deletedProduct = await Product.findByIdAndDelete(product_id)
            return res.status(200).json(deletedProduct)

        } catch (error) {

            return res.status(400).json(error)
        }
    },
    async getProductById(req, res) {
        const { product_id } = req.params
        console.log("PRODUCTID", product_id)
        try {

            const product = await Product.findById(product_id)

            return res.status(200).json(product)

        } catch (error) {

            return res.status(400).json(error)
        }
    }
}