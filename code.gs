/**
 * SCRIPT GIẢI MÃ QR CCCD - PHIÊN BẢN V2 (LINH HOẠT THEO KÝ TỰ CỘT)
 * GitHub: https://github.com/hoafd/google-sheets-qr-cccd
 */

// --- CẤU HÌNH HỆ THỐNG ---
var CONFIG = {
  API_URL: "https://your-api-endpoint.com/scan-qr", // URL API của bạn (ví dụ từ dự án qr-api)
  FOLDER_ID: "1SI1X9IetO1qJtU0HbyEt...",             // ID thư mục chứa ảnh từ Form

  // CẤU HÌNH CỘT (Dùng ký tự chữ cái A, B, C...)
  QR_IMAGE_COL: "G",    // Cột chứa Link ảnh tải lên
  INFO_START_COL: "H",  // Cột bắt đầu ghi 7 thông tin giải mã (Số CCCD, Họ tên...)
  STATUS_COL: "O",      // Cột ghi trạng thái xử lý
  RAW_DATA_COL: "P"     // Cột ghi toàn bộ chuỗi dữ liệu gốc (Raw)
};

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('🚀 QUẢN LÝ CCCD')
      .addItem('🗑️ Xóa sạch ảnh ngay bây giờ', 'confirmAndDeleteManual')
      .addSeparator()
      .addItem('📅 Cài đặt lịch xóa hàng tuần', 'createWeeklyTrigger')
      .addToUi();
}

/**
 * CHUYỂN ĐỔI CHỮ CÁI CỘT SANG SỐ (Ví dụ: "A" -> 1, "AA" -> 27)
 */
function colToNum(letter) {
  var column = 0, length = letter.length;
  for (var i = 0; i < length; i++) {
    column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
  }
  return column;
}

/**
 * GIẢI MÃ QR TỪ FORM
 */
function autoReadQRCode(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var row = (e && e.range) ? e.range.getRow() : sheet.getLastRow();
  
  // Chuyển đổi cấu hình chữ sang số
  var qrCol = colToNum(CONFIG.QR_IMAGE_COL);
  var infoCol = colToNum(CONFIG.INFO_START_COL);
  var statusCol = colToNum(CONFIG.STATUS_COL);
  var rawCol = colToNum(CONFIG.RAW_DATA_COL);

  var fileUrl = sheet.getRange(row, qrCol).getValue(); 
  if (!fileUrl || typeof fileUrl !== 'string' || fileUrl.indexOf("id=") === -1) return;
  
  try {
    var fileId = fileUrl.split("id=")[1].split("&")[0];
    var blob = DriveApp.getFileById(fileId).getBlob();
    
    var options = {
      "method": "post",
      "payload": { "file": blob },
      "muteHttpExceptions": true
    };
    
    var response = UrlFetchApp.fetch(CONFIG.API_URL, options);
    var result = JSON.parse(response.getContentText());
    
    if (result.status === "success") {
      var qrData = result.data; 
      var info = qrData.split("|"); // Định dạng CCCD: Số|Số cũ|Tên|Ngày sinh|Giới tính|Địa chỉ|Ngày cấp
      
      if (info.length >= 6) {
        // Ghi 7 trường thông tin vào dải ô bắt đầu từ infoCol
        sheet.getRange(row, infoCol, 1, 7).setValues([[info[0], info[2], info[3], info[4], info[5], info[6], info[1]]]);
        sheet.getRange(row, statusCol).setValue("✅ Đã xử lý");
        sheet.getRange(row, rawCol).setValue(qrData);
      }
    } else {
      sheet.getRange(row, statusCol).setValue("❌ Lỗi API: " + result.message);
    }
  } catch (err) {
    sheet.getRange(row, statusCol).setValue("⚠️ Hệ thống: " + err.message);
  }
}

// --- QUẢN LÝ DỮ LIỆU ---

function confirmAndDeleteManual() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.alert('XÁC NHẬN XÓA', 'Bạn có chắc chắn muốn chuyển toàn bộ ảnh trong thư mục vào Thùng rác?', ui.ButtonSet.YES_NO);
  if (response == ui.Button.YES) autoDeletePhotos();
}

function autoDeletePhotos() {
  try {
    var folder = DriveApp.getFolderById(CONFIG.FOLDER_ID);
    var files = folder.getFiles();
    var count = 0;
    SpreadsheetApp.getActiveSpreadsheet().toast('Đang bắt đầu dọn dẹp thư mục ảnh...', 'HỆ THỐNG');
    while (files.hasNext()) {
      var file = files.next();
      file.setTrashed(true); 
      count++;
    }
    SpreadsheetApp.getActiveSpreadsheet().toast('Đã dọn dẹp xong ' + count + ' tệp ảnh.', 'THÀNH CÔNG');
  } catch (e) {
    console.error('LỖI: ' + e.message);
  }
}

function createWeeklyTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() == 'autoDeletePhotos') ScriptApp.deleteTrigger(triggers[i]);
  }
  ScriptApp.newTrigger('autoDeletePhotos').timeBased().onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(0).create();
  SpreadsheetApp.getUi().alert('Đã cài đặt lịch xóa tự động vào 0h Thứ Hai!');
}
