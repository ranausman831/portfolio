import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Bot, Loader2, MessageSquare, RotateCcw, Send, Sparkles, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { parseAssistantApiResponse } from '../utils/portfolioAssistant';

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  text: string;
}

const SUGGESTED_QUESTIONS = [
  'What Agentic AI projects has Usman built?',
  'Which MCP & RAG tools are in his GitHub?',
  'What is Usman’s education and availability?',
];

export function PortfolioAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: 'assistant',
      text: 'Hi — I am Muhammad Usman’s Portfolio Assistant. Ask about his AI engineering stack, LangGraph/RAG/MCP projects, GitHub repositories, or availability.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [failedQuestion, setFailedQuestion] = useState<string | null>(null);
  const nextIdRef = useRef(2);
  const scrollEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    const timer = window.setTimeout(() => inputRef.current?.focus(), 140);
    return () => window.clearTimeout(timer);
  }, [isOpen, messages.length, isSending]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const sendQuestion = async (questionText: string, options?: { isRetry?: boolean }) => {
    const trimmed = questionText.trim();
    if (!trimmed || isSending) return;

    setErrorMessage(null);
    setFailedQuestion(null);

    const historyForRequest = messages
      .filter((m) => m.id !== 1)
      .slice(-8)
      .map((m) => ({
        role: m.role,
        text: m.text,
      }));

    if (!options?.isRetry) {
      const userTurn: ChatMessage = {
        id: nextIdRef.current++,
        role: 'user',
        text: trimmed,
      };
      setMessages((prev) => [...prev, userTurn]);
      setInput('');
    }
    setIsSending(true);

    const attemptChatFetch = async (): Promise<
      | { done: true; reply: string }
      | { done: false; error: string; shouldRetry: boolean }
    > => {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 25000);
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            message: trimmed,
            history: historyForRequest,
          }),
        });

        const rawBody = await res.text();
        const parsed = parseAssistantApiResponse(res.status, rawBody);
        if (parsed.ok && parsed.reply) {
          return { done: true, reply: parsed.reply };
        }
        return {
          done: false,
          error:
            parsed.error ||
            'Portfolio AI Assistant could not respond right now. Please try again shortly.',
          shouldRetry: parsed.shouldRetry,
        };
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return {
            done: false,
            error:
              'The AI Assistant request timed out waiting for a reply. Please click Retry or email mbox9016@gmail.com.',
            shouldRetry: true,
          };
        }
        return {
          done: false,
          error:
            'Could not connect to the AI Assistant endpoint (your connection or a browser blocker interrupted /api/chat). Please click Retry or email mbox9016@gmail.com.',
          shouldRetry: true,
        };
      } finally {
        window.clearTimeout(timeoutId);
      }
    };

    try {
      let outcome = await attemptChatFetch();
      if (!outcome.done && outcome.shouldRetry) {
        await new Promise((resolve) => setTimeout(resolve, 650));
        outcome = await attemptChatFetch();
      }

      if (outcome.done) {
        setMessages((prev) => [
          ...prev,
          {
            id: nextIdRef.current++,
            role: 'assistant',
            text: outcome.reply,
          },
        ]);
      } else {
        setErrorMessage(outcome.error);
        setFailedQuestion(trimmed);
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void sendQuestion(input);
  };

  return (
    <div
      className={`fixed right-3 bottom-3 sm:right-6 sm:bottom-6 ${isOpen ? 'z-50' : 'z-40'}`}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.section
            role="dialog"
            aria-label="Muhammad Usman Portfolio AI Assistant"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-3 bottom-[4.25rem] flex h-[min(480px,calc(100dvh-5.5rem))] max-h-[calc(100dvh-5.25rem)] flex-col overflow-hidden rounded-xl border border-[#E2E8F0] bg-white text-[#172033] shadow-[var(--shadow-elevated)] sm:static sm:inset-auto sm:mb-3 sm:h-[480px] sm:max-h-[calc(100vh-6rem)] sm:w-[390px] sm:max-w-[calc(100vw-3rem)] sm:rounded-sm dark:border-white/15 dark:bg-[#101015] dark:text-[#F4F4F6]"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-2 border-b border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 sm:px-4 sm:py-3 dark:border-white/10 dark:bg-[#14141C]">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-[#FFF7ED] text-[#C2410C] dark:bg-[#1F1510] dark:text-[#FF8C42]">
                  <Bot className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-bold text-[#172033] dark:text-white">
                    Portfolio AI Assistant
                  </p>
                  <p className="truncate font-mono text-[10px] text-[#64748B] dark:text-zinc-400">
                    Grounded on verified portfolio data
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close Portfolio AI Assistant"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-[#E2E8F0] bg-white text-[#475569] transition-colors hover:border-[#F97316] hover:text-[#172033] sm:h-8 sm:w-8 dark:border-white/15 dark:bg-[#181820] dark:text-zinc-300 dark:hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-sm px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere] sm:text-[13px] ${
                      msg.role === 'user'
                        ? 'bg-[#F97316] font-medium text-[#172033] dark:bg-[#FF5A1F] dark:text-[#070709]'
                        : 'border border-[#E2E8F0] bg-[#F8FAFC] text-[#172033] dark:border-white/10 dark:bg-[#0B0B10] dark:text-zinc-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isSending && (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-2 rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2 text-xs text-[#64748B] dark:border-white/10 dark:bg-[#0B0B10] dark:text-zinc-400">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#F97316] dark:text-[#FF5A1F]" aria-hidden="true" />
                    <span>Thinking...</span>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div
                  role="alert"
                  className="rounded-sm border border-rose-300 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-800 dark:border-rose-500/30 dark:bg-rose-950/30 dark:text-rose-200"
                >
                  <p>{errorMessage}</p>
                  {failedQuestion && (
                    <button
                      type="button"
                      onClick={() => void sendQuestion(failedQuestion, { isRetry: true })}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-sm border border-rose-400/60 bg-white/80 px-2.5 py-1 text-[11px] font-medium text-rose-900 transition-colors hover:bg-white dark:border-rose-400/30 dark:bg-rose-950/60 dark:text-rose-100 dark:hover:bg-rose-900/60 cursor-pointer"
                    >
                      <RotateCcw className="h-3 w-3" aria-hidden="true" />
                      <span>Retry Question</span>
                    </button>
                  )}
                </div>
              )}

              {/* Suggested Starter Prompts */}
              {messages.length <= 2 && !isSending && (
                <div className="pt-1">
                  <p className="mb-2 flex items-center gap-1 font-mono text-[10px] font-medium text-[#64748B] dark:text-zinc-400">
                    <Sparkles className="h-3 w-3 text-[#F97316] dark:text-[#FF5A1F]" aria-hidden="true" />
                    <span>Suggested Questions</span>
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {SUGGESTED_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => void sendQuestion(q)}
                        className="min-h-[42px] rounded-sm border border-[#E2E8F0] bg-white px-3 py-2 text-left text-xs text-[#334155] transition-colors hover:border-[#F97316] hover:bg-[#FFF7ED] hover:text-[#C2410C] dark:border-white/10 dark:bg-[#14141B] dark:text-zinc-300 dark:hover:border-[#FF5A1F] dark:hover:text-[#FF8C42] cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={scrollEndRef} />
            </div>

            {/* Composer */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-[#E2E8F0] bg-[#F8FAFC] p-2.5 sm:p-3 dark:border-white/10 dark:bg-[#14141C]"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about projects, skills, education..."
                maxLength={600}
                aria-label="Ask Muhammad Usman portfolio assistant"
                className="min-h-[44px] w-full rounded-sm border border-[#CBD5E1] bg-white px-3 py-2 text-base text-[#172033] placeholder:text-[#94A3B8] focus:border-[#F97316] focus:outline-none sm:min-h-[38px] sm:text-xs dark:border-white/15 dark:bg-[#09090D] dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-[#FF5A1F]"
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                aria-label="Send question"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-[#F97316] text-[#172033] transition-colors hover:bg-[#EA580C] disabled:opacity-50 disabled:cursor-not-allowed sm:h-9 sm:w-9 dark:bg-[#FF5A1F] dark:text-[#070709] dark:hover:bg-[#FF6E38] cursor-pointer"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Launcher Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Minimize Portfolio AI Assistant' : 'Ask Portfolio AI Assistant'}
        className="inline-flex min-h-[46px] items-center gap-2 rounded-md border border-[#EA580C]/40 bg-[#F97316] px-3.5 py-2.5 text-xs font-semibold text-[#172033] shadow-[0_12px_28px_-8px_rgba(249,115,22,0.55)] transition-all hover:bg-[#EA580C] active:scale-[0.98] sm:gap-2.5 sm:rounded-sm sm:px-4 dark:border-[#FF5A1F]/40 dark:bg-[#FF5A1F] dark:text-[#070709] dark:shadow-[0_12px_28px_-8px_rgba(255,90,31,0.45)] dark:hover:bg-[#FF6E38] cursor-pointer"
      >
        <MessageSquare className="h-4 w-4" aria-hidden="true" />
        <span>Ask AI Assistant</span>
      </button>
    </div>
  );
}
