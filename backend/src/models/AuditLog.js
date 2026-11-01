import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    adminId: { type: String, required: true },
    adminEmail: { type: String, required: true },
    action: { type: String, required: true }, // e.g. 'UPDATE_BOOKING_STATUS'
    resourceType: { type: String, required: true }, // e.g. 'BOOKING'
    resourceId: { type: String, required: true },
    metadata: { type: Object, default: {} },
    ipAddress: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
