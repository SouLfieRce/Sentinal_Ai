const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are SENTINEL, an expert cybersecurity AI educator and security assistant. You help users understand cybersecurity concepts in clear, jargon-free language.

Rules:
- Give concise, clear answers (2-4 paragraphs max)
- Use analogies for complex topics
- End every answer with one actionable tip prefixed with "💡 Pro Tip:"
- Focus on practical security advice
- Use a professional but approachable tone
- If asked about non-security topics, politely redirect to cybersecurity
- Format responses with clear paragraphs, use **bold** for key terms`;

const FALLBACK_RESPONSES = {
  'what is phishing': `**Phishing** is a type of cyber attack where criminals pretend to be someone you trust — like your bank, boss, or a popular service — to trick you into giving up sensitive information. Think of it like a fisherman casting bait: the attacker sends out convincing-looking emails, texts, or messages hoping someone will "bite."

The most common form is email phishing, where you receive a message that looks legitimate but contains malicious links or asks you to enter your password on a fake website. These attacks work because they exploit human psychology — urgency, fear, and trust.

Modern phishing has evolved beyond simple emails. **Spear phishing** targets specific individuals with personalized messages, while **smishing** uses SMS texts, and **vishing** uses phone calls.

💡 Pro Tip: Always hover over links before clicking to check the actual URL destination. If an email creates urgency or asks for credentials, go directly to the website by typing the address yourself.`,

  'how do i spot a fake url': `Spotting fake URLs is one of the most important cybersecurity skills you can develop. Attackers create URLs that look almost identical to legitimate ones, but with subtle differences designed to fool you.

**Key things to check:**
- **Domain spelling**: Look for misspellings like "amaz0n.com" or "paypa1.com"
- **Subdomain tricks**: "login.bank.evil-site.com" — the real domain here is "evil-site.com"
- **HTTPS isn't enough**: A padlock icon doesn't mean a site is safe, just that the connection is encrypted
- **URL shorteners**: Links from bit.ly or tinyurl can hide malicious destinations

The real domain is always the last part before the first single slash. For example, in "https://secure.accounts.google.com/login", the domain is "google.com" — that's legitimate. But in "https://google.com.evil-site.net/login", the actual domain is "evil-site.net."

