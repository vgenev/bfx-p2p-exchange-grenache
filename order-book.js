const Order = require('./models/order');

class OrderBook {
  constructor(nodeId, broadcaster = () => { }) {
    this.orders = [];
    this.nodeId = nodeId;
    this.broadcaster = broadcaster;

  }
  addOrder(orderInput) {
    try {
      const order = new Order({ ...orderInput, nodeId: (orderInput.nodeId ? orderInput.nodeId : this.nodeId) });
      this.orders.push(order);
      // sorting the orders based on the ULID
      this.orders.sort((a, b) => a.id.localeCompare(b.id));
      if (orderInput.nodeId !== this.nodeId) {
        this.broadcaster(order);
      }
      return order;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  get() {
    return this.orders;
  }

  matchOrders(newOrder) {
    // get the first index of matching price orders with opposite types
    const matchIndex = this.orders.findIndex(order => {
      return (order.ticker === newOrder.ticker
      && order.type !== newOrder.type
      && order.price === newOrder.price)
    }
    );

    if (matchIndex === -1) {
      return;
    }
    const matchedOrder = this.orders[matchIndex];
    this.orders.splice(matchIndex, 1);
    const remainder = matchedOrder.quantity - newOrder.quantity;
    this.orders.splice(matchIndex, 1);
    if (remainder > 0) {
      this.addOrder(
        new Order({
          nodeId: matchedOrder.nodeId,
          ticker: matchedOrder.ticker,
          type: matchedOrder.type,
          quantity: remainder,
          price: matchedOrder.price,
          timestamp: (new Date()).valueOf()
        })
      );
    } else if (remainder < 0) {
      this.addOrder(
        new Order({
          nodeId: newOrder.nodeId,
          ticker: newOrder.ticker,
          type: newOrder.type === 'BID' ? 'ASK' : 'BID',
          quantity: -remainder,
          price: matchedOrder.price,
          timestamp: (new Date()).valueOf()
        })
      );
    } else {
      this.orders.findIndex(order => order.id === newOrder.id);
    }
    return true;
  }
}

module.exports = OrderBook;
