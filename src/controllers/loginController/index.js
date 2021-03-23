const User = require('../../models/User')
const Helpers = require('../../helpers')


module.exports = {
    async createSession(req, res) {
        const { userName, password } = req.body;

        try {
            const hasUser = await User.findOne({ userName })

            if (hasUser === null) {
                return res.status(404).json({ message: 'Usuario não cadastrado' })
            }

            const passwordParams = {
                requestPass: password,
                responsePass: hasUser.password
            }

            const validPassword = await Helpers.decryptPassword(passwordParams)

            if (!validPassword) {
                return res.status(404).json({ message: 'Senha incorreta' })
            }

            const payloadRequest = {
                userName: hasUser.userName,
                id: hasUser._id,
                profile: hasUser.profile
            }

            const token = await Helpers.createToken(payloadRequest)
            var decoded = await Helpers.decodeToken(token, { complete: true });
            return res.status(200).json({
                message: "Logado com sucesso",
                token,
                decode: decoded.payloadRequest

            })

        } catch (error) {

            return res.status(400).json(error.message)

        }
    }
}