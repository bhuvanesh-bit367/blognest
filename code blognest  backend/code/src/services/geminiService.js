const { GoogleGenerativeAI } = require('@google/generative-ai');

const callGemini = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API key is not configured');
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  // Try models one by one
  const models = [
    process.env.GEMINI_MODEL || 'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-flash-latest'
  ];

  let lastError;

  for (const modelName of models) {
    try {
      console.log(`Trying Gemini model: ${modelName}`);

      const model = genAI.getGenerativeModel({
        model: modelName
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (text) {
        console.log(`Gemini success: ${modelName}`);
        return text;
      }

    } catch (error) {
      lastError = error;
      console.log(`Gemini failed: ${modelName}`);
      console.log(error.message);
    }
  }

  throw lastError || new Error('All Gemini models failed');
};

module.exports = {
  callGemini,
};