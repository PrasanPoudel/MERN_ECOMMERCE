const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        image: String,
        price: Number,
        quantity: Number,
      },
    ],
    shippingAddress: {
      province: { type: String, required: true },
      district: { type: String, required: true },
      municipality: { type: String, required: true },
      wardNo: { type: String, required: true },
      town: { type: String, required: true },
      landmark: { type: String },
    },
    paymentMethod: { type: String, enum: ['DummyPay', 'COD'], required: true },
    paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
    orderStatus: {
      type: String,
      enum: ['Pending', 'To Ship', 'Shipped', 'Out for Delivery', 'Delivered'],
      default: 'Pending',
    },
    totalAmount: { type: Number, required: true },
    statusHistory: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
