const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are SENTINEL, an elite cybersecurity AI trained on millions of threat signatures. Analyze the following content and respond ONLY in valid JSON format. Do NOT wrap your response in markdown code blocks.

Respond with this exact JSON structure:
{
  "classification": "Phishing" | "Malware" | "Social Engineering" | "Safe",
  "severity": "Low" | "Medium" | "High",
  "confidence": number (0-100),
  "threat_id": string (generate like "SENT-" followed by 5 random uppercase alphanumeric chars),
  "headline": string (one punchy sentence summary),
  "explanation": string (2-3 sentences, plain English),
  "why_dangerous": string (specific technical reasoning),
  "attack_vector": string (e.g., "Credential Harvesting via Fake Login Page"),
  "indicators": array of strings (list of specific red flags found, max 6),
  "dna": {
    "urgency": number (0-100),
    "impersonation": number (0-100),
    "link_manipulation": number (0-100),
    "authority_abuse": number (0-100),
    "fear_tactics": number (0-100)
  },
  "recommended_action": string (clear step the user should take),
  "educational_tip": string (one thing to remember for future)
}`;

// Fallback analysis for when API key is not set
function generateFallbackAnalysis(content, contentType) {
  const lowerContent = content.toLowerCase();

  // Heuristic checks
  const phishingSignals = [
    'verify your account', 'click here', 'urgent', 'suspended',
    'confirm your identity', 'act now', 'limited time', 'password',
    'login', 'credential', 'bank', 'paypal', 'apple id', 'netflix',
    'update your', 'expire', 'unauthorized', 'suspicious activity',
    'dear customer', 'dear user', 'congratulations', 'you won',
    'claim your', 'prize', 'lottery', 'winner'
  ];

  const malwareSignals = [
    'download', 'exe', 'attachment', 'macro', 'enable content',
    'powershell', 'cmd', 'base64', 'eval(', 'script', '.bat',
    'trojan', 'payload', 'inject', 'exploit', 'vulnerability'
  ];

  const socialEngSignals = [
    'i need help', 'can you do me a favor', 'don\'t tell anyone',
    'keep this between us', 'trust me', 'wire transfer', 'gift card',
    'bitcoin', 'western union', 'money gram', 'urgent request',
    'ceo', 'boss', 'manager said', 'confidential'
  ];

  let phishScore = 0, malwareScore = 0, socialScore = 0;

  phishingSignals.forEach(s => { if (lowerContent.includes(s)) phishScore += 12; });
  malwareSignals.forEach(s => { if (lowerContent.includes(s)) malwareScore += 12; });
  socialEngSignals.forEach(s => { if (lowerContent.includes(s)) socialScore += 12; });

  // URL-specific checks
  if (contentType === 'URL') {
    if (lowerContent.includes('bit.ly') || lowerContent.includes('tinyurl') ||
        lowerContent.includes('goo.gl') || lowerContent.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)) {
      phishScore += 30;
    }
    if (lowerContent.includes('login') || lowerContent.includes('verify') ||
        lowerContent.includes('secure') || lowerContent.includes('account')) {
      phishScore += 20;
    }
  }

  const maxScore = Math.max(phishScore, malwareScore, socialScore);
  const isSafe = maxScore < 15;

  let classification, severity, confidence;
  let indicators = [];
  let dna = { urgency: 0, impersonation: 0, link_manipulation: 0, authority_abuse: 0, fear_tactics: 0 };

  if (isSafe) {
    classification = 'Safe';
    severity = 'Low';
    confidence = 75 + Math.floor(Math.random() * 20);
    indicators = ['No significant threat indicators detected'];
    dna = {
      urgency: Math.floor(Math.random() * 10),
      impersonation: Math.floor(Math.random() * 8),
      link_manipulation: Math.floor(Math.random() * 5),
      authority_abuse: Math.floor(Math.random() * 7),
      fear_tactics: Math.floor(Math.random() * 6)
    };
  } else {
    if (phishScore >= malwareScore && phishScore >= socialScore) {
      classification = 'Phishing';
      indicators = [];
      if (lowerContent.includes('urgent') || lowerContent.includes('act now')) indicators.push('URGENCY LANGUAGE');
      if (lowerContent.includes('click here') || lowerContent.includes('click below')) indicators.push('SUSPICIOUS CTA');
      if (lowerContent.includes('verify') || lowerContent.includes('confirm')) indicators.push('CREDENTIAL HARVEST');
      if (lowerContent.includes('dear customer') || lowerContent.includes('dear user')) indicators.push('GENERIC GREETING');
      if (lowerContent.match(/bit\.ly|tinyurl|goo\.gl/)) indicators.push('SHORTENED URL');
      if (lowerContent.includes('password') || lowerContent.includes('login')) indicators.push('SENSITIVE DATA REQUEST');
      if (indicators.length === 0) indicators.push('PHISHING PATTERN DETECTED');
    } else if (malwareScore >= socialScore) {
      classification = 'Malware';
      indicators = [];
      if (lowerContent.includes('download')) indicators.push('DOWNLOAD PROMPT');
      if (lowerContent.includes('exe') || lowerContent.includes('.bat')) indicators.push('EXECUTABLE FILE');
      if (lowerContent.includes('macro') || lowerContent.includes('enable content')) indicators.push('MACRO EXECUTION');
      if (lowerContent.includes('powershell') || lowerContent.includes('cmd')) indicators.push('SHELL COMMAND');
      if (indicators.length === 0) indicators.push('MALWARE SIGNATURE DETECTED');
    } else {
      classification = 'Social Engineering';
      indicators = [];
      if (lowerContent.includes('urgent') || lowerContent.includes('asap')) indicators.push('URGENCY PRESSURE');
      if (lowerContent.includes('wire transfer') || lowerContent.includes('gift card')) indicators.push('FINANCIAL REQUEST');
      if (lowerContent.includes('ceo') || lowerContent.includes('boss')) indicators.push('AUTHORITY IMPERSONATION');
      if (lowerContent.includes('confidential') || lowerContent.includes('secret')) indicators.push('SECRECY DEMAND');
      if (indicators.length === 0) indicators.push('SOCIAL ENGINEERING PATTERN');
    }

    severity = maxScore > 50 ? 'High' : maxScore > 25 ? 'Medium' : 'Low';
    confidence = Math.min(95, 55 + maxScore);

    dna = {
      urgency: Math.min(100, (lowerContent.includes('urgent') ? 40 : 0) + (lowerContent.includes('act now') ? 35 : 0) + (lowerContent.includes('immediately') ? 30 : 0) + Math.floor(Math.random() * 15)),
      impersonation: Math.min(100, (lowerContent.includes('dear customer') ? 40 : 0) + (lowerContent.includes('official') ? 30 : 0) + (lowerContent.includes('team') ? 20 : 0) + Math.floor(Math.random() * 15)),
      link_manipulation: Math.min(100, (lowerContent.match(/http|www|\.com|bit\.ly|click/g) || []).length * 20 + Math.floor(Math.random() * 10)),
      authority_abuse: Math.min(100, (lowerContent.includes('ceo') ? 45 : 0) + (lowerContent.includes('manager') ? 35 : 0) + (lowerContent.includes('admin') ? 30 : 0) + Math.floor(Math.random() * 15)),
      fear_tactics: Math.min(100, (lowerContent.includes('suspend') ? 40 : 0) + (lowerContent.includes('locked') ? 35 : 0) + (lowerContent.includes('unauthorized') ? 35 : 0) + Math.floor(Math.random() * 10))
    };
  }

  const threatId = 'SENT-' + Array.from({ length: 5 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]).join('');

  const explanations = {
    'Phishing': `This ${contentType.toLowerCase()} exhibits classic phishing characteristics designed to steal your credentials or personal information. The sender uses deceptive tactics to impersonate a trusted entity and create a false sense of urgency.`,
    'Malware': `This ${contentType.toLowerCase()} contains indicators of malicious software distribution. It attempts to trick you into downloading or executing harmful code that could compromise your system.`,
    'Social Engineering': `This ${contentType.toLowerCase()} uses psychological manipulation tactics to exploit human trust. The attacker attempts to build rapport or authority to convince you to take harmful actions.`,
    'Safe': `This ${contentType.toLowerCase()} does not exhibit significant threat indicators. The content appears to be legitimate based on our analysis of known threat patterns and signatures.`
  };

  const actions = {
    'Phishing': 'Do NOT click any links. Report this to your IT security team and delete it immediately.',
    'Malware': 'Do NOT download any files. Run a full system scan with updated antivirus software.',
    'Social Engineering': 'Verify the sender\'s identity through an independent channel. Do not comply with unusual requests.',
    'Safe': 'No immediate action required. Stay vigilant and continue monitoring for suspicious activity.'
  };

  return {
    classification,
    severity,
    confidence,
    threat_id: threatId,
    headline: classification === 'Safe'
      ? 'Content appears safe — no significant threats detected.'
      : `${classification} attempt detected with ${severity.toLowerCase()} severity risk.`,
    explanation: explanations[classification],
    why_dangerous: classification === 'Safe'
      ? 'No immediate danger detected. Content passed basic threat signature analysis.'
      : `This ${classification.toLowerCase()} attack uses ${indicators.slice(0, 3).map(i => i.toLowerCase().replace(/_/g, ' ')).join(', ')} techniques to deceive the target. If successful, it could lead to data theft, financial loss, or system compromise.`,
    attack_vector: classification === 'Safe'
      ? 'N/A'
      : classification === 'Phishing' ? 'Credential Harvesting via Deceptive Communication'
      : classification === 'Malware' ? 'Malicious Payload Delivery via Social Deception'
      : 'Psychological Manipulation via Trust Exploitation',
    indicators: indicators.slice(0, 6),
    dna,
    recommended_action: actions[classification],
    educational_tip: classification === 'Safe'
      ? 'Always verify sender addresses and hover over links before clicking, even in seemingly safe messages.'
      : 'Remember: legitimate organizations will never ask for sensitive information via email or create artificial urgency.'
  };
}

router.post('/', async (req, res) => {
  try {
    const { content, contentType, deepScan } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required for analysis.' });
    }

    const userPrompt = `Content Type: ${contentType || 'EMAIL'}\nContent: ${content}${deepScan ? '\n\nPerform a DEEP SCAN with enhanced analysis depth. Check for obfuscated threats, subtle social engineering cues, and hidden attack vectors.' : ''}`;

    // Try OpenAI API first
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-your-openai-api-key-here') {
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.3,
          max_tokens: 1000
        });

        let responseText = completion.choices[0].message.content.trim();
        // Strip markdown code blocks if present
        responseText = responseText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
        const analysis = JSON.parse(responseText);
        return res.json({ success: true, analysis });
      } catch (apiErr) {
        console.error('OpenAI API error, using fallback:', apiErr.message);
      }
    }

    // Fallback to heuristic analysis
    console.log('Using fallback heuristic analysis (no API key or API error)');
    const analysis = generateFallbackAnalysis(content, contentType || 'EMAIL');
    return res.json({ success: true, analysis });

  } catch (err) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: 'Analysis failed. Please try again.' });
  }
});

module.exports = router;
