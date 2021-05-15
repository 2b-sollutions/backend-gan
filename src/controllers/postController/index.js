const Post = require('../../models/Post')
const Influencer = require('../../models/Influencer')
const User = require('../../models/User')
const Product = require('../../models/Product')

// const fs = require('fs')


const Helpers = require('../../helpers')
const dayjs = require('dayjs')

module.exports = {
    async createPost(req, res) {
        const bodyData = req.body
        const { token } = req.headers
        const decoded = await Helpers.decodeToken(token, { complete: true });
        const userId = decoded.payloadRequest.id
        user = await User.findById(userId)
        if (user.profile !== 3) {
            return res.status(400).json({ message: "Você não é um Influenciador" })
        }
        try {
            let listImage = []
            bodyData.userImage = user.userImage
            bodyData.createdAt = new Date()
            bodyData.userId = userId
            for (const image of bodyData.imagePostList) {
                const response = await Helpers.uploadImage(image)
                listImage.push(response.Location)
            };
            bodyData.imagePostList = listImage
            const newPost = await Post.create(bodyData)
            return res.status(200).json(newPost)
        } catch (error) {
            return res.status(400).json(error.message)
        }
    },
    async getPost(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query
            const posts = await Post.find().limit(limit * 1).skip((page - 1) * limit)
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
                        imagePostList: element.imagePostList,
                        postId: element.id
                    }
                    console.log('payloadResponse', payloadResponse)
                    return payloadResponse
                }))
            return res.status(200).json({ totalPorPage: payloadResponse.length, payloadResponse })
        } catch (error) {
            return res.status(400).json(error)
        }
    },
    async getMyPosts(req, res) {
        const { token } = req.headers
        const decoded = await Helpers.decodeToken(token, { complete: true });
        const userId = decoded.payloadRequest.id
        try {
            const { page = 1, limit = 10 } = req.query
            const posts = await Post.find({ userId }).limit(limit * 1).skip((page - 1) * limit)
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
    async getPostById(req, res) {
        const postId = req.params.post_id
        try {
            const post = await Post.findById({ _id: postId })
            console.log("req.params", post)
            const day = dayjs(new Date());
            const updatedDays = day.diff(post.createdAt, "day")
            const updatedWeek = day.diff(post.createdAt, "week")
            const updatedMonth = day.diff(post.createdAt, "month")
            const user = await User.findById(post.userId)
            const productDetailList = await Promise.all(post.productList.map(async(element) => {
                const product = await Product.findById({ _id: element })
                return product
            }))
            const payloadResponse = {
                user: user.userName,
                userImage: user.userImage,
                updateDate: {
                    updatedDays,
                    updatedWeek,
                    updatedMonth,
                },
                imagePostList: post.imagePostList,
                postId: post.id,
                productDetailList
            }
            return res.status(200).json(payloadResponse)
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
            const { page = 1, limit = 10 } = req.query
            const influencers = await Influencer.find()
            const payloadResponse = await Promise.allSettled(
                influencers.map(async(element) => {
                    const posts = await Post.find({ userId: element.userId }).limit(limit * 1).skip((page - 1) * limit)
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
                            imagePostList: post.imagePostList,
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