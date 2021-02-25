const Influencer = require('../../models/Influencer')
const Helpers = require('../../helpers')
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
    async getInfluencerById(req, res) {
        try {

            const influencers = await Influencer.find()

            return res.status(200).json(influencers)

        } catch (error) {
            return res.status(400).json(error)
        }
    },
}