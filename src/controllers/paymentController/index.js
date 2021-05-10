const User = require('../../models/User')
const Order = require('../../models/Order')
const Helpers = require('../../helpers')
const paypal = require('paypal-rest-sdk')
const paypalConfig = require('../../config')


paypal.configure(paypalConfig)

module.exports = {
    async buy(req, res) {
        const { token } = req.headers;
        var decoded = await Helpers.decodeToken(token, { complete: true });
        const userId = decoded.payloadRequest.id
        try {

            var create_payment_json = {
                intent: "sale",
                payer: {
                    payment_method: "paypal"
                },
                redirect_urls: {
                    return_url: "http://localhost:8090/success",
                    cancel_url: "http://cancel.url"
                },
                transactions: [{
                    item_list: {
                        items: [{
                            name: "item",
                            sku: "item",
                            price: req.body.totalPrice,
                            currency: "BRL",
                            quantity: req.body.productQuantity
                        }]
                    },
                    amount: {
                        currency: "BRL",
                        total: 7500
                    },
                    description: "This is the payment description."
                }]
            };
            paypal.payment.create(create_payment_json, async(error, payment) => {
                if (error) {
                    throw error;
                } else {
                    const payloadNewOrder = {
                        deliveryAdress: req.body.deliveryAdress,
                        sendMethod: req.body.sendMethod,
                        paymentMethod: req.body.paymentMethod,
                        orderNumber: Math.random(),
                        user: userId,
                        store: req.body.storeId,
                        cart: req.body.cartId,
                        products: req.body.productList,
                        createdAt: new Date(),
                        payment: payment,
                        status: "PAGAMENTO_ENVIADO",
                        productQuantity: req.body.productQuantity,
                        totalPrice: req.body.totalPrice,
                        links: payment.links
                    }

                    const newOrder = await Order.create(payloadNewOrder)

                    return res.status(200).json(newOrder)
                }
            })
        } catch (error) {
            return res.status(400).json(error.message)
        }
    },
    async success(req, res) {
        try {
            const payerId = req.query.PayerID
            const paymentId = req.query.paymentId
            const token = req.query.token
            const valor = { currency: "BRL", total: "15.00" }
            const execute_payment_json = {
                "payer_id": payerId,
                "transactions": [{
                    "amount": valor
                }]
            }
            paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
                if (error) {
                    console.log(error.response);
                    throw error
                } else {
                    console.log("pagamento efetuado")
                    console.log(JSON.stringify(payment))
                    return res.status(200).json({
                        message: "Logado com sucesso",
                        token
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