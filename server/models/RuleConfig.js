
const mongoose = require('mongoose');

const ruleConfigSchema = mongoose.Schema(
  {
    violationCode: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: String,
    baseFine: { type: Number, required: true },
    severityMultipliers: {
      LOW: { type: Number, default: 1 },
      MEDIUM: { type: Number, default: 2 },
      HIGH: { type: Number, default: 5 }
    },
    applicableZones: [String]
  },
  { timestamps: true }
);

const RuleConfig = mongoose.model('RuleConfig', ruleConfigSchema);
module.exports = RuleConfig;
