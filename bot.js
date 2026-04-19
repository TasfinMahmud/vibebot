// ════════════════════════════════════════════════════════════════════
// 🤖 VibeBot — Main Bot Entry Point (AI-Powered Edition)
// ════════════════════════════════════════════════════════════════════
// Start the bot:  node bot.js
// ════════════════════════════════════════════════════════════════════

require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  ActivityType,
} = require("discord.js");
const config = require("./config");
const nodemailer = require("nodemailer");
const { GoogleGenAI } = require("@google/genai");

// ── Gemini AI Setup ────────────────────────────────
let ai = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  console.log("🧠 Gemini AI: ENABLED");
} else {
  console.log("🧠 Gemini AI: DISABLED (set GEMINI_API_KEY in .env)");
}

// ── Email Transporter Setup ────────────────────────
let emailTransporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_USER !== "your.email@gmail.com") {
  emailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  console.log("📧 Email notifications: ENABLED");
} else {
  console.log("📧 Email notifications: DISABLED (configure EMAIL_USER & EMAIL_PASS in .env)");
}

// ── Per-Server Email Recipients ────────────────────
const serverEmailMap = {
  // FourFold Research
  "1431530303872307212": [
    "md.zarif.latif@g.bracu.ac.bd",
    "sidratul.muntaha1@g.bracu.ac.bd",
    "puja.banik@g.bracu.ac.bd",
    "kazi.tasfin.mahmud@g.bracu.ac.bd",
  ],
  // Second Brain
  "1427249292392792126": [
    "rafintasfin1@gmail.com",
    "kazi.tasfin.mahmud@g.bracu.ac.bd",
    "tasfinmahmud1@gmail.com",
  ],
  // Alpha & Beta
  "1463548222109913203": [],
};

