import "pdfjs-dist/web/pdf_viewer.css";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import axios from "axios";

import DraggableField from "./DraggableField.jsx";
import { usePdfFields } from "../hooks/usePdfFields.js";

pdfjs.GlobalWorkerOptions.workerSrc = "public/pdf.worker.js";

const PDF_FILE = "/sample.pdf";
const DEFAULT_RATIO = 1.4142; 

export default function PdfEditor() {
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);

  const [containerWidth, setContainerWidth] = useState(0);
  const [pdfRatio, setPdfRatio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [signedPdfUrl, setSignedPdfUrl] = useState(null);
  const [signatureImage, setSignatureImage] = useState(null);

  const { fields, addField, updateField } = usePdfFields();

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setContainerWidth(width);
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleDocumentLoadSuccess = async (pdf) => {
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1 });
    setPdfRatio(viewport.height / viewport.width);
  };

  const ratio = pdfRatio ?? DEFAULT_RATIO;
  const pageWidth = containerWidth || 0;
  const pageHeight = pageWidth ? pageWidth * ratio : 0;

  const handleDrop = (e) => {
    e.preventDefault();
    if (!pageWidth || !pageHeight) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const type = e.dataTransfer.getData("fieldType");
    if (!type) return;

    addField({
      id: Date.now(),
      type,
      page: 1,
      nx: x / pageWidth,
      ny: y / pageHeight,
      nw: 0.2,
      nh: 0.06,
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSignatureUploadChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result;
      if (typeof base64 === "string") {
        setSignatureImage(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSignPDF = async () => {
    const signatureFields = fields.filter((f) => f.type === "signature");

    if (signatureFields.length === 0) {
      alert("Please place at least one signature field.");
      return;
    }

    if (!signatureImage) {
      alert("Please upload a signature image first.");
      return;
    }

    const boxes = signatureFields.map((f) => ({
      page: 1,
      nx: f.nx,
      ny: f.ny,
      nw: f.nw,
      nh: f.nh,
    }));

    const payload = {
      pdfId: "sample-a4",
      signatureImage,
      fields: boxes,
    };

    try {
      setLoading(true);
      const res = await axios.post(
        import.meta.env.VITE_SERVER_URL || "http://localhost:4000/api/sign-pdf",
        payload
      );

      setSignedPdfUrl(res.data.signedPdfUrl);
      alert("PDF signed successfully!");
    } catch (err) {
      console.error("SIGN ERROR:", err);
      alert("Failed to sign the PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col min-w-0">
      <div className="p-3 bg-white border-b flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center justify-between ">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold">PDF Editor</h2>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 text-xs md:text-sm border border-slate-300 rounded bg-slate-50 hover:bg-slate-100 text-gray-900 cursor-pointer"
            >
              Upload Signature Image
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleSignatureUploadChange}
            />
            {signatureImage && (
              <div className="w-16 h-10 border rounded overflow-hidden bg-white flex items-center justify-center">
                <img
                  src={signatureImage}
                  alt="signature preview"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}

            <button
              onClick={handleSignPDF}
              disabled={loading}
              className="px-4 py-2 text-white bg-blue-600 rounded shadow text-sm md:text-base disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Signing..." : "Sign PDF"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3 sm:p-4 bg-slate-50">
        <div ref={containerRef} className="w-full max-w-3xl mx-auto">
          {pageWidth === 0 ? (
            <div className="border rounded bg-white shadow p-4 text-sm text-slate-500">
              Initializing layout…
            </div>
          ) : (
            <div
              className="relative border rounded bg-white shadow"
              style={{
                width: pageWidth,
                height: pageHeight || "auto",
                touchAction: "none",
              }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <Document
                file={PDF_FILE}
                onLoadSuccess={handleDocumentLoadSuccess}
                loading={
                  <div className="p-4 text-sm text-slate-500">Loading PDF…</div>
                }
                error={
                  <div className="p-4 text-sm text-red-500">
                    Failed to load PDF. Ensure sample.pdf exists.
                  </div>
                }
              >
                <Page
                  pageNumber={1}
                  width={pageWidth}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                />
              </Document>

              {pageHeight > 0 && (
                <div
                  className="absolute inset-0"
                  style={{ touchAction: "none" }}
                >
                  {fields
                    .filter((f) => f.page === 1)
                    .map((field) => (
                      <DraggableField
                        key={field.id}
                        field={field}
                        pageRect={{ width: pageWidth, height: pageHeight }}
                        onChange={updateField}
                        signatureImage={signatureImage}
                      />
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {signedPdfUrl && (
        <div className="p-4 bg-white border-t text-center">
          <a
            href={signedPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-semibold underline"
          >
            Download Signed PDF
          </a>
        </div>
      )}
    </main>
  );
}
