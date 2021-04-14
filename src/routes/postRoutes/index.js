const { Router } = require('express')
const routes = Router()
const authenticationn = require('../../middlewares')
const postController = require("../../controllers/postController")

routes.post('/post/createPost', postController.createPost)

routes.get('/post', postController.getPost)
routes.get('/post/myPosts', authenticationn.verifyToken, postController.getMyPosts)

routes.get('/post/:postInfluencer', postController.getPostInfluencer)
routes.get('/post/:user_id', postController.getPostByUserId)

routes.delete('/post/:post_id', postController.deletePost)






module.exports = routes