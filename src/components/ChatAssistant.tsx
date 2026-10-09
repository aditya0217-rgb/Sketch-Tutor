import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  RefreshCw,
  Trash2,
  AlertCircle,
  Pencil,
  Bot,
  User,
  ChevronDown,
} from 'lucide-react';
import { DrawingGuide } from '../types';
import { LANGUAGE_OPTIONS } from '../data/languages';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  failed?: boolean;
}

interface ChatAssistantProps {
  currentGuide: DrawingGuide | null;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}

const DEFAULT_PROMPTS: Record<string, string[]> = {
  hinglish: [
    'Pencil ko kaise hold karein?',
    'Shading smooth kaise karein?',
    'Proportions theek kaise measure karein?',
    'Guidelines erase karte waqt paper kharab na ho?',
  ],
  en: [
    'How should I hold the pencil for light lines?',
    'Tips for smooth gradient shading?',
    'How do I measure proportions accurately?',
    'What eraser is best for sketch guidelines?',
  ],
  hi: [
    'पेंसिल की पकड़ कैसी होनी चाहिए?',
    'स्मूथ शेडिंग कैसे करें?',
    'आकार का अनुपात (प्रपोर्शन) कैसे मापें?',
  ],
  gu: [
    'પેન્સિલ કેવી રીતે પકડવી?',
    'સરળ શેડિંગ માટે ટિપ્સ આપો?',
  ],
};

