var jwt = require('jsonwebtoken');

module.exports = {
    async verifyToken(req, res, next) {
        const { bearer } = req.headers
        const { user_id } = req.params

        if (!bearer) return res.status(400).json({ message: 'No token' })
            // if (authentication !== user_id) {
            //     return res.status(403).json({ message: 'Not Allowedd' })
            // }
        try {
            const token = bearer
            const secretKey = process.env.SECRET_KEY
            const validToken = await jwt.verify(token, secretKey)
            req.user = validToken
            return req.user
        } catch (error) {
            console.log(error)
        }
        //   next()
    }
}