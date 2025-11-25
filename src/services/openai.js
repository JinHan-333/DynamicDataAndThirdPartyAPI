// OpenAI Chat Service
// Calls serverless function at /api/openai
// API key is protected on server-side

// Use environment variable for production backend URL, or relative path for development
const BACKEND_BASE = import.meta.env.VITE_BACKEND_URL || '';

/**
 * Send a chat message to OpenAI
 * @param {Array} messages - Array of message objects [{role: 'user'|'assistant'|'system', content: string}]
 * @param {string} model - Model to use (default: 'gpt-3.5-turbo')
 * @returns {Promise<Object>} Chat completion response
 */
export const sendChatMessage = async (messages, model = 'gpt-3.5-turbo') => {
  const response = await fetch(`${BACKEND_BASE}/api/openai`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      stream: false
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get response from OpenAI');
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
  const response = await fetch(`${BACKEND_BASE}/api/openai`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get response from OpenAI');
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
