const { PeerRPCClient } = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')
const Order = require('./models/order')


const link = new Link({
  grape: 'http://127.0.0.1:30001'
})
link.start()

const client = new PeerRPCClient(link, {})
client.init()

const order = {
  ticker: 'BTCUSD',
  type: process.argv[2] || 'BID',
  quantity: Number.parseInt(process.argv[3]) || 1,
  price: Number.parseInt(process.argv[4]) || 100000,
}

console.log(order)

client.request('order-book', order, (err, res) => {
  if (err) {
    console.error(err)
  } else {
    console.log(res)
  }
  client.stop()
})


