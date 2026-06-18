const SPREADSHEET_ID = "1f0Uraxr3tqmHKXbIKZ9WgngkzGU-CL__xNMosFEVOHE";
const SHEET_NAME = "Заявки с сайта";
const SECRET = "";

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || "{}");

    if (SECRET && body.secret !== SECRET) {
      return jsonResponse({ ok: false, error: "forbidden" });
    }

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getOrCreateSheet_(spreadsheet, SHEET_NAME);

    ensureHeader_(sheet);

    const lead = body.lead || {};

    sheet.appendRow([
      new Date(),
      lead.name || "",
      lead.phone || "",
      lead.message || "",
      body.source || "",
      body.createdAt || "",
      body.userAgent || "",
    ]);

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({
      ok: false,
      error: String(error),
    });
  }
}

function ensureHeader_(sheet) {
  if (sheet.getLastRow() > 0) {
    return;
  }

  sheet.appendRow([
    "Дата",
    "Имя",
    "Телефон",
    "Сообщение",
    "Источник",
    "createdAt",
    "User-Agent",
  ]);
}

function getOrCreateSheet_(spreadsheet, sheetName) {
  const existingSheet = spreadsheet.getSheetByName(sheetName);

  if (existingSheet) {
    return existingSheet;
  }

  return spreadsheet.insertSheet(sheetName);
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
