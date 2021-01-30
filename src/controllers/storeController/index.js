const Store = require('../../models/Store')
const helpers = require('../../helpers')

module.exports = {
    async createStore(req, res) {
        const bodydata = req.body;

        const { bearer } = req.headers
        const { cnpj } = bodydata

        console.log("req", req.user)

        try {
            store = await Store.findOne({ cnpj })
            if (store !== null) {
                return res.status(400).json({ message: "Cnpj ja cadastrado" })
            }
            bodydata = await newStore.populate('userName').execPopulate()
            const newStore = await Store.create(bodydata)
            return res.status(200).json(newStore)
        } catch (error) {
            return res.status(400).json(error.message)
        }
    },
    async getStore(req, res) {
        try {
            const stores = await Store.find()

            return res.status(200).json(stores)

        } catch (error) {
            return res.status(400).json(error)
        }
    },
    async getStoreById(req, res) {

        const { store_id } = req.params

        try {
            const store = await Store.findById(store_id)

            return res.status(200).json(store)

        } catch (error) {

            return res.status(400).json(error)

        }
    },
    async updateStore(req, res) {

        const bodydata = req.body

        const { store_id } = req.params

        try {

            const updatedStore = await Store.findByIdAndUpdate(store_id, bodydata, { new: true })

            return res.status(200).json(updatedStore)

        } catch (error) {

            return res.status(400).json(error)
        }
    },
    async addInfluencer(req, res) {

        const bodydata = req.body

        const { store_id } = req.params
        const { influencerListFront } = bodydata

        try {
            const store = await Store.findById(store_id)
            const { influencerList } = store
            influencerListFront.forEach(element => {
                influencerList.push(element)
            });
            const updatedStore = await Store.findByIdAndUpdate(store_id, { influencerList: influencerList }, { new: true })
            return res.status(200).json(updatedStore)
        } catch (error) {
            return res.status(400).json(error)
        }
    },
    async removeInfluencer(req, res) {

        const bodydata = req.body

        const { store_id } = req.params
        const { influencerListFront } = bodydata

        try {
            const store = await Store.findById(store_id)
            const { influencerList } = store
            influencerListFront.forEach(element => {
                influencerList.splice(influencerList.indexOf(element), 1)
            });
            const updatedStore = await Store.findByIdAndUpdate(store_id, { influencerList: influencerList }, { new: true })
            return res.status(200).json(updatedStore)
        } catch (error) {
            return res.status(400).json(error)
        }
    }
}