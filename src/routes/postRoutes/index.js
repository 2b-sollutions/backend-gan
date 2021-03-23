const { Router } = require('express')
const routes = Router()
const authenticationn = require('../../middlewares')
const postController = require("../../controllers/postController")

routes.post('/post/createPost', postController.createPost)

routes.get('/post', postController.getPost)

routes.delete('/post/:post_id', postController.deletePost)

routes.get('/post/myPosts', authenticationn.verifyToken, postController.getMyPosts)




module.exports = routes