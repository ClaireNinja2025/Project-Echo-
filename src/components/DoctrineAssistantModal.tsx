import React, { useState } from 'react';
import { 
  BookOpen, 
  Send, 
  Sparkles, 
  Loader2, 
  ExternalLink, 
  ShieldCheck, 
  HelpCircle,
  FileCheck,
  Bookmark
} from 'lucide-react';

interface DoctrineAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  citations?: string[];
  authoritiesNote?: string;
}

export const DoctrineAssistantModal: React.FC<DoctrineAssistantModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'crosswalk'>('chat');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'assistant',
      text: 'Greetings. I am the CIO-KE Doctrinal & Decision Support Assistant, grounded in US Joint & Army doctrine (JP 3-57, ADP 3-13, ATP 3-57.50, JP 3-04, FM 3-57, FM 3-53). How can I assist your Civil Knowledge Integration or operational planning?',
      citations: [
        'JP 3-57: Civil-Military Operations',
        'ADP 3-13: Information (27 Nov 2023)',
        'ATP 3-57.50: Civil Knowledge Integration (16 Oct 2024)',
      ],
      authoritiesNote: 'Strictly unclassified civil context and staff advisory guidance.',
    },
  ]);

  const quickPrompts = [
    'Explain the 5 Army Information Activities under ADP 3-13',
    'How does CKI differ from intelligence collection under ATP 3-57.50?',
    'What are the statutory firewalls between Public Affairs and MISO?',
    'Explain legacy IRC vs. Joint Operations in the Information Environment (OIE)',
    'How does CIO safeguard US Person privacy under DoD Directive 5240.01?',
  ];

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = { sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/doctrine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSend }),
      });

      const data = await res.json();
      const aiMsg: ChatMessage = {
        sender: 'assistant',
        text: data.answer || 'No doctrine response returned.',
        citations: data.citations || ['JP 3-57', 'ADP 3-13'],
        authoritiesNote: data.authoritiesNote || 'Staff verification required.',
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Error consulting doctrine server. Check server connection or refer directly to JP 3-57 / ADP 3-13 in the Crosswalk tab.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Grounded AI Doctrine & Reference Assistant
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  gemini-3.8-flash
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Grounded in JP 3-57, ADP 3-13, ATP 3-57.50, and DoD Directive 5240.01
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Interactive Query
            </button>
            <button
              onClick={() => setActiveTab('crosswalk')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeTab === 'crosswalk'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Doctrinal Crosswalk
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 text-base ml-2"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Body */}
        {activeTab === 'chat' ? (
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
            {/* Quick Prompt Carousel */}
            <div className="p-3 bg-slate-900/60 border-b border-slate-800/80 flex items-center space-x-2 overflow-x-auto scrollbar-none text-xs">
              <span className="text-slate-500 font-mono text-[10px] uppercase shrink-0">Prompts:</span>
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap text-[11px] border border-slate-700/80 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed space-y-2 ${
                        isUser
                          ? 'bg-emerald-600 text-white rounded-br-none shadow-md font-sans'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {msg.citations && msg.citations.length > 0 && (
                        <div className="pt-2 border-t border-slate-800 text-[10px] space-y-1 font-mono text-emerald-400">
                          <span className="font-semibold block text-slate-400">DOCTRINAL CITATIONS:</span>
                          <ul className="list-disc list-inside">
                            {msg.citations.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {msg.authoritiesNote && (
                        <div className="text-[10px] font-mono text-slate-400 italic">
                          Notice: {msg.authoritiesNote}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-center space-x-2 text-slate-400 text-xs p-3 bg-slate-900 rounded-lg max-w-xs border border-slate-800">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>Consulting military doctrinal corpus...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2">
              <input
                type="text"
                value={query}
                placeholder="Ask about ADP 3-13, JP 3-57, CKI processes, or operational authorities..."
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend(query);
                }}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => handleSend(query)}
                disabled={isLoading || !query.trim()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit</span>
              </button>
            </div>
          </div>
        ) : (
          /* Crosswalk & Doctrinal Reference Tab */
          <div className="flex-1 overflow-y-auto p-5 bg-slate-950 text-xs space-y-5">
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-2">
                Appendix A: Joint & Army Doctrine Reference Matrix
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono divide-y divide-slate-800 border border-slate-800 rounded-lg">
                  <thead className="bg-slate-900 text-slate-400 text-[10px]">
                    <tr>
                      <th className="p-2.5">PUBLICATION</th>
                      <th className="p-2.5">TITLE & DATE</th>
                      <th className="p-2.5">APPLICATION TO CIO-KE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300 text-[11px]">
                    <tr>
                      <td className="p-2.5 font-bold text-emerald-400">JP 3-57</td>
                      <td className="p-2.5">Civil-Military Operations</td>
                      <td className="p-2.5">Core joint CMO framework; civil information management (CIM); civil component integration.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-emerald-400">ADP 3-13</td>
                      <td className="p-2.5">Information (27 Nov 2023)</td>
                      <td className="p-2.5">Army information advantage framework; 5 activities: Enable, Protect, Inform, Influence, Attack.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-emerald-400">ATP 3-57.50</td>
                      <td className="p-2.5">Civil Knowledge Integration (16 Oct 2024)</td>
                      <td className="p-2.5">Civil information collection, processing, analysis, production, and integration into MDMP.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-emerald-400">JP 3-04</td>
                      <td className="p-2.5">Information in Joint Operations (14 Sep 2022)</td>
                      <td className="p-2.5">Information as a joint function; transition from legacy IO to Operations in Information Environment (OIE).</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-emerald-400">FM 3-53</td>
                      <td className="p-2.5">Military Information Support Operations</td>
                      <td className="p-2.5">MISO missions, authorities, approval chains; strict separation from unclassified civil coordination.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-emerald-400">DoD 5240.01</td>
                      <td className="p-2.5">DoD Intelligence Oversight</td>
                      <td className="p-2.5">Ensures no US Person PII collected or retained without explicit statutory approval.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-2">
                Appendix B: Legacy IRC to Current Doctrinal Construct Crosswalk
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono divide-y divide-slate-800 border border-slate-800 rounded-lg">
                  <thead className="bg-slate-900 text-slate-400 text-[10px]">
                    <tr>
                      <th className="p-2.5">LEGACY TERM (IRC)</th>
                      <th className="p-2.5">CURRENT DOCTRINAL CONSTRUCT</th>
                      <th className="p-2.5">CIO-KE ARCHITECTURAL TREATMENT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300 text-[11px]">
                    <tr>
                      <td className="p-2.5 text-amber-400">Civil Affairs / CMO</td>
                      <td className="p-2.5">Civil Component / CKI</td>
                      <td className="p-2.5">Core civil component and civil knowledge function; integrate into OIE without redefining CA as an influence force.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-amber-400">PSYOP / MISO Targeting</td>
                      <td className="p-2.5">MISO / Influence Activity</td>
                      <td className="p-2.5">Distinct authorized capability; CIO supplies aggregate civil context and assessment support. No individual targeting.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-amber-400">Public Affairs (PA)</td>
                      <td className="p-2.5">Inform Activity</td>
                      <td className="p-2.5">Distinct commander communication capability; CIO supplies verified civil facts/context and synchronization cues.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-amber-400">Offensive Cyber / EW</td>
                      <td className="p-2.5">Cyberspace / EW Operations</td>
                      <td className="p-2.5">Distinct authorities; CIO models civilian dependencies and effects, consuming authorized status indicators.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
