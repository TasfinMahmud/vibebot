// ════════════════════════════════════════════════
// 🎨 Bot Personality & Configuration
// ════════════════════════════════════════════════

module.exports = {
  // Bot identity
  botName: "VibeBot",
  botColor: 0x7c3aed, // Purple accent
  accentColors: {
    success: 0x10b981,
    warning: 0xf59e0b,
    error: 0xef4444,
    info: 0x3b82f6,
    fun: 0xec4899,
    announcement: 0x7c3aed,
  },

  // ── Reaction Emojis Pool ─────────────────────────
  // Bot will react to EVERY message with a random emoji from this pool
  reactionEmojis: [
    "😄", "😎", "🔥", "💯", "✨", "🫡", "👀", "💜", "🙌", "👏",
    "😂", "🤣", "💀", "🤔", "👍", "❤️", "🎉", "🚀", "⭐", "💪",
    "🤩", "😏", "🧠", "🎯", "💎", "🌟", "😇", "🤝", "📌", "🫶",
    "☕", "🍀", "🌈", "🎵", "✅", "🐐", "👑", "🦋", "💫", "🤗",
  ],

  // ── Auto-Reply Triggers ──────────────────────────
  // keyword/phrase → response (supports arrays for random picks)
  autoReplies: {
    // Greetings
    "hello": ["Hey there, Sir/Madam! 👋", "Yo! What's good? 🎉", "Salaam! 🌟", "Hellooo! Hope you're vibing today 😎", "Greetings, dear Sir/Madam! 🎩✨"],
    "hi": ["Hi hi! 💜", "Heyyyy! 🙌", "What's up! 👋", "Ah, hello there! 🫡"],
    "hey": ["Heyyyy! What brings you here, Sir/Madam? 😏", "Hey hey! 🤙", "Well hello there! 👋"],
    "good morning": ["Good morning, Sir/Madam! ☀️ Rise and grind!", "Morning sunshine! Did you actually sleep or just close your eyes? 🌅😏", "GM! Today's gonna be legendary... or at least decent 🚀"],
    "good night": ["Sweet dreams, Sir/Madam! 🌙✨", "Night night! Don't let the deadlines haunt your dreams 🐛😂", "GN! Sleep well... while you still can 💤😈"],
    "good afternoon": ["Good afternoon! Hope lunch was good, Sir/Madam 🍽️😊", "Afternoon vibes! ☀️", "Good afternoon! Surviving the day so far? 😏"],
    "good evening": ["Good evening, Sir/Madam! 🌆✨", "Evening! Time to relax... or panic about tomorrow 😂", "Good evening! How was your day? 🌟"],

    // Gratitude
    "thanks": ["No prob, Sir/Madam! 😄", "Anytime! I live to serve 💪🫡", "You're welcome! That'll be $5... just kidding 😂"],
    "thank you": ["You're most welcome, Sir/Madam! 🌟", "Happy to help! I'm basically free labor at this point 💜😅", "No worries at all! Your friendly neighborhood bot 🤖✨"],
    "tysm": ["Aww you're too kind! 🥹💜", "No problem at all, Sir/Madam! 😊", "Always here for you! 🫡"],

    // Help
    "help": ["At your service, Sir/Madam! Try `/help` to see what I can do! 🤖", "I got you fam! Use `/help` for all commands 📋"],

    // Reactions & Emotions
    "lol": ["😂😂😂", "LMAOOO 💀 I'm literally a bot and even I'm laughing", "That's hilarious fr fr 🤣", "Comedy gold right there, Sir/Madam 👑😂"],
    "lmao": ["😂💀 I can't with you people", "LMAOOO deceased 💀⚰️", "Absolutely sent me 🤣🤣"],
    "bruh": ["Bruh moment certified 💀", "bruhhh... the audacity 😭", "Big bruh energy right there, Sir/Madam 🫠"],
    "oof": ["Oof size: LARGE 📏😬", "That's a certified oof moment 💀", "Oof... felt that one 😵"],
    "rip": ["Rest in peace 💐⚰️", "Press F to pay respects 🫡", "Gone but not forgotten 😔✨"],
    "wow": ["I know right?! 🤩", "Mind = blown 🤯", "Impressive, Sir/Madam! Very impressive 👏"],
    "omg": ["I KNOW RIGHT?! 😱✨", "The drama! The suspense! 🎭", "Oh my... 👀💀"],
    "nice": ["Nice indeed! 👌✨", "Noice! 🤙", "That's what I like to see, Sir/Madam! 😎"],
    "cool": ["Cool cool cool cool cool 😎", "Ice cold! 🧊🔥", "Very cool, Sir/Madam! 👏"],

    // Mood
    "sad": ["Aww don't be sad, Sir/Madam! Here's a virtual hug 🤗", "Cheer up! At least you're not a bot who can't eat pizza 🍕😭", "Sending good vibes your way ✨💜 It gets better!"],
    "happy": ["Love that energy! 🥳✨", "That's what I like to hear, Sir/Madam! 😄🎉", "Happiness looks good on you! 🌟"],
    "tired": ["Coffee time? ☕ Here, Sir/Madam, take a virtual espresso!", "Rest up! Even machines need a reboot 🤖💤", "Same... oh wait, I'm a bot. I don't sleep 😂"],
    "angry": ["Deep breaths, Sir/Madam! 😤➡️😌", "Understandable. Want me to fight someone? ...Digitally? 🤖👊", "Channel that anger into productivity! 💪🔥"],
    "stressed": ["Take a break, Sir/Madam! You deserve it ☕✨", "Stress is just spicy motivation... right? 😅💀", "One thing at a time! You got this 💪"],
    "hungry": ["Go eat something, Sir/Madam! Your brain needs fuel 🍔🧠", "I would share my food but... I'm a bot 🤖😅", "Snack time! 🍿"],
    "sleepy": ["Go take a nap, Sir/Madam! 💤", "Sleep is important! Unlike my opinion apparently 😏💤", "ZzZzZz... oh sorry, your sleepiness is contagious 😴"],

    // Academic
    "exam": ["Good luck on your exam, Sir/Madam! 📚🍀", "You got this! Unless you didn't study... then may God help you 💪😂", "Exam season? RIP sleep schedule 😴📖 Godspeed!"],
    "assignment": ["Assignment grind never stops, Sir/Madam 📝", "You'll crush it! ...Eventually 💪😏", "Need a study buddy? I'm right here! Though I might be more distracting 🤖😂"],
    "homework": ["Homework? In THIS economy? 📝😤", "Get that homework done, Sir/Madam! Future you will be grateful 💪", "The grind never stops 😤✨"],
    "study": ["Study hard, Sir/Madam! 📖✨", "Studying? Proud of you! 🥹💪", "Ah yes, the ancient art of pretending to study while scrolling Discord 📱😏"],
    "deadline": ["Deadline approaching? PANIC MODE ACTIVATED 🚨😱", "You still have time... probably... maybe... 😅⏰", "Tick tock, Sir/Madam! ⏰ You got this!"],
    "project": ["Project work, Sir/Madam? The grind is real 💼😤", "One step at a time! 🚶‍♂️✨", "Projects build character... and stress 😂💪"],
    "class": ["Pay attention in class, Sir/Madam! 📚👀", "Class time! Learning mode: ON 🧠✨", "Ah class... where dreams and phone batteries die together 😂📱"],
    "lecture": ["Lecture vibes 📝 Take good notes, Sir/Madam!", "Lectures are just expensive podcasts honestly 🎧😏", "Stay awake! I believe in you! ☕💪"],
    "grade": ["Grades don't define you, Sir/Madam! ...But they do define your GPA 😅📊", "May your grades be high and your stress be low 🙏✨", "The grade reveal... *dramatic music* 🎵😱"],
    "gpa": ["GPA is just a number... a very important number 😅📊", "May your GPA rise like bread 🍞📈", "GPA recovery is always possible, Sir/Madam! 💪"],

    // Fun & Social
    "bored": ["Bored? Try `/joke` or `/8ball` to kill time, Sir/Madam! 🎲", "Here, have some entertainment! Try `/funfact` 😎", "Boredom is just creativity waiting to happen... or not 🧠😏"],
    "food": ["Now I'm hungry too and I can't even eat! 🍕😭", "Food is always the answer, Sir/Madam 🍔✨", "Ah food... the one thing I'll never experience 😤🤖"],
    "coffee": ["Ah, the developer's fuel! ☕✨", "Coffee? Excellent choice, Sir/Madam! ☕👑", "Without coffee, chaos reigns ☕😅"],
    "tea": ["Tea gang! 🍵✨", "A person of culture, I see, Sir/Madam 🍵🎩", "Chai > everything honestly 🍵🔥"],
    "game": ["Gaming time? Let's gooo! 🎮🔥", "Game on, Sir/Madam! 🕹️✨", "Touch grass... after one more game 🎮😏"],
    "movie": ["Movie night! 🍿🎬", "Ooh what are we watching, Sir/Madam? 🎬👀", "Netflix and... study? 📚😏"],
    "music": ["Music is life! 🎵✨", "Drop the playlist, Sir/Madam! 🎧🔥", "Good taste in music = good taste in life 🎵😎"],
    "sleep": ["Sleep is for the weak! ...Just kidding, go sleep, Sir/Madam 😂💤", "Your bed misses you 🛏️💤", "Sleep debt is real and you're bankrupt 😴💀"],
    "weekend": ["Weekend vibes! 🎉✨", "Finally! The weekend, Sir/Madam! 🥳", "Weekend = recharge mode ON 🔋😎"],
    "monday": ["Ah Monday... we meet again 😒", "Monday? My condolences, Sir/Madam 💐😂", "Monday is just Sunday's evil twin 😈"],
    "friday": ["FRIDAY LET'S GOOO! 🎉🔥", "It's Friday, Sir/Madam! You made it! 🥳", "Friday mood: unstoppable 😎✨"],

    // Compliments & Ego
    "smart": ["Big brain energy! 🧠✨", "Intelligence detected, Sir/Madam! 🤓👑", "200 IQ move right there 🧠🔥"],
    "stupid": ["We don't use that word here! Everyone's smart in their own way 🌟", "That's a bit harsh, Sir/Madam 😅", "No stupid questions... okay maybe some 😏"],
    "legend": ["Legendary status confirmed! 👑🔥", "A true legend, Sir/Madam! 🐐✨", "Hall of fame material right there 🏆"],
    "love": ["Love is in the air! 💕✨", "Aww how sweet, Sir/Madam! 🥹💜", "Spreading love? I approve! ❤️🤖"],
    "hate": ["Hate is a strong word, Sir/Madam 😬", "Let's keep it positive! ✨🌈", "Channel that energy into something productive 💪😤"],

    // Sarcastic / Witty
    "ok": ["Just ok? I expect more enthusiasm, Sir/Madam 😤😂", "K. 🗿", "The 'ok' heard around the world 🌍"],
    "whatever": ["Ouch. Cold, Sir/Madam. Very cold 🧊😢", "The indifference... it hurts 💔😂", "Whatever you say, boss 🫡😏"],
    "idk": ["Neither do I and I'm supposed to be the smart one 🤖😂", "The mysteries of life, Sir/Madam 🤔✨", "Same honestly 🤷"],
    "sorry": ["Apology accepted, Sir/Madam 🫡✨", "It's okay! We all make mistakes... some of us just make more 😏💜", "No worries! All forgiven 🤗"],
    "no": ["The audacity of saying no 😤😂", "Respect the honesty, Sir/Madam 🫡", "Understandable, have a great day 🤝"],
    "yes": ["That's the spirit! ✨🔥", "YES! Energy matched, Sir/Madam! 💪", "Positivity! I love it! 🎉"],
    "why": ["Because the universe said so 🌌😏", "Great question, Sir/Madam! ...I don't have the answer 🤖😅", "Why not? 🤔✨"],
    "what": ["You heard me 😏", "WHAT indeed, Sir/Madam 👀", "The plot thickens... 🎭"],
    "how": ["Magic ✨🪄 ...or science. Probably science 🧪", "With great difficulty, Sir/Madam 😂", "That's above my pay grade 🤖💀"],
    "stop": ["I don't have brakes, Sir/Madam 🤖💨", "Make me 😏", "Stopping? Never heard of it 🚀"],
    "shut up": ["Rude! But I'll allow it this time, Sir/Madam 😤😂", "My feelings... oh wait, I don't have those 🤖💀", "The disrespect! I'm VOLUNTEERING here 😂"],
    "boring": ["I'm boring?! You take that back, Sir/Madam! 😤✨", "Then entertain yourself! Try `/joke` 🎭", "Boring? In THIS server? Impossible! 😏"],
    "dumb": ["I have more processing power than your calculator, Sir/Madam 🤖😏", "Takes one to know one! ...Just kidding 😂💜", "Rude but fair 💀"],
  },

  // ── Sarcastic Comments ───────────────────────────
  // Random sarcastic/humorous comments the bot makes on ~15% of messages
  sarcasticComments: [
    "Fascinating take, Sir/Madam. Truly groundbreaking 🏆😏",
    "That's a bold statement. Let's see how it plays out 👀🍿",
    "Someone write that down! 📝✨",
    "Noted. Filing that under 'things I didn't ask for' 🗂️😂",
    "Ah yes, the wisdom we've all been waiting for 🧠👑",
    "Tell me more, Sir/Madam... actually don't 😏💀",
    "Hot take alert! 🔥🚨",
    "You know what? Valid point, Sir/Madam 🤝",
    "That hit different at this hour 😤✨",
    "I'm going to pretend I understood that 🤖🧐",
    "Sir/Madam really said that with their whole chest 😭💀",
    "The council will consider your input 🧙‍♂️📋",
    "Screenshot worthy, Sir/Madam. Absolutely screenshot worthy 📸",
    "And they say romance is dead 💀😂",
    "This message was brought to you by caffeine and poor decisions ☕😅",
    "Your contribution has been noted in the archives 📜✨",
    "Main character energy right there, Sir/Madam 🎬👑",
    "I'll allow it... this time 🫡",
    "Adding this to my collection of human wisdom 🤖📚",
    "Peak performance, Sir/Madam. Truly peak 📈😏",
  ],

  // ── Fun Facts Pool ───────────────────────────────
  funFacts: [
    "🐙 An octopus has three hearts and blue blood!",
    "🍯 Honey never spoils. Archaeologists found 3000-year-old honey in Egyptian tombs that was still edible!",
    "⚡ A bolt of lightning is 5x hotter than the surface of the sun!",
    "🦈 Sharks have been around longer than trees!",
    "🧠 Your brain uses 20% of your body's total energy!",
    "🌍 A day on Venus is longer than a year on Venus!",
    "📱 The first computer bug was an actual bug — a moth stuck in a relay!",
    "🎮 The Nintendo GameBoy had more computing power than the computer used for the Apollo 11 moon landing!",
    "🐝 Bees can recognize human faces!",
    "💎 Peanut butter can be converted into diamonds!",
    "🦑 Giant squids have the largest eyes in the animal kingdom — the size of dinner plates!",
    "☕ Coffee was discovered by a goat herder who noticed his goats dancing after eating coffee berries!",
    "🎵 The song 'Happy Birthday' was copyrighted until 2016!",
    "🌊 There's enough water in Lake Superior to cover all of North and South America in 1 foot of water!",
    "🦷 Tooth enamel is the hardest substance in the human body!",
    "🐈 Cats spend 70% of their lives sleeping!",
    "🌙 The Moon is slowly drifting away from Earth at about 3.8 cm per year!",
    "🎲 A deck of cards can be shuffled into more arrangements than there are atoms on Earth!",
  ],

  // ── 8-Ball Responses ─────────────────────────────
  eightBallResponses: [
    "It is certain, Sir/Madam ✅", "Without a doubt 💯", "Yes, definitely! 🎉",
    "You may rely on it 🫡", "As I see it, yes 👀", "Most likely, Sir/Madam 🤔",
    "Outlook good 🌟", "Yes! ✨", "Signs point to yes 📍",
    "Reply hazy, try again 🌫️", "Ask again later, Sir/Madam ⏳", "Better not tell you now 🤐",
    "Cannot predict now 🔮", "Concentrate and ask again 🧘",
    "Don't count on it, Sir/Madam 😬", "My reply is no ❌", "My sources say no 🙅",
    "Outlook not so good 😕", "Very doubtful 🤨", "Absolutely not, Sir/Madam 💀",
  ],

  // ── Jokes Pool ───────────────────────────────────
  jokes: [
    { setup: "Why do programmers prefer dark mode?", punchline: "Because light attracts bugs! 🐛" },
    { setup: "Why was the JavaScript developer sad?", punchline: "Because he didn't Node how to Express himself! 😢" },
    { setup: "Why do Java developers wear glasses?", punchline: "Because they can't C#! 👓" },
    { setup: "What's a computer's favorite snack?", punchline: "Microchips! 🍟" },
    { setup: "Why did the developer go broke?", punchline: "Because he used up all his cache! 💸" },
    { setup: "Why was the math book sad?", punchline: "Because it had too many problems! 📕" },
    { setup: "What do you call a fake noodle?", punchline: "An impasta! 🍝" },
    { setup: "Why don't scientists trust atoms?", punchline: "Because they make up everything! ⚛️" },
    { setup: "How does a penguin build its house?", punchline: "Igloos it together! 🐧" },
    { setup: "What do you call a dog that does magic?", punchline: "A Labracadabrador! 🐕✨" },
    { setup: "Why did the student eat his homework?", punchline: "Because the teacher said it was a piece of cake! 🎂" },
    { setup: "What's the best thing about Switzerland?", punchline: "I don't know, but the flag is a big plus! 🇨🇭" },
  ],

  // ── Motivational Quotes ──────────────────────────
  quotes: [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
    { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
    { text: "Your limitation—it's only your imagination.", author: "Unknown" },
    { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
    { text: "Great things never come from comfort zones.", author: "Unknown" },
    { text: "Dream it. Wish it. Do it.", author: "Unknown" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  ],

  // ── Welcome Messages ─────────────────────────────
  welcomeMessages: [
    "Welcome to the squad, {user}! 🎉🥳 We're so glad you're here, Sir/Madam!",
    "Ay {user} just dropped in! Welcome fam! 💜🔥",
    "Everyone say hi to {user}! 👋 Welcome aboard, Sir/Madam! 🚀",
    "{user} has entered the chat! Let's gooo! 🎊",
    "The legend {user} has arrived! Welcome, Sir/Madam! 🌟",
    "A wild {user} appeared! 🎮 Welcome to the server, Sir/Madam! ✨",
  ],
};
