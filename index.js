const { PeerRPCServer, PeerRPCClient } = require('grenache-nodejs-http')
// const { PeerPub, PeerSub } = require('grenache-nodejs-base')
const Link = require('grenache-nodejs-link')
const Order = require('./models/order')
const OrderBook = require('./order-book')
const { generateNodeId } = require('./utils/node-id')
const async = require('async')

const link = new Link({
  grape: 'http://127.0.0.1:30001'
})
link.start()

const server = new PeerRPCServer(link, {
  timeout: 10000
})
server.init()

const nodeId = generateNodeId()

console.log('nodeId :: ', nodeId)

const port = 1024 + Math.floor(Math.random() * 1000)
const service = server.transport('server')
service.listen(port)

link.startAnnouncing('order-book', service.port, { interval: 60000 })

/*
I was trying to use the peerPub and peerSub to broadcast the orders to all the peers,
but it looks like peerPub is not working or I couldn't figure out how to do that.

// let peerPub
// let peerSub

async.series([
  (next) => {
    setTimeout(function () {
      peerPub = new PeerPub(link, { timeout: 300000 })
      peerPub.init()
      next()
    }, 20000)
  },
  (next) => {
    setTimeout(function () {
      peerSub = new PeerSub(link, { timeout: 300000 })
      peerSub.init()
      next()
    }, 30000)
  },
  (next) => {
    setTimeout(function () {
      peerSub.sub('orders', (msg) => {
        console.log('sub :: ', msg)
      })
      next()
    }, 50000)
  }
])
*/


const broadcastOrder = (order) => {
  // console.log('broadcastOrder :: ', order)
  //  This is cauisng errors Error: ERR_REQUEST_GENERIC: socket hang up. No time to debug though
  const client = new PeerRPCClient(link, {})
  client.init()
  setTimeout(() => {
    client.request('order-book', order, (err, res) => {
      if (err) {
        console.error(err)
      }
      client.stop()
    })
  }, 1000)
}

const orderBook = new OrderBook(nodeId, broadcastOrder);

service.on('request', (rid, key, payload, handler) => {
  if (payload.nodeId === nodeId) {
    return;
  }
  const order = new Order(payload);
  const storedOrder = orderBook.addOrder(order);
  orderBook.matchOrders(storedOrder);
  handler.reply(null, { msg: JSON.stringify(orderBook.get(), null, 2) });
})
