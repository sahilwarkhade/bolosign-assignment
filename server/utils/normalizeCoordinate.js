/**
 * Convert normalized browser coordinates (nx, ny, nw, nh)
 * into actual PDF coordinates (x, y, width, height).
 *
 * WHY THIS IS NEEDED:
 *  - Browser uses TOP-LEFT as (0,0)
 *  - PDF uses BOTTOM-LEFT as (0,0)
 *  - Browser sizes/positions change with screen size
 *  - PDF dimensions are absolute and fixed
 *
 * So we store everything in normalized percentages (0–1),
 * then convert them into true PDF coordinates at sign time.
 */

function normalizedToPdfBox({ nx, ny, nw, nh }, pageWidth, pageHeight) {
  /**
   * NORMALIZED VALUES:
   *  nx = normalized X position (0 = left, 1 = right)
   *  ny = normalized Y position (0 = top, 1 = bottom)
   *  nw = normalized width  (0–1)
   *  nh = normalized height (0–1)
   *
   * PDF DIMENSIONS:
   *  pageWidth  => PDF width in points
   *  pageHeight => PDF height in points
   */

  // 🔹 Convert normalized width → actual PDF width
  const boxWidth = nw * pageWidth;

  // 🔹 Convert normalized height → actual PDF height
  const boxHeight = nh * pageHeight;

  // 🔹 Convert normalized X → PDF X (same left-origin system)
  const x = nx * pageWidth;

  /**
   * 🔥 Convert normalized Y → PDF Y (top-left → bottom-left)
   *
   * Browser Y increases downward.
   * PDF Y increases upward.
   *
   * PDF formula:
   *   y = pageHeight                        (start at top in PDF coords)
   *         - (ny * pageHeight)             (move down ny%)
   *         - boxHeight                     (shift to bottom of box)
   */
  const y = pageHeight - ny * pageHeight - boxHeight;

  // Return the computed PDF-safe coordinates
  return { x, y, width: boxWidth, height: boxHeight };
}

export default normalizedToPdfBox;
