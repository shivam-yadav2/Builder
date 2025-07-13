const mongoose = require("mongoose");

const SellFilterSchema = new mongoose.Schema({
  type: { type: String, enum: ['home', 'land'], required: true },
  location: { type: String, required: true },
  area: { type: Number, required: true },
  budget: { type: Number, required: true },
  name: { type: String, required: true },
  number: { type: String, required: true },
  status: {
    type: String,
    enum: ['new', 'lost', 'contacted', 'converted', 'fake'],
    default: 'new',
  },
}, { timestamps: true });

module.exports = mongoose.model('SellFilter', SellFilterSchema);


