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
      User.findByIdAndUpdate(userModel.id, { registerCompleted: true }, { new: true })
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
      const store = await Store.findById(store_id)
      const { influencerList } = store
      influencerListFront.forEach(element => {
        influencerList.push(element)
      })
      const updatedStore = await Store.findByIdAndUpdate(store_id, { influencerList: influencerList }, { new: true })
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
  async productStore (req, res) {
    try {
      const store = await Store.find()

      const payloadResponse = await Promise.all(
        store.map(async (itemStore) => {
          const products = await Product.find()
          const productsForStore = []
          for (const item of products) {
            if (item.store.idStore.toString() === itemStore._id.toString()) {
              productsForStore.push(item)
            }
          }
          const payloadIf = {
            nameStore: itemStore.razaoSocial,
            products: productsForStore
          }
          return payloadIf
        }))

      const payLoadFiltered = payloadResponse.filter((item) => {
        if (item.products.length > 0) {
          return item
        }
      })

      return res.status(200).json(payLoadFiltered)
    } catch (error) {
      return res.status(400).json(error.message)
    }
  }
}
