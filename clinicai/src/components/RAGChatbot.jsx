import React, { useState } from 'react';

export default function RAGChatbot({ patientId }) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { role: 'system', content: `Hello, I can answer questions about the medical history of patient ${patientId || 'N/A'}.` }
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setMessages([...messages, { role: 'user', content: query }]);
    setQuery('');
    
    // Simulate thinking
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'system', 
        content: `MOCK RESPONSE: Based on records from March 2026, the patient was prescribed Pantoprazole for indigestion. No other major contraindications found.` 
      }]);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-indigo-100 flex flex-col h-[600px]">
      <div className="p-4 border-b border-indigo-50 bg-indigo-600 rounded-t-xl">
        <h3 className="text-white font-bold flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Clinical Assistant (RAG)
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-indigo-50 text-indigo-900 rounded-tl-none border border-indigo-100 shadow-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSend} className="p-4 border-t border-indigo-50">
        <div className="flex space-x-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about patient history..."
            className="flex-1 bg-gray-50 border border-indigo-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <button 
            type="submit"
            className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
