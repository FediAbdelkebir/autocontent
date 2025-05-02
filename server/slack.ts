import { type ChatPostMessageArguments, WebClient } from "@slack/web-api";

// Check if Slack integration is configured
const isSlackConfigured = !!(process.env.SLACK_BOT_TOKEN && process.env.SLACK_CHANNEL_ID);
const slack = isSlackConfigured ? new WebClient(process.env.SLACK_BOT_TOKEN) : null;

/**
 * Sends a structured message to a Slack channel using the Slack Web API
 * @param message - Structured message to send
 * @returns Promise resolving to the sent message's timestamp
 */
export async function sendSlackMessage(
  message: ChatPostMessageArguments
): Promise<string | undefined> {
  // Check if Slack is configured
  if (!isSlackConfigured || !slack) {
    console.log('Slack not configured. Message not sent:', message.text);
    return undefined;
  }
  
  try {
    // Send the message - we already checked for null above
    const response = await slack!.chat.postMessage(message);

    // Return the timestamp of the sent message
    return response.ts;
  } catch (error) {
    console.error('Error sending Slack message:', error);
    // Log error but don't throw to prevent app crashes
    return undefined;
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
  // Check if Slack is configured
  if (!isSlackConfigured) {
    console.log(`Slack alert not sent (Slack not configured): ${type} - ${title}: ${message}`);
    return;
  }
  
  try {
    const channel = process.env.SLACK_CHANNEL_ID || '';
    
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
    
    // Add timestamp with separator
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `---\n*Time:* ${new Date().toISOString()}`
      }
    });
    
    // Send the message
    await sendSlackMessage({
      channel,
      blocks: blocks as any,
      text: `${typeEmoji[type]} ${title}: ${message}` // Fallback text
    });
  } catch (error) {
    // Log error but don't throw - allow application to continue
    console.error('Failed to send alert to Slack:', error);
  }
}