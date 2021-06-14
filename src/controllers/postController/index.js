const Post = require('../../models/Post')
const Influencer = require('../../models/Influencer')
const User = require('../../models/User')
const Product = require('../../models/Product')
const postServices = require('../PostController/services')

// const fs = require('fs')

const Helpers = require('../../helpers/comuns')
const dayjs = require('dayjs')

module.exports = {
  async createPost (req, res) {
    const bodyData = req.body
    const { token } = req.headers
    const decoded = await Helpers.decodeToken(token, { complete: true })
    const userId = decoded.payloadRequest.id
    const user = await User.findById(userId)
    if (user.profile !== 3) {
      return res.status(400).json({ message: 'Você não é um Influenciador' })
    }
    try {
      const listImage = []
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
  async getPost (req, res) {
    try {
      const { page = 1, limit = 10, filter = 0 } = req.query
      let productList = []
      const parameterForProduct = { 'productCategory.nameCategory': filter }
      const queryForProduct = filter.length ? parameterForProduct : null
      if (queryForProduct) {
        const product = await Product.find(queryForProduct)
        productList = product.map(item => {
          return item._id.toString()
        })
      }
      const parameterForPost = { productList: { $in: productList } }
      const queryForPost = productList.length ? parameterForPost : null
      const posts = await Post.find(queryForPost).limit(limit * 1).skip((page - 1) * limit)

      const payloadResponse = await Promise.all(
        posts.map(async (element) => {
          const day = dayjs(new Date())
          const updatedDays = day.diff(element.createdAt, 'day')
          const updatedWeek = day.diff(element.createdAt, 'week')
          const updatedMonth = day.diff(element.createdAt, 'month')
          const user = await User.findById(element.userId)
          const payloadResponse = {
            user: user.userName,
            userImage: user.userImage,
            updateDate: {
              updatedDays,
              updatedWeek,
              updatedMonth
            },
            imagePostList: element.imagePostList,
            postId: element.id
          }
          return payloadResponse
        }))
      return res.status(200).json({ totalPorPage: payloadResponse.length, payloadResponse })
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async getMyPosts (req, res) {
    const { token } = req.headers
    const decoded = await Helpers.decodeToken(token, { complete: true })
    const userId = decoded.payloadRequest.id
    try {
      const { page = 1, limit = 10 } = req.query
      const posts = await Post.find({ userId }).limit(limit * 1).skip((page - 1) * limit)
      return res.status(200).json(posts)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async deletePost (req, res) {
    const { postId } = req.params
    try {
      const deletedPost = await Post.findByIdAndDelete(postId)
      return res.status(200).json(deletedPost)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async getPostById (req, res) {
    const postId = req.params.post_id
    try {
      const post = await Post.findById({ _id: postId })
      const day = dayjs(new Date())
      const updatedDays = day.diff(post.createdAt, 'day')
      const updatedWeek = day.diff(post.createdAt, 'week')
      const updatedMonth = day.diff(post.createdAt, 'month')
      const user = await User.findById(post.userId)
      const productDetailList = await Promise.all(post.productList.map(async (element) => {
        const product = await Product.findById({ _id: element })
        return product
      }))
      const payloadResponse = {
        user: user.userName,
        userImage: user.userImage,
        updateDate: {
          updatedDays,
          updatedWeek,
          updatedMonth
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
  async getPostByUserId (req, res) {
    const userId = req.params.user_id
    try {
      const posts = await Post.find({ userId: userId })
      return res.status(200).json(posts)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  // async searchAll(req, res) {
  //     const { filter = 0 } = req.query
  //     try {
  //         const posts = await Promise.all(
  //             await Post.find({ userId: userId }) await Product.find({ userId: userId }) await Store.find({ userId: userId })
  //         )
  //         return res.status(200).json(posts)
  //     } catch (error) {
  //         return res.status(400).json(error)
  //     }
  // },
  // async getPostInfluencer (req, res) {
  //   try {
  //     const resultEnd = await postServices.getPostInfluencer(req, res)
  //     return res.status(200).json(resultEnd)
  //   } catch (error) {
  //     return res.status(400).json(error.message)
  //   }
  // }
  async getPostInfluencer (req, res) {
    const { page = 1, limit = 10 } = req.query
    const influencers = await Influencer.find().limit(limit * 1).skip((page - 1) * limit)
    const payloadResponse = await Promise.all(
      influencers.map(async (element) => {
        const posts = await Post.find({ userId: element.userId }).limit(limit * 1).skip((page - 1) * limit)
        const user = await User.find({ _id: element.userId })

        const postsList = []
        for (const post of posts) {
          const productDetailList = await Promise.all(await post.productList.map(async (element) => {
            const product = await Product.findById({ _id: element })

            return product
          }))
          const payloadResponseFor = {
            postId: post._id,
            imagePostList: post.imagePostList,
            descriptionPost: post.description,
            createdAt: post.createdAt,
            productDetailList
          }
          postsList.push(payloadResponseFor)
        }

        const payloadResponseEnd = {
          influencerName: user[0].userName,
          postsList
        }
        return payloadResponseEnd
      })
    )

    return payloadResponse
  }
}
