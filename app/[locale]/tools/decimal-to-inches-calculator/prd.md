# Product Requirement Document (PRD): Decimal-to-Inches Precision Bridge

**Status:** Approved | **Version:** 1.0 | **Author:** Gemini (Senior PM)

---

## 1. Executive Summary
### 1.1 Problem Statement
In construction, woodworking, and machining, digital measurements (from CAD or calculators) are provided in decimals (e.g., `0.3125"`). However, physical tools like tape measures and drill bits are categorized by fractions (e.g., `5/16"`). Users struggle to bridge this gap, leading to "close enough" guesses that ruin precision.

### 1.2 Solution
A converter that translates any decimal inch value into its **closest fractional equivalent** based on standard ruler increments (1/16, 1/32, 1/64).

---

## 2. User Personas
* **The Woodworker:** Needs to set a table saw fence to a decimal value derived from a blueprint.
* **The Machinist:** Needs the highest possible fractional precision (1/64) for manual milling.
* **The Home DIYer:** Uses a tape measure (1/16 precision) and needs to know where to mark a line.

---

## 3. Functional Requirements

### 3.1 Decimal to Fraction Conversion
* **The Logic:** Convert the decimal to a fraction and reduce it to its simplest form (e.g., `0.75` $\rightarrow$ `3/4`).
* **Selectable Precision (Denominator):** Users must be able to choose the "rounding base":
    * 1/4, 1/8 (Rough construction)
    * 1/16 (Standard tape measure)
    * 1/32, 1/64 (High precision/Machining)

### 3.2 "Nearest Match" & Error Offset
Since not all decimals have a perfect fractional equivalent:
* **Output A:** The exact simplest fraction (if applicable).
* **Output B:** The nearest fraction based on the chosen precision.
* **The "Offset" (Crucial):** Show how much the fraction differs from the decimal (e.g., `0.32" ≈ 5/16" (+ 0.0075" error)`).

### 3.3 Feet-Inch Integration
* Support inputs greater than 12 inches and automatically format as `X' - Y"` (e.g., `14.5"` $\rightarrow$ `1' 2 1/2"`).

---

## 4. UI/UX Design

### 4.1 Visual Ruler Mapping (The "Aha!" Moment)
* **Dynamic Ruler:** Below the result, show a high-resolution digital ruler.
* **The "Marker":** Place a red arrow/line on the ruler exactly where the calculated fraction sits. This allows the user to look at the screen, then look at their physical tape measure and see the exact same pattern.



### 4.2 Large-Digit Display
* The fraction should be displayed in a **stacked format** ($\frac{3}{4}$) rather than linear (`3/4`) to match the visual language of physical tools.

---

## 5. Technical Requirements

| Feature | Requirement |
| :--- | :--- |
| **Input Masking** | Only allow numeric input and a single decimal point. |
| **Rounding Direction** | Options for "Round to Nearest", "Always Round Up", or "Always Round Down" (critical for fitment). |
| **Math Library** | Use Greatest Common Divisor (GCD) algorithm to simplify fractions instantly. |

---

## 6. Success Metrics (KPIs)
* **Visual Match Rate:** Users report that the digital ruler marker matches their physical tools perfectly.
* **Reduced Material Waste:** Decrease in "wrong cuts" reported by beta testers.
* **Task Speed:** User gets from "Decimal" to "Ruler Position" in under 5 seconds.

---

## 7. Future Scope (V2.0)
* **Drill Bit Suggestion:** "The closest drill bit for 0.32" is 5/16"."
* **AR Ruler:** Use the smartphone camera to overlay the fractional measurement onto a real-world object.

---
