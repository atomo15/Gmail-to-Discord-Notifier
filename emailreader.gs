
const test_email_url = "https://discord.com/api/webhooks/abc1";

const primary_noti_url = "https://discord.com/api/webhooks/abc2";

const google_noti_url = "https://discord.com/api/webhooks/abc3";

const indeed_noti_url = "https://discord.com/api/webhooks/abc4";

const paypal_noti_url = "https://discord.com/api/webhooks/abc5";

const status_url = "https://discord.com/api/webhooks/abc6";

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

    // Now you can work with the sheet.  For example, to get all the data:
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


function updatelastime(newlasttime) {
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


function getEmailsFromPrimaryCategoryToday() {
  var lasttimeread = getLasttimeRead();
  var newtimeread;
  var counter = 0;
  var today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today

  // Format the date for the Gmail search query (YYYY/MM/DD)
  var formattedDate = today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate();
  
  var query = "category:primary after:" + formattedDate; // Search query with date filter


  // var now = new Date();
  // var twoHoursAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() - 2, 0, 0, 0);

  // // Format date *and* time for the query (UTC is essential for the search)
  // var formattedTwoHoursAgoUTC = Utilities.formatDate(twoHoursAgo, "GMT", "yyyy/MM/dd HH:mm:ss");
  // var formattedNowUTC = Utilities.formatDate(now, "GMT", "yyyy/MM/dd HH:mm:ss");

  // var query = "category:primary after:" + formattedTwoHoursAgoUTC + " before:" + formattedNowUTC;

  // var query = "category:primary after:" + formattedTwoHoursAgo + " before:" + formattedNow;

  console.log(query);

  var threads = GmailApp.search(query, 0, 100);
  var result = "";
  var google_result = "";
  var indeed_result = "";
  var paypal_result = "";
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
        var extract_lasttime = lasttimeread.split(":")[0]
        Logger.log(extract_lasttime)
        if(extract_lasttime<10)
        {
          lasttimeread = "0"+lasttimeread;
        }
        Logger.log(lasttimeread)
        Logger.log(sentTime_temp)
        // return;

        if(lasttimeread==sentTime_temp)
        {
          Logger.log("new condition mail");
          if(result!=""||google_result!=""||indeed_result!=""||paypal_result!="")
          {
            Logger.log("New mail");
            updatelastime(newtimeread);
            notifydiscord(result,google_result,indeed_result,paypal_result);
          }
          else
          {
            // sendToDiscord(status_url,"Status: OK");
          }
          return;
        }
        
        if(counter==0)
        {
          newtimeread = sentTime;
          counter = 1;
        }

        Logger.log("Subject: " + subject);
        Logger.log("From: " + sender.split("<")[0]);
        Logger.log("Time: "+sentTime);
        // Logger.log("myNumber: " + typeof subject); 
     
        Logger.log("Body: " + body.replace(/^\s*[\r\n]+|^\s+$/gm, ''));

        var snippetLength = 100;
        var snippet = body.length > snippetLength ? body.substring(0, snippetLength) + "..." : body;
        Logger.log("Snippet: " + snippet.replace(/^\s*[\r\n]+|^\s+$/gm, ''));

        Logger.log("--------------------");
        
        if(sender.toString().split("<")[0].trim()!="Google")
        {
            if(sender.toString().split("<")[0].trim()!="Indeed")
            {
              if(sender.toString().split("<")[0].trim()!='"service@paypal.com"'&&sender.toString().split("<")[0].trim()!='PayPal')
              {
                result += "Subject: " + subject.toString().substring(0, 50)+"\n";
                // result += "From: " + sender.toString().split("<")[0]+"\n";
                result += "From: " + sender.toString().substring(0, 50)+"\n";
                // result += "Snippet: " + ((snippet.replace(/^\s*[\r\n]+|^\s+$/gm, '')).substring(0, 50)).split("<")[0]+"\n";
                var summary = "";
                if(sender.toString().split("<")[0].trim()!='Venmo Credit Card')
                {
                  summary = GeminiSummarize((body.replace(/^\s*[\r\n]+|^\s+$/gm, '')).substring(0, 4000));
                }
                else
                {
                  summary = (snippet.replace(/^\s*[\r\n]+|^\s+$/gm, '')).substring(0, 300);
                }
                
                // result += "Body: " + (body.replace(/^\s*[\r\n]+|^\s+$/gm, '')).substring(0, 300)+"\n";
                result += "Body:\n" + summary +"\n";
                result += "Time: "+sentTime+"\n";
                result += "--------------------"+"\n";
              }
              else
              {
                paypal_result += "Subject: " + subject.toString()+"\n";
                // paypal_result += "From: " + sender.toString().split("<")[0]+"\n";
                paypal_result += "From: " + sender.toString().substring(0, 50)+"\n";
                paypal_result += "Snippet: " + (snippet.replace(/^\s*[\r\n]+|^\s+$/gm, '')).substring(0, 50)+"\n";
                paypal_result += "Time: "+sentTime+"\n";
                paypal_result += "--------------------"+"\n";
              }
            }
            else
            {
              indeed_result += "Subject: " + subject.toString()+"\n";
              // indeed_result += "From: " + sender.toString().split("<")[0]+"\n";
              indeed_result += "From: " + sender.toString().substring(0, 50)+"\n";
              // indeed_result += "Snippet: " + (snippet.replace(/^\s*[\r\n]+|^\s+$/gm, '')).substring(0, 50)+"\n";
              indeed_result += "Body: " + (body.replace(/^\s*[\r\n]+|^\s+$/gm, '')).substring(0, 400)+"\n";
              indeed_result += "Time: "+sentTime+"\n";
              indeed_result += "--------------------"+"\n";
            }
        }
        else
        {
          google_result += "Subject: " + subject.toString()+"\n";
          google_result += "From: " + sender.toString().split("<")[0]+"\n";
          // google_result += "From: " + sender.toString().substring(0, 50)+"\n";
          // google_result += "Snippet: " + (snippet.replace(/^\s*[\r\n]+|^\s+$/gm, '')).substring(0, 50)+"\n";
          google_result += "Body: " + (body.replace(/^\s*[\r\n]+|^\s+$/gm, '')).substring(0, 275)+"\n";
          google_result += "Time: "+sentTime+"\n";
          google_result += "--------------------"+"\n";
        }
        
      }
    }
    
  }
      if(result!=""||google_result!=""||indeed_result!=""||paypal_result!="")
          {
        updatelastime(newtimeread);
        notifydiscord(result,google_result,indeed_result,paypal_result);
          }
      else
      {
        // sendToDiscord(status_url,"Status: OK");
      }
  // Logger.log("\n\nResult 1");
  // Logger.log(result);
  // // Logger.log(newtimeread);
  // if(result!="")
  // {
  //   if(result.length>2000)
  //   {
  //     Logger.log("Result more than 2000\n")
  //     Logger.log(result.substring(0, 2000));
  //     Logger.log(result);
  //   }
  //   else
  //   {
  //     //  sendToDiscord(primary_noti_url,result)
  //   }
  // }
  // if(google_result!="")
  // {
  //   // sendToDiscord(google_noti_url,google_result)
  // }
  // if(indeed_result!="")
  // {
  //   // sendToDiscord(indeed_noti_url,indeed_result)
  // }
  // if(paypal_result!="")
  // {
  //   // sendToDiscord(paypal_noti_url,paypal_result)
  // }
}

function notifydiscord(result,google_result,indeed_result,paypal_result)
{
    Logger.log("\n\nResult");
    Logger.log(result);
    // Logger.log(newtimeread);
    if(result!="")
    {
      if(result.length>2000)
      {
        Logger.log("Result more than 2000\n")
        Logger.log(result.substring(0, 2000));
        Logger.log(result);
        sendToDiscord(status_url,"Result more than 2000 in primary")
        sendToDiscord(primary_noti_url,result.toString().substring(0, 1800))
      }
      else
      {
         sendToDiscord(primary_noti_url,result)
      }
    }
    if(google_result!="")
    {
      sendToDiscord(google_noti_url,google_result)
    }
    if(indeed_result!="")
    {
      sendToDiscord(indeed_noti_url,indeed_result)
    }
    if(paypal_result!="")
    {
      sendToDiscord(paypal_noti_url,paypal_result)
    }
}
