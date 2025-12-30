
const Violation = require('../models/Violation');
const Permit = require('../models/Permit');
const GeoValidator = require('../utils/geoValidator');

exports.uploadEvidence = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { lat, lng, address, title, description } = req.body;
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    // 1. File Metadata
    const fileUrl = `/uploads/${req.file.filename}`;

    // 2. GPS/GIS Validation
    // Find if coordinates fall within any active permit boundary
    const permits = await Permit.find({ status: 'ACTIVE' });
    let matchedPermit = null;

    for (const permit of permits) {
      // GeoJSON structure: permit.boundary.coordinates[0] is the outer ring
      if (GeoValidator.isPointInPolygon(latitude, longitude, permit.boundary.coordinates[0])) {
        matchedPermit = permit;
        break;
      }
    }

    // 3. Save to MongoDB
    const violation = await Violation.create({
      title: title || 'Evidence Upload',
      description: description || 'Direct evidence submission',
      reporterId: req.user._id,
      location: {
        lat: latitude,
        lng: longitude,
        address: address || 'Captured via GPS'
      },
      status: 'REPORTED',
      evidenceUrls: [fileUrl],
      permitId: matchedPermit ? matchedPermit.permitNumber : 'UNAUTHORIZED'
    });

    res.status(201).json({
      message: 'Evidence uploaded and violation record created',
      fileUrl,
      violation,
      gpsValidated: !!matchedPermit,
      matchedPermitId: matchedPermit ? matchedPermit.permitNumber : null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
