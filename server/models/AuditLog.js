import mongoose from "mongoose";

const boxSchema = new mongoose.Schema(
  {
    page: { type: Number, required: true },
    nx: { type: Number, required: true },
    ny: { type: Number, required: true },
    nw: { type: Number, required: true },
    nh: { type: Number, required: true },
  },
  { _id: false }
);

const auditLogSchema = new mongoose.Schema(
  {
    pdfId: { type: String, required: true },
    box: [{ type: boxSchema, required: true }],
    originalHash: { type: String, required: true },
    signedHash: { type: String, required: true },
    signedFilePath: { type: String, required: true },
    signatureStored: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const AuditLog = mongoose.model("AuditLog", auditLogSchema);