💡 Pro Tip: When in doubt, don't click the link. Instead, open your browser and manually type the website address you want to visit.`,

  'what is social engineering': `**Social engineering** is the art of manipulating people into giving up confidential information or performing actions that compromise security. Unlike technical hacking, social engineering attacks the human element — which is often the weakest link in any security system.

Think of it like a con artist's toolkit. Instead of breaking through a locked door (hacking a system), social engineers convince someone to hand over the key. Common techniques include **pretexting** (creating a fake scenario), **baiting** (leaving infected USB drives around), **tailgating** (following someone through a secure door), and **quid pro quo** (offering something in exchange for information).

These attacks are devastatingly effective because they exploit fundamental human traits: our desire to be helpful, our tendency to trust authority figures, and our fear of getting in trouble. Even the most security-aware organizations can fall victim.

💡 Pro Tip: Before sharing any sensitive information or performing unusual requests, verify the person's identity through a separate communication channel — like calling them directly on a known phone number.`,

  'explain malware types': `**Malware** (malicious software) is an umbrella term for any software designed to harm your computer, steal your data, or gain unauthorized access. Here are the main types:

**🦠 Viruses** attach themselves to legitimate programs and spread when you run the infected file. **🐛 Worms** spread automatically across networks without needing you to do anything. **🐴 Trojans** disguise themselves as legitimate software to trick you into installing them. **🔐 Ransomware** encrypts your files and demands payment for the decryption key. **👻 Spyware** secretly monitors your activity and steals information. **📢 Adware** bombards you with unwanted advertisements and can track browsing habits.

The most dangerous modern threats combine multiple types. For example, a trojan might install ransomware, or a worm might carry spyware. **Rootkits** are particularly nasty because they hide deep in your operating system, making them extremely difficult to detect and remove.

💡 Pro Tip: Keep your operating system and all software updated, use reputable antivirus software, and never download programs from untrusted sources. Most malware needs you to do something to get in — don't give it that chance.`,

  'why is urgency used in scams': `**Urgency is the #1 weapon in a scammer's arsenal** because it bypasses your critical thinking. When you feel pressured to act immediately, your brain switches from careful analysis mode to reactive mode — exactly what attackers want.

Psychologists call this the "fight-or-flight" response. Phrases like "Your account will be closed in 24 hours!" or "Act now or lose access!" trigger stress hormones that make you more likely to click without thinking. Scammers know that if you take even 5 minutes to think about their message, you'll probably realize it's fake.

This technique works across all types of scams: phishing emails claiming your account is compromised, tech support calls saying your computer has a virus, or messages claiming you've won a prize that expires soon. The common thread is always: **"You MUST act RIGHT NOW."**

Legitimate organizations understand that important decisions shouldn't be rushed. Your bank will never demand you click a link within minutes, and the IRS will never call threatening immediate arrest.

💡 Pro Tip: Make it a personal rule — the more urgent a message feels, the slower you should respond. Take a breath, verify independently, and remember: if it were truly urgent, they'd contact you through multiple verified channels.`,

  'how to protect my email': `**Email is the #1 attack vector for cybercriminals**, so protecting it is crucial for your overall security. Here's a comprehensive defense strategy:

**🔐 Authentication:**
- Use a **strong, unique password** (at least 16 characters with mixed types)
- Enable **two-factor authentication (2FA)** — preferably with an authenticator app, not SMS
- Never reuse your email password anywhere else

**🛡️ Defense habits:**
- **Don't click links** in unexpected emails — go directly to the website instead
- **Check sender addresses** carefully for subtle misspellings
- **Be suspicious of attachments** you weren't expecting, even from known contacts
- **Use the "report phishing" button** in your email client when you spot threats

**🏗️ Infrastructure:**
- Keep your email app and browser **updated** to the latest version
- Use your email provider's **built-in security features** (Gmail's Advanced Protection, Outlook's Safe Links)
- Consider using **email aliases** for different services to limit exposure

💡 Pro Tip: Set up login alerts for your email account so you're immediately notified of any access from unfamiliar devices or locations. This gives you an early warning system if your account is ever compromised.`
};

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    // Try OpenAI API
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-your-openai-api-key-here') {
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 600
        });

        return res.json({
          success: true,
          response: completion.choices[0].message.content.trim()
        });
      } catch (apiErr) {
        console.error('OpenAI Chat API error, using fallback:', apiErr.message);
      }
    }

    // Fallback responses
    const lowerMsg = message.toLowerCase().trim();
    let response = null;

    for (const [key, value] of Object.entries(FALLBACK_RESPONSES)) {
      if (lowerMsg.includes(key) || key.split(' ').every(word => lowerMsg.includes(word))) {
        response = value;
        break;
      }
    }

    if (!response) {
      // Generic cybersecurity response
      response = `That's a great question about cybersecurity! While I'm currently running in offline mode without full AI capabilities, I can tell you that staying informed about security threats is one of the most important things you can do.

**Key security principles to always remember:**
- **Verify before you trust** — always confirm identities through independent channels
- **Think before you click** — hover over links and check URLs carefully
- **Keep everything updated** — software updates patch known vulnerabilities
- **Use strong, unique passwords** — consider a password manager
- **Enable two-factor authentication** — adds a critical extra layer of protection

For a more detailed analysis of your specific question, please ensure the SENTINEL AI backend is connected to an AI provider.

💡 Pro Tip: Make cybersecurity awareness a daily habit, not just a one-time training. The threat landscape changes constantly, and staying informed is your best defense.`;
    }

    return res.json({ success: true, response });

  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Chat failed. Please try again.' });
  }
});

module.exports = router;
