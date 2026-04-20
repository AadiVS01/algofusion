import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, AlertCircle, Bot, User } from 'lucide-react';
import { queryRAG } from '../services/gemini';

export default function RAGChatbot({ patientId }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello, I'm your Clinical Assistant. I have analyzed **${patientId}'s** records. How can I help you today?`
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
    }
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const answer = await queryRAG(patientId, inputValue);
      setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'error', 
        content: "I encountered an issue connecting to the clinical records. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="sarvam-card p-0 flex flex-col h-full min-h-[600px] overflow-hidden">
      {/* Chat Header */}
      <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#131313]">Clinical Insights Agent</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">Status: Ready</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#FAFAFA]/50"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-all duration-300
              ${msg.role === 'user' ? 'bg-[#131313] text-white' : (msg.role === 'error' ? 'bg-red-100 text-red-600' : 'bg-white border border-slate-100')}`}>
              {msg.role === 'user' ? <User className="w-6 h-6" /> : (msg.role === 'error' ? <AlertCircle className="w-6 h-6" /> : <Bot className="w-6 h-6 text-indigo-600" />)}
            </div>
            
            <div className={`p-6 rounded-[2.5rem] max-w-[85%] text-lg leading-relaxed shadow-sm transition-all duration-300
              ${msg.role === 'user' 
                ? 'bg-[#131313] text-white rounded-tr-none' 
                : (msg.role === 'error' 
                  ? 'bg-red-50 border border-red-100 text-red-800' 
                  : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none')}`}>
              <span dangerouslySetInnerHTML={{ __html: (msg.content || '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-4 bg-white/40 border border-slate-50 rounded-2xl w-fit">
            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150"></span>
            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-300"></span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-6 bg-white border-t border-slate-50">
        <div className="relative flex items-center">
          <input 
            className="w-full bg-slate-50 border border-slate-100 text-[#131313] px-6 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:bg-white transition-all placeholder-slate-300 pr-16" 
            placeholder="Ask about patient's history..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            autoComplete="off"
          />
          <button 
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="absolute right-2 bg-[#131313] hover:bg-black disabled:bg-slate-200 text-white p-3 rounded-xl transition-all shadow-md active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-slate-300 mt-4 text-center font-bold uppercase tracking-tighter">
           AI answers may vary. Check records before acting.
        </p>
      </form>
    </section>
  );
}
