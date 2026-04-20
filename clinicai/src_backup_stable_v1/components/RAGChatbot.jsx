import React, { useState, useEffect } from 'react';
import useVoiceRecorder from '@/hooks/useVoiceRecorder';

export default function RAGChatbot({ patientId }) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'system', content: `Hello, I can answer questions about the medical history of patient ${patientId || 'N/A'}.` }
  ]);

  const { isRecording, transcript, startRecording, stopRecording } = useVoiceRecorder();

  // Sync voice transcript to input
  useEffect(() => {
    if (transcript) setQuery(transcript);
  }, [transcript]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    const userMessage = query.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setQuery('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId: patientId || 'P12345', question: userMessage })
      });
      
      const data = await response.json();
      setMessages(prev => [...prev, { 
        role: 'system', 
        content: data.answer || "I couldn't find specific information on that." 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'system', content: "Error connecting to clinical brain." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col h-full max-h-[650px] overflow-hidden">
      {/* Premium Header */}
      <div className="p-5 bg-gradient-to-r from-indigo-700 to-indigo-600 flex justify-between items-center shadow-md">
        <h3 className="text-white font-bold flex items-center text-sm tracking-tight">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
          Clinical Brain Assistant
        </h3>
        {isLoading && (
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        )}
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gray-50/30">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[88%] p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
              </div>
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest">Consulting Medical Wisdom...</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSend} className="flex items-center space-x-3">
          <button 
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-3 rounded-xl transition-all shadow-sm ${
              isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
            title={isRecording ? "Stop Voice Input" : "Start Voice Input"}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isRecording ? "Listening to your query..." : "Ask history or clinical guidelines..."}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-gray-400 shadow-inner"
            />
          </div>
          
          <button 
            type="submit"
            disabled={isLoading || !query.trim()}
            className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
        {isRecording && (
          <p className="mt-2 text-center text-[10px] font-bold text-red-500 uppercase tracking-tighter animate-pulse">
            Recording Active • Speak clearly
          </p>
        )}
      </div>
    </div>
  );
}
