
const mongoose = require('mongoose');

const appealSchema = mongoose.Schema(
  {
    violationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Violation', required: true },
    appellantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    evidenceUrls: [String],
    status: {
      type: String,
      enum: ['PENDING', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED'],
      default: 'PENDING'
    },
    hearingDate: Date,
    decisionNote: String,
    decidedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

const Appeal = mongoose.model('Appeal', appealSchema);
module.exports = Appeal;
