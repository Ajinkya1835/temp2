
const Violation = require('../models/Violation');
const LegalNotice = require('../models/LegalNotice');
const RuleEngine = require('../services/ruleEngine');

exports.reportViolation = async (req, res) => {
  try {
    const { title, description, location, evidenceUrls, violationCode, severity } = req.body;

    // 1. Auto-match Permit via GIS
    const matchedPermit = await RuleEngine.matchPermitByLocation(location.lat, location.lng);
    
    // 2. Create Violation Record
    const violation = await Violation.create({
      title,
      description,
      reporterId: req.user._id,
      location,
      evidenceUrls,
      permitId: matchedPermit ? matchedPermit.permitNumber : 'UNAUTHORIZED',
      status: 'REPORTED'
    });

    res.status(201).json({
      message: 'Violation reported successfully',
      violation,
      gisMatch: !!matchedPermit
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyViolation = async (req, res) => {
  try {
    const { id } = req.params;
    const { violationCode, severity, remarks } = req.body;

    const violation = await Violation.findById(id);
    if (!violation) return res.status(404).json({ message: 'Violation not found' });

    // 1. Calculate Fine via Rule Engine
    const fineAmount = await RuleEngine.calculateFine(violationCode, severity);

    // 2. Update Violation Status
    violation.status = 'VERIFIED';
    violation.fineAmount = fineAmount;
    await violation.save();

    // 3. Generate Legal Notice
    const notice = await LegalNotice.create({
      noticeNumber: `NTCE-${Date.now()}`,
      violationId: violation._id,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      totalFine: fineAmount,
      legalDescription: `Automated enforcement notice for ${violationCode} violation.`
    });

    violation.noticeId = notice.noticeNumber;
    await violation.save();

    res.json({
      message: 'Violation verified and notice issued',
      violation,
      notice
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getViolationStats = async (req, res) => {
  try {
    const stats = await Violation.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
