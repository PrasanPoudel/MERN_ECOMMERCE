const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    images: [{ url: String, public_id: String }],
    sold: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['In Stock', 'Low Stock', 'Out of Stock'],
      default: 'In Stock',
    },
  },
  { timestamps: true }
);

// Auto-update status based on quantity
productSchema.pre('save', async function () {
  if (this.quantity === 0) this.status = 'Out of Stock';
  else if (this.quantity < 5) this.status = 'Low Stock';
  else this.status = 'In Stock';
});

productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
