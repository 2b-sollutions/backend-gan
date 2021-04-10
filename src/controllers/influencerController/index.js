const Influencer = require('../../models/Influencer')
const User = require('../../models/User')
const Helpers = require('../../helpers')
const Post = require('../../models/Post')
module.exports = {

    async createInfluencer(req, res) {

        const bodydata = req.body;

        const { token } = req.headers;

        const { cpf } = bodydata

        var decoded = await Helpers.decodeToken(token, { complete: true });

        const userModel = decoded.payloadRequest

        const influencerObject = { userId: userModel.id, ...bodydata }

        try {
            influencer = await Influencer.findOne({ cpf })
            if (influencer !== null) {
                return res.status(400).json({ message: "Cpf ja cadastrado" })
            }
            const newInfluencer = await Influencer.create(influencerObject)
            return res.status(200).json(newInfluencer)

        } catch (error) {

            return res.status(400).json(error.message)

        }
    },
    async getInfluencer(req, res) {
        try {

            const influencers = await Influencer.find()

            return res.status(200).json(influencers)

        } catch (error) {
            return res.status(400).json(error)
        }
    },
    async getMyAcount(req, res) {

        const { token } = req.headers;

        var decoded = await Helpers.decodeToken(token, { complete: true });

        try {

            const _id = decoded.payloadRequest.id

            const myAcount = await Influencer.find({ userId: _id })

            return res.status(200).json(myAcount)

        } catch (error) {

            return res.status(400).json(error)

        }
    },
    async getInfluencerByUserName(req, res) {
        try {
            const userName = req.params.userName
            const user = await User.find({ userName })
            if (user.length === 0) {
                return res.status(400).json({ message: "Nome de usuario não encontrado" })
            }
            const influencer = await Influencer.find({ userId: user[0].id })


            return res.status(200).json(influencer)

        } catch (error) {
            return res.status(400).json(error.message)
        }
    },
    async getPostInfluencer(req, res) {
        try {

            const influencers = await Influencer.find()

            const payloadResponse = await Promise.allSettled(
                influencers.map(async(element) => {

                    const user = await User.findById(element.userId)

                    const post = await Post.find({ userId: element.userId })

                    const payloadResponse = {
                        user: user.userName,
                        userImage: user.userImage,
                        post: post
                    }
                    console.log("payloadResponse", payloadResponse)
                    return payloadResponse
                }))

            return res.status(200).json(payloadResponse)

        } catch (error) {
            return res.status(400).json(error)
        }
    },
}