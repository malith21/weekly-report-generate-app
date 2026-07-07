const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  weekStart: { type: Date, required: true },
  weekEnd: { type: Date, required: true },
  projectCategory: { type: String, required: true },
  tasksCompleted: [{ type: String }],
  tasksPlanned: [{ type: String }],
  blockers: [{ type: String }],
  hoursWorked: { type: Number, default: 0 },
  notes: { type: String },
  status: { 
    type: String, 
    enum: ['draft', 'submitted'], 
    default: 'draft' 
  },
  submittedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);