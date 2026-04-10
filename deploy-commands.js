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

  // ── Server Insights ──────────────────────────────
  new SlashCommandBuilder()
    .setName("insight")
    .setDescription("📊 Get cool server stats and insights"),

  new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("👤 Get info about a user")
    .addUserOption((o) =>
      o
        .setName("user")
        .setDescription("User to look up (defaults to you)")
        .setRequired(false)
    ),

  // ── Fun Commands ─────────────────────────────────
  new SlashCommandBuilder()
    .setName("joke")
    .setDescription("😂 Get a random joke"),

  new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("🔮 Ask the magic 8-ball a question")
    .addStringOption((o) =>
      o.setName("question").setDescription("Your question").setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("funfact")
    .setDescription("🧠 Get a random fun fact"),

  new SlashCommandBuilder()
    .setName("quote")
    .setDescription("💬 Get an inspirational quote"),

  new SlashCommandBuilder()
    .setName("poll")
    .setDescription("📊 Create a quick poll")
    .addStringOption((o) =>
      o
        .setName("question")
        .setDescription("Poll question")
        .setRequired(true)
    )
    .addStringOption((o) =>
      o
        .setName("option1")
        .setDescription("First option")
        .setRequired(true)
    )
    .addStringOption((o) =>
      o
        .setName("option2")
        .setDescription("Second option")
        .setRequired(true)
    )
    .addStringOption((o) =>
      o
        .setName("option3")
        .setDescription("Third option (optional)")
        .setRequired(false)
    )
    .addStringOption((o) =>
      o
        .setName("option4")
        .setDescription("Fourth option (optional)")
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("🪙 Flip a coin!"),

  new SlashCommandBuilder()
    .setName("roll")
    .setDescription("🎲 Roll a dice")
    .addIntegerOption((o) =>
      o
        .setName("sides")
        .setDescription("Number of sides (default 6)")
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("🖼️ Get someone's avatar in full size")
    .addUserOption((o) =>
      o
        .setName("user")
        .setDescription("User to get avatar of")
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("vibe")
    .setDescription("✨ Check today's vibe"),

  // ── Utility ──────────────────────────────────────
  new SlashCommandBuilder()
    .setName("help")
    .setDescription("📋 Show all available commands"),
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