export const ChatAssistant: React.FC<ChatAssistantProps> = ({
  currentGuide,
  selectedLanguage,
  onLanguageChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // Initial welcome message
    const initialGreeting =
      selectedLanguage === 'hinglish'
        ? 'Hi! Main hoon aapka Sketch Assistant. Drawing mein kahan help chahiye? Pencils, shading, ya proportions ke baare mein kuch bhi pucho!'
        : selectedLanguage === 'hi'
        ? 'नमस्ते! मैं आपका स्केच असिस्टेंट हूँ। ड्राइंग, शेडिंग या प्रोपोर्शन से जुड़ा कोई भी सवाल पूछें!'
        : selectedLanguage === 'gu'
        ? 'નમસ્તે! હું તમારો સ્કેચ આસિસ્ટન્ટ છું. ચિત્રકામ માટે કંઈ પણ પૂછો!'
        : 'Hello! I am your Sketch Assistant. Ask me anything about pencil grip, line weight, shading, or fixing your proportions!';

    return [
      {
        id: 'initial',
        role: 'model',
        content: initialGreeting,
        timestamp: Date.now(),
      },
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  // Update initial greeting when language changes if no conversation started
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === 'initial') {
      const greeting =
        selectedLanguage === 'hinglish'
          ? 'Hi! Main hoon aapka Sketch Assistant. Drawing mein kahan help chahiye? Pencils, shading, ya proportions ke baare mein kuch bhi pucho!'
          : selectedLanguage === 'hi'
          ? 'नमस्ते! मैं आपका स्केच असिस्टेंट हूँ। ड्राइंग, शेडिंग या प्रोपोर्शन से जुड़ा कोई भी सवाल पूछें!'
          : selectedLanguage === 'gu'
          ? 'નમસ્તે! હું તમારો સ્કેચ આસિસ્ટન્ટ છું. ચિત્રકામ માટે કંઈ પણ પૂછો!'
          : 'Hello! I am your Sketch Assistant. Ask me anything about pencil grip, line weight, shading, or fixing your proportions!';

      setMessages([
        {
          id: 'initial',
          role: 'model',
          content: greeting,
          timestamp: Date.now(),
        },
      ]);
    }
  }, [selectedLanguage]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isSending) return;

    const userMsgId = 'user-' + Date.now();
    const newUserMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsSending(true);

    try {
      // Send last messages to backend for multi-turn context
      const payloadMessages = updatedMessages
        .filter((m) => !m.failed)
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages,
          language: selectedLanguage,
          currentGuideContext: currentGuide
            ? {
                subjectName: currentGuide.subjectName,
                summary: currentGuide.summary,
                difficulty: currentGuide.difficulty,
                lightSourceDirection: currentGuide.lightSourceDirection,
                proportionsTip: currentGuide.proportionsTip,
              }
            : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to get reply.');
      }

      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        role: 'model',
        content: data.reply,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: 'bot-err-' + Date.now(),
        role: 'model',
        content:
          err.message ||
          (selectedLanguage === 'hinglish'
            ? 'Sorry, network issue ki wajah se reply nahi mil saka. Ek baar phir try karein.'
            : 'Sorry, I could not generate a response. Please try again.'),
        timestamp: Date.now(),
        failed: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    const greeting =
      selectedLanguage === 'hinglish'
        ? 'Chat reset ho gayi hai. Koi naya question pucho!'
        : 'Chat reset. Feel free to ask a new drawing question!';

    setMessages([
      {
        id: 'initial-' + Date.now(),
        role: 'model',
        content: greeting,
        timestamp: Date.now(),
      },
    ]);
  };

  const activePrompts =
    DEFAULT_PROMPTS[selectedLanguage] || DEFAULT_PROMPTS.en || [];

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-40">
        {!isOpen ? (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open Sketch Assistant Chat"
            className="group flex items-center gap-2 pl-3.5 pr-4 py-2.5 rounded-full bg-neutral-900 text-white shadow-lg hover:bg-neutral-800 active:scale-95 transition-all border border-neutral-700"
          >
            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
              <MessageSquare className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-semibold tracking-wide">
              Ask AI
            </span>
            {currentGuide && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Aware of current drawing" />
            )}
          </button>
        ) : null}
      </div>

      {/* Floating Chat Panel Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50 w-[calc(100vw-2rem)] sm:w-[380px] max-w-[400px] h-[520px] max-h-[82vh] bg-white rounded-xl shadow-2xl border border-neutral-300 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="px-4 py-3 bg-neutral-900 text-white flex items-center justify-between border-b border-neutral-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                <Pencil className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-semibold tracking-tight text-white leading-none">
                  Sketch Assistant
                </h3>
                <p className="text-[10px] text-neutral-400 mt-0.5 leading-none">
                  {currentGuide ? `Context: ${currentGuide.subjectName}` : 'Friendly Art Tutor'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearChat}
                title="Clear conversation"
                className="p-1 rounded text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1 rounded text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Context & Language Strip */}
          <div className="px-3 py-1.5 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between text-[11px] text-neutral-600 shrink-0">
            <span className="truncate max-w-[170px]">
              Lang:{' '}
              <strong className="text-neutral-800">
                {LANGUAGE_OPTIONS.find((l) => l.code === selectedLanguage)?.name || 'Hinglish'}
              </strong>
            </span>
            <select
              value={selectedLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="text-[10px] bg-white border border-neutral-200 rounded px-1.5 py-0.5 text-neutral-700 cursor-pointer focus:outline-hidden"
            >
              {LANGUAGE_OPTIONS.slice(0, 4).map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-white text-xs">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-6 h-6 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] px-3 py-2 rounded-lg leading-relaxed text-xs ${
                      isUser
                        ? 'bg-neutral-900 text-white rounded-br-2xs'
                        : msg.failed
                        ? 'bg-neutral-100 text-neutral-800 border border-neutral-300 rounded-bl-2xs'
                        : 'bg-neutral-100 text-neutral-900 rounded-bl-2xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              );
            })}

            {isSending && (
              <div className="flex gap-2 justify-start">
                <div className="w-6 h-6 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-neutral-100 text-neutral-600 px-3 py-2 rounded-lg text-xs flex items-center gap-1.5">
                  <RefreshCw className="w-3 h-3 animate-spin text-neutral-600" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggested Question Chips */}
          {messages.length <= 3 && !isSending && (
            <div className="px-3 py-2 bg-neutral-50/80 border-t border-neutral-200 shrink-0">
              <span className="text-[10px] font-medium text-neutral-500 block mb-1">
                Suggested questions:
              </span>
              <div className="flex flex-wrap gap-1">
                {activePrompts.slice(0, 3).map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(prompt)}
                    className="text-[10px] text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-md px-2 py-1 transition-colors text-left truncate max-w-full"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Box Footer */}
          <div className="p-2.5 bg-white border-t border-neutral-200 shrink-0">
            <div className="flex items-center gap-1.5">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  selectedLanguage === 'hinglish'
                    ? 'Pucho kuch bhi (e.g. shading kaise karein)...'
                    : 'Ask drawing tutor anything...'
                }
                disabled={isSending}
                className="flex-1 text-xs bg-neutral-50 border border-neutral-300 rounded-md px-3 py-2 text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-900 transition-colors"
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isSending}
                className="p-2 rounded-md bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
