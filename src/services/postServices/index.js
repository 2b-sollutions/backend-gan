const Post = require('../../models/Post')
const Influencer = require('../../models/Influencer')
const User = require('../../models/User')
const Product = require('../../models/Product')

module.exports = {

  async getPostInfluencer (req) {
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
