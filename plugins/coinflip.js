module.exports = {
  command: 'coinflip',
  aliases: ['flip', 'coin', 'toss'],
  category: 'fun',
  description: 'Flip a coin and get Heads or Tails',
  usage: '.coinflip',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
    const emoji = result === 'Heads' ? '🪙' : '🥏';

    await sock.sendMessage(chatId, {
      text: `${emoji} *Coin Flip*\n\nThe coin landed on... *${result}*!`
    }, { quoted: message });
  }
};
