const Category = require('../../models/Category')
const Product = require('../../models/Product')
const User = require('../../models/User')
const Post = require('../../models/Post')
const Color = require('../../models/Color')
const Size = require('../../models/Size')
const Helpers = require('../../helpers/comuns')
const dayjs = require('dayjs')

module.exports = {
  async createProduct (req, res) {
    const listImage = []
    const { token } = req.headers
    const decoded = await Helpers.decodeToken(token, { complete: true })
    const tokenData = decoded.payloadRequest
    const bodyData = req.body
    
    try {

      for (const image of bodyData.productListImages) {
        const response = await Helpers.uploadImage(image)
        listImage.push(response.Location)
      };
      const user = await User.find({ _id: tokenData.id })
      const category = await Category.findById(bodyData.idCategory)
      const store = {
        store: {
          userId: user[0]._id,
          userImage: user[0].userImage,
          userName: user[0].userName
        }
      }

      const productCategory = {
        productCategory: {
          idCategory: category._id,
          nameCategory: category.name,
          weightCategory: category.weight
        }
      }
      bodyData.productListImages = listImage
      const payloadCreate = { ...bodyData, ...store, ...productCategory }
      const newProduct = await Product.create(payloadCreate)
      return res.status(200).json(newProduct)
    } catch (error) {
      return res.status(400).json(error)
    }
  },

  async updateProduct (req, res) {
    const decoded = await Helpers.decodeToken(token, { complete: true })
    const tokenData = decoded.payloadRequest
    const bodyData = req.body
    const { product_id } = req.params
    try {

      const user = await User.find({ _id: tokenData.id })
      const category = await Category.findById(bodyData.idCategory)
      const store = {
        store: {
          userId: user[0]._id,
          userImage: user[0].userImage,
          userName: user[0].userName
        }
      }
      const productCategory = {
        productCategory: {
          idCategory: category._id,
          nameCategory: category.name,
          weightCategory: category.weight
        }
      }
      const payloadCreate = { ...bodyData, ...store, ...productCategory }
      const updatedProduct = await Product.findByIdAndUpdate(product_id, payloadCreate, { new: true })
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
    const { product_id } = req.params
    try {
      const deletedProduct = await Product.findByIdAndDelete(product_id)


      const 
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
  async createCategory (req, res) {
    const bodydata = req.body
    try {
      const newCategory = await Category.create(bodydata)
      return res.status(200).json(newCategory)
    } catch (error) {
      return res.status(400).json(error)
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
  },
  async getCategory (req, res) {
    try {
      const listCategory = await Category.find()
      return res.status(200).json(listCategory)
    } catch (error) {
      return res.status(400).json(error)
    }
  }
}
