

---

# Product Requirement Document (PRD): Universal Time-to-Decimal Engine

**Status:** Approved | **Version:** 1.0 | **Author:** Gemini (Senior PM)

---

## 1. Executive Summary
### 1.1 Problem Statement
Time data exists in multiple "human" formats (12h/24h, HH:MM:SS, Days:Hours). Computers and statistical models require a single float value (Decimal) for calculations. Manually converting "2 days, 4 hours, and 15 minutes" into a decimal day or hour is highly prone to error.

### 1.2 Solution
A multi-modal converter that transforms any time format into a selectable decimal base (Decimal Hours, Decimal Minutes, or Decimal Days).

---

## 2. User Personas
* **Data Analyst:** Converting a column of "HH:MM:SS" logs into decimals for trend line plotting.
* **Project Manager:** Converting "Man-Hours" (e.g., 1d 4h) into a decimal for budget forecasting.
* **Logistics Coordinator:** Calculating decimal days for shipping lead times (e.g., 2.75 days).

---

## 3. Functional Requirements

### 3.1 Flexible Input Parser (The "Magic Box")
The system must support a single "Natural Language" input field that parses:
* **Colon format:** `01:30:45`
* **Textual format:** `1h 30m`, `45min`, `2 days 6 hours`
* **Clock Time:** `2:30 PM` (converts to decimal of the day, i.e., `14.50`)

### 3.2 Output Configuration (Multi-Base)
Users can choose their "Target Base":
* **Decimal Hours (Default):** $1:30 \rightarrow 1.5$
* **Decimal Days:** $12:00 \rightarrow 0.5$
* **Decimal Minutes:** $1:01 \rightarrow 61.0$

### 3.3 The "Excel-Friendly" Toggle
* **Format for CSV:** A feature to automatically format the output without symbols (e.g., `1.50` instead of `1.50 hrs`) to ensure it's ready for copy-pasting into spreadsheets.

---

## 4. UI/UX Design

### 4.1 Real-Time Breadcrumbs
As the user types, the UI should show how it's interpreting the data:
* *Input:* `1:15`
* *Interpretation:* `[1 Hour] [15 Minutes]` (This prevents the user from accidentally entering 1.15 minutes).

### 4.2 One-Click "Reverse"
A prominent "Swap" button to instantly switch to **Decimal to Time** mode, as users often need to verify the result by going backwards.

---

## 5. Technical Requirements

| Feature | Requirement |
| :--- | :--- |
| **Precision Control** | User-defined decimal places (0 to 6). |
| **Handling Overflows** | If input is `00:90:00`, output should correctly show `1.5` hours. |
| **Parsing Logic** | Use Regex to identify time units (d, h, m, s) regardless of user spacing. |

---

## 6. Success Metrics (KPIs)
* **Parser Accuracy:** % of natural language inputs successfully recognized on the first try.
* **Copy-to-Clipboard Rate:** Number of users using the result in other software.
* **Session Duration:** Should be $< 10$ seconds (aiming for "utility speed").

---

## 7. Future Scope (V2.0)
* **Batch Conversion:** Upload a .txt or .csv file and convert an entire column of time strings.
* **Industrial Standard Presets:** Add specialized bases used in specific industries (e.g., "Industrial Minutes" where 1 hour = 100 units).

---
