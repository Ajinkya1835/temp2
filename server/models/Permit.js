
const mongoose = require('mongoose');

const permitSchema = mongoose.Schema(
  {
    permitNumber: { type: String, required: true, unique: true },
    ownerName: { type: String, required: true },
    permitType: { type: String, required: true },
    issueDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['ACTIVE', 'EXPIRED', 'REVOKED', 'COMPLETED'],
      default: 'ACTIVE'
    },
    // GeoJSON for boundary checking
    boundary: {
      type: {
        type: String,
        enum: ['Polygon'],
        required: true
      },
      coordinates: {
        type: [[[Number]]], // Array of arrays of arrays [lng, lat]
        required: true
      }
    }
  },
  { timestamps: true }
);

// Create spatial index for boundary checking
permitSchema.index({ boundary: '2dsphere' });

const Permit = mongoose.model('Permit', permitSchema);
module.exports = Permit;
