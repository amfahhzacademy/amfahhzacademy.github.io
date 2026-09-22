/**
 * AMFAHHZ Cambridge Academy - website enquiry form handler (Google Apps Script)
 *
 * What it does: every enquiry from contact.html is saved as a new row in the
 * "Enquiries" tab of the Google Sheet this script belongs to, and an email is
 * sent to NOTIFY_EMAIL with the details.
 *
 * Setup (one time):
 *   1. Open the Google Sheet "AMFAHHZ Website Enquiries" > Extensions > Apps Script.
 *   2. Replace everything in Code.gs with this file and click Save.
 *   3. Deploy > New deployment > type "Web app"
 *        Execute as: Me    Who has access: Anyone
 *   4. Authorise when asked, then copy the Web app URL (ends in /exec).
 *   5. Paste that URL into data-endpoint="..." on the <form> in contact.html.
 *
 * After editing this script, use Deploy > Manage deployments > Edit > Version: New version
 * so the same URL keeps working.
 */

var NOTIFY_EMAIL = 'amfahhzacademy@gmail.com';
var SHEET_NAME = 'Enquiries';
var FIELDS = ['name', 'phone', 'email', 'level', 'subject', 'format', 'message', 'page'];
var HEADERS = ['Received', 'Name', 'WhatsApp / Phone', 'Email', 'Level', 'Subject(s)', 'Class type', 'Message', 'Sent from page'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var p = (e && e.parameter) || {};

    // Spam trap: real visitors never fill in this hidden field
    if (p['bot-field']) return json_({ result: 'success' });

    if (!p.name || !p.phone) return json_({ result: 'error', error: 'Name and phone are required.' });

    var row = [new Date()].concat(FIELDS.map(function (f) { return clean_(p[f]); }));
    getSheet_().appendRow(row);
    sendEmail_(p);

    return json_({ result: 'success' });
  } catch (err) {
    return json_({ result: 'error', error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Visiting the URL in a browser just confirms the endpoint is live
function doGet() {
  return ContentService.createTextOutput('AMFAHHZ Cambridge Academy enquiry form endpoint is running.');
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#f8efd9');
    sheet.setColumnWidth(8, 360);
  }
  return sheet;
}

// Trim, cap the length and stop spreadsheet formulas being injected (=, +, -, @)
function clean_(value) {
  var v = String(value || '').trim().slice(0, 2000);
  if (/^[=+\-@]/.test(v)) v = "'" + v;
  return v;
}

function escape_(value) {
  return String(value || '').replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function sendEmail_(p) {
  var rows = [
    ['Name', p.name], ['WhatsApp / Phone', p.phone], ['Email', p.email],
    ['Level', p.level], ['Subject(s)', p.subject], ['Class type', p.format], ['Message', p.message]
  ];
  var html = '<h2 style="font-family:Georgia,serif;color:#3a0f1d">New website enquiry</h2>' +
    '<table cellpadding="8" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">' +
    rows.map(function (r) {
      return '<tr><td style="border:1px solid #ece4e1;background:#f8f3ec;font-weight:bold">' + r[0] +
        '</td><td style="border:1px solid #ece4e1">' + escape_(r[1]).replace(/\n/g, '<br>') + '</td></tr>';
    }).join('') + '</table>' +
    '<p style="font-family:Arial,sans-serif;font-size:13px;color:#6b5d62">Saved in the "AMFAHHZ Website Enquiries" Google Sheet.</p>';

  var options = {
    to: NOTIFY_EMAIL,
    subject: 'New enquiry: ' + String(p.name || '').slice(0, 60) + (p.level ? ' (' + String(p.level).slice(0, 40) + ')' : ''),
    htmlBody: html,
    name: 'AMFAHHZ Website'
  };
  if (p.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) options.replyTo = p.email;
  MailApp.sendEmail(options);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
