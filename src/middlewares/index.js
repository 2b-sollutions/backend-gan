const jwt = require('jsonwebtoken')

module.exports = {
  async verifyToken (req, res, next) {
    const { token } = req.headers
    const { user_id } = req.params

    if (!token) return res.status(400).json({ message: 'No token' })
    // if (authentication !== user_id) {
    //     return res.status(403).json({ message: 'Not Allowedd' })
    // }
    try {
      const secretKey = process.env.SECRET_KEY
      const validToken = await jwt.verify(token, secretKey)
      req.user = validToken
    } catch (error) {
      return res.status(404).json({ message: 'Token Invalido' })
    }
    next()
  }
}
