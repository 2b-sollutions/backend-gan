const Post = require('../../models/Post')
const User = require('../../models/User')
const Helpers = require('../../helpers')
module.exports = {

    async createPost(req, res) {

        const bodyData = req.body

        const { token } = req.headers

        var decoded = await Helpers.decodeToken(token, { complete: true });

        const userId = decoded.payloadRequest.id

        try {
            user = await User.findOne({ userId })

            if (user.profile !== 3) {

                return res.status(400).json({ message: "Você não é um Influenciador" })

            }

            bodyData.userImage = user.userImage

            const newPost = await Post.create(bodyData)

            return res.status(200).json(newPost)

        } catch (error) {

            return res.status(400).json(error.message)
        }
    },
    async getPost(req, res) {

        try {

            const posts = await Post.find()

            return res.status(200).json(posts)

        } catch (error) {

            return res.status(400).json(error)

        }
    },
    async getMyPosts(req, res) {

        const { token } = req.headers

        var decoded = await Helpers.decodeToken(token, { complete: true });

        const userId = decoded.payloadRequest.id

        try {

            const posts = await Post.find({ userId })

            return res.status(200).json(posts)

        } catch (error) {

            return res.status(400).json(error)
        }
    },
    async deletePost(req, res) {

        const { post_id } = req.params

        try {

            const deletedPost = await User.findByIdAndDelete(post_id)

            return res.status(200).json(deletedPost)

        } catch (error) {

            return res.status(400).json(error)
        }
    }
}