// ════════════════════════════════════════════════════════════════════
// 🤖 VibeBot — Main Bot Entry Point
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
      <div style="background: ${color}; padding: 20px 30px;">
        <h1 style="color: white; margin: 0; font-size: 22px;">${emoji} ${title || catLabel}</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0; font-size: 13px;">from ${serverName} • #${channelName}</p>
      </div>
      <div style="padding: 25px 30px; color: #e2e8f0;">
        <p style="font-size: 15px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
      </div>
      <div style="padding: 15px 30px; border-top: 1px solid #2d3748; color: #718096; font-size: 12px;">
        <p style="margin: 0;">\ud83e\udd16 Sent via VibeBot • ${new Date().toLocaleString()}</p>
        <p style="margin: 4px 0 0; color: #4a5568;">This is an automated notification from your Discord server.</p>
      </div>
    </div>
  `;

  try {
    await emailTransporter.sendMail({
      from: `"VibeBot \ud83e\udd16" <${process.env.EMAIL_USER}>`,
      to: recipients.join(", "),
      subject: `${emoji} [${catLabel}] ${title || catLabel} — ${serverName}`,
      html: htmlEmail,
    });
    console.log(`✉️ Email sent to ${recipients.length} recipient(s) for server: ${serverName}`);
    return true;
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
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
  else embed.setFooter({ text: `${config.botName} ✨ | Making servers fun since 2026` });

  return embed;
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
// 💬 EVENT: Message (Emoji Reactions + Auto-Replies + Mention Responder + Sarcasm)
// ════════════════════════════════════════════════════
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase().trim();

  // ── React with a random emoji to EVERY message ────
  try {
    const emoji = pick(config.reactionEmojis);
    await message.react(emoji);
  } catch (e) {
    // Silently ignore reaction errors (missing perms, etc.)
  }

  // ── Mention Responder ────────────────────────────
  // If someone @mentions another user, bot tells them the person will respond when they see it
  const mentionedUsers = message.mentions.users.filter((u) => u.id !== message.author.id && !u.bot);
  if (mentionedUsers.size > 0) {
    const mentionNames = mentionedUsers.map((u) => `**${u.displayName || u.username}**`).join(", ");
    const plural = mentionedUsers.size > 1;
    const mentionResponses = [
      `👋 Hey! ${mentionNames} ${plural ? "have" : "has"} been notified. ${plural ? "They" : "He/She"} will respond once ${plural ? "they see" : "he/she sees"} the message! 📩`,
      `📬 Got it! ${mentionNames} will get back to you once ${plural ? "they're" : "he/she is"} available! Hang tight ⏳`,
      `✅ ${mentionNames} ${plural ? "are" : "is"} currently away. Don't worry, ${plural ? "they" : "he/she"} will reply when ${plural ? "they check" : "he/she checks"} the chat! 💬`,
      `🫡 Roger that, Sir/Madam! ${mentionNames} will be notified. Patience is a virtue! ✨`,
    ];
    await message.reply(pick(mentionResponses));
    return;
  }

  // ── Check auto-reply triggers ────────────────────
  let didAutoReply = false;
  for (const [trigger, responses] of Object.entries(config.autoReplies)) {
    const regex = new RegExp(`\\b${trigger}\\b`, "i");
    if (regex.test(content)) {
      const response = Array.isArray(responses) ? pick(responses) : responses;
      await message.reply(response);
      didAutoReply = true;
      break; // Only one auto-reply per message
    }
  }

  // ── ALL CAPS Easter Egg ──────────────────────────
  if (!didAutoReply && content.length > 10 && content === content.toUpperCase() && /[A-Z]/.test(content)) {
    const capsReplies = [
      "Whoa, easy on the caps lock, Sir/Madam! 😅",
      "I CAN HEAR YOU LOUD AND CLEAR 📢",
      "Sir/Madam, this is a Discord server 🤣",
      "caps lock is cruise control for cool 😎",
      "Why are you yelling at me, Sir/Madam?! I'm doing my best! 😭🤖",
      "The caps... the energy... I can't handle it 💀🔥",
    ];
    await message.reply(pick(capsReplies));
    didAutoReply = true;
  }

  // ── Random Sarcastic / Humorous Comment (~15% chance) ──
  // Only if we haven't already replied to this message
  if (!didAutoReply && content.length > 5 && Math.random() < 0.15) {
    const comment = pick(config.sarcasticComments);
    await message.reply(comment);
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

      // ── /insight ───────────────────────────────────
      case "insight": {
        const guild = interaction.guild;
        await guild.members.fetch(); // Ensure cache is populated

        const totalMembers = guild.memberCount;
        const onlineMembers = guild.members.cache.filter(
          (m) => m.presence?.status && m.presence.status !== "offline"
        ).size;
        const botCount = guild.members.cache.filter((m) => m.user.bot).size;
        const textChannels = guild.channels.cache.filter((c) => c.type === 0).size;
        const voiceChannels = guild.channels.cache.filter((c) => c.type === 2).size;
        const roles = guild.roles.cache.size;
        const emojis = guild.emojis.cache.size;
        const boosts = guild.premiumSubscriptionCount || 0;
        const boostTier = guild.premiumTier;

        const embed = makeEmbed({
          title: `📊 Server Insights — ${guild.name}`,
          thumbnail: guild.iconURL({ dynamic: true, size: 256 }),
          color: config.accentColors.info,
          fields: [
            { name: "👥 Members", value: `${totalMembers}`, inline: true },
            { name: "🟢 Online", value: `${onlineMembers}`, inline: true },
            { name: "🤖 Bots", value: `${botCount}`, inline: true },
            { name: "💬 Text Channels", value: `${textChannels}`, inline: true },
            { name: "🔊 Voice Channels", value: `${voiceChannels}`, inline: true },
            { name: "🎭 Roles", value: `${roles}`, inline: true },
            { name: "😄 Emojis", value: `${emojis}`, inline: true },
            { name: "💎 Boosts", value: `${boosts} (Tier ${boostTier})`, inline: true },
            {
              name: "📅 Created",
              value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`,
              inline: true,
            },
          ],
        });

        await interaction.reply({ embeds: [embed] });
        break;
      }

      // ── /userinfo ──────────────────────────────────
      case "userinfo": {
        const user = options.getUser("user") || interaction.user;
        const member = await interaction.guild.members.fetch(user.id);

        const roles = member.roles.cache
          .filter((r) => r.name !== "@everyone")
          .map((r) => `${r}`)
          .join(", ") || "None";

        const embed = makeEmbed({
          title: `👤 User Info — ${user.username}`,
          thumbnail: user.displayAvatarURL({ dynamic: true, size: 256 }),
          color: member.displayHexColor === "#000000" ? config.botColor : member.displayColor,
          fields: [
            { name: "🏷️ Tag", value: user.tag, inline: true },
            { name: "🆔 ID", value: user.id, inline: true },
            { name: "🤖 Bot?", value: user.bot ? "Yes" : "No", inline: true },
            {
              name: "📅 Account Created",
              value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`,
              inline: true,
            },
            {
              name: "📥 Joined Server",
              value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
              inline: true,
            },
            { name: `🎭 Roles (${member.roles.cache.size - 1})`, value: roles },
          ],
        });

        await interaction.reply({ embeds: [embed] });
        break;
      }

      // ── /joke ──────────────────────────────────────
      case "joke": {
        const joke = pick(config.jokes);
        const embed = makeEmbed({
          title: "😂 Random Joke",
          description: `**${joke.setup}**\n\n||${joke.punchline}||`,
          color: config.accentColors.fun,
          footer: "Click the spoiler for the punchline! 🤣",
        });
        await interaction.reply({ embeds: [embed] });
        break;
      }

      // ── /8ball ─────────────────────────────────────
      case "8ball": {
        const question = options.getString("question");
        const answer = pick(config.eightBallResponses);
        const embed = makeEmbed({
          title: "🔮 Magic 8-Ball",
          fields: [
            { name: "❓ Question", value: question },
            { name: "🎱 Answer", value: `**${answer}**` },
          ],
          color: 0x1a1a2e,
        });
        await interaction.reply({ embeds: [embed] });
        break;
      }

      // ── /funfact ───────────────────────────────────
      case "funfact": {
        const fact = pick(config.funFacts);
        const embed = makeEmbed({
          title: "🧠 Fun Fact",
          description: fact,
          color: config.accentColors.info,
        });
        await interaction.reply({ embeds: [embed] });
        break;
      }

      // ── /quote ─────────────────────────────────────
      case "quote": {
        const q = pick(config.quotes);
        const embed = makeEmbed({
          title: "💬 Inspirational Quote",
          description: `*"${q.text}"*\n\n— **${q.author}**`,
          color: 0x2d3436,
        });
        await interaction.reply({ embeds: [embed] });
        break;
      }

      // ── /poll ──────────────────────────────────────
      case "poll": {
        const question = options.getString("question");
        const opt1 = options.getString("option1");
        const opt2 = options.getString("option2");
        const opt3 = options.getString("option3");
        const opt4 = options.getString("option4");

        const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣"];
        let desc = `${emojis[0]} ${opt1}\n${emojis[1]} ${opt2}`;
        let reactionCount = 2;

        if (opt3) { desc += `\n${emojis[2]} ${opt3}`; reactionCount = 3; }
        if (opt4) { desc += `\n${emojis[3]} ${opt4}`; reactionCount = 4; }

        const embed = makeEmbed({
          title: `📊 Poll: ${question}`,
          description: desc,
          color: config.accentColors.warning,
          footer: `Poll by ${interaction.user.username} • React to vote!`,
        });

        const pollMsg = await interaction.reply({ embeds: [embed], fetchReply: true });

        for (let i = 0; i < reactionCount; i++) {
          await pollMsg.react(emojis[i]);
        }
        break;
      }

      // ── /coinflip ──────────────────────────────────
      case "coinflip": {
        const result = Math.random() < 0.5 ? "Heads" : "Tails";
        const emoji = result === "Heads" ? "👑" : "🌍";

        await interaction.reply({
          embeds: [
            makeEmbed({
              title: "🪙 Coin Flip!",
              description: `The coin landed on... **${emoji} ${result}!**`,
              color: config.accentColors.fun,
            }),
          ],
        });
        break;
      }

      // ── /roll ──────────────────────────────────────
      case "roll": {
        const sides = options.getInteger("sides") || 6;
        const result = Math.floor(Math.random() * sides) + 1;

        await interaction.reply({
          embeds: [
            makeEmbed({
              title: "🎲 Dice Roll!",
              description: `Rolling a **d${sides}**...\n\nYou rolled a **${result}**! 🎯`,
              color: config.accentColors.fun,
            }),
          ],
        });
        break;
      }

      // ── /avatar ────────────────────────────────────
      case "avatar": {
        const user = options.getUser("user") || interaction.user;
        const embed = makeEmbed({
          title: `🖼️ ${user.username}'s Avatar`,
          image: user.displayAvatarURL({ dynamic: true, size: 1024 }),
          color: config.accentColors.info,
        });

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("Open in Browser")
            .setStyle(ButtonStyle.Link)
            .setURL(user.displayAvatarURL({ dynamic: true, size: 4096 }))
            .setEmoji("🔗")
        );

        await interaction.reply({ embeds: [embed], components: [row] });
        break;
      }

      // ── /vibe ──────────────────────────────────────
      case "vibe": {
        const vibes = [
          { vibe: "Absolutely immaculate ✨🔥", emoji: "💯", level: 100 },
          { vibe: "Main character energy 🎬", emoji: "🌟", level: 95 },
          { vibe: "Chef's kiss perfection 🤌", emoji: "💋", level: 90 },
          { vibe: "Vibing like a legend 😎", emoji: "🎸", level: 85 },
          { vibe: "Pretty solid honestly 👌", emoji: "✅", level: 75 },
          { vibe: "Decent vibes today 🙂", emoji: "😊", level: 60 },
          { vibe: "Mid vibes ngl 😐", emoji: "🤷", level: 50 },
          { vibe: "Could be better 😕", emoji: "☁️", level: 35 },
          { vibe: "Bruh moment energy 💀", emoji: "😭", level: 20 },
          { vibe: "L vibes detected 📉", emoji: "📉", level: 10 },
        ];

        const todayVibe = pick(vibes);
        const bar = "█".repeat(Math.floor(todayVibe.level / 10)) +
                    "░".repeat(10 - Math.floor(todayVibe.level / 10));

        const embed = makeEmbed({
          title: `✨ Vibe Check for ${interaction.user.username}`,
          description: `${todayVibe.emoji} **${todayVibe.vibe}**\n\n` +
                       `Vibe Level: \`[${bar}]\` **${todayVibe.level}%**`,
          color: todayVibe.level >= 70 ? config.accentColors.success :
                 todayVibe.level >= 40 ? config.accentColors.warning :
                 config.accentColors.error,
        });

        await interaction.reply({ embeds: [embed] });
        break;
      }

      // ── /help ──────────────────────────────────────
      case "help": {
        const embed = makeEmbed({
          title: `📋 ${config.botName} Commands`,
          description: "Here's everything I can do! 🤖✨",
          color: config.botColor,
          fields: [
            {
              name: "✉️ Post as Bot",
              value:
                "`/post` — Send a message as the bot (4 categories)\n" +
                "`/remind` — Schedule a deadline reminder with @everyone",
            },
            {
              name: "📢 Announcements",
              value:
                "`/announce` — Post a fancy announcement\n" +
                "`/schedule` — Schedule an announcement",
            },
            {
              name: "📊 Insights",
              value:
                "`/insight` — Server stats & info\n" +
                "`/userinfo` — Look up a user",
            },
            {
              name: "🎮 Fun",
              value:
                "`/joke` — Random joke\n" +
                "`/8ball` — Ask the magic 8-ball\n" +
                "`/funfact` — Random fun fact\n" +
                "`/quote` — Inspirational quote\n" +
                "`/vibe` — Check your vibe\n" +
                "`/coinflip` — Flip a coin\n" +
                "`/roll` — Roll a dice",
            },
            {
              name: "🛠️ Utility",
              value:
                "`/poll` — Create a poll\n" +
                "`/avatar` — Get someone's avatar\n" +
                "`/help` — This help menu",
            },
            {
              name: "💬 Smart Features",
              value:
                "**Auto-Replies** — Responds to greetings, moods & more\n" +
                "**Mention Responder** — When someone @mentions a user, I'll let them know the person will reply when they see it 📩",
            },
          ],
        });

        await interaction.reply({ embeds: [embed] });
        break;
      }

      default:
        await interaction.reply({
          content: "Unknown command! Try `/help` 🤔",
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

// ── Login ──────────────────────────────────────────
console.log("Attempting Discord login...");
client.login(process.env.DISCORD_TOKEN)
  .then(() => console.log("Discord login successful!"))
  .catch((err) => console.error("Discord login FAILED:", err.message));

// ── Health Check Server (for Render/Cloud hosting) ──
const http = require("http");
const PORT = process.env.PORT || 10000;
http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("VibeBot is alive!");
}).listen(PORT, () => {
  console.log(`Health check server running on port ${PORT}`);
});

