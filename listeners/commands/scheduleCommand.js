const scheduleCommandCallback = async ({ command, ack, respond, client }) => {
  try {
    await ack();

    // Get user mentions from command text
    const mentions = command.text.trim().split(/\s+/);

    // Validate input
    if (
      mentions.length !== 2 ||
      !mentions.every((m) => m.startsWith("<@") && m.endsWith(">"))
    ) {
      return await respond({
        text: "⚠️ Usage: `/schedule @user1 @user2`",
        response_type: "ephemeral",
      });
    }

    // Get user info to validate they exist
    const userIds = mentions.map((m) => m.slice(2, -1));

    try {
      await Promise.all(userIds.map((id) => client.users.info({ user: id })));
    } catch (error) {
      return await respond({
        text: "⚠️ One or both users not found",
        response_type: "ephemeral",
      });
    }

    await respond({
      text: `Setting up meeting between ${mentions.join(" and ")}`,
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
