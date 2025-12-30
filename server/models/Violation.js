
const mongoose = require('mongoose');

const violationSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: {
      lat: Number,
      lng: Number,
      address: String
    },
    status: {
      type: String,
      enum: ['REPORTED', 'UNDER_REVIEW', 'VERIFIED', 'NOTICE_ISSUED', 'PAID', 'APPEALED', 'DISMISSED'],
      default: 'REPORTED'
    },
    evidenceUrls: [String],
    permitId: String,
    fineAmount: Number,
    noticeId: String
  },
  { timestamps: true }
);

const Violation = mongoose.model('Violation', violationSchema);
module.exports = Violation;
