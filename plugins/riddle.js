const RIDDLES = [
  {
    question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
    answer: "An echo"
  },
  {
    question: "The more you take, the more you leave behind. What am I?",
    answer: "Footsteps"
  },
  {
    question: "I have cities, but no houses live there. I have mountains, but no trees grow there. I have water, but no fish swim there. I have roads, but no cars drive there. What am I?",
    answer: "A map"
  },
  {
    question: "What has hands but cannot clap?",
    answer: "A clock"
  },
  {
    question: "What has to be broken before you can use it?",
    answer: "An egg"
  },
  {
    question: "I'm light as a feather, yet the strongest person can't hold me for five minutes. What am I?",
    answer: "Breath"
  },
  {
    question: "What has many keys but can't open a single lock?",
    answer: "A piano"
  },
  {
    question: "What runs, but never walks, has a mouth but never talks, has a head but never weeps, has a bed but never sleeps?",
    answer: "A river"
  },
  {
    question: "I have a tail and a head, but no body. What am I?",
    answer: "A coin"
  },
  {
    question: "The more you take away from me, the bigger I become. What am I?",
    answer: "A hole"
  },
  {
    question: "What comes once in a minute, twice in a moment, but never in a thousand years?",
    answer: "The letter M"
  },
  {
    question: "I have branches, but no fruit, trunk, or leaves. What am I?",
    answer: "A bank"
  },
  {
    question: "What can fill a room but takes up no space?",
    answer: "Light"
  },
  {
    question: "What gets wetter as it dries?",
    answer: "A towel"
  },
  {
    question: "What invention lets you look right through a wall?",
    answer: "A window"
  },
  {
    question: "I have no wings but I can fly. I have no eyes but I can cry. What am I?",
    answer: "A cloud"
  },
  {
    question: "What has four fingers and a thumb but is not alive?",
    answer: "A glove"
  },
  {
    question: "What starts with T, ends with T, and has T in it?",
    answer: "A teapot"
  },
  {
    question: "What goes up when rain comes down?",
    answer: "An umbrella"
  },
  {
    question: "I have a neck but no head, and I wear a cap. What am I?",
    answer: "A bottle"
  }
];

// In-memory store for pending riddle answers (chatId -> riddle index)
const pendingRiddles = new Map();
const RIDDLE_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

module.exports = {
  command: 'riddle',
  aliases: ['brain', 'puzzle'],
  category: 'fun',
  description: 'Get a random riddle and guess the answer',
  usage: '.riddle  |  .riddle answer <your answer>',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;

    if (args[0] && args[0].toLowerCase() === 'answer') {
      const pending = pendingRiddles.get(chatId);
      if (!pending) {
        return await sock.sendMessage(chatId, {
          text: '🤔 No active riddle! Use `.riddle` to get one first.'
        }, { quoted: message });
      }

      const riddle = RIDDLES[pending.index];
      const guess = args.slice(1).join(' ').trim().toLowerCase();
      const correctAnswer = riddle.answer.toLowerCase();

      pendingRiddles.delete(chatId);

      if (guess === correctAnswer || correctAnswer.includes(guess)) {
        return await sock.sendMessage(chatId, {
          text: `🎉 *Correct!* Well done!\n\n✅ The answer is: *${riddle.answer}*`
        }, { quoted: message });
      } else {
        return await sock.sendMessage(chatId, {
          text: `❌ *Wrong answer!*\n\n💡 The correct answer was: *${riddle.answer}*\n\nYour guess: _${args.slice(1).join(' ')}_`
        }, { quoted: message });
      }
    }

    const index = Math.floor(Math.random() * RIDDLES.length);
    const riddle = RIDDLES[index];
    pendingRiddles.set(chatId, { index });

    // Auto-clear pending riddle after timeout
    setTimeout(() => pendingRiddles.delete(chatId), RIDDLE_TIMEOUT_MS);

    await sock.sendMessage(chatId, {
      text: `🧩 *Riddle Time!*\n\n❓ ${riddle.question}\n\n_Reply with_ \`.riddle answer <your answer>\` _to guess!_`
    }, { quoted: message });
  }
};
