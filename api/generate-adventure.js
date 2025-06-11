const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const response = await openai.createChatCompletion({
      model: "gpt-4o", // or your choice
      messages: [
        { role: "system", content: "You are a helpful D&D adventure generator." },
        { role: "user", content: prompt },
      ],
      max_tokens: 1000,
      temperature: 0.8,
    });

    return res.status(200).json({ result: response.data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
