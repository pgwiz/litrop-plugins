const CHARS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  digits: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?'
};

function generatePassword(length, useUpper, useLower, useDigits, useSymbols) {
  let pool = '';
  const required = [];

  if (useUpper) { pool += CHARS.upper; required.push(CHARS.upper[Math.floor(Math.random() * CHARS.upper.length)]); }
  if (useLower) { pool += CHARS.lower; required.push(CHARS.lower[Math.floor(Math.random() * CHARS.lower.length)]); }
  if (useDigits) { pool += CHARS.digits; required.push(CHARS.digits[Math.floor(Math.random() * CHARS.digits.length)]); }
  if (useSymbols) { pool += CHARS.symbols; required.push(CHARS.symbols[Math.floor(Math.random() * CHARS.symbols.length)]); }

  if (!pool) return null;

  const remaining = Array.from({ length: length - required.length }, () =>
    pool[Math.floor(Math.random() * pool.length)]
  );

  const all = [...required, ...remaining];
  // Shuffle
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }

  return all.join('');
}

module.exports = {
  command: 'password',
  aliases: ['genpass', 'passgen', 'pw'],
  category: 'utility',
  description: 'Generate a secure random password',
  usage: '.password [length] [options: --no-symbols --no-upper --no-lower --no-digits]',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;

    let length = 16;
    let useUpper = true;
    let useLower = true;
    let useDigits = true;
    let useSymbols = true;

    for (const arg of args) {
      if (!isNaN(arg)) {
        length = parseInt(arg, 10);
      } else if (arg === '--no-symbols') {
        useSymbols = false;
      } else if (arg === '--no-upper') {
        useUpper = false;
      } else if (arg === '--no-lower') {
        useLower = false;
      } else if (arg === '--no-digits') {
        useDigits = false;
      }
    }

    if (length < 4 || length > 128) {
      return await sock.sendMessage(chatId, {
        text: '❌ Password length must be between 4 and 128.'
      }, { quoted: message });
    }

    if (!useUpper && !useLower && !useDigits && !useSymbols) {
      return await sock.sendMessage(chatId, {
        text: '❌ At least one character type must be enabled.'
      }, { quoted: message });
    }

    const password = generatePassword(length, useUpper, useLower, useDigits, useSymbols);
    const components = [
      useUpper ? '🔠 Uppercase' : null,
      useLower ? '🔡 Lowercase' : null,
      useDigits ? '🔢 Digits' : null,
      useSymbols ? '🔣 Symbols' : null
    ].filter(Boolean).join(', ');

    await sock.sendMessage(chatId, {
      text: `🔐 *Password Generator*\n\n🗝️ Password: \`${password}\`\n📏 Length: ${length}\n🧩 Contains: ${components}\n\n⚠️ _Keep this safe and don't share it!_`
    }, { quoted: message });
  }
};
