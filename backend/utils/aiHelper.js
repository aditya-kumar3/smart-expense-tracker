// backend/utils/aiHelper.js
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateAIInsight(prompt) {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a friendly personal finance coach for Indian users. Use short sentences, emojis and practical tips.",
        },
        { role: "user", content: prompt },
      ],
    });

    return response.choices[0].message.content;
  } catch (err) {
    console.error("OpenAI error:", err);
    throw err;
  }
}

module.exports = generateAIInsight;
