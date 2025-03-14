# Gmail-to-Discord Notifier with AI Summary

![Project Status](https://img.shields.io/badge/status-active-brightgreen)  
![License](https://img.shields.io/badge/license-MIT-blue)

## Overview

This project is a Google Apps Script (`.gs`) application that automates email monitoring and notification. It reads emails from a Gmail inbox hourly using Apps Script's trigger system and sends notifications to specific Discord channels via Discord webhooks. The script includes features like email filtering, content summarization, and translation using the Gemini API (v1.5), making it efficient and user-friendly. Additionally, it integrates with Google Sheets to track the last processed email, preventing duplicate notifications.

The motivation behind this project stemmed from unreliable email sync and notification issues on Android devices, especially when managing multiple Gmail accounts. By integrating AI and Discord, this tool provides a centralized, real-time solution for email tracking and content digestion.

## Features

- **Automated Email Fetching**: Fetches emails from Gmail's primary inbox every hour using Apps Script triggers.
- **Discord Notifications**: Sends email details to Discord via webhooks, including:
  1. Sender
  2. Subject
  3. Content (summarized and translated if enabled)
- **Channel Categorization**: Routes notifications to specific Discord channels based on sender or email type.
- **AI-Powered Summarization**: Uses the free Gemini API (v1.5) to summarize email content and translate it into Thai for better accessibility.
- **Duplicate Prevention**: Tracks the last processed email timestamp in a Google Sheet to avoid redundant notifications.
- **Character Limit Handling**: Summarizes content to fit Discord's 2000-character message limit.

## How It Works

1. **Email Fetching**:
   - Queries all emails in the primary inbox for the current day.
   - Uses a custom filter to fetch only new emails based on a timestamp stored in Google Sheets.

2. **Timestamp Tracking**:
   - On the first run, processes all emails and updates the Google Sheet with the timestamp of the latest email.
   - On subsequent runs, uses the stored timestamp as a cutoff to fetch only newer emails.
   - Handles timezone issues by using raw display values instead of converted time to avoid errors (e.g., Daylight Saving Time).

3. **Notification Process**:
   - Extracts sender, subject, and content.
   - Optionally summarizes and translates content using the Gemini API.
   - Sends the processed data to a designated Discord channel via webhook.

4. **Customization**:
   - Allows filtering by sender or email type to route notifications to specific Discord channels.

## Tech Stack

- **Google Apps Script (`.gs`)**: Core scripting language for Gmail and Google Sheets integration.
- **Gmail API**: For fetching emails programmatically.
- **Google Sheets API**: For storing and retrieving the last processed timestamp.
- **Discord Webhook**: For real-time notifications to Discord channels.
- **Gemini API (v1.5)**: Free AI API for content summarization and translation.

## Prerequisites

- A Google account with access to Gmail and Google Sheets.
- A Discord server with webhook URLs configured for target channels.
- A Gemini API key (free tier available for developers).

## Setup Instructions

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/atomo15/Gmail-to-Discord-Notifier.git
   ```
2. **Google Apps Script Setup**:
   
- Open the [Google Apps Script dashboard](https://script.google.com/).
- Create a new project and paste the contents of `script.gs`.
- Configure the script properties (e.g., Discord webhook URLs, Gemini API key) in the script.

3. **Google Sheets Setup**:

- Create a new Google Sheet.
- Add a cell (e.g., `A1`) to store the last processed timestamp.
- Update the script with the Sheet ID and cell reference.

4. **Set Up Triggers**:

- In the Apps Script editor, go to "Triggers."
- Add a time-driven trigger to run the script hourly.

5. **Discord Webhook**:

- In your Discord server, create webhooks for each target channel.
- Copy the webhook URLs and add them to the script configuration.

6. **Run the Script**:

- Execute the script manually for the first run to process all emails.
- Verify that notifications appear in Discord and the timestamp updates in Google Sheets.
