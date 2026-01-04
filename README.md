# 🆔 Google Sheets QR CCCD Processor

Hệ thống tự động thu thập và giải mã thông tin căn cước công dân (CCCD) từ Google Forms vào Google Sheets.



## 🚀 Tính năng
- **Auto-Read:** Tự động đọc mã QR từ ảnh tải lên Form và điền thông tin (Họ tên, ngày sinh, địa chỉ...) vào các cột tương ứng.
- **Privacy Mode:** Tự động dọn dẹp ảnh đã tải lên vào Thùng rác hàng tuần để tiết kiệm dung lượng Drive và bảo mật dữ liệu.
- **API Integration:** Dễ dàng thay đổi Endpoint API giải mã QR.

## 🛠️ Hướng dẫn cài đặt

### 1. Chuẩn bị Google Form
- Tạo Form có trường **Tải tệp lên** (Ảnh CCCD).
- Trong trang tính nhận phản hồi, xác định ID thư mục lưu ảnh (nằm trong URL thư mục trên Drive).

### 2. Thiết lập Apps Script
- Vào **Extensions** -> **Apps Script**.
- Dán nội dung file `Code.gs`.
- Cấu hình ID thư mục và URL API trong phần `CONFIG`.

### 3. Cài đặt Trình kích hoạt (Trigger)
- Tại giao diện Apps Script, chọn biểu tượng đồng hồ (Triggers).
- Nhấn **Add Trigger**.
- Chọn hàm: `autoReadQRCode`.
- Chọn sự kiện: **From spreadsheet** -> **On form submit**.

## ⚙️ Cấu hình bảng tính

Mở tệp Apps Script đính kèm và cập nhật phần `CONFIG`:

* **API_URL:** Địa chỉ server xử lý mã QR (Ví dụ: `https://your-api.id.vn/scan-qr`).
* **QR_IMAGE_COL:** Nhập chữ cái cột chứa link ảnh (Ví dụ: `"G"`).
* **INFO_START_COL:** Nhập chữ cái cột bắt đầu ghi thông tin CCCD (Ví dụ: `"H"` sẽ ghi vào H, I, J, K, L, M, N).
* **STATUS_COL:** Nhập chữ cái cột hiển thị trạng thái (Ví dụ: `"O"`).

Hệ thống sẽ tự động chuyển đổi chữ cái `"G"` -> `7`, `"O"` -> `15` giúp bạn không cần đếm cột thủ công.

## ⚖️ Giấy phép
MIT License. Copyright (c) 2026 **hoafd**.
