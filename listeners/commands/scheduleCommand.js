const scheduleCommandCallback = async ({ command, ack, respond, client }) => {
  try {
    await ack();

    const mentions = command.text.trim().split(/\s+/);
    const sender = command.user_id;
    console.log("Mentions#", mentions, sender);
    if (mentions.length === 0) {
      return await respond({
        text: "⚠️ Usage: `/schedule @user1 (required) @user2 (optional)`",
        response_type: "ephemeral",
      });
    }

    // Clean usernames and create participants array including sender
    const usernames = mentions.map((m) => m.replace("@", ""));
    // Fetch user IDs from usernames
    const userIds = await Promise.all(
      usernames.map(async (username) => {
        const result = await client.users.list();
        const user = result.members.find((u) => u.name === username);
        if (!user) throw new Error(`User ${username} not found`);
        return user.id;
      })
    );
    console.log("userIds", userIds);
    userIds.push(sender);
    console.log("Sender", sender);
    console.log("userids2", userIds);
    // Send DM to each participant
    // Open DM channels and send messages
    await Promise.all(
      userIds.map(async (userId) => {
        const dm = await client.conversations.open({ users: userId });
        await client.chat.postMessage({
          channel: dm.channel.id,
          text: `🗓 New meeting request!\n• Organizer: <@${sender}>\n• Participants: ${userIds
            .map((id) => `<@${id}>`)
            .join(", ")}`,
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `🗓 New meeting request!\n• Organizer: <@${sender}>\n• Participants: ${userIds
                  .map((id) => `<@${id}>`)
                  .join(", ")}`,
              },
            },
            {
              type: "actions",
              elements: [
                {
                  type: "button",
                  text: {
                    type: "plain_text",
                    text: "Connect Google Calendar",
                  },
                  url: "https://your-oauth-url.com", // Replace with your OAuth URL
                  action_id: "connect_google_calendar",
                },
              ],
            },
          ],
        });
      })
    );

    await respond({
      text: `✅ DMs sent to all participants`,
      response_type: "ephemeral",
    });
  } catch (error) {
    console.error(error);
    await respond({
      text: "⚠️ Something went wrong",
      response_type: "ephemeral",
    });
  }
};

module.exports = { scheduleCommandCallback };
