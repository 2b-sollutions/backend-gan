const Influencer = require('../../models/Influencer')
const Store = require('../../models/Store')
const User = require('../../models/User')
const Helpers = require('../../helpers/comuns')
module.exports = {

  async createInfluencer (req, res) {
    const bodydata = req.body
    const { token } = req.headers
    const { cpf } = bodydata
    const decoded = await Helpers.decodeToken(token, { complete: true })
    const userModel = decoded.payloadRequest
    const influencerObject = { userId: userModel.id, ...bodydata }

    try {
      const influencer = await Influencer.findOne({ cpf })
      if (influencer !== null) {
        return res.status(400).json({ message: 'Cpf ja cadastrado' })
      }
      const newInfluencer = await Influencer.create(influencerObject)
      const response = await Helpers.uploadImage(bodydata.userImage)
      await User.findByIdAndUpdate(userModel.id, { registerCompleted: true, userImage: response.Location }, { new: true })
      return res.status(200).json(newInfluencer)
    } catch (error) {
      return res.status(400).json(error.message)
    }
  },
  async getInfluencer (req, res) {
    try {
      const influencers = await Influencer.find()
      return res.status(200).json(influencers)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async getMyAcount (req, res) {
    const { token } = req.headers
    const decoded = await Helpers.decodeToken(token, { complete: true })
    try {
      const _id = decoded.payloadRequest.id
      const myAcount = await Influencer.find({ userId: _id })
      return res.status(200).json(myAcount)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async getInfluencerByUserName (req, res) {
    try {
      const { token } = req.headers
      const userName = req.params.userName
      const user = await User.find({ userName })

      if (user.length === 0) {
        return res.status(400).json({ message: 'Nome de usuario não encontrado' })
      }
      const influencer = await Influencer.find({ userId: user[0].id })
      const decoded = await Helpers.decodeToken(token, { complete: true })
      const payloadResponse = {
        userName: user[0].userName,
        userImage: user[0].userImage,
        _id: user[0].id,
        description: influencer[0].descriptionProfile
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
  },
  async getMyStores (req, res) {
    const { token } = req.headers
    const decoded = await Helpers.decodeToken(token, { complete: true })
    const storeList = []
    try {
      const _id = decoded.payloadRequest.id
      const myStores = await Store.find({ influencerList: _id })
      for (const store of myStores) {
        const user = await User.find({ _id: store.userId })
        const payloadResponse = {
          store_id: user[0].id,
          store_image: user[0].userImage,
          store_name: user[0].userName
        }
        storeList.push(payloadResponse)
      }
      return res.status(200).json(storeList)
    } catch (error) {
      return res.status(400).json(error.message)
    }
  }
}
