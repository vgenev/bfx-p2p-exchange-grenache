
const { monotonicFactory } = require('ulid');
const ulid = monotonicFactory();
// this is ID that is alphabetically ordered based on seedTime. We use it to sort the order book based on DHT stored

const OrderSchema = require('./order-schema');

class Order {
  constructor(data) {
    try {
      const validatedData = OrderSchema.parse(data);
      this.id = validatedData.id ? validatedData.id : ulid(validatedData.seedTime ? validatedData.seedTime : new Date().getTime());
      this.nodeId = validatedData.nodeId;
      this.ticker = validatedData.ticker;
      this.type = validatedData.type;
      this.quantity = validatedData.quantity;
      this.price = validatedData.price;
      this.timestamp = validatedData.timestamp ? (new Date(validatedData.timestamp)).valueOf() : (new Date()).valueOf();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

module.exports = Order;