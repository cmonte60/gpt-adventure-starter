const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const { prompt } = req.body;

  try {
    const completion = await openai.createCompletion({
      model: 'gpt-3.5-turbo-instruct',
      prompt,
      max_tokens: 800,
    });

    res.status(200).json({ result: completion.data.choices[0].text.trim() });
  } catch (error) {
    console.error(error.response || error.message || error);
    res.status(500).json({ error: 'Failed to generate adventure.' });
  }
};
