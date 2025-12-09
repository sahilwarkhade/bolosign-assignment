import { signPdfWithSignature } from "../services/pdfService.js";

export async function signPdf(req, res) {
  try {
    const { pdfId, signatureImage, fields } = req.body;

    if (!pdfId || !signatureImage || !fields || !Array.isArray(fields)) {
      return res.status(400).json({
        success: false,
        message: "pdfId, signatureImage and fields[] are required",
      });
    }

    const basePdfDir = process.env.BASE_PDF_DIR || "./sample-pdfs";
    const signedPdfDir = process.env.SIGNED_PDF_DIR || "./signed-pdfs";

    const result = await signPdfWithSignature({
      pdfId,
      signatureImageBase64: signatureImage,
      fields, 
      basePdfDir,
      signedPdfDir,
    });

    const baseUrl =
      process.env.BASE_URL || `http://localhost:${process.env.PORT || 4000}`;
    const signedPdfUrl = `${baseUrl}/signed/${result.signedFileName}`;

    return res.json({
      success: true,
      signedPdfUrl,
      originalHash: result.originalHash,
      signedHash: result.signedHash,
      auditId: result.auditId,
    });
  } catch (err) {
    console.error("Error in signPdf:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to sign PDF",
      error: err.message,
    });
  }
}
