import mongoose from 'mongoose'

/**
 * Maintenance report schema representing a maintenance report with basic metadata.
 */
const reportSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['kitchen', 'appliance', 'plumbing', 'heating', 'other'],
      required: true
    },
    apartmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Apartment',
      required: true
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'closed'],
      default: 'open'
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    }
  },
  { timestamps: true }
)

export const ReportModel = mongoose.model('Report', reportSchema)
