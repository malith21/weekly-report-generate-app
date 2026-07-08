const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const Report = require('../models/Report');
const router = express.Router();

// Create report
router.post('/', auth, authorize('team_member', 'manager'), async (req, res) => {
  try {
    const report = new Report({
      ...req.body,
      userId: req.user._id
    });
    await report.save();
    res.status(201).json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating report' });
  }
});

// Get my reports
router.get('/my-reports', auth, async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user._id })
      .sort({ weekStart: -1 });
    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching reports' });
  }
});

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
    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching reports' });
  }
});

// Update report
router.put('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    
    if (req.user.role !== 'manager' && report.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    if (req.body.status === 'submitted' && report.status === 'draft') {
      req.body.submittedAt = new Date();
    }
    
    Object.assign(report, req.body);
    await report.save();
    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating report' });
  }
});

// Delete report
router.delete('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    
    if (req.user.role !== 'manager' && report.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    await report.deleteOne();
    res.json({ message: 'Report deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting report' });
  }
});

module.exports = router;