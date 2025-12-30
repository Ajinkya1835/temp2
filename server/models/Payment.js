
const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema(
  {
    noticeId: { type: mongoose.Schema.Types.ObjectId, ref: 'LegalNotice', required: true },
    violationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Violation', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    paymentDate: { type: Date },
    transactionId: { type: String, unique: true, sparse: true },
    paymentMethod: { type: String, enum: ['UPI', 'NET_BANKING', 'CARD', 'CASH', 'DEMO_GATEWAY'] },
    status: { 
      type: String, 
      enum: ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'], 
      default: 'PENDING' 
    },
    gatewayResponse: Object,
    isEscalated: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Index for fast lookup during fiscal audits
paymentSchema.index({ noticeId: 1, status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
