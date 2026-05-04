import { useState, useRef, useEffect, useCallback } from "react";
import { useStore } from "../../store/useStore";
import { C, FONT } from "../../theme";
import { SectionTitle } from "../ui/SectionTitle";
import { buildContextSnapshot, streamAiResponse } from "../../services/aiService";
import type { AiMessage } from "../../types";

// ─── Simple markdown renderer ─────────────────────────────────────────────────

function renderMarkdown(text: string): string {
  return text
    // Code blocks
    .replace(/```[\s\S]*?```/g, (match) => {
      const code = match.slice(3, -3).replace(/^\w+\n/, "");
      return `<pre style="background:#06080c;border:1px solid #1f2535;border-radius:6px;padding:0.75rem;overflow-x:auto;font-family:monospace;font-size:0.82rem;margin:0.5rem 0">${escapeHtml(code)}</pre>`;
    })
    // Inline code
    .replace(/`([^`]+)`/g, (_m, code) =>
      `<code style="background:#06080c;border:1px solid #1f2535;border-radius:3px;padding:1px 5px;font-family:monospace;font-size:0.85em">${escapeHtml(code)}</code>`
    )
    // Bold
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    // Italic
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    // Headings
    .replace(/^### (.+)$/gm, `<div style="font-weight:700;font-size:0.92rem;margin:0.75rem 0 0.25rem;color:${C.text}">$1</div>`)
    .replace(/^## (.+)$/gm, `<div style="font-weight:700;font-size:0.98rem;margin:0.75rem 0 0.25rem;color:${C.text}">$1</div>`)
    .replace(/^# (.+)$/gm, `<div style="font-weight:700;font-size:1.05rem;margin:0.75rem 0 0.25rem;color:${C.text}">$1</div>`)
    // Unordered lists
    .replace(/^[-*] (.+)$/gm, `<div style="padding-left:1.25rem;margin:0.15rem 0">· $1</div>`)
    // Numbered lists
    .replace(/^\d+\. (.+)$/gm, `<div style="padding-left:1.25rem;margin:0.15rem 0">$1</div>`)
    // Line breaks
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ─── Suggested prompts ────────────────────────────────────────────────────────

const SUGGESTED_PROMPTS = [
  "What projects need my attention this week?",
  "Summarize bottlenecks in my pipeline",
  "Which ideas should I prioritize based on my current quarter goal?",
  "What risks do I see in my current phase?",
  "Give me a weekly focus recommendation based on my energy and goals",
  "What's blocking my top-priority projects?",
];

// ─── Main component ───────────────────────────────────────────────────────────

export default function AiAdvisorView() {
  const appConfig = useStore((s) => s.appConfig);
  const aiConversations = useStore((s) => s.aiConversations);
  const activeConversationId = useStore((s) => s.activeConversationId);
  const createAiConversation = useStore((s) => s.createAiConversation);
  const appendAiMessage = useStore((s) => s.appendAiMessage);
  const updateLastAiMessage = useStore((s) => s.updateLastAiMessage);
  const removeAiConversation = useStore((s) => s.removeAiConversation);
  const setActiveConversationId = useStore((s) => s.setActiveConversationId);
  const setActiveView = useStore((s) => s.setActiveView);

  const [input, setInput] = useState("");
  const [includeSnapshot, setIncludeSnapshot] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<boolean>(false);

  const activeConversation = aiConversations.find((c) => c.id === activeConversationId) ?? null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages.length, isStreaming]);

  const getSnapshot = useCallback((): string => {
    const state = useStore.getState();
    return buildContextSnapshot(state);
  }, []);

  async function sendMessage(text: string) {
    if (!text.trim() || isStreaming) return;

    const apiKey = appConfig.aiApiKey?.trim();
    if (!apiKey) {
      setError("No API key configured. Please set your API key in Settings → AI Advisor.");
      return;
    }
    setError(null);

    // Ensure we have an active conversation
    let convId = activeConversationId;
    if (!convId) {
      convId = createAiConversation(text.slice(0, 60));
    }

    const userMsg: AiMessage = { role: "user", content: text.trim(), ts: Date.now() };
    appendAiMessage(convId, userMsg);
    setInput("");

    // Build system message
    let systemContent = appConfig.aiSystemPrompt || "";
    if (includeSnapshot) {
      const snapshot = getSnapshot();
      systemContent += `\n\n## Current Dashboard Snapshot:\n${snapshot}`;
    }

    // Get current messages for the API call
    const currentConv = useStore.getState().aiConversations.find((c) => c.id === convId);
    const historyMessages: AiMessage[] = currentConv?.messages ?? [userMsg];

    const apiMessages: AiMessage[] = [
      { role: "system", content: systemContent, ts: 0 },
      ...historyMessages,
    ];

    // Add placeholder assistant message for streaming
    const assistantMsg: AiMessage = { role: "assistant", content: "", ts: Date.now() };
    appendAiMessage(convId, assistantMsg);

    setIsStreaming(true);
    abortRef.current = false;

    try {
      let accumulated = "";
      const gen = streamAiResponse(apiMessages, {
        apiKey,
        baseUrl: appConfig.aiBaseUrl || "https://api.openai.com/v1",
        model: appConfig.aiModel || "gpt-4o-mini",
        systemPrompt: systemContent,
      });

      for await (const chunk of gen) {
        if (abortRef.current) break;
        accumulated += chunk;
        updateLastAiMessage(convId, accumulated);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      updateLastAiMessage(convId, `⚠ Error: ${message}`);
      setError(message);
    } finally {
      setIsStreaming(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function handleStop() {
    abortRef.current = true;
  }

  function handleNewConversation() {
    setActiveConversationId(null);
    setInput("");
    setError(null);
  }

  function handleSuggestedPrompt(prompt: string) {
    if (!activeConversationId) {
      createAiConversation(prompt.slice(0, 60));
    }
    sendMessage(prompt);
  }

  const hasApiKey = !!appConfig.aiApiKey?.trim();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <SectionTitle sub="Your strategic AI advisor — reflects on your dashboard data and suggests actions">
        ✦ AI Advisor
      </SectionTitle>

      {/* No API key warning */}
      {!hasApiKey && (
        <div
          style={{
            background: `${C.amber}12`,
            border: `1px solid ${C.amber}40`,
            borderRadius: 8,
            padding: "0.85rem 1.1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div>
            <span style={{ color: C.amber, fontWeight: 600, fontSize: "0.85rem" }}>⚠ API key required</span>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.8rem", color: C.textMuted }}>
              Set your OpenAI (or compatible) API key in Settings to use the AI Advisor.
            </p>
          </div>
          <button
            onClick={() => setActiveView("settings")}
            style={{
              background: C.amber,
              border: "none",
              color: "#000",
              padding: "0.45rem 1rem",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: "0.82rem",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            Go to Settings
          </button>
        </div>
      )}

      {/* Main two-panel layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: "1rem",
          minHeight: 520,
        }}
      >
        {/* Left panel — conversation list */}
        <div
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "0.85rem 0.9rem 0.6rem", borderBottom: `1px solid ${C.border}` }}>
            <button
              onClick={handleNewConversation}
              style={{
                width: "100%",
                background: C.accent,
                border: "none",
                color: "#fff",
                padding: "0.45rem 0.75rem",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: "0.82rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 6,
                justifyContent: "center",
              }}
            >
              <span>+</span> New Chat
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem" }}>
            {aiConversations.length === 0 ? (
              <div style={{ fontSize: "0.75rem", color: C.textDim, padding: "0.75rem 0.5rem", textAlign: "center" }}>
                No conversations yet
              </div>
            ) : (
              aiConversations.map((conv) => (
                <div
                  key={conv.id}
                  style={{
                    padding: "0.5rem 0.65rem",
                    borderRadius: 6,
                    background: activeConversationId === conv.id ? `${C.accent}18` : "transparent",
                    border: `1px solid ${activeConversationId === conv.id ? C.accent + "30" : "transparent"}`,
                    marginBottom: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 4,
                    cursor: "pointer",
                  }}
                  onClick={() => setActiveConversationId(conv.id)}
                >
                  <div style={{ overflow: "hidden" }}>
                    <div
                      style={{
                        fontSize: "0.78rem",
                        color: activeConversationId === conv.id ? C.text : C.textSoft,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontWeight: activeConversationId === conv.id ? 600 : 400,
                      }}
                    >
                      {conv.title}
                    </div>
                    <div style={{ fontSize: "0.68rem", color: C.textDim }}>
                      {conv.messages.length} msg{conv.messages.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAiConversation(conv.id);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: C.textDim,
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      padding: "2px 4px",
                      borderRadius: 3,
                      flexShrink: 0,
                    }}
                    title="Delete conversation"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right panel — chat */}
        <div
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Messages area */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
            {!activeConversation ? (
              /* Empty state */
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "1.5rem", padding: "2rem 0" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✦</div>
                  <div style={{ fontSize: "0.95rem", color: C.textSoft, fontFamily: FONT.display, marginBottom: "0.4rem" }}>
                    Ask your AI Advisor
                  </div>
                  <div style={{ fontSize: "0.78rem", color: C.textDim, maxWidth: 380 }}>
                    It reads your dashboard data — projects, pipeline, KPIs, ideas, and retrospectives — to give you contextual, actionable advice.
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 500 }}>
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => hasApiKey ? handleSuggestedPrompt(prompt) : setError("Set your API key in Settings → AI Advisor first.")}
                      style={{
                        background: C.surfaceAlt,
                        border: `1px solid ${C.border}`,
                        color: C.textSoft,
                        padding: "0.45rem 0.85rem",
                        borderRadius: 20,
                        cursor: "pointer",
                        fontSize: "0.78rem",
                        transition: "border-color 0.15s, color 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = C.accent;
                        (e.currentTarget as HTMLButtonElement).style.color = C.text;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = C.border;
                        (e.currentTarget as HTMLButtonElement).style.color = C.textSoft;
                      }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Message list */
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {activeConversation.messages
                  .filter((m) => m.role !== "system")
                  .map((msg, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                      }}
                    >
                      <div
                        style={{
                          maxWidth: "80%",
                          padding: "0.6rem 0.9rem",
                          borderRadius: msg.role === "user" ? "12px 12px 3px 12px" : "12px 12px 12px 3px",
                          background: msg.role === "user" ? C.accent : C.surfaceAlt,
                          border: msg.role === "user" ? "none" : `1px solid ${C.border}`,
                          fontSize: "0.85rem",
                          lineHeight: 1.6,
                          color: msg.role === "user" ? "#fff" : C.text,
                        }}
                      >
                        {msg.role === "assistant" ? (
                          <div
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content || "…") }}
                          />
                        ) : (
                          msg.content
                        )}
                      </div>
                    </div>
                  ))}
                {isStreaming && (
                  <div style={{ display: "flex", justifyContent: "flex-start" }}>
                    <div
                      style={{
                        padding: "0.5rem 0.9rem",
                        borderRadius: "12px 12px 12px 3px",
                        background: C.surfaceAlt,
                        border: `1px solid ${C.border}`,
                        fontSize: "0.78rem",
                        color: C.textDim,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <span style={{ animation: "pulse 1.2s ease-in-out infinite" }}>●</span>
                      <span>Thinking…</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Error display */}
          {error && (
            <div
              style={{
                margin: "0 1rem",
                padding: "0.5rem 0.85rem",
                background: `${C.red}12`,
                border: `1px solid ${C.red}30`,
                borderRadius: 6,
                fontSize: "0.78rem",
                color: C.red,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: "0.9rem" }}
              >
                ×
              </button>
            </div>
          )}

          {/* Input area */}
          <div
            style={{
              padding: "0.75rem",
              borderTop: `1px solid ${C.border}`,
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            {/* Snapshot toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: "0.73rem",
                  color: C.textMuted,
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <input
                  type="checkbox"
                  checked={includeSnapshot}
                  onChange={(e) => setIncludeSnapshot(e.target.checked)}
                  style={{ accentColor: C.accent }}
                />
                Include dashboard snapshot as context
              </label>
            </div>

            {/* Text input row */}
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question or describe a challenge… (Enter to send, Shift+Enter for newline)"
                disabled={isStreaming}
                rows={2}
                style={{
                  flex: 1,
                  background: C.bg,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: "0.55rem 0.8rem",
                  color: C.text,
                  fontSize: "0.85rem",
                  outline: "none",
                  resize: "none",
                  fontFamily: FONT.body,
                  lineHeight: 1.5,
                  boxSizing: "border-box",
                  opacity: isStreaming ? 0.6 : 1,
                }}
              />
              {isStreaming ? (
                <button
                  onClick={handleStop}
                  style={{
                    background: C.red,
                    border: "none",
                    color: "#fff",
                    padding: "0.55rem 1rem",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    alignSelf: "stretch",
                  }}
                >
                  Stop
                </button>
              ) : (
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || !hasApiKey}
                  style={{
                    background: input.trim() && hasApiKey ? C.accent : C.surfaceAlt,
                    border: "none",
                    color: input.trim() && hasApiKey ? "#fff" : C.textDim,
                    padding: "0.55rem 1.1rem",
                    borderRadius: 8,
                    cursor: input.trim() && hasApiKey ? "pointer" : "default",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    alignSelf: "stretch",
                    transition: "background 0.15s",
                  }}
                >
                  Send ↑
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info footer */}
      <div style={{ fontSize: "0.72rem", color: C.textVeryDim, textAlign: "center" }}>
        Your API key is sent directly to {appConfig.aiBaseUrl || "the AI provider"} from your browser. It is stored only in your browser&apos;s local storage.
      </div>
    </div>
  );
}
