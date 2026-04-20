' ==========================================
' VibeBot — Silent Auto-Starter
' Runs the bot in background, no window
' ==========================================
Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "E:\301\discord-bot"
WshShell.Run "cmd /c node bot.js > vibebot.log 2>&1", 0, False
