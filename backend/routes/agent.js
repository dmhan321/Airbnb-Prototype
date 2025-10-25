// backend/routes/agent.js
const express = require('express');
const router = express.Router();
const OpenAI = require('openai'); 
require('dotenv').config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // must be set in your .env
});

// POST /api/agent
router.post('/', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Query is required',
      });
    }

    // Send the user query to OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4', // or 'gpt-3.5-turbo' if GPT-4 is not available
      messages: [
        {
          role: 'system',
          content:
            'You are a friendly and knowledgeable AI travel concierge. You help users plan trips, suggest destinations, and answer questions clearly and warmly.',
        },
        { role: 'user', content: query },
      ],
      temperature: 0.7,
    });

    // Extract the AI’s message
    const reply = completion.choices[0]?.message?.content?.trim() || 'No response from AI.';

    // Return result to frontend
    res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error('OpenAI API error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to get response from OpenAI',
      error: error.message || 'Unknown error',
    });
  }
});

module.exports = router;