// ── Helper: Send Email to Recipients ───────────────
async function sendEmailNotification({ category, title, message, serverName, channelName, guildId }) {
  if (!emailTransporter) return false;

  const recipients = serverEmailMap[guildId] || [];
  if (recipients.length === 0) return false;

  const categoryColors = {
    announcement: "#7c3aed",
    insight: "#f59e0b",
    info: "#3b82f6",
    reminder: "#ef4444",
  };
  const categoryEmojis = {
    announcement: "\ud83d\udce2",
    insight: "\ud83d\udca1",
    info: "\u2139\ufe0f",
    reminder: "\ud83d\udd14",
  };

  const color = categoryColors[category] || "#7c3aed";
  const emoji = categoryEmojis[category] || "\ud83d\udce2";
  const catLabel = category.charAt(0).toUpperCase() + category.slice(1);

  const htmlEmail = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; border-radius: 12px; overflow: hidden;">
      <div style="background: ${color}; padding: 20px 24px;">
        <h1 style="color: white; margin: 0; font-size: 22px;">${emoji} ${title}</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0; font-size: 13px;">From ${serverName} • #${channelName}</p>
      </div>
      <div style="padding: 24px; color: #e2e8f0;">
        <p style="font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
      </div>
      <div style="padding: 16px 24px; background: #16213e; text-align: center;">
        <p style="color: #64748b; font-size: 12px; margin: 0;">Sent by ${config.botName} 🤖 • ${catLabel} Notification</p>
      </div>
    </div>
  `;

  try {
    await emailTransporter.sendMail({
      from: `"${config.botName} 🤖" <${process.env.EMAIL_USER}>`,
      to: recipients.join(", "),
      subject: `${emoji} [${serverName}] ${catLabel}: ${title}`,
      html: htmlEmail,
    });
    console.log(`📧 Email sent to ${recipients.length} recipient(s) for ${serverName}`);
    return true;
  } catch (error) {
    console.error("📧 Email error:", error.message);
    return false;
  }
}

// ── Create Client ──────────────────────────────────
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  ws: {
    large_threshold: 50,
  },
  rest: {
    timeout: 60000,
  },
});

// ── Helper: Random Pick ────────────────────────────
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ── Helper: Create Styled Embed ────────────────────
function makeEmbed({ title, description, color, fields, footer, image, thumbnail }) {
  const embed = new EmbedBuilder()
    .setColor(color || config.botColor)
    .setTimestamp();

  if (title) embed.setTitle(title);
  if (description) embed.setDescription(description);
  if (fields) embed.addFields(fields);
  if (image) embed.setImage(image);
  if (thumbnail) embed.setThumbnail(thumbnail);
  if (footer) embed.setFooter({ text: footer });
  else embed.setFooter({ text: `${config.botName} ✨ | FourFold Research` });

  return embed;
}

// ── Helper: Generate AI Reply ──────────────────────
async function generateAIReply(username, messageContent, hasAttachments) {
  if (!ai) return null;

  try {
    let prompt = `${config.aiSystemPrompt}

The user's Discord display name is: ${username}
Their message: "${messageContent}"
${hasAttachments ? "They also uploaded a file/image/document with this message." : ""}

Reply to them. Remember: start with "মাননীয় সদস্য, ${username}," then your response. Keep it SHORT (1-3 sentences).`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    return response.text || null;
  } catch (error) {
    console.error("🧠 Gemini AI error:", error.message);
    return null;
  }
}

// ════════════════════════════════════════════════════
// 📡 EVENT: Ready
// ════════════════════════════════════════════════════
client.once("ready", () => {
  console.log("=== BOT READY ===");
  console.log("Bot: " + config.botName + " is ONLINE (appearing offline)");
  console.log("Tag: " + client.user.tag);
  console.log("Servers: " + client.guilds.cache.size);
  console.log("=================");

  // Set bot to invisible (appears offline to everyone)
  client.user.setPresence({
    status: "invisible",
    activities: [],
  });
});

// ── Error Handlers ────────────────────────────────
client.on("error", (err) => console.error("Client error:", err.message));
client.on("warn", (msg) => console.warn("Client warn:", msg));
client.on("disconnect", () => console.log("Bot disconnected! Reconnecting..."));
client.on("reconnecting", () => console.log("Bot reconnecting..."));

// ════════════════════════════════════════════════════
// 👋 EVENT: Member Join (Welcome)
// ════════════════════════════════════════════════════
client.on("guildMemberAdd", async (member) => {
  // Find a general/welcome channel
  const channel =
    member.guild.systemChannel ||
    member.guild.channels.cache.find(
      (ch) =>
        ch.name.includes("general") ||
        ch.name.includes("welcome") ||
        ch.name.includes("chat")
    );

  if (!channel) return;

  const welcomeMsg = pick(config.welcomeMessages).replace(
    "{user}",
    `<@${member.id}>`
  );

  const embed = makeEmbed({
    title: "🎉 New Member Alert!",
    description: welcomeMsg,
    color: config.accentColors.success,
    thumbnail: member.user.displayAvatarURL({ dynamic: true, size: 256 }),
    fields: [
      {
        name: "📊 Member Count",
        value: `You're member #${member.guild.memberCount}!`,
        inline: true,
      },
      {
        name: "📅 Account Created",
        value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`,
        inline: true,
      },
    ],
    footer: "Welcome aboard! 🚀",
  });

  channel.send({ embeds: [embed] });
});

// ════════════════════════════════════════════════════
// 💬 EVENT: Message (AI-Powered FourFold Research Bot)
// ════════════════════════════════════════════════════
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const isAIServer = message.guild && config.aiEnabledServers.includes(message.guild.id);

  // ═══════════════════════════════════════════════
  // 🏛️ AI-ENABLED SERVERS — Bengali Reply Behavior
  // ═══════════════════════════════════════════════
  if (isAIServer) {
    const username = message.member?.displayName || message.author.displayName || message.author.username;

    // ── 1. File Upload → Thank in Bengali + ❤️ React ──
    if (message.attachments.size > 0) {
      try {
        await message.react("❤️");
      } catch (e) { /* ignore */ }

      // Generate AI thank-you reply for file uploads
      const aiReply = await generateAIReply(username, message.content || "(uploaded a file)", true);
      if (aiReply) {
        await message.reply(aiReply);
      } else {
        await message.reply(`মাননীয় সদস্য, ${username}, আপনাকে ধন্যবাদ! আপনার অবদান অত্যন্ত মূল্যবান। 🙏❤️`);
      }
      return;
    }

    // ── 2. @Mention → Bengali Notification ──
    const mentionedUsers = message.mentions.users.filter((u) => u.id !== message.author.id && !u.bot);
    if (mentionedUsers.size > 0) {
      const mentionNames = mentionedUsers.map((u) => {
        const member = message.guild.members.cache.get(u.id);
        return member?.displayName || u.displayName || u.username;
      });
      const nameList = mentionNames.join(", ");
      
      const aiReply = await generateAIReply(username, `I mentioned ${nameList} in my message: "${message.content}"`, false);
      if (aiReply) {
        await message.reply(aiReply);
      } else {
        await message.reply(`মাননীয় সদস্য, ${nameList} কে জানানো হবে। Patience is a virtue! ✨`);
      }
      return;
    }

    // ── 3. All Other Messages → AI Reply ──
    const content = message.content.trim();
    if (content.length > 0) {
      const aiReply = await generateAIReply(username, content, false);
      if (aiReply) {
        await message.reply(aiReply);
      }
      // If AI fails, stay silent rather than spamming
    }

    return; // Don't process FourFold messages further
  }

  // ═══════════════════════════════════════════════
  // 🌐 OTHER SERVERS — Minimal behavior (no spam)
  // ═══════════════════════════════════════════════
  // Just react with a random emoji occasionally (~10%)
  if (Math.random() < 0.10) {
    try {
      const emojis = ["👍", "✨", "💜", "🔥", "👀", "🫡"];
      await message.react(pick(emojis));
    } catch (e) { /* ignore */ }
  }
});


// ════════════════════════════════════════════════════
// ⚡ EVENT: Slash Command Interactions
// ════════════════════════════════════════════════════
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, options } = interaction;

  try {
    switch (commandName) {
      // ── /announce ──────────────────────────────────
      case "announce": {
        // Owner only
        if (interaction.user.id !== interaction.guild.ownerId) {
          return interaction.reply({
            content: "❌ Only the **server owner** can use this command!",
            ephemeral: true,
          });
        }

        const title = options.getString("title");
        const message = options.getString("message");
        const channel = options.getChannel("channel") || interaction.channel;
        const color = options.getString("color");
        const image = options.getString("image");

        const embed = makeEmbed({
          title: `📢 ${title}`,
          description: message,
          color: color ? parseInt(color.replace("#", ""), 16) : config.accentColors.announcement,
          image: image || null,
          footer: `Announced by ${interaction.user.username} 📣`,
        });

        await channel.send({ embeds: [embed] });
        await interaction.reply({
          content: `✅ Announcement posted in ${channel}!`,
          ephemeral: true,
        });
        break;
      }

      // ── /schedule ──────────────────────────────────
      case "schedule": {
        if (interaction.user.id !== interaction.guild.ownerId) {
          return interaction.reply({
            content: "❌ Only the **server owner** can use this command!",
            ephemeral: true,
          });
        }

        const title = options.getString("title");
        const message = options.getString("message");
        const minutes = options.getInteger("minutes");
        const channel = options.getChannel("channel") || interaction.channel;

        await interaction.reply({
          content: `⏰ Announcement **"${title}"** scheduled for **${minutes} minute(s)** from now in ${channel}!`,
          ephemeral: true,
        });

        setTimeout(async () => {
          const embed = makeEmbed({
            title: `📢 ${title}`,
            description: message,
            color: config.accentColors.announcement,
            footer: `Scheduled announcement by ${interaction.user.username} 📣`,
          });
          await channel.send({ embeds: [embed] });
        }, minutes * 60 * 1000);
        break;
      }

      // ── /post (Proxy Message) ───────────────────────
      case "post": {
        if (interaction.user.id !== interaction.guild.ownerId) {
          return interaction.reply({
            content: "❌ Only the **server owner** can use this command!",
            ephemeral: true,
          });
        }

        const category = options.getString("category");
        const message = options.getString("message");
        const title = options.getString("title");
        const channel = options.getChannel("channel") || interaction.channel;
        const pingEveryone = options.getBoolean("ping_everyone") || false;

        // Category styles
        const categoryStyles = {
          announcement: {
            emoji: "📢",
            label: "Announcement",
            color: config.accentColors.announcement,
          },
          insight: {
            emoji: "💡",
            label: "Insight",
            color: 0xf59e0b,
          },
          info: {
            emoji: "ℹ️",
            label: "Info",
            color: config.accentColors.info,
          },
          reminder: {
            emoji: "🔔",
            label: "Reminder",
            color: 0xef4444,
          },
        };

        const style = categoryStyles[category];
        const embedTitle = title
          ? `${style.emoji} ${title}`
          : `${style.emoji} ${style.label}`;

        const embed = makeEmbed({
          title: embedTitle,
          description: message,
          color: style.color,
          footer: `${style.label} • via ${config.botName}`,
        });

        const sendPayload = { embeds: [embed] };
        if (pingEveryone) {
          sendPayload.content = "@everyone";
        }

        await channel.send(sendPayload);

        // Reply FIRST (Discord has a 3-second timeout)
        await interaction.reply({
          content: `✅ **${style.label}** posted in ${channel}! ✉️ Sending emails...`,
          ephemeral: true,
        });

        // Send email in background (don't block the reply)
        sendEmailNotification({
          category,
          title: title || style.label,
          message,
          serverName: interaction.guild.name,
          channelName: channel.name,
          guildId: interaction.guild.id,
        });
        break;
      }

      // ── /remind (Deadline Reminder) ─────────────────
      case "remind": {
        if (interaction.user.id !== interaction.guild.ownerId) {
          return interaction.reply({
            content: "❌ Only the **server owner** can use this command!",
            ephemeral: true,
          });
        }

        const title = options.getString("title");
        const message = options.getString("message");
        const minutes = options.getInteger("minutes");
        const channel = options.getChannel("channel") || interaction.channel;

        const fireTime = new Date(Date.now() + minutes * 60 * 1000);
        const fireTimestamp = Math.floor(fireTime.getTime() / 1000);

        await interaction.reply({
          content: `✅ Reminder **"${title}"** scheduled!\n⏰ Fires: <t:${fireTimestamp}:R> in ${channel}\n👥 Will ping @everyone`,
          ephemeral: true,
        });

        setTimeout(async () => {
          const embed = makeEmbed({
            title: `🚨 REMINDER: ${title}`,
            description:
              `${message}\n\n` +
              `⏰ **This is your scheduled reminder!**\n` +
              `📅 Deadline alert — please take action now!`,
            color: 0xef4444,
            footer: `Reminder set by ${interaction.user.username} ⏰`,
          });

          await channel.send({
            content: "@everyone 🔔 **DEADLINE REMINDER**",
            embeds: [embed],
          });
        }, minutes * 60 * 1000);
        break;
      }

      default:
        await interaction.reply({
          content: "Unknown command! 🤔",
          ephemeral: true,
        });
    }
  } catch (error) {
    console.error(`❌ Error handling /${commandName}:`, error);
    const reply = {
      content: "⚠️ Something went wrong! Please try again.",
      ephemeral: true,
    };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply);
    } else {
      await interaction.reply(reply);
    }
  }
});

// ── Health Check Server (for Render/Cloud hosting) ──
// IMPORTANT: Start this FIRST so Render marks service as "live" before Discord login
const http = require("http");
const PORT = process.env.PORT || 10000;
http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("VibeBot is alive!");
}).listen(PORT, () => {
  console.log(`Health check server running on port ${PORT}`);

  // ── Login to Discord AFTER port is bound ──
  const token = process.env.DISCORD_TOKEN;
  if (!token) {
    console.error("FATAL: DISCORD_TOKEN is not set!");
    return;
  }
  console.log(`Token length: ${token.length} chars, starts with: ${token.substring(0, 10)}...`);
  console.log("Attempting Discord login...");

  // Add a timeout — if login takes >30s, something is wrong
  const loginTimeout = setTimeout(() => {
    console.error("WARNING: Discord login is taking >30 seconds. WebSocket may be blocked.");
    console.error("Token first 20 chars:", token.substring(0, 20));
  }, 30000);

  client.login(token)
    .then(() => {
      clearTimeout(loginTimeout);
      console.log("Discord login successful!");
    })
    .catch((err) => {
      clearTimeout(loginTimeout);
      console.error("Discord login FAILED:", err.message);
    });
});
