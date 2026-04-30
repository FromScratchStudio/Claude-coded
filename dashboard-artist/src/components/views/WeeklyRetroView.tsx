import { useState, useMemo } from "react";
import { C, FONT } from "../../theme";
import { useStore } from "../../store/useStore";
import { WORK_MODES } from "../../data/workflow";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import type { WeeklyRetro } from "../../types";

const ACCENT = "#A78BFA";

// ─── Week helpers ─────────────────────────────────────────────────────────────

function getISOWeekKey(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function getMondayOfWeek(offset: number): Date {
  const today = new Date();
  const dow = today.getDay();
  const daysToMonday = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(today);
  monday.setDate(today.getDate() + daysToMonday + offset * 7);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

const MONTHS = ["jan","fév","mar","avr","mai","jun","jul","aoû","sep","oct","nov","déc"];
function fmtDate(date: Date): string {
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

function fmtDuration(min: number): string {
  if (min < 60) return `${min}min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, "0")}`;
}

// ─── ScoreSlider ──────────────────────────────────────────────────────────────

const EMOJIS = ["","😞","😔","😐","😕","😐","🙂","😊","😄","🤩","🔥"];

function ScoreSlider({
  label, value, onChange, color,
}: { label: string; value: number; onChange: (v: number) => void; color: string }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.3rem" }}>
        <span style={{ fontFamily: FONT.mono, fontSize: "0.65rem", color: C.textDim, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
        <span style={{ fontFamily: FONT.mono, fontSize: "0.85rem", color: color, fontWeight: "bold" }}>
          {value}/10 {EMOJIS[value]}
        </span>
      </div>
      <input
        type="range" min={1} max={10} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: color, cursor: "pointer" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.15rem" }}>
        {[1,2,3,4,5,6,7,8,9,10].map((n) => (
          <span key={n} style={{ fontFamily: FONT.mono, fontSize: "0.55rem", color: n === value ? color : C.textVeryDim }}>{n}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────

function Field({
  label, value, onChange, placeholder, rows = 3,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <div>
      <label style={{ display: "block", fontFamily: FONT.mono, fontSize: "0.65rem", color: C.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.35rem" }}>
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        style={{
          width: "100%",
          background: C.surfaceAlt,
          border: `1px solid ${C.border}`,
          borderRadius: 6,
          color: C.text,
          fontFamily: FONT.body,
          fontSize: "0.8rem",
          padding: "0.5rem 0.65rem",
          resize: "vertical",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function WeeklyRetroView() {
  const setActiveView = useStore((s) => s.setActiveView);
  const scheduleSlots = useStore((s) => s.scheduleSlots);
  const weeklyRetros = useStore((s) => s.weeklyRetros);
  const upsertWeeklyRetro = useStore((s) => s.upsertWeeklyRetro);
  const removeWeeklyRetro = useStore((s) => s.removeWeeklyRetro);

  // Default to last week (-1)
  const [weekOffset, setWeekOffset] = useState(-1);

  const monday = useMemo(() => getMondayOfWeek(weekOffset), [weekOffset]);
  const sunday = useMemo(() => addDays(monday, 6), [monday]);
  const weekKey = useMemo(() => getISOWeekKey(monday), [monday]);

  // Form state — pre-filled from existing retro if any
  const existing = weeklyRetros.find((r) => r.weekKey === weekKey);

  const [energyScore, setEnergyScore] = useState(existing?.energyScore ?? 7);
  const [pleasureScore, setPleasureScore] = useState(existing?.pleasureScore ?? 7);
  const [accomplished, setAccomplished] = useState(existing?.accomplished ?? "");
  const [blockers, setBlockers] = useState(existing?.blockers ?? "");
  const [learnings, setLearnings] = useState(existing?.learnings ?? "");
  const [nextWeekIntent, setNextWeekIntent] = useState(existing?.nextWeekIntent ?? "");
  const [completionPct, setCompletionPct] = useState(existing?.completionPct ?? 80);
  const [saved, setSaved] = useState(false);

  // Reset form when week changes
  const [lastLoadedWeek, setLastLoadedWeek] = useState(weekKey);
  if (weekKey !== lastLoadedWeek) {
    const ex = weeklyRetros.find((r) => r.weekKey === weekKey);
    setEnergyScore(ex?.energyScore ?? 7);
    setPleasureScore(ex?.pleasureScore ?? 7);
    setAccomplished(ex?.accomplished ?? "");
    setBlockers(ex?.blockers ?? "");
    setLearnings(ex?.learnings ?? "");
    setNextWeekIntent(ex?.nextWeekIntent ?? "");
    setCompletionPct(ex?.completionPct ?? 80);
    setSaved(false);
    setLastLoadedWeek(weekKey);
  }

  // Planned week summary from scheduleSlots
  const weekSlots = useMemo(
    () => scheduleSlots.filter((s) => s.weekKey === weekKey),
    [scheduleSlots, weekKey]
  );

  const totalPlannedMin = weekSlots.reduce((acc, s) => acc + s.durationMin, 0);

  const slotsByMode = useMemo(() => {
    const map: Record<string, number> = {};
    for (const s of weekSlots) {
      const key = s.workModeId ?? "—";
      map[key] = (map[key] ?? 0) + s.durationMin;
    }
    return map;
  }, [weekSlots]);

  const sortedRetros = useMemo(
    () => [...weeklyRetros].sort((a, b) => b.weekKey.localeCompare(a.weekKey)),
    [weeklyRetros]
  );

  function handleSave() {
    upsertWeeklyRetro({
      weekKey,
      energyScore,
      pleasureScore,
      accomplished,
      blockers,
      learnings,
      nextWeekIntent,
      completionPct,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const scoreAvg = Math.round((energyScore + pleasureScore) / 2);
  const scoreColor = scoreAvg >= 8 ? "#34D399" : scoreAvg >= 6 ? C.gold : scoreAvg >= 4 ? "#FB923C" : C.red;

  // ─── PDF / Print export ────────────────────────────────────────────────
  function printRetro() {
    const dateRange = `${fmtDate(monday)} → ${fmtDate(sunday)} ${sunday.getFullYear()}`;
    const avgScore = Math.round((energyScore + pleasureScore) / 2);
    const avgColor = avgScore >= 8 ? "#16a34a" : avgScore >= 6 ? "#ca8a04" : avgScore >= 4 ? "#ea580c" : "#dc2626";
    const energyColor = "#16a34a";
    const pleasureColor = "#7c3aed";

    function scoreBar(value: number, color: string): string {
      const filled = Math.round((value / 10) * 10);
      return Array.from({ length: 10 }, (_, i) =>
        `<span style="display:inline-block;width:14px;height:14px;margin-right:2px;border-radius:2px;background:${i < filled ? color : "#e5e7eb"};"></span>`
      ).join("");
    }

    function completionBar(pct: number): string {
      const col = pct >= 75 ? "#16a34a" : pct >= 50 ? "#ca8a04" : "#dc2626";
      return `<div style="width:100%;height:8px;background:#e5e7eb;border-radius:4px;overflow:hidden;">
        <div style="width:${pct}%;height:100%;background:${col};border-radius:4px;"></div>
      </div>`;
    }

    function textSection(icon: string, title: string, content: string): string {
      if (!content.trim()) return "";
      const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);
      return `
        <div style="margin-bottom:10px;break-inside:avoid;">
          <div style="font-size:7.5pt;font-weight:bold;text-transform:uppercase;letter-spacing:0.1em;color:#555;margin-bottom:4px;">${icon} ${title}</div>
          <div style="border-left:3px solid #a78bfa;padding-left:8px;">
            ${lines.map((l) => `<div style="font-size:8.5pt;color:#111;margin-bottom:2px;">${l}</div>`).join("")}
          </div>
        </div>`;
    }

    // Planned slots summary
    function slotsSection(): string {
      if (weekSlots.length === 0) return "";
      const modeRows = Object.entries(slotsByMode)
        .sort((a, b) => b[1] - a[1])
        .map(([modeId, min]) => {
          const mode = WORK_MODES.find((m) => m.id === modeId);
          const name = mode?.name ?? modeId;
          const color = mode?.color ?? "#888";
          const pct = Math.round((min / totalPlannedMin) * 100);
          return `<div style="display:flex;align-items:center;gap:5px;margin-bottom:3px;">
            <div style="width:8px;height:8px;border-radius:50%;background:${color};flex-shrink:0;"></div>
            <span style="flex:1;font-size:7pt;color:#333;">${name}</span>
            <span style="font-size:7pt;color:#555;font-family:monospace;">${fmtDuration(min)}</span>
            <div style="width:50px;height:4px;background:#eee;border-radius:2px;overflow:hidden;">
              <div style="width:${pct}%;height:100%;background:${color};"></div>
            </div>
            <span style="font-size:6.5pt;color:#999;">${pct}%</span>
          </div>`;
        }).join("");
      return `
        <div style="margin-bottom:10px;break-inside:avoid;">
          <div style="font-size:7.5pt;font-weight:bold;text-transform:uppercase;letter-spacing:0.1em;color:#555;margin-bottom:6px;">▦ Semaine planifiée</div>
          <div style="font-size:7.5pt;color:#555;margin-bottom:5px;">${weekSlots.length} créneau${weekSlots.length > 1 ? "x" : ""} · ${fmtDuration(totalPlannedMin)} total</div>
          ${modeRows}
        </div>`;
    }

    const EMOJIS_PRINT = ["","😞","😔","😐","😕","😐","🙂","😊","😄","🤩","🔥"];

    const html = `<!DOCTYPE html>
<html lang="fr"><head>
  <meta charset="UTF-8">
  <title>STRATEX · Rétro · ${weekKey}</title>
  <style>
    @page { size: A4 portrait; margin: 14mm 12mm 12mm; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Courier New', Courier, monospace; font-size: 9pt; color: #111; background: #fff; }
  </style>
</head><body>

  <!-- Header -->
  <div style="border-bottom:2px solid #111;padding-bottom:8px;margin-bottom:12px;">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;">
      <div>
        <div style="font-size:13pt;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;">STRATEX · Rétrospective hebdomadaire</div>
        <div style="font-size:8.5pt;color:#444;margin-top:3px;">Semaine <strong>${weekKey}</strong> · ${dateRange}</div>
      </div>
      <div style="text-align:right;font-size:7pt;color:#999;">
        <div>Généré le ${new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
      </div>
    </div>
  </div>

  <!-- Scores -->
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:14px;">
    <div style="border:1px solid #e5e7eb;border-radius:4px;padding:8px 10px;">
      <div style="font-size:6.5pt;text-transform:uppercase;letter-spacing:0.1em;color:#777;margin-bottom:4px;">⚡ Énergie</div>
      <div style="font-size:14pt;font-weight:bold;color:${energyColor};margin-bottom:4px;">${energyScore}/10 ${EMOJIS_PRINT[energyScore]}</div>
      <div>${scoreBar(energyScore, energyColor)}</div>
    </div>
    <div style="border:1px solid #e5e7eb;border-radius:4px;padding:8px 10px;">
      <div style="font-size:6.5pt;text-transform:uppercase;letter-spacing:0.1em;color:#777;margin-bottom:4px;">✨ Plaisir / flow</div>
      <div style="font-size:14pt;font-weight:bold;color:${pleasureColor};margin-bottom:4px;">${pleasureScore}/10 ${EMOJIS_PRINT[pleasureScore]}</div>
      <div>${scoreBar(pleasureScore, pleasureColor)}</div>
    </div>
    <div style="border:1px solid #e5e7eb;border-radius:4px;padding:8px 10px;">
      <div style="font-size:6.5pt;text-transform:uppercase;letter-spacing:0.1em;color:#777;margin-bottom:4px;">✅ Complétion créneaux</div>
      <div style="font-size:14pt;font-weight:bold;color:${avgColor};margin-bottom:6px;">${completionPct}%</div>
      ${completionBar(completionPct)}
    </div>
  </div>

  <!-- Score moyen banner -->
  <div style="border:1px solid #a78bfa;border-radius:4px;padding:6px 10px;margin-bottom:14px;display:flex;align-items:center;gap:10px;">
    <span style="font-size:7pt;text-transform:uppercase;letter-spacing:0.08em;color:#555;">Score moyen de la semaine :</span>
    <span style="font-size:13pt;font-weight:bold;color:${avgColor};">${avgScore}/10 ${EMOJIS_PRINT[avgScore]}</span>
  </div>

  <!-- Two columns: text fields + slots -->
  <div style="display:grid;grid-template-columns:1fr 220px;gap:14px;">
    <div>
      ${textSection("✅", "Réalisations", accomplished)}
      ${textSection("🚧", "Blocages & obstacles", blockers)}
      ${textSection("💡", "Apprentissages", learnings)}
      ${textSection("🎯", "Intention semaine prochaine", nextWeekIntent)}
    </div>
    <div>
      ${slotsSection()}
    </div>
  </div>

  <!-- Footer -->
  <div style="margin-top:10px;text-align:center;font-size:6pt;color:#bbb;border-top:1px solid #eee;padding-top:4px;">
    STRATEX — Dashboard artiste indépendant · Rétro ${weekKey}
  </div>

  <script>window.onload = function() { window.print(); };<\/script>
</body></html>`;

    const win = window.open("", "_blank", "width=900,height=700");
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <SectionTitle accent={ACCENT}>
          ↩ Rétrospective hebdomadaire
        </SectionTitle>
          <p style={{ fontFamily: FONT.mono, fontSize: "0.68rem", color: C.textDim, margin: "0.2rem 0 0" }}>
            Bilan de semaine — énergie, réalisations, blocages, apprentissages
          </p>
        </div>
        <button
          onClick={() => setActiveView("weekly-calendar")}
          style={{
            background: "none",
            border: `1px solid ${C.border}`,
            color: C.textDim,
            borderRadius: 6,
            padding: "0.35rem 0.85rem",
            fontSize: "0.68rem",
            cursor: "pointer",
            fontFamily: FONT.mono,
          }}
        >
          ▦ Agenda
        </button>
        <button
          onClick={() => printRetro()}
          style={{
            background: `${ACCENT}18`,
            border: `1px solid ${ACCENT}66`,
            color: ACCENT,
            borderRadius: 6,
            padding: "0.35rem 0.85rem",
            fontSize: "0.68rem",
            cursor: "pointer",
            fontFamily: FONT.mono,
          }}
          title="Exporter la rétro en PDF imprimable"
        >
          🖨 Fiche PDF
        </button>
      </div>

      {/* Week nav */}
      <Card style={{ marginBottom: "1.25rem", padding: "0.75rem 1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            onClick={() => setWeekOffset((o) => o - 1)}
            style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 6, padding: "0.3rem 0.65rem", fontSize: "0.85rem", cursor: "pointer", fontFamily: FONT.mono }}
          >‹</button>
          <div style={{ flex: 1, textAlign: "center" }}>
            <span style={{ fontFamily: FONT.mono, fontSize: "0.78rem", color: C.text, fontWeight: "bold" }}>
              {weekKey}
            </span>
            <span style={{ fontFamily: FONT.mono, fontSize: "0.68rem", color: C.textDim, marginLeft: "0.6rem" }}>
              {fmtDate(monday)} → {fmtDate(sunday)}
            </span>
            {existing && (
              <span style={{ marginLeft: "0.6rem", fontFamily: FONT.mono, fontSize: "0.6rem", color: ACCENT, background: `${ACCENT}20`, borderRadius: 4, padding: "0.15rem 0.4rem" }}>
                ✓ enregistrée
              </span>
            )}
          </div>
          <button
            onClick={() => setWeekOffset((o) => o + 1)}
            style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 6, padding: "0.3rem 0.65rem", fontSize: "0.85rem", cursor: "pointer", fontFamily: FONT.mono }}
          >›</button>
          <button
            onClick={() => setWeekOffset(-1)}
            style={{
              background: weekOffset === -1 ? `${ACCENT}22` : C.surfaceAlt,
              border: `1px solid ${weekOffset === -1 ? ACCENT : C.border}`,
              color: weekOffset === -1 ? ACCENT : C.textMuted,
              borderRadius: 6,
              padding: "0.3rem 0.7rem",
              fontSize: "0.65rem",
              cursor: "pointer",
              fontFamily: FONT.mono,
            }}
          >
            Semaine passée
          </button>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.25rem", alignItems: "start" }}>
        {/* ─── Main form ───────────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Scores */}
          <Card>
            <h3 style={{ fontFamily: FONT.mono, fontSize: "0.7rem", color: C.textDim, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 1rem" }}>
              Scores de la semaine
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              <ScoreSlider label="Énergie" value={energyScore} onChange={setEnergyScore} color="#34D399" />
              <ScoreSlider label="Plaisir / flow" value={pleasureScore} onChange={setPleasureScore} color={ACCENT} />
            </div>
            <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <span style={{ fontFamily: FONT.mono, fontSize: "0.65rem", color: C.textDim }}>Score moyen :</span>
              <span style={{ fontFamily: FONT.mono, fontSize: "1.05rem", color: scoreColor, fontWeight: "bold" }}>
                {scoreAvg}/10
              </span>
              <span style={{ fontFamily: FONT.mono, fontSize: "0.75rem" }}>{EMOJIS[scoreAvg]}</span>
            </div>
          </Card>

          {/* Taux de complétion */}
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.5rem" }}>
              <h3 style={{ fontFamily: FONT.mono, fontSize: "0.7rem", color: C.textDim, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>
                Taux de complétion des créneaux
              </h3>
              <span style={{ fontFamily: FONT.mono, fontSize: "0.9rem", color: completionPct >= 75 ? "#34D399" : completionPct >= 50 ? C.gold : C.red, fontWeight: "bold" }}>
                {completionPct}%
              </span>
            </div>
            <input
              type="range" min={0} max={100} step={5} value={completionPct}
              onChange={(e) => setCompletionPct(Number(e.target.value))}
              style={{ width: "100%", accentColor: ACCENT, cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.2rem" }}>
              <span style={{ fontFamily: FONT.mono, fontSize: "0.6rem", color: C.textVeryDim }}>0%</span>
              <span style={{ fontFamily: FONT.mono, fontSize: "0.6rem", color: C.textVeryDim }}>50%</span>
              <span style={{ fontFamily: FONT.mono, fontSize: "0.6rem", color: C.textVeryDim }}>100%</span>
            </div>
          </Card>

          {/* Text fields */}
          <Card style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Field
              label="✅ Réalisations de la semaine"
              value={accomplished}
              onChange={setAccomplished}
              placeholder="Ce que j'ai accompli, terminé, publié, avancé…"
              rows={3}
            />
            <Field
              label="🚧 Blocages & obstacles"
              value={blockers}
              onChange={setBlockers}
              placeholder="Ce qui a freiné, les imprévus, les distractions…"
              rows={3}
            />
            <Field
              label="💡 Apprentissages"
              value={learnings}
              onChange={setLearnings}
              placeholder="Ce que j'ai appris, compris, ou retenu cette semaine…"
              rows={3}
            />
            <Field
              label="🎯 Intention semaine prochaine"
              value={nextWeekIntent}
              onChange={setNextWeekIntent}
              placeholder="La priorité principale, le focus, l'engagement…"
              rows={2}
            />
          </Card>

          {/* Save button */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.65rem", alignItems: "center" }}>
            {existing && (
              <button
                onClick={() => { if (confirm("Supprimer la rétro de cette semaine ?")) removeWeeklyRetro(weekKey); }}
                style={{ background: "none", border: `1px solid ${C.red}44`, color: C.red, borderRadius: 6, padding: "0.45rem 0.9rem", fontSize: "0.7rem", cursor: "pointer", fontFamily: FONT.mono }}
              >
                Supprimer
              </button>
            )}
            <button
              onClick={handleSave}
              style={{
                background: saved ? "#34D39922" : `${ACCENT}22`,
                border: `1px solid ${saved ? "#34D399" : ACCENT}`,
                color: saved ? "#34D399" : ACCENT,
                borderRadius: 6,
                padding: "0.45rem 1.25rem",
                fontSize: "0.75rem",
                cursor: "pointer",
                fontFamily: FONT.mono,
                fontWeight: "bold",
                transition: "all 0.2s",
              }}
            >
              {saved ? "✓ Enregistré" : "Enregistrer la rétro"}
            </button>
          </div>
        </div>

        {/* ─── Right panel ─────────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Planned week summary */}
          <Card>
            <h3 style={{ fontFamily: FONT.mono, fontSize: "0.7rem", color: C.textDim, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 0.75rem" }}>
              Semaine planifiée
            </h3>
            {weekSlots.length === 0 ? (
              <p style={{ fontFamily: FONT.mono, fontSize: "0.68rem", color: C.textVeryDim, margin: 0 }}>
                Aucun créneau planifié pour cette semaine.
              </p>
            ) : (
              <>
                <div style={{ marginBottom: "0.65rem" }}>
                  <span style={{ fontFamily: FONT.mono, fontSize: "0.68rem", color: C.textDim }}>Total planifié : </span>
                  <span style={{ fontFamily: FONT.mono, fontSize: "0.78rem", color: C.text, fontWeight: "bold" }}>
                    {fmtDuration(totalPlannedMin)}
                  </span>
                  <span style={{ fontFamily: FONT.mono, fontSize: "0.65rem", color: C.textDim, marginLeft: "0.4rem" }}>
                    ({weekSlots.length} créneau{weekSlots.length > 1 ? "x" : ""})
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  {Object.entries(slotsByMode)
                    .sort((a, b) => b[1] - a[1])
                    .map(([modeId, min]) => {
                      const pct = Math.round((min / totalPlannedMin) * 100);
                      return (
                        <div key={modeId}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.15rem" }}>
                            <span style={{ fontFamily: FONT.mono, fontSize: "0.62rem", color: C.textDim }}>{modeId}</span>
                            <span style={{ fontFamily: FONT.mono, fontSize: "0.62rem", color: C.text }}>{fmtDuration(min)} ({pct}%)</span>
                          </div>
                          <div style={{ height: 4, background: C.surfaceAlt, borderRadius: 2, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${pct}%`, background: ACCENT, borderRadius: 2 }} />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </>
            )}
            <button
              onClick={() => setActiveView("weekly-calendar")}
              style={{
                marginTop: "0.85rem",
                background: "none",
                border: `1px solid ${C.border}`,
                color: C.textDim,
                borderRadius: 6,
                padding: "0.3rem 0.65rem",
                fontSize: "0.62rem",
                cursor: "pointer",
                fontFamily: FONT.mono,
                width: "100%",
              }}
            >
              ▦ Voir l'Agenda
            </button>
          </Card>

          {/* History */}
          <Card>
            <h3 style={{ fontFamily: FONT.mono, fontSize: "0.7rem", color: C.textDim, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 0.75rem" }}>
              Historique ({sortedRetros.length})
            </h3>
            {sortedRetros.length === 0 ? (
              <p style={{ fontFamily: FONT.mono, fontSize: "0.68rem", color: C.textVeryDim, margin: 0 }}>
                Aucune rétro enregistrée.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: 320, overflowY: "auto" }}>
                {sortedRetros.map((r: WeeklyRetro) => {
                  const avg = Math.round((r.energyScore + r.pleasureScore) / 2);
                  const col = avg >= 8 ? "#34D399" : avg >= 6 ? C.gold : avg >= 4 ? "#FB923C" : C.red;
                  const isCurrentWeek = r.weekKey === weekKey;
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        // Find offset for this week
                        const targetMonday = (() => {
                          const [yr, wk] = r.weekKey.split("-W").map(Number);
                          const jan4 = new Date(Date.UTC(yr, 0, 4));
                          const jan4Day = jan4.getUTCDay() || 7;
                          const monday = new Date(jan4.getTime() - (jan4Day - 1) * 86400000 + (wk - 1) * 7 * 86400000);
                          return monday;
                        })();
                        const currentMonday = getMondayOfWeek(0);
                        const diffMs = targetMonday.getTime() - currentMonday.getTime();
                        setWeekOffset(Math.round(diffMs / (7 * 86400000)));
                      }}
                      style={{
                        background: isCurrentWeek ? `${ACCENT}18` : C.surfaceAlt,
                        border: `1px solid ${isCurrentWeek ? ACCENT : C.border}`,
                        borderRadius: 6,
                        padding: "0.5rem 0.65rem",
                        cursor: "pointer",
                        textAlign: "left",
                        width: "100%",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontFamily: FONT.mono, fontSize: "0.68rem", color: C.text, fontWeight: "bold" }}>{r.weekKey}</span>
                        <span style={{ fontFamily: FONT.mono, fontSize: "0.7rem", color: col, fontWeight: "bold" }}>
                          {avg}/10 {EMOJIS[avg]}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.3rem" }}>
                        <span style={{ fontFamily: FONT.mono, fontSize: "0.6rem", color: C.textDim }}>
                          ⚡ {r.energyScore} &nbsp; ✨ {r.pleasureScore} &nbsp; ✅ {r.completionPct}%
                        </span>
                      </div>
                      {r.nextWeekIntent && (
                        <div style={{ fontFamily: FONT.body, fontSize: "0.65rem", color: C.textDim, marginTop: "0.3rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          🎯 {r.nextWeekIntent}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
