const User = require('../../models/User')
const Helpers = require('../../helpers')
const paypal = require('paypal-rest-sdk')
const paypalConfig = require('../../config')

paypal.configure(paypalConfig)

module.exports = {
    async buy(req, res) {


        try {

            var create_payment_json = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": "http://localhost:8090/success",
                    "cancel_url": "http://cancel.url"
                },
                "transactions": [{
                    "item_list": {
                        "items": [{
                            "name": "item",
                            "sku": "item",
                            "price": "15.00",
                            "currency": "BRL",
                            "quantity": 1
                        }]
                    },
                    "amount": {
                        "currency": "BRL",
                        "total": "15.00"
                    },
                    "description": "This is the payment description."
                }]
            };


            paypal.payment.create(create_payment_json, function(error, payment) {
                if (error) {
                    throw error;
                } else {
                    payment.links.forEach((link) => {
                        if (link.rel === 'approval_url') return res.redirect(link.href)
                    })
                    console.log("Create Payment Response");
                    console.log(payment);
                }
            });

        } catch (error) {

            return res.status(400).json(error.message)

        }
    },
    async success(req, res) {
        try {
            const payerId = req.query.PayerID
            console.log("payerId", payerId)
            const paymentId = req.query.paymentId
            console.log("paymentId", paymentId)

            const valor = { currency: "BRL", total: "15.00" }
            const execute_payment_json = {
                "payer_id": payerId,
                "transactions": [{
                    "amount": valor
                }]

            }
            console.log("entrei")
            paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
                if (error) {
                    console.log(error.response);
                    throw error
                } else {
                    console.log("pagamento efetuado")
                    console.log(JSON.stringify(payment))
                    return res.status(200).json({
                        message: "Logado com sucesso",
                        token,
                        decode: decoded.payloadRequest

                    })

                }
            })

        } catch (error) {

            return res.status(400).json(error.message)

        }
    },
    async cancel(req, res) {
        const { userName, password } = req.body;

        try {
            const hasUser = await User.findOne({ userName })

            if (hasUser === null) {
                return res.status(404).json({ message: 'Usuario não cadastrado' })
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