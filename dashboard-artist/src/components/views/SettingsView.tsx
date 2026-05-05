import { useRef, useState } from "react";
import { C, FONT } from "../../theme";
import { useStore } from "../../store/useStore";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import { AI_PROVIDERS } from "../../services/aiService";
import type { AiProviderId, AiProviderConfig } from "../../types";

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export default function SettingsView() {
  const store = useStore();
  const importState = useStore((s) => s.importState);
  const aiConfig = useStore((s) => s.aiConfig);
  const updateAiConfig = useStore((s) => s.updateAiConfig);
  const fileRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle");
  const [importMsg, setImportMsg] = useState("");
  const [importPreview, setImportPreview] = useState<string | null>(null);

  // ── Export ────────────────────────────────────────────────────────────────
  function handleExport() {
    const exportData = {
      _version: 2,
      _exported: new Date().toISOString(),
      phases: store.phases,
      workflowStages: store.workflowStages,
      chapters: store.chapters,
      projects: store.projects,
      kpiValues: store.kpiValues,
      kpiDefs: store.kpiDefs,
      quarter: store.quarter,
      ideas: store.ideas,
      kmIssues: store.kmIssues,
      heteronymData: store.heteronymData,
      degradedModes: store.degradedModes,
      principles: store.principles,
      traps: store.traps,
      collabChecklist: store.collabChecklist,
      buildBudgets: store.buildBudgets,
      energy: store.energy,
      plaisir: store.plaisir,
      joursEpuises: store.joursEpuises,
      ulWeek: store.ulWeek,
      degradedMode: store.degradedMode,
    };
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stratex-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Import ────────────────────────────────────────────────────────────────
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportStatus("idle");
    setImportMsg("");
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      try {
        const parsed = JSON.parse(text);
        // Show a preview of top-level keys before confirming
        const keys = Object.keys(parsed).filter((k) => !k.startsWith("_"));
        setImportPreview(`Clés trouvées : ${keys.join(", ")}`);
        setImportMsg(`Fichier : ${file.name} (${formatBytes(text.length)})`);
        // Store text for later confirm
        (fileRef.current as any)._parsedData = parsed;
        setImportStatus("idle");
      } catch {
        setImportStatus("error");
        setImportMsg("Fichier JSON invalide.");
        setImportPreview(null);
      }
    };
    reader.readAsText(file);
  }

  function handleImportConfirm() {
    const parsed = (fileRef.current as any)?._parsedData;
    if (!parsed) return;
    try {
      if (parsed._version !== 2) {
        setImportStatus("error");
        setImportMsg(`Version de sauvegarde incompatible (attendu : v2, reçu : ${parsed._version ?? "inconnue"}).`);
        return;
      }
      importState(parsed);
      setImportStatus("success");
      setImportMsg("Données importées avec succès. L'état a été fusionné.");
      setImportPreview(null);
      if (fileRef.current) { fileRef.current.value = ""; (fileRef.current as any)._parsedData = null; }
    } catch {
      setImportStatus("error");
      setImportMsg("Erreur lors de l'import des données.");
    }
  }

  function handleClearImport() {
    setImportStatus("idle");
    setImportMsg("");
    setImportPreview(null);
    if (fileRef.current) { fileRef.current.value = ""; (fileRef.current as any)._parsedData = null; }
  }

  // ── Storage size estimate ─────────────────────────────────────────────────
  const rawSize = (() => {
    try {
      const raw = localStorage.getItem("stratex-dashboard-v2");
      return raw ? raw.length : 0;
    } catch { return 0; }
  })();

  return (
    <div>
      <div style={{ marginBottom: "1.25rem" }}>
        <h2 style={{ fontFamily: FONT.display, fontSize: "1.2rem", color: C.text, margin: 0 }}>Réglages</h2>
        <p style={{ fontSize: "0.7rem", color: C.textDim, margin: "0.2rem 0 0", fontFamily: FONT.mono }}>
          Sauvegarde, restauration et gestion des données locales
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "1.25rem" }}>

        {/* ── Export section ── */}
        <Card>
          <SectionTitle accent={C.green}>Exporter les données</SectionTitle>
          <p style={{ fontSize: "0.75rem", color: C.textSoft, lineHeight: 1.55, margin: "0 0 0.85rem" }}>
            Télécharge un fichier JSON contenant l'intégralité de l'état de l'application : phases, pipeline, projets, KPIs, idées, garde-fous, etc.
          </p>
          <div style={{ padding: "0.65rem", background: C.bg, borderRadius: 6, border: `1px solid ${C.border}`, marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.65rem", color: C.textDim, fontFamily: FONT.mono, marginBottom: "0.35rem" }}>Stockage local estimé</div>
            <div style={{ fontSize: "1.1rem", fontFamily: FONT.mono, color: rawSize > 50000 ? C.amber : C.green }}>
              {formatBytes(rawSize)}
            </div>
            <div style={{ fontSize: "0.6rem", color: C.textVeryDim, marginTop: "0.2rem" }}>localStorage · clé: stratex-dashboard-v2</div>
          </div>
          <button onClick={handleExport} style={{ width: "100%", background: C.green, border: "none", color: "#fff", borderRadius: 6, padding: "0.55rem", fontSize: "0.78rem", fontFamily: FONT.mono, cursor: "pointer", fontWeight: "bold", letterSpacing: "0.05em" }}>
            ↓ Télécharger le fichier de sauvegarde
          </button>
        </Card>

        {/* ── Import section ── */}
        <Card>
          <SectionTitle accent={C.amber}>Importer des données</SectionTitle>
          <p style={{ fontSize: "0.75rem", color: C.textSoft, lineHeight: 1.55, margin: "0 0 0.85rem" }}>
            Charge un fichier JSON précédemment exporté. Les données sont <strong style={{ color: C.text }}>fusionnées</strong> avec l'état actuel (pas de remplacement total).
          </p>
          <input ref={fileRef} type="file" accept=".json,application/json" onChange={handleFileChange} style={{ display: "none" }} />
          <button onClick={() => fileRef.current?.click()} style={{ width: "100%", background: C.surfaceAlt, border: `1px dashed ${C.amber}55`, color: C.amber, borderRadius: 6, padding: "0.55rem", fontSize: "0.75rem", fontFamily: FONT.mono, cursor: "pointer", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
            ↑ Sélectionner un fichier JSON
          </button>

          {importMsg && (
            <div style={{ padding: "0.5rem 0.65rem", background: importStatus === "error" ? `${C.red}18` : importStatus === "success" ? `${C.green}18` : C.bg, border: `1px solid ${importStatus === "error" ? C.red : importStatus === "success" ? C.green : C.border}`, borderRadius: 6, marginBottom: "0.5rem" }}>
              <p style={{ fontSize: "0.68rem", color: importStatus === "error" ? C.red : importStatus === "success" ? C.green : C.textSoft, margin: 0, fontFamily: FONT.mono }}>{importMsg}</p>
              {importPreview && <p style={{ fontSize: "0.63rem", color: C.textDim, margin: "0.3rem 0 0", fontStyle: "italic" }}>{importPreview}</p>}
            </div>
          )}

          {importPreview && importStatus !== "success" && (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={handleImportConfirm} style={{ flex: 1, background: C.amber, border: "none", color: "#000", borderRadius: 6, padding: "0.45rem", fontSize: "0.72rem", fontFamily: FONT.mono, cursor: "pointer", fontWeight: "bold" }}>Confirmer l'import</button>
              <button onClick={handleClearImport} style={{ background: "none", border: `1px solid ${C.border}`, color: C.textDim, borderRadius: 6, padding: "0.45rem 0.75rem", fontSize: "0.72rem", fontFamily: FONT.mono, cursor: "pointer" }}>Annuler</button>
            </div>
          )}
        </Card>

        {/* ── AI Conseiller config ── */}
        <AiConseillerSettings aiConfig={aiConfig} updateAiConfig={updateAiConfig} />

        {/* ── Storage info ── */}
        <Card>
          <SectionTitle accent={C.cyan}>Données stockées</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {[
              { label: "Phases & tâches", value: `${store.phases.length} phases` },
              { label: "Étapes pipeline", value: `${store.workflowStages.length} étapes` },
              { label: "Chapitres pipeline", value: `${store.chapters.length} chapitres` },
              { label: "Projets", value: `${store.projects.length} projets` },
              { label: "Idées", value: `${store.ideas.length} idées` },
              { label: "Modes dégradés", value: `${store.degradedModes.length} modes` },
              { label: "Principes", value: `${store.principles.length} principes` },
              { label: "Pièges", value: `${store.traps.length} pièges` },
              { label: "Checklist collab", value: `${store.collabChecklist.length} critères` },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.25rem 0", borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontSize: "0.7rem", color: C.textMuted, fontFamily: FONT.mono }}>{label}</span>
                <span style={{ fontSize: "0.7rem", color: C.text, fontFamily: FONT.mono }}>{value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* ── About ── */}
        <Card>
          <SectionTitle accent={C.gold}>À propos</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <p style={{ fontSize: "0.75rem", color: C.textSoft, margin: 0, lineHeight: 1.6 }}>
              <strong style={{ color: C.text }}>STRATEX Dashboard</strong> — Outil de pilotage personnel pour artiste indépendant. Méthode Unifiée 3 Couches.
            </p>
            <p style={{ fontSize: "0.68rem", color: C.textDim, margin: 0, fontFamily: FONT.mono }}>
              Version du schéma : v2 · Stockage : localStorage
            </p>
            <p style={{ fontSize: "0.65rem", color: C.textVeryDim, margin: 0, fontStyle: "italic" }}>
              Toutes les données du tableau de bord sont exclusivement locales. Seules les requêtes du Conseiller IA sortent du navigateur, envoyées directement au fournisseur IA que vous configurez.
            </p>
          </div>
        </Card>

      </div>
    </div>
  );
}

// ─── AI Conseiller settings sub-component ────────────────────────────────────

function AiConseillerSettings({
  aiConfig,
  updateAiConfig,
}: {
  aiConfig: import("../../types").AiConfig;
  updateAiConfig: (updates: Partial<import("../../types").AiConfig>) => void;
}) {
  const selectedProvider = (aiConfig.provider ?? "openai") as AiProviderId;
  const providerDef = AI_PROVIDERS.find((p) => p.id === selectedProvider) ?? AI_PROVIDERS[0];
  const providerConfig: AiProviderConfig = {
    apiKey: "",
    model: providerDef.defaultModel,
    ...(aiConfig.providers?.[selectedProvider] ?? {}),
  };

  function setProviderField(field: keyof AiProviderConfig, value: string) {
    const updated: AiProviderConfig = { ...providerConfig, [field]: value };
    updateAiConfig({ providers: { ...aiConfig.providers, [selectedProvider]: updated } });
  }

  const showBaseUrl = selectedProvider === "custom" || selectedProvider === "ollama";
  const currentModel = providerConfig.model ?? "";
  const modelIsCustom = !providerDef?.models.includes(currentModel) && currentModel !== "";

  return (
    <Card>
      <SectionTitle accent={C.violet}>Conseiller IA</SectionTitle>
      <p style={{ fontSize: "0.72rem", color: C.textDim, margin: "0 0 0.85rem", lineHeight: 1.5 }}>
        Les clés API sont stockées <strong style={{ color: C.textSoft }}>uniquement dans votre navigateur</strong> et envoyées directement au fournisseur. Elles ne sont jamais transmises ailleurs.
      </p>

      {/* Provider selection */}
      <div style={{ marginBottom: "0.75rem" }}>
        <label style={{ display: "block", fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, marginBottom: "0.3rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Fournisseur</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {AI_PROVIDERS.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                const existingCfg = aiConfig.providers?.[p.id as AiProviderId] ?? { apiKey: "", model: p.defaultModel };
                updateAiConfig({
                  provider: p.id,
                  providers: { ...aiConfig.providers, [p.id]: existingCfg },
                });
              }}
              style={{
                background: selectedProvider === p.id ? `${C.violet}20` : C.surfaceAlt,
                border: `1px solid ${selectedProvider === p.id ? C.violet : C.border}`,
                color: selectedProvider === p.id ? C.violet : C.textSoft,
                padding: "0.3rem 0.65rem",
                borderRadius: 5,
                cursor: "pointer",
                fontSize: "0.72rem",
                fontFamily: FONT.mono,
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Model selection */}
      <div style={{ marginBottom: "0.75rem" }}>
        <label style={{ display: "block", fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, marginBottom: "0.3rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Modèle</label>
        {providerDef?.models.length > 0 && (
          <select
            value={modelIsCustom ? "__custom__" : (providerConfig.model || providerDef.defaultModel)}
            onChange={(e) => {
              if (e.target.value !== "__custom__") setProviderField("model", e.target.value);
            }}
            style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.text, borderRadius: 5, padding: "0.35rem 0.5rem", fontSize: "0.78rem", width: "100%", marginBottom: "0.35rem" }}
          >
            {providerDef.models.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
            <option value="__custom__">Personnalisé…</option>
          </select>
        )}
        <input
          type="text"
          value={providerConfig.model ?? ""}
          onChange={(e) => setProviderField("model", e.target.value)}
          placeholder={providerDef?.defaultModel || "nom-du-modèle"}
          style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.text, borderRadius: 5, padding: "0.35rem 0.5rem", fontSize: "0.75rem", width: "100%", boxSizing: "border-box" }}
        />
      </div>

      {/* API key */}
      {providerDef?.requiresApiKey && (
        <div style={{ marginBottom: "0.75rem" }}>
          <label style={{ display: "block", fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, marginBottom: "0.3rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Clé API</label>
          <input
            type="password"
            value={providerConfig.apiKey ?? ""}
            onChange={(e) => setProviderField("apiKey", e.target.value)}
            placeholder={selectedProvider === "anthropic" ? "sk-ant-…" : selectedProvider === "gemini" ? "AIza…" : "sk-…"}
            style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.text, borderRadius: 5, padding: "0.35rem 0.5rem", fontSize: "0.75rem", width: "100%", boxSizing: "border-box", fontFamily: FONT.mono }}
          />
        </div>
      )}

      {/* Base URL */}
      {showBaseUrl && (
        <div style={{ marginBottom: "0.75rem" }}>
          <label style={{ display: "block", fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, marginBottom: "0.3rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>URL de base</label>
          <input
            type="text"
            value={providerConfig.baseUrl ?? providerDef.baseUrl}
            onChange={(e) => setProviderField("baseUrl", e.target.value)}
            placeholder={providerDef.baseUrl ?? "https://…"}
            style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.text, borderRadius: 5, padding: "0.35rem 0.5rem", fontSize: "0.75rem", width: "100%", boxSizing: "border-box", fontFamily: FONT.mono }}
          />
          {providerDef?.baseUrl && (
            <div style={{ fontSize: "0.6rem", color: C.textVeryDim, marginTop: "0.2rem" }}>
              Défaut : {providerDef.baseUrl}
            </div>
          )}
          {selectedProvider === "custom" && (
            <div style={{ fontSize: "0.6rem", color: C.textDim, marginTop: "0.2rem" }}>
              Tout endpoint compatible OpenAI, ex. https://openrouter.ai/api/v1
            </div>
          )}
        </div>
      )}

      {/* System prompt */}
      <div>
        <label style={{ display: "block", fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, marginBottom: "0.3rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Prompt système</label>
        <textarea
          value={aiConfig.systemPrompt ?? ""}
          onChange={(e) => updateAiConfig({ systemPrompt: e.target.value })}
          rows={3}
          placeholder="Instructions pour le conseiller IA…"
          style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.text, borderRadius: 5, padding: "0.4rem 0.5rem", fontSize: "0.75rem", width: "100%", boxSizing: "border-box", resize: "vertical", fontFamily: FONT.body }}
        />
      </div>
    </Card>
  );
}
