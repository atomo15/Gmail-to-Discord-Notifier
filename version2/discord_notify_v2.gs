function getDiscordURL() {
  const ss = DriveApp.getFilesByName("discordemailnotification").next();
  if (!ss) {
    Logger.log("Spreadsheet 'discordemailnotification' not found.");
    return; // Or handle the error as needed.
  }

    // Open the spreadsheet.
    const spreadsheet = SpreadsheetApp.openById(ss.getId());

    // Get the sheet you want to work with..
    const sheet = spreadsheet.getSheetByName("tbl_notify_management"); 

    if (!sheet) {
      Logger.log("Sheet 'tbl_notify_management' not found in 'discordemailnotification'.");
      return;
    }
    var channel_name = [];
    var channel_url = {};
    const data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) { // เริ่มที่แถว 2 เพราะแถวแรกเป็น header
      channel_name.push(data[i][0]);
      channel_url[data[i][0]] = data[i][3];
      // Logger.log(data[i][0]);
    }
    // Logger.log(channel_name);
    // Logger.log(channel_url);

    // Get the sheet you want to work with..
    const sheet2 = spreadsheet.getSheetByName("tbl_sender_group"); 
    if (!sheet2) {
      Logger.log("Sheet 'tbl_sender_group' not found in 'discordemailnotification'.");
      return;
    }
    const data2 = sheet2.getDataRange().getValues();
    var sender_group = {};

    for (var i = 1; i < data2.length; i++) { // เริ่มที่แถว 2 เพราะแถวแรกเป็น header
      sender_group[data2[i][1]] = data2[i][0];
    }
    // Logger.log(sender_group);
    // for (var key in sender_group) {
    //   if (sender_group.hasOwnProperty(key)) { // Important: Check if the property belongs to the object itself
    //     Logger.log(key); // Prints the key
    //   }
  // }

  return [channel_name,channel_url,sender_group];
}

function discord_test(){
  var message = "Ez";
  var url = "";
  sendToDiscord(url,message);
}
function sendToDiscord(dest_url,message)
{
  const payload = {
    content: message, // Message content
  };

  const options = {
    method: "POST",
    contentType: "application/json",
    payload: JSON.stringify(payload),
  };

  // Send the request to Discord
  UrlFetchApp.fetch(dest_url, options);
}
