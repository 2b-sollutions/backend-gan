const User = require('../../models/User')
const helpers = require('../../helpers/comuns')
module.exports = {
  async createUser (req, res) {
    const bodydata = req.body
    const { password, userName } = bodydata
    try {
      const user = await User.findOne({ userName })
      if (user !== null) {
        return res.status(400).json({ message: 'Usuario ja cadastrado' })
      }
      const encryptPassword = await helpers.encryptPassword(password)
      bodydata.password = encryptPassword
      // const response = await helpers.uploadImage(bodydata.userImage)
      // bodydata.userImage = response.Location
      bodydata.fullName = bodydata.fullName ? bodydata.fullName : bodydata.userName
      const newUser = await User.create(bodydata)
      return res.status(200).json(newUser)
    } catch (error) {
      return res.status(400).json(error.message)
    }
  },
  async getUser (req, res) {
    try {
      const users = await User.find()
      return res.status(200).json(users)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async getUserById (req, res) {
    const { user_id } = req.params
    try {
      const user = await User.findById(user_id)
      return res.status(200).json(user)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async deleteUser (req, res) {
    const { user_id } = req.params
    try {
      const deletedUser = await User.findByIdAndDelete(user_id)
      return res.status(200).json(deletedUser)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async activateUser (req, res) {
    const { userId, userActivate } = req.body
    try {
      await User.findByIdAndUpdate(userId, { userActivate: userActivate }, { new: true })
      return res.status(200).json('atualizado com sucesso')
    } catch (error) {
      return res.status(400).json(error)
    }
  }
}
