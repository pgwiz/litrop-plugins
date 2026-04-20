module.exports = {
  command: 'timezone',
  aliases: ['time', 'tz', 'clock'],
  category: 'utility',
  description: 'Show the current time in any timezone or city',
  usage: '.timezone <timezone or city>  (e.g. .timezone Africa/Nairobi)',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;

    if (!args.length) {
      return await sock.sendMessage(chatId, {
        text: `🌍 *Timezone Lookup*\n\nProvide a timezone or city name.\n\n*Examples:*\n• \`.timezone Africa/Nairobi\`\n• \`.timezone America/New_York\`\n• \`.timezone Europe/London\`\n• \`.timezone Asia/Kolkata\`\n• \`.timezone UTC\`\n\n_Use IANA timezone names for best results._`
      }, { quoted: message });
    }

    // Try to match common city names to IANA timezones
    const CITY_MAP = {
      nairobi: 'Africa/Nairobi',
      lagos: 'Africa/Lagos',
      cairo: 'Africa/Cairo',
      accra: 'Africa/Accra',
      johannesburg: 'Africa/Johannesburg',
      london: 'Europe/London',
      paris: 'Europe/Paris',
      berlin: 'Europe/Berlin',
      rome: 'Europe/Rome',
      moscow: 'Europe/Moscow',
      dubai: 'Asia/Dubai',
      mumbai: 'Asia/Kolkata',
      delhi: 'Asia/Kolkata',
      kolkata: 'Asia/Kolkata',
      karachi: 'Asia/Karachi',
      dhaka: 'Asia/Dhaka',
      bangkok: 'Asia/Bangkok',
      jakarta: 'Asia/Jakarta',
      singapore: 'Asia/Singapore',
      tokyo: 'Asia/Tokyo',
      seoul: 'Asia/Seoul',
      beijing: 'Asia/Shanghai',
      shanghai: 'Asia/Shanghai',
      sydney: 'Australia/Sydney',
      melbourne: 'Australia/Melbourne',
      'new york': 'America/New_York',
      newyork: 'America/New_York',
      'los angeles': 'America/Los_Angeles',
      losangeles: 'America/Los_Angeles',
      chicago: 'America/Chicago',
      toronto: 'America/Toronto',
      vancouver: 'America/Vancouver',
      'sao paulo': 'America/Sao_Paulo',
      saopaulo: 'America/Sao_Paulo',
      'buenos aires': 'America/Argentina/Buenos_Aires',
      mexico: 'America/Mexico_City',
      utc: 'UTC',
      gmt: 'Etc/GMT'
    };

    const input = args.join(' ').trim();
    const lowerInput = input.toLowerCase().replace(/\s+/g, ' ');
    const timezone = CITY_MAP[lowerInput] || input;

    try {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZoneName: 'long'
      });

      const parts = formatter.formatToParts(now);
      const get = type => (parts.find(p => p.type === type) || {}).value || '';

      const dateStr = `${get('weekday')}, ${get('month')} ${get('day')}, ${get('year')}`;
      const timeStr = `${get('hour')}:${get('minute')}:${get('second')} ${get('dayPeriod')}`;
      const tzName = get('timeZoneName');

      await sock.sendMessage(chatId, {
        text: `🕐 *Timezone: ${timezone}*\n\n📅 Date: ${dateStr}\n⏰ Time: ${timeStr}\n🌐 Zone: ${tzName}`
      }, { quoted: message });

    } catch (err) {
      await sock.sendMessage(chatId, {
        text: `❌ Invalid timezone: *${input}*\n\nUse a valid IANA timezone (e.g. \`Africa/Nairobi\`, \`America/New_York\`).`
      }, { quoted: message });
    }
  }
};
