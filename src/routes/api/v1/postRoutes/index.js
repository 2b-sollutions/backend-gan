const { Router } = require('express')
const routes = Router()
const authenticationn = require('../../../../middlewares')
const postController = require('../../../../controllers/postController')

routes.post('/createPost', postController.createPost)

routes.get('/', postController.getPost)
routes.get('/myPosts', authenticationn.verifyToken, postController.getMyPosts)

routes.get('/postInfluencer', postController.getPostInfluencer)
routes.get('/searchAll', postController.getPostInfluencer)
routes.get('/user/:user_id', postController.getPostByUserId)

routes.delete('/:post_id', postController.deletePost)
routes.get('/:post_id/post', postController.getPostById)

module.exports = routes
