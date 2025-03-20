# Gmail-to-Discord Notifier with AI Summary

![Project Status](https://img.shields.io/badge/status-active-brightgreen)  
![License](https://img.shields.io/badge/license-MIT-blue)

## Overview

This project is a Google Apps Script (`.gs`) application that automates email monitoring and notification. It reads emails from a Gmail inbox hourly using Apps Script's trigger system and sends notifications to specific Discord channels via Discord webhooks. The script includes features like email filtering, content summarization, and translation using the Gemini API (v1.5), making it efficient and user-friendly. Additionally, it integrates with Google Sheets to track the last processed email, preventing duplicate notifications.

The motivation behind this project stemmed from unreliable email sync and notification issues on Android devices, especially when managing multiple Gmail accounts. By integrating AI and Discord, this tool provides a centralized, real-time solution for email tracking and content digestion.

---

## Version History

| Version | Description                                      | Release Date  |
|---------|--------------------------------------------------|---------------|
| 1.0.0   | Initial release with hourly Gmail monitoring, Discord notifications, and Gemini API summarization. | 03/13/2025    |
| 1.1.0   | Improved duplicate prevention by refining Google Sheets timestamp logic. | 03/14/2025    |

---

## Project Status and Roadmap

The following table outlines the current status, updates, new features, features under development, and limitations of the Gmail-to-Discord Notifier project. This section will be regularly updated to reflect the project's progress.

| **Category**            | **Details**                                                                 | **Date**       | **Status**    |
|--------------------------|-----------------------------------------------------------------------------|----------------|---------------|
| **Project Progress**     | Initial release with hourly Gmail monitoring, Discord notifications, and Gemini API summarization. | 03/13/2025     | Completed     |
| **Project Updates**      | Improved duplicate prevention by refining Google Sheets timestamp logic.    | 03/14/2025     | Implemented   |
| **New Features**         | Added channel categorization based on sender or email type.                 | 03/22/2025     | In Progress   |
| **Features Under Development** | Planned enhancements include: (1) restructuring the data pipeline to Google Sheets for improved scalability and reliability in email tracking; (2) adding support for grouping emails by custom categories and routing them to dedicated Discord channels for better notification organization.     | 04/05/2025 | Planned       |
| **Limitations**          | Restricted to primary inbox; support for other labels/folders pending.      | N/A            | Ongoing       |

### Notes
- **Status Definitions**: 
  - *Completed*: Fully implemented and tested.
  - *Implemented*: Recently added and in use.
  - *In Progress*: Actively being developed.
  - *Planned*: Scheduled for future development.
  - *Ongoing*: Known issue or limitation to address.

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

- Create a new Google Sheet.( `discordemailnotification` is an example sheet on code)
- Add a cell (e.g., `A1`, `A2`) to store the last processed timestamp.
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

## Configuration

Edit the following variables in `script.gs`:

- `DISCORD_WEBHOOK_URLS`: An object mapping senders or email types to webhook URLs.
- `SHEET_ID`: The ID of your Google Sheet.
- `TIMESTAMP_CELL`: The cell where the last timestamp is stored (e.g., `"A1"`).
- `GEMINI_API_KEY`: Your Gemini API key for summarization and translation.

## Usage

- Once set up, the script runs automatically every hour.
- Check your Discord channels for email notifications.
- Monitor the Google Sheet for the last processed timestamp.

## Limitations

- Discord's 2000-character limit requires summarization for lengthy emails.
- Dependent on Gmail's primary inbox; other labels/folders are not supported yet.
- Gemini API usage is limited to the free tier's quota.

## Future Improvements

- Support for multiple Gmail accounts.
- Customizable email filters beyond the primary inbox.
- Enhanced AI features (e.g., sentiment analysis, priority tagging).
- Error handling for webhook or API failures.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Google Apps Script for the automation framework.
- Discord for webhook integration.
- Gemini API for free AI summarization and translation.
