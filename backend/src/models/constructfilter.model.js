const mongoose = require("mongoose");

const ConstructionFilterSchema = new mongoose.Schema({
  plotArea: { type: Number, required: true },
  constructionArea: { type: Number, required: true },
  budget: { type: Number, required: true },
  location: { type: String, required: true },
  name: { type: String, required: true },
  number: { type: String, required: true },
  status: {
    type: String,
    enum: ['new', 'lost', 'contacted', 'converted', 'fake'],
    default: 'new',
  },
}, { timestamps: true });

module.exports = mongoose.model('ConstructionFilter', ConstructionFilterSchema);
