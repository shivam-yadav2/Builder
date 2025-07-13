const mongoose = require("mongoose");

const RentFilterSchema = new mongoose.Schema({
  type: { type: String, enum: ['home'], required: true },
  propertyType: { type: String, enum: ['commercial', 'residential'], required: true },
  location: { type: String, required: true },
  budget: { type: Number, required: true },
  name: { type: String, required: true },
  number: { type: String, required: true },
  status: {
    type: String,
    enum: ['new', 'lost', 'contacted', 'converted', 'fake'],
    default: 'new',
  },
}, { timestamps: true });

module.exports =  mongoose.model('RentFilter', RentFilterSchema);
