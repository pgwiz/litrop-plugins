const { randomInt } = require('crypto');

const CHARS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  digits: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?'
};

const MIN_PASSWORD_LENGTH = 4;
const MAX_PASSWORD_LENGTH = 128;

function cryptoRand(max) {
  return randomInt(0, max);
}

function generatePassword(length, useUpper, useLower, useDigits, useSymbols) {
  let pool = '';
  const required = [];

  if (useUpper) { pool += CHARS.upper; required.push(CHARS.upper[cryptoRand(CHARS.upper.length)]); }
  if (useLower) { pool += CHARS.lower; required.push(CHARS.lower[cryptoRand(CHARS.lower.length)]); }
  if (useDigits) { pool += CHARS.digits; required.push(CHARS.digits[cryptoRand(CHARS.digits.length)]); }
  if (useSymbols) { pool += CHARS.symbols; required.push(CHARS.symbols[cryptoRand(CHARS.symbols.length)]); }

  if (!pool) return null;

  const remaining = Array.from({ length: length - required.length }, () =>
    pool[cryptoRand(pool.length)]
  );

  const all = [...required, ...remaining];
  // Fisher-Yates shuffle using crypto random
  for (let i = all.length - 1; i > 0; i--) {
    const j = cryptoRand(i + 1);
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

    if (!useUpper && !useLower && !useDigits && !useSymbols) {
      return await sock.sendMessage(chatId, {
        text: '❌ At least one character type must be enabled.'
      }, { quoted: message });
    }

    // Ensure length is at least the number of enabled character types (one required char each)
    const enabledTypes = [useUpper, useLower, useDigits, useSymbols].filter(Boolean).length;
    const effectiveMin = Math.max(MIN_PASSWORD_LENGTH, enabledTypes);

    if (length < effectiveMin || length > MAX_PASSWORD_LENGTH) {
      return await sock.sendMessage(chatId, {
        text: `❌ Password length must be between ${effectiveMin} and ${MAX_PASSWORD_LENGTH}.`
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
