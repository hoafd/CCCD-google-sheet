# 🆔 Google Sheets QR CCCD

Giải pháp tự động hóa giúp thu thập, giải mã và quản lý dữ liệu Căn cước công dân (CCCD) từ **Google Forms** vào **Google Sheets**. Hệ thống tích hợp xử lý ảnh qua API và cơ chế tự động dọn dẹp bảo mật.

---

## 🌟 Tính năng nổi bật

* **Giải mã QR tự động:** Trích xuất Số ID, Họ tên, Ngày sinh, Giới tính, Địa chỉ, Ngày cấp... ngay khi nộp Form.
* **Cấu hình chữ cái cột:** Thiết lập vị trí cột bằng chữ cái (`A`, `B`, `C`...) cực kỳ tiện lợi.
* **Bảo mật tuyệt đối:** Tự động chuyển ảnh vào Thùng rác sau khi xử lý hoặc theo lịch hàng tuần.
* **Linh hoạt API:** Hỗ trợ server riêng (dự án `qr-api`) hoặc các dịch vụ bên thứ ba.

---

## 🛠️ Hướng dẫn cài đặt

### Bước 1: Chuẩn bị
1. Tạo **Google Form** dạng "Tải tệp lên" để nhận ảnh CCCD.
2. Mở Sheet nhận phản hồi, xác định **ID thư mục** lưu ảnh trên Drive.

### Bước 2: Cài đặt Apps Script
1. Trong Sheet, vào **Extensions** -> **Apps Script**.
2. Dán nội dung file `Code.gs` vào trình soạn thảo.
3. Cập nhật phần `CONFIG` ở đầu mã nguồn (URL API, ID Thư mục, Chữ cái cột).

### Bước 3: Cài đặt Trigger
1. Nhấn vào biểu tượng **Triggers** (⏰).
2. Chọn hàm: `autoReadQRCode` | Event: **On form submit**.

---

## 📋 Danh sách API giải mã QR đề xuất

| Dịch vụ | URL API | Ghi chú |
| :--- | :--- | :--- |
| **Dự án của Hoa FD `qr-api`** | `https://github.com/hoafd/qr-api` | **Khuyên dùng** (Bảo mật nhất) |
| **GoQR.me** | `https://api.qrserver.com/v1/read-qr-code/` | Miễn phí (Dễ lỗi Unicode) |
| **Google Vision** | `https://vision.googleapis.com/v1/images:annotate` | Trả phí (Độ chính xác tuyệt đối) |

---

🔐 Lưu ý quan trọng về Bảo mật (Security)
Dữ liệu Căn cước công dân là thông tin cực kỳ nhạy cảm. Khi sử dụng script này, hãy tuân thủ các nguyên tắc sau:

Hạn chế API bên thứ ba: Tránh gửi ảnh CCCD qua các API miễn phí không rõ nguồn gốc.

Khóa quyền truy cập Script: Chỉ cho phép những email quản trị có quyền truy cập vào Apps Script và bảng tính.

Tận dụng tính năng Tự động xóa: Hãy luôn kích hoạt tính năng 📅 Cài đặt lịch xóa hàng tuần có sẵn trong menu để đảm bảo ảnh không tồn tại vĩnh viễn trên Drive.

---

## 📂 Cấu trúc mã nguồn

* **`Code.gs`**: Logic xử lý chính và hàm chuyển đổi cột.
* **`appsscript.json`**: Cấu hình môi trường Google Apps Script.

---

## 🩺 Xử lý lỗi (Troubleshooting)

1. **Lỗi font chữ:** Đảm bảo API trả về định dạng UTF-8 (Tiếng Việt).
2. **Script không chạy:** Kiểm tra xem đã cấp quyền cho Trigger chưa.
3. **Cột bị lệch:** Kiểm tra lại ký tự cột trong `CONFIG` đã khớp với Sheet thực tế chưa.

---

## ⚖️ Giấy phép
Dự án phát hành dưới giấy phép **MIT License**. Bản quyền (c) 2026 **hoafd**.
