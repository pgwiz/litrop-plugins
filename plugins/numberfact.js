const axios = require('axios');

module.exports = {
  command: 'numberfact',
  aliases: ['numfact', 'numinfo', 'nfact'],
  category: 'fun',
  description: 'Get an interesting fact about a number',
  usage: '.numberfact [number]  (omit for a random fact)',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const input = args[0];
    let url;

    if (!input) {
      url = 'https://numbersapi.com/random/trivia?json';
    } else {
      const num = parseInt(input, 10);
      if (isNaN(num)) {
        return await sock.sendMessage(chatId, {
          text: '❌ Please provide a valid number.\nExample: `.numberfact 42`'
        }, { quoted: message });
      }
      url = `https://numbersapi.com/${num}/trivia?json`;
    }

    try {
      const response = await axios.get(url, { timeout: 8000 });
      const data = response.data;

      await sock.sendMessage(chatId, {
        text: `🔢 *Number Fact*\n\n🔹 Number: *${data.number}*\n\n📚 ${data.text}`
      }, { quoted: message });
    } catch (err) {
      console.error('numberfact error:', err.message);
      await sock.sendMessage(chatId, {
        text: '❌ Could not fetch a number fact right now. Please try again later.'
      }, { quoted: message });
    }
  }
};
