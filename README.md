# 🖊️ Signature Injection Engine — Responsive PDF Signer (MERN + pdf-lib)

A production-grade prototype of a **Signature Injection Engine** similar to BoloForms/DocuSign.  
This project solves the critical problem of mapping **responsive screen coordinates → exact PDF coordinates**, ensuring perfect field placement on any device.

---

## 🚀 Features

### 🖥 Frontend (React + PDF.js)
- Fully responsive PDF viewer  
- Drag & drop fields:  
  - Signature  
  - Text  
  - Date  
  - Checkbox  
  - Radio  
  - Image  
- Resize and reposition fields  
- Normalized coordinates (device independent)  
- Signature upload (Base64)  
- Multiple signature fields supported  

### ⚙️ Backend (Node.js + Express + pdf-lib)
- Converts normalized coordinates → PDF coordinates  
- Draws signature images inside bounding boxes  
- Aspect-ratio–safe scaling (no distortion)  
- Multi-field support on a single page  
- SHA-256 hashing of original & signed PDF  
- MongoDB audit logging  
- Returns downloadable signed PDF URL  

---

## 🧠 The Core Problem

Browsers and PDFs use **different coordinate systems**:

| System | Origin | Units |
|--------|--------|--------|
| Browser | Top-left | CSS pixels |
| PDF | Bottom-left | 72 DPI points |

### ❗ If a user places a signature visually on the screen, it **will not** directly match the PDF’s coordinate system.

This engine solves that with **normalized coordinates (0–1)**.

---

# 📹 Project Demo Video

Below is a walkthrough demonstrating the full Signature Injection Engine, including:

- Responsive PDF editor  
- Drag & drop fields  
- Signature upload  
- Coordinate conversion  
- Backend burn-in engine  
- SHA-256 audit trail  
- Final signed PDF output  

## 🎥 Watch the Video

<!-- You can embed MP4 or WebM video directly from public/ -->
LINK : https://drive.google.com/file/d/1FOYQTWCX4kauqGsvRY1LkPuYprSdbDhU/view?usp=drive_link

---