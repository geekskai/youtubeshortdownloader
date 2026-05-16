

# Product Requirement Document (PRD): Hours-to-Decimal Payroll Utility

**Status:** Approved | **Version:** 1.0 | **Author:** Gemini (Senior PM)

---

## 1. Executive Summary
### 1.1 Problem Statement
Time is naturally recorded in sexagesimal (base-60), but accounting software and payroll formulas require decimal (base-10). Users often make the critical mistake of entering `1:30` as `1.3` instead of the correct `1.5`, leading to underpayment and legal compliance risks.

### 1.2 Solution
A specialized calculator that converts `HH:MM` or `HH:MM:SS` into decimal hours with a specific focus on **Payroll Rounding Rules** (e.g., the 7-minute rule).

---

## 2. User Personas
* **The Small Business Owner:** Manually calculating weekly wages for employees based on punch cards.
* **The Freelancer:** Needs to bill clients for precise project hours (e.g., 45 minutes = 0.75 hrs).
* **The HR Specialist:** Batch-processing hundreds of time entries into a centralized payroll system.

---

## 3. Functional Requirements

### 3.1 Dual Input Modes
* **Standard Time Input:** Three separate fields for Hours, Minutes, and Seconds.
* **Smart String Parser:** A single text box that recognizes formats like `1h 30m`, `1:30`, or even `90 min` and automatically normalizes them.

### 3.2 Logic & Rounding (The "Money" Logic)
* **Exact Conversion:** $\text{Decimal} = \text{Hours} + (\text{Minutes} / 60) + (\text{Seconds} / 3600)$.
* **Standard Payroll Rounding (Toggles):**
    * **No Rounding:** Show up to 4 decimal places.
    * **Quarter-Hour (15 min):** Round to nearest `.00`, `.25`, `.50`, `.75`.
    * **Tenth-of-an-Hour (6 min):** Common in legal/consulting billing.
    * **The 7-Minute Rule:** A US-standard where 1–7 minutes rounds down, and 8–14 minutes rounds up to the nearest quarter hour.

### 3.3 Wage Integration (Value-Add)
* **Rate Multiplier:** An optional field for "Hourly Rate" ($).
* **Instant Total:** Displaying the final payout amount: $\text{Decimal Hours} \times \text{Rate}$.

---

## 4. UI/UX Design

### 4.1 "Human-Readable" Confirmation
* Below the decimal result, display a clear text summary: *"That's 1 hour and 30 minutes"* to prevent data entry errors.

### 4.2 Batch Entry Table
* Instead of a single calculation, provide a **Table View** where users can add multiple "Rows" of time for a whole week, with a "Grand Total" at the bottom.

### 4.3 Visual Feedback
* A simple clock-face icon that fills up based on the minutes entered (e.g., if 45 min is entered, 3/4 of the circle is shaded).

---

## 5. Technical Requirements

| Feature | Requirement |
| :--- | :--- |
| **Edge Cases** | Handle "overflow" (e.g., if user enters 90 minutes, convert to 1.5 hours). |
| **Data Persistence** | Use LocalStorage to save the Hourly Rate so the user doesn't re-type it every visit. |
| **Export** | Ability to export the batch table as a **CSV** or **PDF** for payroll records. |

---

## 6. Success Metrics (KPIs)
* **Accuracy Ratio:** Users reporting zero discrepancies when auditing against payroll software.
* **Time Saved:** Reduce the time it takes to process a weekly timesheet by >50%.
* **Cross-Sell:** High click-through rate on the "Export to CSV" feature (indicating professional use).

---

## 7. Future Scope (V2.0)
* **Overtime Logic:** Automatically calculate 1.5x for hours exceeding 40/week.
* **Break Deductions:** A toggle to subtract "Unpaid Lunch Break" (e.g., 30 min) from the total.

---
