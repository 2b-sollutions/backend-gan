const Cart = require('../../models/Cart')
const Product = require('../../models/Product')
const Helpers = require('../../helpers')

module.exports = {

    async createCart(req, res) {

        const bodyData = req.body

        const { token } = req.headers

        var decoded = await Helpers.decodeToken(token, { complete: true });

        const userId = decoded.payloadRequest.id

        try {
            const createdCart = await Cart.create({ userId, ...bodyData })

            await createdCart.populate('products').execPopulate()

            return res.status(200).json(createdCart)

        } catch (error) {
            return res.status(400).json(error)
        }
    },
    async getUserCarts(req, res) {

        const { user_id } = req.params
        const userName = { _id: user_id }
        try {

            const userCart = await Cart.find({ userId: user_id })
            console.log(userCart)
            await userCart.populate('products').execPopulate()

            return res.status(200).json(userCart)

        } catch (error) {

            return res.status(400).json(error)

        }
    },
    async getMyCart(req, res) {

        const { token } = req.headers;

        var decoded = await Helpers.decodeToken(token, { complete: true });
        console.log("descoded@@@", decoded)

        try {

            const userId = decoded.payloadRequest.id

            const myCart = await Cart.find({ userId })
            console.log("myCart@@@", decoded)
                // await myCart.populate('products').execPopulate()

            return res.status(200).json(myCart)

        } catch (error) {

            return res.status(400).json(error)
        }
    },
    async getCarts(req, res) {

        try {

            const listCart = await Cart.find()

            await listCart.populate('products').execPopulate()

            return res.status(200).json(listCart)

        } catch (error) {

            return res.status(400).json(error)

        }
    },
    async removeProduct(req, res) {

        const bodydata = req.body

        const { token } = req.headers;

        var decoded = await Helpers.decodeToken(token, { complete: true });

        const userId = decoded.payloadRequest.id

        const { productListFront } = bodydata


        try {

            const myCart = await Cart.find({ userId: userId })

            var enableCart = myCart.filter(function(cart) {
                return cart.enable;
            });

            const cartId = enableCart[0].id

            const { products } = enableCart[0]

            productListFront.forEach(element => {
                products.splice(products.indexOf(element), 1)
            });

            const updatedCart = await Cart.findByIdAndUpdate(cartId, { products: products }, { new: true })

            return res.status(200).json(updatedCart)

        } catch (error) {

            return res.status(400).json(error)
        }
    },
    async addProduct(req, res) {

        const bodydata = req.body

        const { token } = req.headers;

        var decoded = await Helpers.decodeToken(token, { complete: true });

        const userId = decoded.payloadRequest.id

        const { productListFront } = bodydata


        try {

            const myCart = await Cart.find({ userId: userId })

            var enableCart = myCart.filter(function(cart) {
                return cart.enable;
            });

            const cartId = enableCart[0].id

            const { products } = enableCart[0]

            productListFront.forEach(element => {
                products.push(element)
            });

            const updatedCart = await Cart.findByIdAndUpdate(cartId, { products: products }, { new: true })

            return res.status(200).json(updatedCart)

        } catch (error) {

            return res.status(400).json(error)
        }
    },
    async getDeliveryCep(req, res) {

        try {

            // Recupera o cep 
            const cepRequested = req.body.CEP


            const adress = await Helpers.getCep(cepRequested)

            return res.status(200).json(adress)

        } catch (error) {

            return res.status(400).json(error)

        }
    },
    async getDeliveryTax(req, res) {

        const { token } = req.headers

        var decoded = await Helpers.decodeToken(token, { complete: true });

        const userId = decoded.payloadRequest.id

        try {

            const cepRequested = req.body.CEP

            // Fazer uma requisião  para toda a lista de produtos do carrinho e recuperar os ceps das marcars para serem o cep origem 

            const myCart = await Cart.find({ userId: userId })
            const enableCart = myCart.filter(function(cart) {
                return cart.enable;
            });

            const listStore = []

            for (const productId of enableCart[0].products) {

                const product = await Product.findById(productId)

                if (!listStore.includes(product.store)) {
                    listStore.push(product.store)
                    console.log("listStore", listStore)
                }

            };
            console.log("listStore", listStore)
            let args = {
                // Não se preocupe com a formatação dos valores de entrada do cep, qualquer uma será válida (ex: 21770-200, 21770 200, 21asa!770@###200 e etc),
                sCepOrigem: '04620012',
                //s"81200100",
                sCepDestino: req.body.CEP,
                nVlPeso: "1",
                nCdFormato: "1",
                nVlComprimento: "20",
                nVlAltura: "20",
                nVlLargura: "20",
                nCdServico: ["04014", '04510'], //Array com os códigos de serviço
                nVlDiametro: "0",
            };

            const frete = await Helpers.getCepTax(args)

            return res.status(200).json(frete)

        } catch (error) {

            return res.status(400).json(error)

        }
    }
}