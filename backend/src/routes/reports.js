const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const Report = require('../models/Report');
const router = express.Router();

// Get all reports (Manager only)
router.get('/all', auth, authorize('manager'), async (req, res) => {
  try {
    const { weekStart, weekEnd, userId, project } = req.query;
    const filter = {};
    
    if (weekStart) filter.weekStart = { $gte: new Date(weekStart) };
    if (weekEnd) filter.weekEnd = { $lte: new Date(weekEnd) };
    if (userId) filter.userId = userId;
    if (project) filter.projectCategory = project;
    
    const reports = await Report.find(filter)
      .populate('userId', 'name email')
      .sort({ weekStart: -1 });
    
    console.log(`📊 Found ${reports.length} reports for manager`);
    res.json(reports);
  } catch (error) {
    console.error('❌ Error fetching reports:', error);
    res.status(500).json({ message: 'Error fetching reports' });
  }
});

// Get my reports (Team Member)
router.get('/my-reports', auth, async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user._id })
      .sort({ weekStart: -1 });
    console.log(`📊 Found ${reports.length} reports for user ${req.user.email}`);
    res.json(reports);
  } catch (error) {
    console.error('❌ Error fetching my reports:', error);
    res.status(500).json({ message: 'Error fetching reports' });
  }
});

// Create report
router.post('/', auth, authorize('team_member', 'manager'), async (req, res) => {
  try {
    console.log('📝 Creating report for:', req.user.email);
    const report = new Report({
      ...req.body,
      userId: req.user._id
    });
    await report.save();
    console.log('✅ Report created:', report._id);
    res.status(201).json(report);
  } catch (error) {
    console.error('❌ Error creating report:', error);
    res.status(500).json({ message: 'Error creating report' });
  }
});

// Update report
router.put('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    // Check permission
    if (req.user.role !== 'manager' && report.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // If submitting, set submittedAt
    if (req.body.status === 'submitted' && report.status === 'draft') {
      req.body.submittedAt = new Date();
    }
    
    Object.assign(report, req.body);
    await report.save();
    console.log('✅ Report updated:', report._id);
    res.json(report);
  } catch (error) {
    console.error('❌ Error updating report:', error);
    res.status(500).json({ message: 'Error updating report' });
  }
});

// Delete report
router.delete('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    if (req.user.role !== 'manager' && report.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    await report.deleteOne();
    console.log('✅ Report deleted:', req.params.id);
    res.json({ message: 'Report deleted' });
  } catch (error) {
    console.error('❌ Error deleting report:', error);
    res.status(500).json({ message: 'Error deleting report' });
  }
});

module.exports = router;