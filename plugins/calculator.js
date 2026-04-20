module.exports = {
  command: 'calc',
  aliases: ['calculate', 'math'],
  category: 'utility',
  description: 'Evaluate a mathematical expression',
  usage: '.calc <expression>',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const expression = args.join(' ').trim();

    if (!expression) {
      return await sock.sendMessage(chatId, {
        text: '📐 *Calculator*\n\nProvide a math expression.\nExample: `.calc 2 + 2 * 5`'
      }, { quoted: message });
    }

    // Only allow safe characters: digits, operators, parentheses, spaces, and dots (for decimals)
    if (!/^[\d\s+\-*/.%^()]+$/.test(expression)) {
      return await sock.sendMessage(chatId, {
        text: '❌ Invalid expression. Only numbers and operators (+, -, *, /, %, ^, parentheses) are allowed.'
      }, { quoted: message });
    }

    try {
      // Replace ^ with ** for exponentiation
      const sanitized = expression.replace(/\^/g, '**');
      // eslint-disable-next-line no-new-func
      const result = Function('"use strict"; return (' + sanitized + ')')();

      if (!isFinite(result)) {
        return await sock.sendMessage(chatId, {
          text: '❌ Result is undefined (e.g. division by zero).'
        }, { quoted: message });
      }

      await sock.sendMessage(chatId, {
        text: `📐 *Calculator*\n\n🔢 Expression: \`${expression}\`\n✅ Result: *${result}*`
      }, { quoted: message });
    } catch (err) {
      await sock.sendMessage(chatId, {
        text: '❌ Could not evaluate the expression. Please check your syntax.'
      }, { quoted: message });
    }
  }
};
