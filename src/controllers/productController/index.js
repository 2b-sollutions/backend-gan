const Product = require('../../models/Product')
const Post = require('../../models/Post')
const Color = require('../../models/Color')
const Size = require('../../models/Size')

const dayjs = require('dayjs')
module.exports = {
  async createProduct (req, res) {
    const bodydata = req.body
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
  async getUserProducts (req, res) {
    const { store_id } = req.params
    try {
      const producs = await Product.find({ store: store_id })
      return res.status(200).json(producs)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async updateProduct (req, res) {
    const bodydata = req.body
    const { product_id, store_id } = req.params
    try {
      const updatedProduct = await Product.findByIdAndUpdate(product_id, bodydata, { new: true })
      return res.status(200).json(updatedProduct)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async getProducts (req, res) {
    try {
      const producs = await Product.find()
      return res.status(200).json(producs)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async deleteProduct (req, res) {
    const { product_id, user_id } = req.params
    try {
      const deletedProduct = await Product.findByIdAndDelete(product_id)
      return res.status(200).json(deletedProduct)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async getProductById (req, res) {
    const { product_id } = req.params
    try {
      const product = await Product.findById(product_id)
      return res.status(200).json(product)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async getProductByPostId (req, res) {
    try {
      const post = await Post.findById({ _id: req.params.post_id })
      const day = dayjs(new Date())
      const updatedDays = day.diff(post.createdAt, 'day')
      const updatedWeek = day.diff(post.createdAt, 'week')
      const updatedMonth = day.diff(post.createdAt, 'month')
      const productDetailList = await Promise.all(post.productList.map(async (element) => {
        const product = await Product.findById({ _id: element })
        return product
      }))
      const payloadResponse = {
        postId: post._id,
        imagePost: post.imagePost,
        descriptionPost: post.description,
        updateDate: {
          updatedDays,
          updatedWeek,
          updatedMonth
        },
        productDetailList
      }
      return res.status(200).json(payloadResponse)
    } catch (error) {
      return res.status(400).json(error.message)
    }
  },
  async createColor (req, res) {
    const bodydata = req.body
    try {
      const newColor = await Color.create(bodydata)
      return res.status(200).json(newColor)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async createSize (req, res) {
    const bodydata = req.body
    try {
      const newSize = await Size.create(bodydata)
      return res.status(200).json(newSize)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async getColor (req, res) {
    try {
      const listColor = await Color.find()
      return res.status(200).json(listColor)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async getSize (req, res) {
    try {
      const listSize = await Size.find()
      return res.status(200).json(listSize)
    } catch (error) {
      return res.status(400).json(error)
    }
  }
}
