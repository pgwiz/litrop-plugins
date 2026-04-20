module.exports = {
  command: 'wordcount',
  aliases: ['wc', 'count', 'charcount'],
  category: 'utility',
  description: 'Count words, characters, sentences, and paragraphs in text',
  usage: '.wordcount <text>',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;

    // Also check for quoted/replied message text
    const quotedText =
      message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation ||
      message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.text ||
      null;

    const text = args.length ? args.join(' ') : quotedText;

    if (!text || !text.trim()) {
      return await sock.sendMessage(chatId, {
        text: '📊 *Word Count*\n\nProvide text to analyse, or reply to a message.\nExample: `.wordcount Hello World, this is a test.`'
      }, { quoted: message });
    }

    const trimmed = text.trim();

    const charCount = trimmed.length;
    const charNoSpaces = trimmed.replace(/\s/g, '').length;
    const wordCount = trimmed.split(/\s+/).filter(w => w.length > 0).length;
    const sentenceCount = (trimmed.match(/[.!?]+/g) || []).length || 1;
    const paragraphCount = trimmed.split(/\n\s*\n/).filter(p => p.trim().length > 0).length || 1;
    const lineCount = trimmed.split('\n').length;

    // Estimated reading time (average reading speed in words per minute)
    const AVG_WORDS_PER_MINUTE = 200;
    const readingSeconds = Math.ceil((wordCount / AVG_WORDS_PER_MINUTE) * 60);
    const readingTime = readingSeconds < 60
      ? `${readingSeconds} sec`
      : `${Math.floor(readingSeconds / 60)} min ${readingSeconds % 60} sec`;

    await sock.sendMessage(chatId, {
      text: `📊 *Text Analysis*\n\n` +
        `🔤 Characters (with spaces): *${charCount}*\n` +
        `🔡 Characters (no spaces): *${charNoSpaces}*\n` +
        `📝 Words: *${wordCount}*\n` +
        `📖 Sentences: *${sentenceCount}*\n` +
        `📄 Paragraphs: *${paragraphCount}*\n` +
        `➖ Lines: *${lineCount}*\n` +
        `⏱️ Reading time: *${readingTime}*`
    }, { quoted: message });
  }
};
