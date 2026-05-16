# Product Requirement Document (PRD): Gauge-to-Decimal Converter Tool

**Status:** Draft | **Version:** 1.0 | **Author:** Gemini (Senior PM)

---

## 1. Executive Summary
### 1.1 Problem Statement
Users in manufacturing, engineering, and DIY crafting often struggle with the "Gauge" system, which is non-linear and varies by material (e.g., Steel vs. Aluminum vs. Wire). Mistakes in conversion lead to material waste and structural failures.

### 1.2 Solution
A mobile-responsive web utility that provides instant, high-precision conversion from Gauge to Decimal (Inches & Millimeters) with material-specific logic.

---

## 2. User Personas
* **Fabricator Frank:** Needs to quickly check sheet metal thickness on a noisy factory floor using a mobile device.
* **Jeweler Jane:** Needs to convert AWG (American Wire Gauge) to mm for beadwork and wire wrapping.
* **Engineer Eric:** Needs precise decimal values (up to 4 decimal places) for CAD modeling.

---

## 3. Functional Requirements

### 3.1 Material & Standard Selection
The system **must** allow users to select from the following standards, as "Gauge" is not universal:
* **Sheet Steel** (Standard)
* **Galvanized Steel**
* **Stainless Steel**
* **Aluminum / Non-Ferrous Metals**
* **Wire (AWG - American Wire Gauge)**

### 3.2 Conversion Logic
* **Input:** Users can select a Gauge number from a dropdown or type it in.
* **Output:** Real-time display of:
    * Decimal Inches (e.g., `0.0598"`)
    * Metric Millimeters (e.g., `1.519 mm`)
* **Tolerance Display:** Show the standard manufacturing tolerance range for the selected gauge.

### 3.3 Visual Reference (The "Mental Model" Helper)
* Include a dynamic visual indicator that represents the relative thickness compared to common objects (e.g., "Approximately the thickness of a credit card").



---

## 4. Technical & UI Requirements (UI/UX)
### 4.1 Precision
* All decimal conversions must be accurate to **4 decimal places** for inches and **3 decimal places** for millimeters.

### 4.2 Search-First UI
* **Quick Search:** A prominent search bar where a user can type "16 ga" and get immediate results without navigating menus.

### 4.3 Mobile Responsiveness
* Large touch targets for buttons.
* High contrast ratios for readability in bright industrial environments.

---

## 5. Data Schema (Simplified)

| Gauge | Standard Steel (in) | Stainless Steel (in) | Galvanized (in) |
| :--- | :--- | :--- | :--- |
| 10 | 0.1345 | 0.1406 | 0.1382 |
| 12 | 0.1046 | 0.1094 | 0.1084 |
| 16 | 0.0598 | 0.0625 | 0.0635 |

---

## 6. Success Metrics (KPIs)
* **Accuracy:** Zero reported instances of conversion errors.
* **Time-to-Result:** Users should find their conversion within **3 seconds** of landing on the page.
* **Retention:** Repeat usage by users in the construction/jewelry industries.

---

## 7. Future Scope (V2.0)
* **Offline Mode:** PWA (Progressive Web App) support for workshops without Wi-Fi.
* **Camera Scan:** Using AR to scan a metal edge and estimate its gauge.

---
