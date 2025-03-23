function updatelasttime(newlasttime) {

  if(newlasttime==null)
  {
    Logger.log("Error: Cell A2 in 'discordemailnotification' try updated to: " + newlasttime);
    return;
  }
  // Get the spreadsheet file by name.
  const ss = DriveApp.getFilesByName("discordemailnotification").next();

  if (!ss) {
    Logger.log("Spreadsheet 'discordemailnotification' not found.");
    return;
  }

  const spreadsheet = SpreadsheetApp.openById(ss.getId());
  const sheet = spreadsheet.getSheetByName("Sheet1"); // Replace "Sheet1" with your sheet name.

  if (!sheet) {
    Logger.log("Sheet 'Sheet1' not found in 'discordemailnotification'.");
    return;
  }

  // Value to write to cell A2.  Change this to the value you want to write.
  const newValue = newlasttime; // Or a variable containing the value.

  // Update cell A2.
  sheet.getRange("A2").setValue(newValue);

  Logger.log("Cell A2 in 'discordemailnotification' updated to: " + newValue);
}

function getLasttimeRead() {
  const ss = DriveApp.getFilesByName("discordemailnotification").next();
  if (!ss) {
    Logger.log("Spreadsheet 'discordemailnotification' not found.");
    return; // Or handle the error as needed.
  }

    // Open the spreadsheet.
    const spreadsheet = SpreadsheetApp.openById(ss.getId());

    // Get the sheet you want to work with.  Replace "Sheet1" with the actual sheet name.
    const sheet = spreadsheet.getSheetByName("Sheet1"); // Or getSheetByName("YourSheetName");

    if (!sheet) {
      Logger.log("Sheet 'Sheet1' not found in 'discordemailnotification'.");
      return;
    }

    const data = sheet.getDataRange().getValues();
    // var time = Utilities.formatDate(data[1][0], "America/Chicago", "yyyy-MM-dd HH:mm:ss");
    // for (var i = 1; i < data.length; i++) { // เริ่มที่แถว 2 เพราะแถวแรกเป็น header
    //   var time = Utilities.formatDate(data[i][0], "America/Chicago", "yyyy-MM-dd HH:mm:ss");
    //   Logger.log(data[i][0]);
    // }
    var displayedTime = sheet.getRange("A2").getDisplayValue();
    var new_time = displayedTime.split(" ")[1];
    Logger.log(new_time);
  return new_time;
}

function updatelastrun() {
  var now = new Date();
  var formattedDateTime = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-M-dd HH:mm:ss");
  Logger.log(formattedDateTime);
  // return formattedDateTime;
  // Get the spreadsheet file by name.
  const ss = DriveApp.getFilesByName("discordemailnotification").next();

  if (!ss) {
    Logger.log("Spreadsheet 'discordemailnotification' not found.");
    return;
  }

  const spreadsheet = SpreadsheetApp.openById(ss.getId());
  const sheet = spreadsheet.getSheetByName("Sheet1"); // Replace "Sheet1" with your sheet name.

  if (!sheet) {
    Logger.log("Sheet 'Sheet1' not found in 'discordemailnotification'.");
    return;
  }

  // Update cell B2.
  sheet.getRange("B2").setValue(formattedDateTime);

  Logger.log("Cell B2 (updatelastrun) in 'discordemailnotification' updated to: " + formattedDateTime);
}

function addNewSenderToSheet(channel,new_sender) {
  // var new_sender = "TIKTOK";
  // Search for the file by name
  var files = DriveApp.getFilesByName("discordemailnotification");
  var spreadsheet;
  
  if (files.hasNext()) {
    spreadsheet = SpreadsheetApp.open(files.next());
  } else {
    throw new Error("File 'discordemailnotification' not found.");
  }
  
  // Get the specific sheet
  var sheet = spreadsheet.getSheetByName("tbl_sender_group");
  
  // Get the last row and append data
  var lastRow = sheet.getLastRow();
  var newData = [
    [channel,new_sender],
  ];
  sheet.getRange(lastRow + 1, 1, newData.length, newData[0].length).setValues(newData);

  // sheet.getRange(lastRow + 1, 1).setValue(new_sender);
  Logger.log("Add New Sender: "+new_sender);
}

function analyze_sender_group(sender,sender_group){
   for (var key in sender_group) {
      if (sender_group.hasOwnProperty(key)) { // Important: Check if the property belongs to the object itself
        // Logger.log(sender+" VS "+key); // Prints the key

        var sender = sender.replace(/^\s+|\s+$/g, "");
        // Logger.log(sender.length)
        // Logger.log(key.length)
        if(key==sender.toString())
        {
          // Logger.log("match")
          return sender_group[key];
        }
      }
   }
   addNewSenderToSheet("other",sender);
   return "other";
}

