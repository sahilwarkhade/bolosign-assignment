import fs from "fs/promises";
import path from "path";
import { PDFDocument } from "pdf-lib";
import { sha256Buffer } from "../utils/hashUtils.js";
import { AuditLog } from "../models/AuditLog.js";
import normalizedToPdfBox from "../utils/normalizeCoordinate.js";

const __dirname = path.resolve();

export async function signPdfWithSignature({
  pdfId,
  signatureImageBase64,
  fields,
  basePdfDir,
  signedPdfDir,
}) {
  const originalPath = path.join(basePdfDir, `${pdfId}.pdf`);
  const originalPdfBytes = await fs.readFile(originalPath);

  const originalHash = sha256Buffer(originalPdfBytes);
  const pdfDoc = await PDFDocument.load(originalPdfBytes);

  const page = pdfDoc.getPages()[0];
  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();

  for (const box of fields) {
    const pdfBox = normalizedToPdfBox(box, pageWidth, pageHeight);

    const cleanedBase64 = signatureImageBase64.replace(
      /^data:image\/\w+;base64,/,
      ""
    );
    const imgBytes = Buffer.from(cleanedBase64, "base64");

    const embeddedImage = signatureImageBase64.startsWith("data:image/jpeg")
      ? await pdfDoc.embedJpg(imgBytes)
      : await pdfDoc.embedPng(imgBytes);

    const imgWidth = embeddedImage.width;
    const imgHeight = embeddedImage.height;

    const scale = Math.min(pdfBox.width / imgWidth, pdfBox.height / imgHeight);

    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;

    const drawX = pdfBox.x + (pdfBox.width - drawWidth) / 2;
    const drawY = pdfBox.y + (pdfBox.height - drawHeight) / 2;

    page.drawImage(embeddedImage, {
      x: drawX,
      y: drawY,
      width: drawWidth,
      height: drawHeight,
    });
  }

  const signedPdfBytes = await pdfDoc.save();
  const signedHash = sha256Buffer(signedPdfBytes);

  await fs.mkdir(signedPdfDir, { recursive: true });

  const signedFileName = `${pdfId}-signed-${Date.now()}.pdf`;
  const signedFilePath = path.join(signedPdfDir, signedFileName);

  await fs.writeFile(signedFilePath, signedPdfBytes);

  const auditRecord = await AuditLog.create({
    pdfId,
    fields,
    originalHash,
    signedHash,
    signedFilePath,
  });

  return {
    signedFileName,
    originalHash,
    signedHash,
    auditId: auditRecord._id,
  };
}
