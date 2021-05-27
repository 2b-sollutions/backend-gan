const Cart = require('../../models/Cart')
const Product = require('../../models/Product')
const Store = require('../../models/Store')
const Helpers = require('../../helpers/comuns')

const args = {
  // Não se preocupe com a formatação dos valores de entrada do cep, qualquer uma será válida (ex: 21770-200, 21770 200, 21asa!770@###200 e etc),
  sCepOrigem: '04620012',
  // s"81200100",
  sCepDestino: '04620012',
  nVlPeso: '1',
  nCdFormato: '1',
  nVlComprimento: '20',
  nVlAltura: '20',
  nVlLargura: '20',
  nCdServico: ['04014', '04510'], // Array com os códigos de serviço
  nVlDiametro: '0'
}

module.exports = {
  async createCart (req, res) {
    const bodyData = req.body
    const { token } = req.headers
    const decoded = await Helpers.decodeToken(token, { complete: true })
    const userId = decoded.payloadRequest.id
    try {
      const createdCart = await Cart.create({ userId, ...bodyData })
      await createdCart.populate('products').execPopulate()
      return res.status(200).json(createdCart)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async getUserCarts (req, res) {
    const { userId } = req.params
    const userName = { _id: userId }
    try {
      const userCart = await Cart.find({ userId: userName })
      await userCart.populate('products').execPopulate()
      return res.status(200).json(userCart)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async getMyCart (req, res) {
    const { token } = req.headers
    const decoded = await Helpers.decodeToken(token, { complete: true })
    try {
      const userId = decoded.payloadRequest.id
      const myCart = await Cart.find({ userId })
      // await myCart.populate('products').execPopulate()
      return res.status(200).json(myCart)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async getCartById (req, res) {
    try {
      const cartId = req.params.cartId
      const newCart = await Cart.findById(cartId)
      // await myCart.populate('products').execPopulate()
      return res.status(200).json(newCart)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async getCarts (req, res) {
    try {
      const listCart = await Cart.find()
      return res.status(200).json(listCart)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async removeProduct (req, res) {
    const productId = req.params
    const { token } = req.headers
    const decoded = await Helpers.decodeToken(token, { complete: true })
    const userId = decoded.payloadRequest.id
    try {
      const myCart = await Cart.find({ userId: userId })
      const enableCart = myCart.filter(function (cart) {
        return cart.enable
      })
      const cartId = enableCart[0].id
      const updatedCart = await Cart.deleteOne(cartId, { productList: productId }, { new: true })
      return res.status(200).json(updatedCart)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async updateCart (req, res) {
    const bodydata = req.body
    const { token } = req.headers
    const decoded = await Helpers.decodeToken(token, { complete: true })
    const userId = decoded.payloadRequest.id
    try {
      const myCart = await Cart.find({ userId: userId })
      const enableCart = myCart.filter(function (cart) {
        return cart.enable
      })
      const cartId = enableCart[0].id

      const updatedCart = await Cart.findByIdAndUpdate(cartId, {
        productList: bodydata.productList,
        totalTax: bodydata.totalTax,
        totalValue: bodydata.totalValue,
        totalQuantity: bodydata.totalQuantity
      }, { new: true })
     return res.status(200).json(updatedCart)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async getDeliveryCep (req, res) {
    try {
      // Recupera o cep
      const cepRequested = req.body.CEP
      const adress = await Helpers.getCep(cepRequested)
      return res.status(200).json(adress)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async getDeliveryTax (req, res) {
    const { token } = req.headers
    const decoded = await Helpers.decodeToken(token, { complete: true })
    const userId = decoded.payloadRequest.id
    try {
      const totalSedex = []
      const totalPac = []
      const cepRequested = req.body.CEP
      // Fazer uma requisião  para toda a lista de produtos do carrinho e recuperar os ceps das marcars para serem o cep origem
      const myCart = await Cart.find({ userId: userId })
      const enableCart = myCart.filter(function (cart) {
        return cart.enable
      })
      // filtra todas as lojas distintas dos produtos incluso no meu carrinho
      for (const productId of enableCart[0].products) {
        const product = await Product.findById(productId)
        const store = await Store.findById(product.store)
        args.sCepOrigem = store.adress.postCode
        args.sCepDestino = cepRequested
        args.nCdServico = ['04014']
        const fretePac = await Helpers.getCepTax(args)
        args.nCdServico = ['04510']
        const freteSedex = await Helpers.getCepTax(args)
        totalPac.push(freteSedex[0].Valor)
        totalSedex.push(fretePac[0].Valor)
      };
      const totalPacReturn = totalPac.reduce(function (acumulador, valorAtual) {
        const valorParseado = valorAtual.replace(',', '.')
        return acumulador + parseFloat(valorParseado)
      }, 0)
      const totalSedexReturn = totalSedex.reduce((acumulador, valorAtual) => {
        const valorParseado = valorAtual.replace(',', '.')
        return acumulador + parseFloat(valorParseado)
      }, 0)
      const payloadFinal = {
        totalPacReturn,
        totalSedexReturn
      }
      return res.status(200).json(payloadFinal)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async getDeliveryTaxCart (req, res) {
    const { productList } = req.body

    const storeList = await Promise.all(productList.map(async (element) => {
      const propertiesProduct = await Product.findById({ _id: element })
      console.log(propertiesProduct.store.idStore)
      console.log(propertiesProduct.productCategory)
    }))

    const uniqueStore = [...new Set(storeList)]

    const postCodeList = await Promise.all(uniqueStore.map(async (element) => {
      const propertiesStore = await Store.findById({ _id: element })
      const mapx = {
        postCode: propertiesStore.adress.postCode
      }
      return mapx
    }))
    try {
      const valorTotal = []
      for (const item of postCodeList) {
        args.sCepOrigem = item.postCode
        args.nCdServico = ['04014']
        args.sCepDestino = req.body.cepDestiny
        const fretePac = await Helpers.getCepTax(args)
        valorTotal.push(fretePac)
      }
      console.log(valorTotal)
      return res.status(200).json(valorTotal)
    } catch (error) {
      return res.status(400).json(error)
    }
  }
}