function main() {
  var result = getDiscordURL();
  var channel_name_list = result[0];
  var channel_url_list = result[1];
  var sender_group_list = result[2];
  // Logger.log(channel_name_list);
  // Logger.log(channel_url_list);
  // Logger.log(sender_group_list);
  updatelastrun();
  var lasttimeread = getLasttimeRead();
  var newtimeread;
  var counter = 0;
  var check_new_mail = 0;
  var today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today

  // Format the date for the Gmail search query (YYYY/MM/DD)
  var formattedDate = today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate();
  
  var query = "category:primary after:" + formattedDate; // Search query with date filter

  console.log(query);

  var threads = GmailApp.search(query, 0, 100);
  for (var i = 0; i < threads.length; i++) {
    var thread = threads[i];
    var messages = thread.getMessages();
    
    for (var j = 0; j < messages.length; j++) {
      var message = messages[j];
      var messageDate = new Date(message.getDate());
            // Although we filter by date in the query, it's a good practice to double-check
      if (messageDate >= today) { // Ensure emails are from today
        var subject = message.getSubject();
        var sender = message.getFrom();
        var body = message.getPlainBody();
        var sentTime = Utilities.formatDate(messageDate, "America/Chicago", "yyyy-MM-dd HH:mm:ss"); // Format the send time

        var sentTime_temp = sentTime.split(" ")[1];
        Logger.log(lasttimeread)
        if(lasttimeread!=null)
        {
          var extract_lasttime = lasttimeread.split(":")[0]
          // Logger.log(extract_lasttime)
          if(extract_lasttime<10 && extract_lasttime.length == 1)
          {
            lasttimeread = "0"+lasttimeread;
          }
        }
        else
        {
          sendToDiscord(channel_url_list["status"],"Status: Error Get lasttimeread");
          return;
        }
      
        // Logger.log(lasttimeread)
        // Logger.log(sentTime_temp)
        var result_post = "";

        if(lasttimeread==sentTime_temp)
        {
          if(newtimeread!=null)
          {
            updatelasttime(newtimeread);
          }
          Logger.log("Stop Read Condition Mail");
          if(check_new_mail==0)
          {
            sendToDiscord(channel_url_list["status"],"Status: No new mail come up.");
          }
          else
          {
            sendToDiscord(channel_url_list["status"],"Status: "+check_new_mail+" New mail.");
          }
          // if(result_post!="")
            // {
            //   Logger.log("New mail");
            //   updatelasttime(newtimeread);
            //   // notifydiscord(result,google_result,indeed_result,paypal_result);
            //   // sendToDiscord(status_url,"Status: Last update time: "+newtimeread);
              
            //   // var dest_channel = analyze_sender_group(sender.split("<")[0],sender_group_list);
            //   // // var dest_url = channel_url_list[dest_channel];
            //   // var dest_url = channel_url_list["other"];
            //   // Logger.log("destination channel: "+dest_channel+" with URL ("+dest_url+")");
            //   // // Logger.log("Body 1: "+body);
            //   // // Logger.log("Body 2: " + body.replace(/^\s*[\r\n]+|^\s+$/gm, ''));
            //   // Logger.log(result_post)
            //   // sendToDiscord(dest_url,result_post);
            // }
            // else
            // {
            //   // updatelasttime(newtimeread);
              
            //   sendToDiscord(channel_url_list["status"],"Status: No new mail come up.");
          // }
          return;
        }
        else
        {
          Logger.log("Subject: " + subject);
          Logger.log("From: " + sender);
          // Logger.log("From Split 1st: " + sender.split("<")[0]);
          // Logger.log("From Split 2nd: " + sender.split("<")[1]);
          Logger.log("Time: "+sentTime);

          result_post += "\n===========================\n\nSubject: " + subject;
          result_post += "\nFrom: " + sender;
          result_post += "\nBody: " + body.replace(/^\s*[\r\n]+|^\s+$/gm, '').substring(0, 1500);
          result_post += "\nTime: " + sentTime;
          
          var dest_channel = analyze_sender_group(sender.split("<")[0],sender_group_list);
          var dest_url = channel_url_list[dest_channel];
          // var dest_url = channel_url_list["other"];
          Logger.log("destination channel: "+dest_channel+" with URL ("+dest_url+")");
          // Logger.log("Body 1: "+body);
          // Logger.log("Body 2: " + body.replace(/^\s*[\r\n]+|^\s+$/gm, ''));
          Logger.log(result_post)
          sendToDiscord(dest_url,result_post);
          check_new_mail += 1;
        }

        // sendToDiscord(channel_url_list['status'],"Status: No new mail come up.");
        // if(counter==3)
        // {
        //       return;
        // }

        if(counter==0)
        {
          newtimeread = sentTime;
          counter = 1;
        }

      }
    }
  }
  updatelasttime(newtimeread);
  sendToDiscord(channel_url_list["status"],"Status: First Run => "+new Date());
}
