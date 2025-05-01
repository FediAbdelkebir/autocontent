import { type ChatPostMessageArguments, WebClient } from "@slack/web-api";

// Check required environment variables
if (!process.env.SLACK_BOT_TOKEN) {
  throw new Error("SLACK_BOT_TOKEN environment variable must be set");
}

if (!process.env.SLACK_CHANNEL_ID) {
  throw new Error("SLACK_CHANNEL_ID environment variable must be set");
}

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

/**
 * Sends a structured message to a Slack channel using the Slack Web API
 * @param message - Structured message to send
 * @returns Promise resolving to the sent message's timestamp
 */
export async function sendSlackMessage(
  message: ChatPostMessageArguments
): Promise<string | undefined> {
  try {
    // Send the message
    const response = await slack.chat.postMessage(message);

    // Return the timestamp of the sent message
    return response.ts;
  } catch (error) {
    console.error('Error sending Slack message:', error);
    throw error;
  }
}

/**
 * Sends a system alert to Slack
 * @param title - Alert title
 * @param message - Alert message
 * @param type - Alert type (error, warning, info, success)
 * @param details - Optional additional details about the alert
 */
export async function sendAlertToSlack(
  title: string,
  message: string,
  type: "error" | "warning" | "info" | "success",
  details?: Record<string, any>
): Promise<void> {
  const channel = process.env.SLACK_CHANNEL_ID!;
  
  // Map type to emoji
  const typeEmoji = {
    error: "🚨",
    warning: "⚠️",
    info: "ℹ️",
    success: "✅"
  };
  
  // Create the message blocks
  const blocks = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `${typeEmoji[type]} ${title}`,
        emoji: true
      }
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: message
      }
    }
  ];
  
  // Add details if provided
  if (details && Object.keys(details).length > 0) {
    const detailsText = Object.entries(details)
      .map(([key, value]) => `*${key}:* ${JSON.stringify(value)}`)
      .join("\n");
    
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Details:*\n${detailsText}`
      }
    });
  }
  
  // Add timestamp
  blocks.push({
    type: "context",
    elements: [
      {
        type: "mrkdwn",
        text: `*Time:* ${new Date().toISOString()}`
      }
    ] as any
  });
  
  // Send the message
  await sendSlackMessage({
    channel,
    blocks: blocks as any,
    text: `${typeEmoji[type]} ${title}: ${message}` // Fallback text
  });
}