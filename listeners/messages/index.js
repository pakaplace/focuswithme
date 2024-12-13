const { sampleMessageCallback } = require('./sample-message');

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const API_URL = 'https://slack.com/api/chat.postMessage';

// Function to send a message
async function sendMessage(channel, text) {
  const payload = {
    channel: channel, // Channel ID or User ID
    text: text, // Message text
  };

  console.log('payload', payload);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (result.ok) {
      console.log('Message sent successfully:', result);
    } else {
      console.error('Error sending message:', result);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}

async function listUsers() {
  try {
    const response = await fetch('https://slack.com/api/users.list', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
      },
    });

    const result = await response.json();
    if (result.ok) {
      // console.log('Users:', result.members);
      //  console.log('resultMembers', result);
      result.members.forEach((member) => {
        // Skip bots and the app itself
        if (!member.is_bot && !member.is_app_user) {
          openDM(member.id).then((channelId) => {
            if (channelId) {
              sendMessage(channelId, 'Yo its big mike');
            }
          });
        }
      });
    } else {
      console.error('Error fetching users:', result);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}

async function openDM(userId) {
  const payload = { users: userId }; // Replace with the user's Slack ID

  try {
    const response = await fetch('https://slack.com/api/conversations.open', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (result.ok) {
      console.log('DM Channel ID:', result.channel.id);
      return result.channel.id;
    } else {
      console.error('Error opening DM:', result);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}

module.exports.register = (app) => {
  app.message(/^(hi|hello|hey).*/, sampleMessageCallback);
  app.message(/^(yo).*/, listUsers);
};
