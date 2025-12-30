
const Payment = require('../models/Payment');
const LegalNotice = require('../models/LegalNotice');
const Violation = require('../models/Violation');
const crypto = require('crypto');

/**
 * Initiate a payment session (Mock)
 */
exports.initiatePayment = async (req, res) => {
  try {
    const { noticeId } = req.body;

    const notice = await LegalNotice.findById(noticeId).populate('violationId');
    if (!notice) return res.status(404).json({ message: 'Legal Notice not found' });

    if (notice.status === 'PAID') {
      return res.status(400).json({ message: 'Notice is already settled' });
    }

    // Create a pending payment record
    const payment = await Payment.create({
      noticeId: notice._id,
      violationId: notice.violationId._id,
      amount: notice.totalFine,
      status: 'PENDING'
    });

    // Generate a mock secure payment link
    const mockHash = crypto.randomBytes(16).toString('hex');
    const paymentLink = `https://pvms.gov.in/pay/gateway?session=${mockHash}&pid=${payment._id}`;

    res.status(200).json({
      message: 'Payment session initiated',
      paymentId: payment._id,
      amount: notice.totalFine,
      paymentLink
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Confirm Payment (Mock Gateway Callback)
 * Locks the violation and notice status
 */
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentId, paymentMethod } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: 'Transaction record not found' });

    // Update Payment Record
    payment.status = 'SUCCESS';
    payment.paymentDate = new Date();
    payment.transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    payment.paymentMethod = paymentMethod || 'DEMO_GATEWAY';
    await payment.save();

    // Update Legal Notice - Status "PAID"
    await LegalNotice.findByIdAndUpdate(payment.noticeId, { status: 'PAID' });

    // Update Violation - Status "PAID" (Locking the record)
    await Violation.findByIdAndUpdate(payment.violationId, { status: 'PAID' });

    res.json({
      message: 'Payment confirmed. Violation case marked as SETTLED.',
      transactionId: payment.transactionId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Escalation Engine
 * Marks notices as OVERDUE and handles auto-escalation after 20 days
 */
exports.processEscalations = async (req, res) => {
  try {
    const now = new Date();
    const escalationThreshold = new Date();
    escalationThreshold.setDate(now.getDate() - 20); // 20 days ago

    // 1. Mark notices past due date as OVERDUE
    const overdueResult = await LegalNotice.updateMany(
      { 
        status: { $in: ['ISSUED', 'SERVED'] }, 
        dueDate: { $lt: now } 
      },
      { status: 'OVERDUE' }
    );

    // 2. Identify notices that are 20+ days overdue for Legal Action
    const escalatedNotices = await LegalNotice.find({
      status: 'OVERDUE',
      dueDate: { $lt: escalationThreshold }
    });

    // In a real system, this would trigger an external legal API or email
    const noticeIds = escalatedNotices.map(n => n._id);
    
    res.json({
      message: 'Fiscal escalation scan complete',
      noticesMarkedOverdue: overdueResult.modifiedCount,
      noticesEscalatedToLegal: noticeIds.length,
      escalatedNoticeIds: noticeIds
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
