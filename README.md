# 🆔 Google Sheets QR CCCD Processor (V2)

Giải pháp tự động hóa toàn diện giúp thu thập, giải mã và quản lý dữ liệu Căn cước công dân (CCCD) từ **Google Forms** vào **Google Sheets**. Hệ thống tích hợp xử lý ảnh thông minh qua API và cơ chế tự động dọn dẹp để bảo mật dữ liệu tuyệt đối.



---

## 🌟 Tính năng nổi bật

* **Giải mã QR tự động:** Trích xuất tức thời các thông tin từ mã QR CCCD: *Số ID, Họ tên, Ngày sinh, Giới tính, Địa chỉ, Ngày cấp...*
* **Cấu hình linh hoạt (Column Letters):** Cho phép thiết lập vị trí các cột dữ liệu bằng chữ cái (`A`, `B`, `C`...) thay vì đếm số thứ tự thủ công. Script tự động chuyển đổi chữ cái sang số thứ tự tương ứng.
* **Bảo mật & Quyền riêng tư:** Tự động chuyển tệp ảnh vào Thùng rác (Trash) ngay sau khi xử lý thành công hoặc theo lịch trình hàng tuần để tiết kiệm dung lượng Drive và bảo vệ thông tin cá nhân.
* **Hỗ trợ đa API:** Dễ dàng tùy chỉnh Endpoint API để sử dụng server riêng (như dự án **`qr-api`**) hoặc các dịch vụ giải mã QR của bên thứ ba.

---

## 🛠️ Hướng dẫn cài đặt chi tiết

### Bước 1: Chuẩn bị Google Form & Sheet
1. Tạo một **Google Form** với câu hỏi dạng **Tải tệp lên** (File Upload) để người dùng gửi ảnh CCCD.
2. Kết nối Form với một **Google Sheet** để nhận phản hồi.
3. Xác định **ID thư mục** lưu ảnh trên Google Drive (Lấy từ chuỗi ký tự cuối cùng trong URL của thư mục trên Drive).

### Bước 2: Thiết lập Google Apps Script
1. Trong Google Sheet, chọn **Extensions** (Tiện ích mở rộng) -> **Apps Script**.
2. Xóa toàn bộ mã hiện có và dán nội dung file **`Code.gs`** (nằm trong kho lưu trữ này).
3. Cập nhật phần **`CONFIG`** ở đầu script:
   * `API_URL`: Địa chỉ API giải mã QR của bạn.
   * `FOLDER_ID`: ID thư mục lưu ảnh đã chuẩn bị ở Bước 1.
   * `QR_IMAGE_COL`: Chữ cái cột chứa link ảnh (VD: `"G"`).
   * `INFO_START_COL`: Chữ cái cột bắt đầu ghi thông tin giải mã (VD: `"H"`).
   * `STATUS_COL`: Cột ghi trạng thái xử lý (VD: `"O"`).

### Bước 3: Cài đặt Trình kích hoạt (Trigger)
Để hệ thống tự vận hành mỗi khi có người nộp Form:
1. Tại giao diện Apps Script, nhấn vào biểu tượng **Triggers** (hình đồng hồ ⏰).
2. Nhấn **Add Trigger** (Thêm trình kích hoạt).
3. Thiết lập các thông số:
   * Chọn hàm: `autoReadQRCode`.
   * Chọn nguồn sự kiện: **From spreadsheet**.
   * Chọn loại sự kiện: **On form submit**.
4. Nhấn **Save** và phê duyệt quyền truy cập cho script.

---

[!TIP] Khuyên dùng: Sử dụng dự án qr-api chạy trên VPS cá nhân của bạn để đảm bảo tốc độ xử lý và bảo mật dữ liệu cao nhất.
https://github.com/hoafd/qr-api

🩺 Kiểm tra & Bảo trì
Menu hệ thống: Sau khi làm mới Google Sheet, một menu mới 🚀 QUẢN LÝ CCCD sẽ xuất hiện. Tại đây bạn có thể:

🗑️ Xóa sạch ảnh ngay bây giờ: Dọn dẹp thủ công thư mục ảnh.

📅 Cài đặt lịch xóa hàng tuần: Tự động dọn dẹp vào 0h Thứ Hai hàng tuần.

Log lỗi: Nếu dữ liệu không được điền, hãy kiểm tra cột Trạng thái (O) để xem phản hồi chi tiết từ API hoặc lỗi hệ thống.

---

## 📂 Cấu trúc mã nguồn

* **`Code.gs`**: Chứa toàn bộ logic xử lý, hàm chuyển đổi ký tự cột sang số và các hàm tương tác API.
* **`appsscript.json`**: File cấu hình môi trường và quyền truy cập (Scopes) của Google Apps Script.

---

## 📋 API Endpoint (Đề xuất)

Hệ thống yêu cầu một API nhận file ảnh và trả về JSON theo định dạng chuẩn:

```json
{
  "status": "success",
  "data": "Số CCCD|Số CMND cũ|Họ tên|Ngày sinh|Giới tính|Địa chỉ|Ngày cấp"
}
```

## ⚖️ Giấy phép
Dự án được cấp phép theo [MIT License](LICENSE). Copyright (c) 2026 **hoafd**.
