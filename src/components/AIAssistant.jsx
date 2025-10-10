import { useState } from 'react'
import { sendChatMessage } from '../services/openai'

function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: 'system',
      content: 'You are a helpful cocktail expert assistant. Provide recommendations, ingredient substitutions, and mixing tips. Keep responses concise and friendly.'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = { role: 'user', content: input }
    const newMessages = [...messages, userMessage]

    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const assistantMessage = await sendChatMessage(newMessages)
      setMessages([...newMessages, assistantMessage])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const visibleMessages = messages.filter(msg => msg.role !== 'system')

  const quickQuestions = [
    "How to make Mojito less sweet?",
    "How to make Margarita?",
    "Daiquiri vs Margarita?",
    "How to make an Old Fashioned?",
    "How to muddle mint?",
    "Best cocktails for party?"
  ]

  const handleQuickQuestion = (question) => {
    setInput(question)
  }

  const hasConversation = visibleMessages.length > 0

  return (
    <div
      className="min-h-[80vh] bg-black text-white flex flex-col px-4 py-12 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(/images/background-2.png)' }}
    >
      <div className="max-w-6xl w-full mx-auto flex-1 flex flex-col">
        {/* Header - Only show when no conversation */}
        {!hasConversation && (
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-5xl font-bold mb-8 flex items-center justify-center gap-4">
              <span>Ask our AI ASSISTANT ABOUT Cocktail</span>
            </h2>
          </div>
        )}

        {/* Chat History */}
        {hasConversation && (
          <div className="flex-1 mb-8 overflow-y-auto px-4">
            <div className="space-y-6 max-w-4xl mx-auto">
              {visibleMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`${
                      msg.role === 'user'
                        ? 'bg-white text-black ml-auto rounded-3xl rounded-tr-md'
                        : 'bg-white text-black mr-auto rounded-3xl rounded-tl-md'
                    } px-8 py-6 max-w-[70%]`}
                  >
                    <div className="text-lg whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white text-black mr-auto rounded-3xl rounded-tl-md px-8 py-6 max-w-[70%]">
                    <div className="text-gray-500">Thinking...</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Questions - Only show when no conversation */}
        {!hasConversation && (
          <div className="border-2 border-white rounded-3xl p-12 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {quickQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuestion(question)}
                  className="border-2 border-gray-400 rounded-full px-8 py-4 text-gray-300 hover:border-white hover:text-white transition text-center text-lg"
                >
                  {question}
                </button>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* Input Area */}
            <div className="flex items-center bg-white rounded-full px-6 py-4 shadow-lg">
              <input
                type="text"
                placeholder="Ask questions about cocktail"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className="flex-1 bg-transparent text-black placeholder-gray-400 focus:outline-none disabled:opacity-50 text-lg"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="ml-4 bg-gray-300 text-gray-600 rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-400 hover:text-gray-800 disabled:bg-gray-200 disabled:cursor-not-allowed transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Conversation Mode - Error and Input */}
        {hasConversation && (
          <>
            {/* Error Message */}
            {error && (
              <div className="bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded-lg mb-6 max-w-4xl mx-auto w-full">
                {error}
              </div>
            )}

            {/* Input Area - Always at bottom */}
            <div className="max-w-4xl mx-auto w-full">
              <div className="flex items-center bg-white rounded-full px-6 py-4 shadow-lg">
                <input
                  type="text"
                  placeholder="Ask questions about cocktail"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  className="flex-1 bg-transparent text-black placeholder-gray-400 focus:outline-none disabled:opacity-50 text-lg"
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="ml-4 bg-gray-300 text-gray-600 rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-400 hover:text-gray-800 disabled:bg-gray-200 disabled:cursor-not-allowed transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AIAssistant
