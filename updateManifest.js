const axios = require("axios");

const manifest = {
  display_information: {
    name: "Focus With Me",
    description: "v0",
    background_color: "#000000",
  },
  features: {
    app_home: {
      home_tab_enabled: true,
      messages_tab_enabled: false,
      messages_tab_read_only_enabled: true,
    },
    bot_user: {
      display_name: "Focus With Me",
      always_online: false,
    },
    shortcuts: [
      {
        name: "Schedule sample shortcut",
        type: "global",
        callback_id: "sample_shortcut_id",
        description: "Runs a sample shortcut",
      },
    ],
    slash_commands: [
      {
        command: "/schedule",
        description: "Runs a sample schedule command",
        should_escape: false,
      },
    ],
  },
  oauth_config: {
    scopes: {
      bot: [
        "app_mentions:read",
        "channels:history",
        "channels:join",
        "channels:read",
        "chat:write",
        "chat:write.public",
        "commands",
        "groups:history",
        "groups:read",
        "im:history",
        "im:read",
        "im:write",
        "mpim:history",
        "mpim:read",
        "team:read",
        "users:read",
        "users:read.email",
      ],
    },
    redirect_urls: [`${process.env.APP_URL}/oauth2callback`],
  },
  settings: {
    event_subscriptions: {
      bot_events: [
        "app_mention",
        "message.im",
        "message.channels",
        "app_home_opened",
        "user_change",
      ],
      request_url: `${process.env.APP_URL}/slack/events`,
    },
    interactivity: {
      is_enabled: true,
      request_url: `${process.env.APP_URL}/slack/events`,
    },
    org_deploy_enabled: false,
    socket_mode_enabled: false,
    token_rotation_enabled: false,
  },
};

async function updateManifest() {
  try {
    await axios.post(
      "https://api.slack.com/apps/{YOUR_APP_ID}/manifest",
      {
        manifest: JSON.stringify(manifest),
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.SLACK_USER_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Manifest updated successfully");
  } catch (error) {
    console.error("Failed to update manifest:", error);
  }
}

updateManifest();
