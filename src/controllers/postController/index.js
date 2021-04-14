const Post = require('../../models/Post')
const User = require('../../models/User')
const Helpers = require('../../helpers')
const dayjs = require('dayjs');

module.exports = {

    async createPost(req, res) {

        const bodyData = req.body

        const { token } = req.headers

        var decoded = await Helpers.decodeToken(token, { complete: true });

        const userId = decoded.payloadRequest.id

        try {
            user = await User.findById(userId)
            if (user.profile !== 3) {
                return res.status(400).json({ message: "Você não é um Influenciador" })
            }
            bodyData.userImage = user.userImage

            bodyData.createdAt = new Date()

            bodyData.userId = user._id

            const newPost = await Post.create(bodyData)

            return res.status(200).json(newPost)

        } catch (error) {

            return res.status(400).json(error.message)
        }
    },
    async getPost(req, res) {

        try {
            const posts = await Post.find()
            const payloadResponse = await Promise.all(
                posts.map(async(element) => {
                    const day = dayjs(new Date());
                    const updatedDays = day.diff(element.createdAt, "day")
                    const updatedWeek = day.diff(element.createdAt, "week")
                    const updatedMonth = day.diff(element.createdAt, "month")
                    const user = await User.findById(element.userId)
                    const payloadResponse = {
                        user: user.userName,
                        userImage: user.userImage,
                        updateDate: {
                            updatedDays,
                            updatedWeek,
                            updatedMonth,
                        },
                        imagePost: element.imagePost,
                        postId: element.id
                    }
                    return payloadResponse
                }))

            return res.status(200).json(payloadResponse)

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

            const deletedPost = await Post.findByIdAndDelete(post_id)

            return res.status(200).json(deletedPost)

        } catch (error) {

            return res.status(400).json(error)
        }
    },
    async getPostByUserId(req, res) {

        const userId = req.params.user_id
        try {

            const posts = await Post.find({ userId: userId })

            return res.status(200).json(posts)

        } catch (error) {

            return res.status(400).json(error)
        }
    },
    async getPostInfluencer(req, res) {
        try {

            const influencers = await Influencer.find()

            const payloadResponse = await Promise.allSettled(

                influencers.map(async(element) => {

                    const posts = await Post.find({ userId: element.userId })
                    const user = await User.find({ _id: element.userId })
                    const postsList = []
                    for (const post of posts) {

                        const productDetailList = await Promise.all(post.productList.map(async(element) => {
                            const product = await Product.findById({ _id: element })
                            return product
                        }))
                        const payloadResponse = {
                            postId: post._id,
                            userId: user[0]._id,
                            userName: user[0].userName,
                            userImage: user[0].userImage,
                            imagePost: post.imagePost,
                            descriptionPost: post.description,
                            createdAt: post.createdAt,
                            productDetailList

                        }
                        postsList.push(payloadResponse)

                    }
                    return postsList
                })
            )

            return res.status(200).json(payloadResponse)

        } catch (error) {
            return res.status(400).json(error.message)
        }
    }


}