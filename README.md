# 🆔 Google Sheets QR CCCD

An automated solution to collect, decode, and manage Citizen ID (CCCD) data from **Google Forms** into **Google Sheets**. The system integrates image processing via API and includes an automatic security cleanup mechanism.

---

## 🌟 Key Features

* **Automatic QR Decoding:** Extracts ID Number, Full Name, Date of Birth, Gender, Address, Date of Issue, etc., immediately upon Form submission.
* **Column Letter Configuration:** Set column positions using letters (`A`, `B`, `C`...) for extreme convenience.
* **Absolute Security:** Automatically moves images to Trash after processing or on a weekly schedule.
* **API Flexibility:** Supports private servers (`qr-api` project) or third-party services.

---

## 🛠️ Installation Guide

### Step 1: Preparation
1. Create a **Google Form** with a "File Upload" field to receive ID card images.
2. Open the response Sheet and identify the **Folder ID** where images are stored on Drive.

### Step 2: Install Apps Script
1. In the Sheet, go to **Extensions** -> **Apps Script**.
2. Paste the content of the `Code.gs` file into the editor.
3. Update the `CONFIG` section at the top of the source code (API URL, Folder ID, Column Letters).

### Step 3: Install Trigger
1. Click on the **Triggers** icon (⏰).
2. Select function: `autoReadQRCode` | Event: **On form submit**.

---

## 📋 Recommended QR Decoding APIs

| Service | API URL | Notes |
| :--- | :--- | :--- |
| **Hoa FD's Project `qr-api`** | `https://github.com/hoafd/qr-api` | **Recommended** (Most Secure) |
| **GoQR.me** | `https://api.qrserver.com/v1/read-qr-code/` | Free (Prone to Unicode errors) |
| **Google Vision** | `https://vision.googleapis.com/v1/images:annotate` | Paid (Absolute Accuracy) |

---

🔐 Important Security Notice
Citizen ID data is extremely sensitive information. When using this script, please adhere to the following principles:

Limit Third-Party APIs: Avoid sending ID images via obscure free APIs.

Lock Script Access: Only allow admin emails to access the Apps Script and spreadsheet.

Utilize Auto-Delete: Always activate the available 📅 Weekly deletion schedule feature in the menu to ensure images do not exist permanently on Drive.

---

## 📂 Source Code Structure

* **`Code.gs`**: Main processing logic and column conversion functions.
* **`appsscript.json`**: Google Apps Script environment configuration.

---

## 🩺 Troubleshooting

1. **Font Errors:** Ensure the API returns UTF-8 format (for Vietnamese characters).
2. **Script not running:** Check if permissions have been granted for the Trigger.
3. **Misaligned Columns:** Re-check if the column characters in `CONFIG` match the actual Sheet.

---

## ☕ Support my work

If you find this project helpful, please consider supporting me to maintain the server and develop more free tools:

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Donate-orange?style=for-the-badge&logo=buy-me-a-coffee&logoColor=white)](https://www.buymeacoffee.com/hoa0290303s)

---

## ⚖️ License
This project is licensed under the [MIT License](LICENSE). Copyright (c) 2026 **hoafd**.
