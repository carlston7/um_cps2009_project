const mongoose = require('mongoose');

const stripeSessionSchema = new mongoose.Schema({
  session_id: String,
  email: String,
  amount: mongoose.Types.Decimal128, 
  created_at: { type: Date, default: Date.now }, // Timestamp of session creation
});

module.exports = mongoose.model('StripeSession', stripeSessionSchema);