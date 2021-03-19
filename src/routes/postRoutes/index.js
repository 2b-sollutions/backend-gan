const { Router } = require('express')
const routes = Router()
const authenticationn = require('../../middlewares')
const postController = require("../../controllers/postController")

routes.post('/post', authenticationn.verifyToken, postController.createPost)

routes.get('/post/myPosts', authenticationn.verifyToken, postController.getMyPosts)

routes.get('/post/', postController.getPost)

routes.delete('/post/:post_id', postController.deletePost)


module.exports = routes