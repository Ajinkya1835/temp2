
const mongoose = require('mongoose');

const legalNoticeSchema = mongoose.Schema(
  {
    noticeNumber: { type: String, required: true, unique: true },
    violationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Violation', required: true },
    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    totalFine: { type: Number, required: true },
    status: {
      type: String,
      enum: ['ISSUED', 'SERVED', 'APPEALED', 'PAID', 'OVERDUE'],
      default: 'ISSUED'
    },
    legalDescription: String
  },
  { timestamps: true }
);

const LegalNotice = mongoose.model('LegalNotice', legalNoticeSchema);
module.exports = LegalNotice;
