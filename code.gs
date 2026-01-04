/**
 * SCRIPT GIẢI MÃ QR CCCD - PHIÊN BẢN LINH HOẠT (BẢO MẬT)
 * GitHub: https://github.com/hoafd/google-sheets-qr-cccd
 */

// --- CẤU HÌNH HỆ THỐNG ---
var CONFIG = {
  API_URL: "https://your-api-endpoint.com/scan-qr", // Thay bằng URL API của bạn
  FOLDER_ID: "1SI1X9IetO1qJtU0HbyEt...",             // ID thư mục chứa ảnh Google Form tải lên
  COL_IMAGE_URL: 7,                                 // Cột chứa Link ảnh (mặc định G)
  COL_STATUS: 15,                                   // Cột ghi trạng thái (mặc định O)
  COL_RAW_DATA: 16                                  // Cột ghi dữ liệu gốc (mặc định P)
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
 * GIẢI MÃ QR TỪ FORM (Hàm chính)
 * Cần cài đặt Trigger "On Form Submit" cho hàm này
 */
function autoReadQRCode(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var row = (e && e.range) ? e.range.getRow() : sheet.getLastRow();
  
  var fileUrl = sheet.getRange(row, CONFIG.COL_IMAGE_URL).getValue(); 
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
      var info = qrData.split("|"); // Format: Số CCCD|Số CMND cũ|Họ tên|Ngày sinh|Giới tính|Địa chỉ|Ngày cấp
      
      if (info.length >= 6) {
        // Điền vào các cột: Số CCCD(8), Họ tên(9), Ngày sinh(10), Giới tính(11), Địa chỉ(12), Ngày cấp(13), CMND cũ(14)
        sheet.getRange(row, 8, 1, 7).setValues([[info[0], info[2], info[3], info[4], info[5], info[6], info[1]]]);
        sheet.getRange(row, CONFIG.COL_STATUS).setValue("✅ Đã xử lý");
        sheet.getRange(row, CONFIG.COL_RAW_DATA).setValue(qrData);
      }
    } else {
      sheet.getRange(row, CONFIG.COL_STATUS).setValue("❌ Lỗi API: " + result.message);
    }
  } catch (err) {
    sheet.getRange(row, CONFIG.COL_STATUS).setValue("⚠️ Hệ thống: " + err.message);
  }
}

// --- QUẢN LÝ DỮ LIỆU DRIVE ---

function confirmAndDeleteManual() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.alert('XÁC NHẬN XÓA', 'Bạn có chắc chắn muốn chuyển toàn bộ ảnh trong thư mục vào Thùng rác?', ui.ButtonSet.YES_NO);
  if (response == ui.Button.YES) {
    autoDeletePhotos();
  }
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
    console.error('LỖI XÓA FILE: ' + e.message);
  }
}

function createWeeklyTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() == 'autoDeletePhotos') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  ScriptApp.newTrigger('autoDeletePhotos')
      .timeBased()
      .onWeekDay(ScriptApp.WeekDay.MONDAY)
      .atHour(0)
      .create();
  SpreadsheetApp.getUi().alert('Đã cài đặt lịch xóa tự động vào 0h Thứ Hai hàng tuần!');
}
