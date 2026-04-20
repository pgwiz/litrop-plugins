const axios = require('axios');

const SIGNS = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

const SIGN_EMOJIS = {
  aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋',
  leo: '♌', virgo: '♍', libra: '♎', scorpio: '♏',
  sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓'
};

const SIGN_DATES = {
  aries: 'Mar 21 – Apr 19',     taurus: 'Apr 20 – May 20',
  gemini: 'May 21 – Jun 20',    cancer: 'Jun 21 – Jul 22',
  leo: 'Jul 23 – Aug 22',       virgo: 'Aug 23 – Sep 22',
  libra: 'Sep 23 – Oct 22',     scorpio: 'Oct 23 – Nov 21',
  sagittarius: 'Nov 22 – Dec 21', capricorn: 'Dec 22 – Jan 19',
  aquarius: 'Jan 20 – Feb 18',  pisces: 'Feb 19 – Mar 20'
};

module.exports = {
  command: 'horoscope',
  aliases: ['horo', 'zodiac', 'star'],
  category: 'fun',
  description: 'Get your daily horoscope',
  usage: '.horoscope <zodiac sign>  (e.g. .horoscope aries)',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;

    if (!args.length) {
      const signList = SIGNS.map(s => `${SIGN_EMOJIS[s]} ${s.charAt(0).toUpperCase() + s.slice(1)} (${SIGN_DATES[s]})`).join('\n');
      return await sock.sendMessage(chatId, {
        text: `✨ *Daily Horoscope*\n\nProvide your zodiac sign:\n\n${signList}\n\nExample: \`.horoscope leo\``
      }, { quoted: message });
    }

    const sign = args[0].toLowerCase();

    if (!SIGNS.includes(sign)) {
      return await sock.sendMessage(chatId, {
        text: `❌ *"${args[0]}"* is not a valid zodiac sign.\n\nValid signs: ${SIGNS.join(', ')}`
      }, { quoted: message });
    }

    try {
      const response = await axios.get(`https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${sign}&day=TODAY`, {
        timeout: 10000
      });

      const data = response.data;
      const horoscope = data?.data?.horoscope_data || data?.data?.description;
      const date = data?.data?.date || new Date().toDateString();

      if (!horoscope) throw new Error('No horoscope data');

      const emoji = SIGN_EMOJIS[sign];
      const signTitle = sign.charAt(0).toUpperCase() + sign.slice(1);

      await sock.sendMessage(chatId, {
        text: `${emoji} *${signTitle} Horoscope*\n📅 ${date}\n\n${horoscope}`
      }, { quoted: message });

    } catch (err) {
      console.error('horoscope error:', err.message);
      await sock.sendMessage(chatId, {
        text: '❌ Could not fetch horoscope right now. Please try again later.'
      }, { quoted: message });
    }
  }
};
