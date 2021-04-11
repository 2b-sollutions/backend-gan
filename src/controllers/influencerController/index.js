const Influencer = require('../../models/Influencer')
const User = require('../../models/User')
const Product = require('../../models/Product')
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
            console.log("USER", user[0].id)
            if (user.length === 0) {
                return res.status(400).json({ message: "Nome de usuario não encontrado" })
            }
            const influencer = await Influencer.find({ userId: user[0].id })

            const payloadResponse = {
                userName: user.userName,
                userImage: user.userImage,
                _id: user.id,
                description: influencer.fullName
            }

            return res.status(200).json(payloadResponse)

        } catch (error) {
            return res.status(400).json(error.message)
        }
    },
    async getPostInfluencer(req, res) {
        try {

            const influencers = await Influencer.find()

            const payloadResponse = await Promise.allSettled(

                influencers.map(async(element) => {

                    const posts = await Post.find({ userId: element.userId })

                    for (const post of posts) {
                        const productDetailList = await Promise.all(post.productList.map(async(element) => {
                            const product = await Product.findById({ _id: element })
                            return product
                        }))

                        const payloadResponse = {
                            _id: post._id,
                            imagePost: post.imagePost,
                            description: post.description,
                            createdAt: post.createdAt,
                            userId: post.userId,
                            productDetailList
                        }
                        return payloadResponse
                    }
                })
            )

            return res.status(200).json(payloadResponse)

        } catch (error) {
            return res.status(400).json(error.message)
        }
    },
}