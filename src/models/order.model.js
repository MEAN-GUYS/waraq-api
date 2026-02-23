const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const SHIPPING_STATUSES = ['processing', 'out for delivery', 'delivered'];
const PAYMENT_STATUSES = ['pending', 'success'];
const VALID_SHIPPING_TRANSITIONS = {
  processing: ['out for delivery'],
  'out for delivery': ['delivered'],
  delivered: [],
};

const orderItemSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    cover: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: 'Quantity must be an integer',
      },
    },
  },
  { _id: false }
);

const orderAddressSchema = new mongoose.Schema(
  {
    street: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (items) => items.length > 0,
        message: 'Order must contain at least one item',
      },
    },
    address: {
      type: orderAddressSchema,
      required: true,
    },
    shippingStatus: {
      type: String,
      enum: SHIPPING_STATUSES,
      default: 'processing',
    },
    paymentMethod: {
      type: String,
      enum: ['COD'],
      default: 'COD',
    },
    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: 'pending',
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

orderSchema.index({ user: 1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
module.exports.SHIPPING_STATUSES = SHIPPING_STATUSES;
module.exports.PAYMENT_STATUSES = PAYMENT_STATUSES;
module.exports.VALID_SHIPPING_TRANSITIONS = VALID_SHIPPING_TRANSITIONS;
