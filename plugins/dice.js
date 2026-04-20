module.exports = {
  command: 'dice',
  aliases: ['roll', 'rolldice'],
  category: 'fun',
  description: 'Roll a dice. Optionally specify number of sides (default: 6)',
  usage: '.dice [sides]',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    let sides = 6;

    if (args[0]) {
      const parsed = parseInt(args[0], 10);
      if (isNaN(parsed) || parsed < 2) {
        return await sock.sendMessage(chatId, {
          text: '❌ Please provide a valid number of sides (minimum 2).\nExample: `.dice 20`'
        }, { quoted: message });
      }
      if (parsed > 1000) {
        return await sock.sendMessage(chatId, {
          text: '❌ Maximum allowed sides is 1000.'
        }, { quoted: message });
      }
      sides = parsed;
    }

    const result = Math.floor(Math.random() * sides) + 1;

    await sock.sendMessage(chatId, {
      text: `🎲 *Dice Roll* (d${sides})\n\nYou rolled a *${result}*!`
    }, { quoted: message });
  }
};
