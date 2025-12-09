import express from "express";
import cors from "cors";
import path from "path";
import { connectDB } from "./config/db.js";
import signRoutes from "./routes/signRoutes.js";
import "dotenv/config.js";

const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const __dirname = path.resolve();

app.use(cors());

app.use(express.json({ limit: "20mb" })); // base64 images

// Static serving of PDFs
const signedDir = process.env.SIGNED_PDF_DIR || "./signed-pdfs";
const basePdfDir = process.env.BASE_PDF_DIR || "./sample-pdfs";

app.use("/signed", express.static(path.join(__dirname, signedDir)));
app.use("/pdf", express.static(path.join(__dirname, basePdfDir)));

app.use("/api", signRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Backend listening at http://localhost:${PORT}`);
  });
});
