
const Permit = require('../models/Permit');
const RuleConfig = require('../models/RuleConfig');

/**
 * Rule Engine for PVMS
 * Handles GIS matching and automated fine calculation
 */
const RuleEngine = {
  /**
   * Find a permit that covers the given location coordinates
   */
  async matchPermitByLocation(lat, lng) {
    try {
      const permit = await Permit.findOne({
        boundary: {
          $geoIntersects: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat] // GeoJSON uses [longitude, latitude]
            }
          }
        },
        status: 'ACTIVE'
      });
      return permit;
    } catch (error) {
      console.error('GIS Matching Error:', error);
      return null;
    }
  },

  /**
   * Calculate fine based on violation type and severity
   */
  async calculateFine(violationCode, severity = 'MEDIUM') {
    try {
      const config = await RuleConfig.findOne({ violationCode });
      if (!config) return 0;

      const multiplier = config.severityMultipliers[severity] || 1;
      return config.baseFine * multiplier;
    } catch (error) {
      console.error('Fine Calculation Error:', error);
      return 0;
    }
  }
};

module.exports = RuleEngine;
