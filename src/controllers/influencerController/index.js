const Influencer = require('../../models/Influencer')

module.exports = {
    async createInfluencer(req, res) {
        const bodydata = req.body;

        const { cpf } = bodydata

        try {
            influencer = await Influencer.findOne({ cpf })
            if (influencer !== null) {
                return res.status(400).json({ message: "Cpf ja cadastrado" })
            }
            const newInfluencer = await Influencer.create(bodydata)
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
    async getInfluencerById(req, res) {

        const { influencer_id } = req.params
        try {

            const influencer = await Influencer.findById(influencer_id)

            return res.status(200).json(influencer)

        } catch (error) {

            return res.status(400).json(error)

        }
    }
}