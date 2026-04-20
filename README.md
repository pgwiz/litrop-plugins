# litrop-plugins

A collection of community plugins for the [pgwiz-md-litrop](https://github.com/pgwiz/pgwiz-md-litrop) WhatsApp bot (**MEGA-MD**).

---

## 📦 Installation

Copy any `.js` file from the `plugins/` folder into the `plugins/` directory of your `pgwiz-md-litrop` bot installation. The bot hot-reloads plugins automatically — no restart needed.

```bash
# Example: copy all plugins at once
cp plugins/*.js /path/to/pgwiz-md-litrop/plugins/
```

---

## 🧩 Available Plugins

| Plugin | Command | Aliases | Category | Description |
|--------|---------|---------|----------|-------------|
| `calculator.js` | `.calc` | `calculate`, `math` | utility | Evaluate a mathematical expression |
| `coinflip.js` | `.coinflip` | `flip`, `coin`, `toss` | fun | Flip a coin — Heads or Tails |
| `dice.js` | `.dice` | `roll`, `rolldice` | fun | Roll a dice (customisable sides) |
| `horoscope.js` | `.horoscope` | `horo`, `zodiac`, `star` | fun | Get your daily horoscope |
| `morse.js` | `.morse` | `morsecode` | utility | Encode/decode Morse code |
| `numberfact.js` | `.numberfact` | `numfact`, `nfact` | fun | Interesting facts about any number |
| `password.js` | `.password` | `genpass`, `passgen`, `pw` | utility | Generate a secure random password |
| `riddle.js` | `.riddle` | `brain`, `puzzle` | fun | Random riddles with answer guessing |
| `timezone.js` | `.timezone` | `time`, `tz`, `clock` | utility | Show the current time in any timezone |
| `wordcount.js` | `.wordcount` | `wc`, `count`, `charcount` | utility | Count words, characters, sentences in text |

---

## 📖 Plugin Details

### 🔢 calculator.js
Evaluates mathematical expressions safely. Supports `+`, `-`, `*`, `/`, `%`, `^` (power), and parentheses.

```
.calc 2 + 2 * 5
.calc (100 - 30) / 7
.calc 2^10
```

---

### 🪙 coinflip.js
Flips a virtual coin and returns Heads or Tails.

```
.coinflip
.flip
.toss
```

---

### 🎲 dice.js
Rolls a standard 6-sided die by default. Specify the number of sides for custom dice.

```
.dice         → rolls a d6
.dice 20      → rolls a d20
.roll 100
```

---

### ✨ horoscope.js
Fetches today's horoscope for any zodiac sign.

```
.horoscope aries
.horo leo
.zodiac scorpio
```

---

### 📡 morse.js
Encodes plain text to Morse code or decodes Morse code back to text.

```
.morse encode Hello World
.morse decode .... . .-.. .-.. --- / .-- --- .-. .-.. -..
```

---

### 🔢 numberfact.js
Fetches interesting trivia about any number (uses the Numbers API). Omit the number for a random fact.

```
.numberfact 42
.numberfact 7
.numberfact          ← random fact
```

---

### 🔐 password.js
Generates a secure random password. You can configure the length and character types.

```
.password              → 16-char password (default)
.password 24           → 24-char password
.password 20 --no-symbols
.password 12 --no-upper --no-symbols
```

**Flags:** `--no-symbols`, `--no-upper`, `--no-lower`, `--no-digits`

---

### 🧩 riddle.js
Sends a random riddle. Reply with `.riddle answer <your answer>` to check your answer.

```
.riddle                          ← get a riddle
.riddle answer footsteps         ← submit your answer
```

---

### 🌍 timezone.js
Shows the current date and time in any IANA timezone or common city name.

```
.timezone Africa/Nairobi
.timezone America/New_York
.timezone London
.timezone Tokyo
.timezone UTC
```

---

### 📊 wordcount.js
Analyses text and reports word count, character count, sentence count, paragraphs, lines, and estimated reading time. Works on typed text or a quoted/replied message.

```
.wordcount Hello World, this is a sample text.
.wc                 ← reply to any message
```

---

## 🛠️ Plugin Development

See the [PLUGIN_GUIDE.md](https://github.com/pgwiz/pgwiz-md-litrop/blob/main/PLUGIN_GUIDE.md) in the main bot repository for the full plugin development guide.

### Minimal Plugin Template

```javascript
module.exports = {
  command: 'hello',
  aliases: ['hi'],
  category: 'general',
  description: 'Sends a greeting',
  usage: '.hello',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    await sock.sendMessage(chatId, { text: 'Hello World! 👋' }, { quoted: message });
  }
};
```

---

## 🤝 Contributing

Pull requests are welcome! Please follow the existing plugin structure and test your plugin before submitting.

---

## 📜 License

MIT © [pgwiz](https://github.com/pgwiz)