function callGeminiFlashAPI(prompt) {
  const apiKey = "YOUR_API_KEY"; // Replace with your actual API key 
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`; 

  const payload = {
    "contents": [
      {
        "parts": [
          { "text": prompt }
        ]
      }
    ]
  };

  const options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true // Important for error handling
  };

  try {
    const response = UrlFetchApp.fetch(url, options);

    if (response.getResponseCode() !== 200) {
      // Handle HTTP errors
      let errorDetails = "";
      try {
        const errorData = JSON.parse(response.getContentText());
        errorDetails = errorData.error?.message || JSON.stringify(errorData); // Try to get a more specific error message
      } catch (parseError) {
        errorDetails = response.getContentText(); // Fallback to raw response if JSON parsing fails
      }
      Logger.log(`HTTP Error: ${response.getResponseCode()} - ${errorDetails}`);
      return `Gemini API Error: ${response.getResponseCode()} - ${errorDetails}`; // Or throw an error if you prefer
    }

    const data = JSON.parse(response.getContentText());

    if (!data || !data.candidates || data.candidates.length === 0 || !data.candidates[0].content || !data.candidates[0].content.parts || data.candidates[0].content.parts.length === 0) {
      // Handle cases where the API response is not in the expected format
      Logger.log("Unexpected API Response Format:", data); // Log the full response for debugging
      return "Unexpected Gemini API Response Format"; // Or throw an error
    }

    const jsonString = data.candidates[0].content.parts[0];
    Logger.log(jsonString);
    Logger.log(typeof jsonString);
    Logger.log(jsonString.text);

    return (jsonString.text).toString(); // Return the text


  } catch (error) {
    Logger.log("General Error:", error);
    return `An error occurred: ${error.message}`; // Or throw the error
  }
}

function testGemini() {
  var myPrompt = "I will give you a content and you need to summarize with briefly included all essential details within 3 - 4 sentences separate by line with bullet in Thai Language in case of the name of person/place keep it as original lang\n Here is the content:\n";
  var detail = "Some topic for test";
  myPrompt += detail;
  const result = callGeminiFlashAPI(myPrompt);
  Logger.log("Gemini Result:\n"+result);
  //sendToDiscord(status_url,result);
}

function GeminiSummarize(detail) {
  var myPrompt = "I will give you a content and you need to summarize with briefly and simple included all neccesary details within 2 - 3 sentences separate by line with bullet in Thai Language in case of the name of person/place keep it as original lang\n Here is the content:\n";
  myPrompt += detail;
  
  const result = callGeminiFlashAPI(myPrompt);
  // const modifiedString = result.replace(/\./g, ".\n-");
  // result += 
  Logger.log("Gemini Result:\n"+result);
  Logger.log(myPrompt);
  Logger.log(result);
  // sendToDiscord(status_url,result);
  return result;
}
