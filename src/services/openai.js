// OpenAI Chat Service
// API Documentation: https://platform.openai.com/docs/api-reference
// Requires API key (configured in .env as VITE_OPENAI_API_KEY)
// Implementation in Phase 7

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

/**
 * Send a chat message to OpenAI
 * @param {Array} messages - Array of message objects [{role: 'user'|'assistant'|'system', content: string}]
 * @param {string} model - Model to use (default: 'gpt-3.5-turbo')
 * @returns {Promise<Object>} Chat completion response
 */
export const sendChatMessage = async (messages, model = 'gpt-3.5-turbo') => {
  if (!API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 500
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to get response from OpenAI');
  }

  const data = await response.json();
  return data.choices[0].message;
};

/**
 * Create a streaming chat completion
 * @param {Array} messages - Array of message objects
 * @param {Function} onChunk - Callback for each chunk of the response
 * @param {string} model - Model to use (default: 'gpt-3.5-turbo')
 * @returns {Promise<void>}
 */
export const streamChatMessage = async (messages, onChunk, model = 'gpt-3.5-turbo') => {
  if (!API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 500,
      stream: true
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to get response from OpenAI');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter(line => line.trim() !== '');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') return;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices[0]?.delta?.content;
          if (content) {
            onChunk(content);
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }
  }
};
