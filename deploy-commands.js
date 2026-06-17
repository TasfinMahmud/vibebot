// ════════════════════════════════════════════════════════════════
// 🤖 VibeBot — Slash Command Registration
// ════════════════════════════════════════════════════════════════
// Run this ONCE to register slash commands with Discord:
//   node deploy-commands.js
// ════════════════════════════════════════════════════════════════

require("dotenv").config();
const { REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

const commands = [
  // ── Announcements ────────────────────────────────
  new SlashCommandBuilder()
    .setName("announce")
    .setDescription("📢 Post a fancy announcement embed")
    .addStringOption((o) =>
      o.setName("title").setDescription("Announcement title").setRequired(true)
    )
    .addStringOption((o) =>
      o
        .setName("message")
        .setDescription("Announcement body text")
        .setRequired(true)
    )
    .addChannelOption((o) =>
      o
        .setName("channel")
        .setDescription("Channel to post in (defaults to current)")
        .setRequired(false)
    )
    .addStringOption((o) =>
      o
        .setName("color")
        .setDescription("Embed color (e.g. #7c3aed)")
        .setRequired(false)
    )
    .addStringOption((o) =>
      o
        .setName("image")
        .setDescription("Image URL to attach")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(0),

  // ── Schedule Announcement ────────────────────────
  new SlashCommandBuilder()
    .setName("schedule")
    .setDescription("⏰ Schedule an announcement (in minutes from now)")
    .addStringOption((o) =>
      o.setName("title").setDescription("Announcement title").setRequired(true)
    )
    .addStringOption((o) =>
      o.setName("message").setDescription("Announcement body").setRequired(true)
    )
    .addIntegerOption((o) =>
      o
        .setName("minutes")
        .setDescription("Minutes from now to post")
        .setRequired(true)
    )
    .addChannelOption((o) =>
      o
        .setName("channel")
        .setDescription("Channel to post in")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(0),

  // ── Proxy Post (Send as Bot) ──────────────────────
  new SlashCommandBuilder()
    .setName("post")
    .setDescription("✉️ Post a message as the bot in a styled category")
    .addStringOption((o) =>
      o
        .setName("category")
        .setDescription("Message category")
        .setRequired(true)
        .addChoices(
          { name: "📢 Announcement", value: "announcement" },
          { name: "💡 Insight", value: "insight" },
          { name: "ℹ️ Info", value: "info" },
          { name: "🔔 Reminder", value: "reminder" }
        )
    )
    .addStringOption((o) =>
      o
        .setName("message")
        .setDescription("The message content to post")
        .setRequired(true)
    )
    .addStringOption((o) =>
      o
        .setName("title")
        .setDescription("Optional title/heading")
        .setRequired(false)
    )
    .addChannelOption((o) =>
      o
        .setName("channel")
        .setDescription("Channel to post in (defaults to current)")
        .setRequired(false)
    )
    .addBooleanOption((o) =>
      o
        .setName("ping_everyone")
        .setDescription("Ping @everyone with this message?")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(0),

  // ── Deadline Reminder ─────────────────────────────
  new SlashCommandBuilder()
    .setName("remind")
    .setDescription("⏰ Schedule a deadline reminder that pings @everyone")
    .addStringOption((o) =>
      o
        .setName("title")
        .setDescription("What's the reminder about?")
        .setRequired(true)
    )
    .addStringOption((o) =>
      o
        .setName("message")
        .setDescription("Reminder details")
        .setRequired(true)
    )
    .addIntegerOption((o) =>
      o
        .setName("minutes")
        .setDescription("Minutes from now to send the reminder")
        .setRequired(true)
    )
    .addChannelOption((o) =>
      o
        .setName("channel")
        .setDescription("Channel to post reminder in")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(0),
  // ── Ping Command ──────────────────────────────────
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("🏓 Check the bot's latency"),
].map((cmd) => cmd.toJSON());

// ── Deploy ─────────────────────────────────────────
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`🔄 Registering ${commands.length} slash commands...`);
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands,
    });
    console.log("✅ All slash commands registered successfully!");
    console.log(
      "💡 Note: It may take up to 1 hour for global commands to appear everywhere."
    );
  } catch (error) {
    console.error("❌ Error registering commands:", error);
  }
})();
