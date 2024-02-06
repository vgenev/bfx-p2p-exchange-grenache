const z = require('zod');

const OrderSchema = z.object({
  id: z.string().nullable().optional(),
  nodeId: z.string().nullable().optional(),
  ticker: z.string(),
  type: z.enum(['BID', 'ASK']),
  quantity: z.number().positive(),
  price: z.number().positive(),
  timestamp: z.number().nullable().optional(),
  seedTime: z.number().nullable().optional(),
});

module.exports = OrderSchema;