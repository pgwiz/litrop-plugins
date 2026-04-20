const MORSE_CODE = {
  A: '.-',    B: '-...',  C: '-.-.',  D: '-..',   E: '.',
  F: '..-.',  G: '--.',   H: '....',  I: '..',    J: '.---',
  K: '-.-',   L: '.-..',  M: '--',    N: '-.',    O: '---',
  P: '.--.',  Q: '--.-',  R: '.-.',   S: '...',   T: '-',
  U: '..-',   V: '...-',  W: '.--',   X: '-..-',  Y: '-.--',
  Z: '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.',
  '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
  '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
  '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.',
  '$': '...-..-', '@': '.--.-.'
};

const MORSE_REVERSE = Object.fromEntries(Object.entries(MORSE_CODE).map(([k, v]) => [v, k]));

function textToMorse(text) {
  return text
    .toUpperCase()
    .split('')
    .map(char => {
      if (char === ' ') return '/';
      return MORSE_CODE[char] || '?';
    })
    .join(' ');
}

function morseToText(morse) {
  return morse
    .split(' / ')
    .map(word =>
      word
        .split(' ')
        .map(code => MORSE_REVERSE[code] || '?')
        .join('')
    )
    .join(' ');
}

module.exports = {
  command: 'morse',
  aliases: ['morsecode'],
  category: 'utility',
  description: 'Encode text to Morse code or decode Morse code to text',
  usage: '.morse encode <text>  |  .morse decode <morse>',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;

    if (args.length < 2) {
      return await sock.sendMessage(chatId, {
        text: '📡 *Morse Code*\n\nUsage:\n• `.morse encode Hello World`\n• `.morse decode .... . .-.. .-.. --- / .-- --- .-. .-.. -..`'
      }, { quoted: message });
    }

    const mode = args[0].toLowerCase();
    const input = args.slice(1).join(' ');

    if (mode === 'encode') {
      const encoded = textToMorse(input);
      await sock.sendMessage(chatId, {
        text: `📡 *Morse Code — Encode*\n\n🔤 Text: ${input}\n📟 Morse: ${encoded}`
      }, { quoted: message });
    } else if (mode === 'decode') {
      const decoded = morseToText(input);
      await sock.sendMessage(chatId, {
        text: `📡 *Morse Code — Decode*\n\n📟 Morse: ${input}\n🔤 Text: ${decoded}`
      }, { quoted: message });
    } else {
      await sock.sendMessage(chatId, {
        text: '❌ Unknown mode. Use `encode` or `decode`.\nExample: `.morse encode Hello`'
      }, { quoted: message });
    }
  }
};
