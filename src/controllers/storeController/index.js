const Store = require('../../models/Store')
const User = require('../../models/User')
const Product = require('../../models/Product')
const Helpers = require('../../helpers/comuns')

module.exports = {
  async createStore (req, res) {
    const bodydata = req.body
    const { token } = req.headers
    const { cnpj } = bodydata
    const decoded = await Helpers.decodeToken(token, { complete: true })
    const userModel = decoded.payloadRequest
    const storeObject = { userId: userModel.id, ...bodydata }
    try {
      const store = await Store.findOne({ cnpj })
      if (store !== null) {
        return res.status(400).json({ message: 'Cnpj ja cadastrado' })
      }
      const createdStore = await Store.create(storeObject)
      await User.findByIdAndUpdate(userModel.id, { registerCompleted: true }, { new: true })
      await createdStore.populate('userName').execPopulate()
      return res.status(200).json(createdStore)
    } catch (error) {
      return res.status(400).json(error.message)
    }
  },
  async getStore (req, res) {
    try {
      const stores = await Store.find()
      return res.status(200).json(stores)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async getStoreById (req, res) {
    const { store_id } = req.params
    try {
      const store = await Store.findById(store_id)
      return res.status(200).json(store)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async updateStore (req, res) {
    const bodydata = req.body
    const { store_id } = req.params
    try {
      const updatedStore = await Store.findByIdAndUpdate(store_id, bodydata, { new: true })
      return res.status(200).json(updatedStore)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async addInfluencer (req, res) {
    const bodydata = req.body
    const { token } = req.headers
    const decoded = await Helpers.decodeToken(token, { complete: true })
    const store_id = decoded.payloadRequest.id
    const { influencerListFront } = bodydata
    try {
      const store = await Store.find({ userId: store_id })
      const influencerList = store[0].influencerList
      influencerListFront.forEach(element => {
        influencerList.push(element)
      })
      const updatedStore = await Store.findByIdAndUpdate(store[0]._id, { influencerList: influencerList }, { new: true })
      return res.status(200).json(updatedStore)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async removeInfluencer (req, res) {
    const bodydata = req.body
    const { token } = req.headers
    const decoded = await Helpers.decodeToken(token, { complete: true })
    const store_id = decoded.payloadRequest.id
    const { influencerListFront } = bodydata
    try {
      const store = await Store.findById(store_id)
      const { influencerList } = store
      influencerListFront.forEach(element => {
        influencerList.splice(influencerList.indexOf(element), 1)
      })
      const updatedStore = await Store.findByIdAndUpdate(store_id, { influencerList: influencerList }, { new: true })
      return res.status(200).json(updatedStore)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async getProductsByStore (req, res) {
    const { store_id } = req.params
    const { page = 1, limit = 3 } = req.query
    const payloadResponse = []
    try {
      const quantidadeTotal = await Product.find({ 'store.userId': store_id }).count()
      const products = await Product.find({ 'store.userId': store_id }).sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit)
      const totalPage = Math.round(quantidadeTotal / limit)

      products.forEach(product => {
        const payloadForEachResponse = {
          product_id: product._id,
          product_image: product.productListImages[0],
          prouct_name: product.productName,
          product_price: product.productPrice
        }
        payloadResponse.push(payloadForEachResponse)
      })
      return res.status(200).json({ payloadResponse, totalPage })
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async getStoreByUsername (req, res) {
    try {
      const { token } = req.headers
      const userName = req.params.user_name
      const user = await User.find({ userName })

      if (user.length === 0) {
        return res.status(400).json({ message: 'Nome de usuario não encontrado' })
      }
      const store = await Store.find({ userId: user[0].id })
      const decoded = await Helpers.decodeToken(token, { complete: true })
      const payloadResponse = {
        userName: user[0].userName,
        userImage: user[0].userImage,
        _id: user[0].id,
        description: store[0].descriptionProfile
      }
      if (token) {
        const data = {
          userIdtoken: decoded.payloadRequest.id,
          userId: user[0].id
        }
        const isSameProfile = await Helpers.verifyProfile(data)
        if (isSameProfile) {
          return res.status(200).json(payloadResponse)
        } else {
          return res.status(203).json(payloadResponse)
        }
      }
      return res.status(203).json(payloadResponse)
    } catch (error) {
      return res.status(400).json(error.message)
    }
  }
}
