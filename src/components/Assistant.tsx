import { useEffect, useRef, useState } from "react"
import { Bot, MessageSquare, Send, X } from "lucide-react"
import { assistantGreeting, getAssistantReply } from "../services/aiAssistant"
import { useAuth } from "../contexts/AuthContext"
import { useLanguage } from "../contexts/LanguageContext"

interface Msg {
  role: "user" | "assistant"
  text: string
}

export default function Assistant() {
  const { t, lang } = useLanguage()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([])
  const [chips, setChips] = useState<string[]>([])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, typing])

  const toggle = () => {
    if (!open && messages.length === 0) {
      const g = assistantGreeting(lang, user?.name || "Farmer")
      setMessages([{ role: "assistant", text: g.text }])
      setChips(g.chips)
    }
    setOpen((v) => !v)
  }

  const send = async (raw?: string) => {
    const text = (raw ?? input).trim()
    if (!text || typing || !open) return
    setInput("")
    setMessages((m) => [...m, { role: "user", text }])
    setTyping(true)
    await new Promise((r) => setTimeout(r, 550 + Math.random() * 450))
    const reply = getAssistantReply(text, lang, user?.name)
    setMessages((m) => [...m, { role: "assistant", text: reply.text }])
    setChips(reply.chips)
    setTyping(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-label={t("assistant.open")}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-leaf-600 text-white shadow-lg shadow-leaf-600/40 transition-transform hover:scale-105"
      >
        {open ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        {!open && <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-sun-400" />}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={t("assistant.title")}
          className="fixed right-4 bottom-24 z-40 flex h-[min(70vh,600px)] w-[min(92vw,384px)] flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl sm:right-5"
        >
          <div className="flex items-center gap-3 bg-gradient-to-br from-leaf-600 to-leaf-700 px-4 py-3.5 text-white">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
              <Bot className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-bold">{t("assistant.title")}</p>
              <p className="flex items-center gap-1.5 text-xs text-leaf-100">
                <span className="h-1.5 w-1.5 rounded-full bg-leaf-200" />
                {t("assistant.subtitle")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("common.close")}
              className="rounded-lg p-1.5 hover:bg-white/15"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-[#f9f9f6] p-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <p
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-leaf-600 text-white"
                      : "border border-gray-200 bg-white text-navy-900"
                  }`}
                >
                  {m.text}
                </p>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <span className="flex items-center gap-1 rounded-2xl border border-gray-200 bg-white px-4 py-3">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-leaf-500"
                      style={{ animationDelay: `${d * 150}ms` }}
                    />
                  ))}
                </span>
              </div>
            )}
          </div>

          {chips.length > 0 && (
            <div className="flex gap-2 overflow-x-auto border-t border-gray-100 bg-white px-3 py-2">
              {chips.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => void send(c)}
                  className="shrink-0 rounded-full border border-leaf-200 bg-leaf-50 px-3 py-1.5 text-xs font-semibold text-leaf-800 hover:bg-leaf-100"
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 border-t border-gray-100 bg-white p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void send()
              }}
              placeholder={t("assistant.placeholder")}
              aria-label={t("assistant.placeholder")}
              className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-navy-900 outline-none focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200"
            />
            <button
              type="button"
              onClick={() => void send()}
              disabled={typing || !input.trim()}
              aria-label={t("assistant.send")}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-leaf-600 text-white transition-colors hover:bg-leaf-700 disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}