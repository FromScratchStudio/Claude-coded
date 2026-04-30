import { useState, useMemo } from "react";
import { useStore } from "../../store/useStore";
import { C } from "../../theme";
import { SectionTitle } from "../ui/SectionTitle";
import { Card } from "../ui/Card";
import { ProgressBar } from "../ui/ProgressBar";
import { labelStyle, formRow, btnPrimary, btnSecondary } from "../ui/Modal";

// ─── Week helpers (same ISO format as WeeklyCalendarView) ─────────────────────

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

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fmtDate(date: Date): string {
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

function fmtWeekRange(monday: Date): string {
  const sunday = addDays(monday, 6);
  if (monday.getMonth() === sunday.getMonth()) {
    return `${monday.getDate()} – ${sunday.getDate()} ${MONTHS[monday.getMonth()]} ${sunday.getFullYear()}`;
  }
  return `${fmtDate(monday)} – ${fmtDate(sunday)} ${sunday.getFullYear()}`;
}

function fmtDuration(min: number): string {
  if (min < 60) return `${min}min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, "0")}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScoreRow({
  label, value, onChange, color,
}: { label: string; value: number; onChange: (v: number) => void; color: string }) {
  return (
    <div style={{ marginBottom: "1.1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, alignItems: "center" }}>
        <label style={{ fontSize: "0.82rem", color: C.textSoft }}>{label}</label>
        <span style={{ fontSize: "1.4rem", fontWeight: 700, color }}>{value}<span style={{ fontSize: "0.72rem", color: C.textDim }}>/10</span></span>
      </div>
      <input
        type="range" min={1} max={10} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: color, cursor: "pointer" }}
      />
      <ProgressBar value={value * 10} color={color} height={3} />
    </div>
  );
}

function TextBlock({
  label, value, onChange, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div style={formRow}>
      <label style={labelStyle}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          background: C.bgDeep,
          border: `1px solid ${C.border}`,
          borderRadius: 6,
          padding: "0.5rem 0.75rem",
          color: C.text,
          fontSize: "0.85rem",
          outline: "none",
          resize: "vertical",
          minHeight: 60,
          boxSizing: "border-box",
          lineHeight: 1.5,
        }}
      />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function RetrospectiveView() {
  const appConfig = useStore((s) => s.appConfig);
  const weeklyRetros = useStore((s) => s.weeklyRetros);
  const upsertWeeklyRetro = useStore((s) => s.upsertWeeklyRetro);
  const removeWeeklyRetro = useStore((s) => s.removeWeeklyRetro);
  const scheduleSlots = useStore((s) => s.scheduleSlots);
  const workModes = useStore((s) => s.workModes);
  const retroWeekOffset = useStore((s) => s.retroWeekOffset);
  const setRetroWeekOffset = useStore((s) => s.setRetroWeekOffset);
  const setActiveView = useStore((s) => s.setActiveView);

  const monday = useMemo(() => getMondayOfWeek(retroWeekOffset), [retroWeekOffset]);
  const weekKey = useMemo(() => getISOWeekKey(monday), [monday]);

  const existing = useMemo(
    () => weeklyRetros.find((r) => r.weekKey === weekKey),
    [weeklyRetros, weekKey]
  );

  // Form state – reset when week changes via lastLoadedWeek
  const [energy, setEnergy] = useState(existing?.energyScore ?? 7);
  const [satisfaction, setSatisfaction] = useState(existing?.satisfactionScore ?? 7);
  const [completion, setCompletion] = useState(existing?.completionPct ?? 0);
  const [accomplished, setAccomplished] = useState(existing?.accomplished ?? "");
  const [blockers, setBlockers] = useState(existing?.blockers ?? "");
  const [learnings, setLearnings] = useState(existing?.learnings ?? "");
  const [nextIntent, setNextIntent] = useState(existing?.nextWeekIntent ?? "");
  const [saved, setSaved] = useState(false);

  const [lastLoadedWeek, setLastLoadedWeek] = useState(weekKey);
  if (weekKey !== lastLoadedWeek) {
    const ex = weeklyRetros.find((r) => r.weekKey === weekKey);
    setEnergy(ex?.energyScore ?? 7);
    setSatisfaction(ex?.satisfactionScore ?? 7);
    setCompletion(ex?.completionPct ?? 0);
    setAccomplished(ex?.accomplished ?? "");
    setBlockers(ex?.blockers ?? "");
    setLearnings(ex?.learnings ?? "");
    setNextIntent(ex?.nextWeekIntent ?? "");
    setSaved(false);
    setLastLoadedWeek(weekKey);
  }

  // Scheduled slots for this week
  const weekSlots = useMemo(
    () => scheduleSlots.filter((s) => s.weekKey === weekKey),
    [scheduleSlots, weekKey]
  );

  const totalUtCount = weekSlots.reduce((acc, s) => acc + s.utCount, 0);
  const totalPlannedMin = weekSlots.reduce((acc, s) => acc + s.durationMin, 0);

  const slotsByMode = useMemo(() => {
    const map: Record<string, number> = {};
    for (const s of weekSlots) {
      const key = s.workModeId ?? "__none__";
      map[key] = (map[key] ?? 0) + s.durationMin;
    }
    return map;
  }, [weekSlots]);

  const sortedRetros = useMemo(
    () => [...weeklyRetros].sort((a, b) => b.weekKey.localeCompare(a.weekKey)),
    [weeklyRetros]
  );

  const currentISOWeekKey = getISOWeekKey(new Date());
  const isFutureWeek = weekKey > currentISOWeekKey;

  function handleSave() {
    upsertWeeklyRetro({
      weekKey,
      energyScore: energy,
      satisfactionScore: satisfaction,
      completionPct: completion,
      accomplished,
      blockers,
      learnings,
      nextWeekIntent: nextIntent,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function goToCalendar() {
    // Sync calendar week to retro week before navigating
    setActiveView("weekly-calendar");
  }

  return (
    <div>
      <SectionTitle
        sub={fmtWeekRange(monday)}
        action={
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button
              onClick={goToCalendar}
              style={{ background: "none", border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: "0.78rem" }}
            >
              ← Calendar
            </button>
            <button onClick={() => setRetroWeekOffset(retroWeekOffset - 1)} style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: "0.82rem" }}>&#8249;</button>
            <button onClick={() => setRetroWeekOffset(-1)} style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: "0.75rem" }}>Last week</button>
            <button onClick={() => setRetroWeekOffset(retroWeekOffset + 1)} style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: "0.82rem" }}>&#8250;</button>
            {existing && (
              <button
                onClick={() => { if (confirm("Delete this retro?")) removeWeeklyRetro(weekKey); }}
                style={{ background: "none", border: `1px solid ${C.red}40`, color: C.red, borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: "0.75rem" }}
              >
                Delete
              </button>
            )}
          </div>
        }
      >
        Retrospective
        {existing && <span style={{ marginLeft: 10, fontSize: "0.7rem", color: C.green }}>✓ saved</span>}
      </SectionTitle>

      {isFutureWeek && (
        <div style={{ padding: "0.75rem 1rem", background: `${C.amber}15`, border: `1px solid ${C.amber}40`, borderRadius: 8, marginBottom: "1.25rem", fontSize: "0.82rem", color: C.amber }}>
          This is a future week. You can pre-fill your intent.
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.5rem", alignItems: "start" }}>
        {/* Left: form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <Card>
            <div style={{ fontSize: "0.7rem", color: C.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>
              Weekly Scores
            </div>
            <ScoreRow label={appConfig.energyLabel} value={energy} onChange={setEnergy} color={C.amber} />
            <ScoreRow label={appConfig.satisfactionLabel} value={satisfaction} onChange={setSatisfaction} color={C.green} />
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, alignItems: "center" }}>
                <label style={{ fontSize: "0.82rem", color: C.textSoft }}>{appConfig.capacityLabel} completed</label>
                <span style={{ fontSize: "1.4rem", fontWeight: 700, color: C.accent }}>{completion}<span style={{ fontSize: "0.72rem", color: C.textDim }}>%</span></span>
              </div>
              <input type="range" min={0} max={100} step={5} value={completion} onChange={(e) => setCompletion(Number(e.target.value))} style={{ width: "100%", accentColor: C.accent, cursor: "pointer" }} />
              <ProgressBar value={completion} color={C.accent} height={3} />
            </div>
          </Card>

          <Card>
            <TextBlock label="✅ Accomplished" value={accomplished} onChange={setAccomplished} placeholder="What did you get done this week?" />
            <TextBlock label="🚧 Blockers / friction" value={blockers} onChange={setBlockers} placeholder="What got in the way?" />
            <TextBlock label="💡 Learnings" value={learnings} onChange={setLearnings} placeholder="What did you discover or learn?" />
            <TextBlock label="🎯 Next week intent" value={nextIntent} onChange={setNextIntent} placeholder="What's the focus for next week?" />
          </Card>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            {saved && <span style={{ fontSize: "0.82rem", color: C.green, alignSelf: "center" }}>✓ Saved</span>}
            <button onClick={handleSave} style={{ ...btnPrimary, padding: "0.55rem 1.5rem" }}>
              Save retro
            </button>
          </div>
        </div>

        {/* Right: week summary + history */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Calendar summary for this week */}
          <Card>
            <div style={{ fontSize: "0.7rem", color: C.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>
              Calendar summary
            </div>
            {weekSlots.length === 0 ? (
              <div>
                <p style={{ color: C.textVeryDim, fontSize: "0.82rem", margin: "0 0 0.5rem" }}>No slots planned for this week.</p>
                <button onClick={goToCalendar} style={{ ...btnSecondary, fontSize: "0.78rem" }}>Open calendar →</button>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "0.82rem", color: C.textMuted }}>{totalUtCount} {appConfig.timeUnitLabel}</span>
                  <span style={{ fontSize: "0.82rem", color: C.textMuted }}>{fmtDuration(totalPlannedMin)} total</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {Object.entries(slotsByMode).map(([modeId, minutes]) => {
                    const mode = workModes.find((m) => m.id === modeId);
                    const pct = totalPlannedMin > 0 ? Math.round((minutes / totalPlannedMin) * 100) : 0;
                    return (
                      <div key={modeId}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <span style={{ width: 8, height: 8, borderRadius: 2, background: mode?.color ?? C.textDim, display: "inline-block", flexShrink: 0 }} />
                            <span style={{ fontSize: "0.75rem", color: C.textSoft }}>{mode?.name ?? "No mode"}</span>
                          </div>
                          <span style={{ fontSize: "0.72rem", color: C.textDim }}>{fmtDuration(minutes)}</span>
                        </div>
                        <ProgressBar value={pct} color={mode?.color ?? C.textDim} height={3} />
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </Card>

          {/* History */}
          <div>
            <div style={{ fontSize: "0.7rem", color: C.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
              History ({weeklyRetros.length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 420, overflowY: "auto" }}>
              {sortedRetros.length === 0 && (
                <p style={{ color: C.textVeryDim, fontSize: "0.82rem" }}>No retros saved yet.</p>
              )}
              {sortedRetros.map((retro) => {
                const isActive = retro.weekKey === weekKey;
                const avg = Math.round((retro.energyScore + retro.satisfactionScore) / 2);
                const color = avg >= 8 ? C.green : avg >= 6 ? C.amber : C.red;
                return (
                  <button
                    key={retro.id}
                    onClick={() => {
                      // Find offset for this weekKey
                      const retroMonday = new Date(retro.weekKey + "-1"); // approximate
                      const todayMonday = getMondayOfWeek(0);
                      const diff = Math.round((retroMonday.getTime() - todayMonday.getTime()) / (7 * 86400000));
                      setRetroWeekOffset(diff);
                    }}
                    style={{
                      background: isActive ? `${C.accent}15` : C.surface,
                      border: `1px solid ${isActive ? C.accent + "50" : C.border}`,
                      borderRadius: 8,
                      padding: "0.6rem 0.75rem",
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                      <span style={{ fontSize: "0.8rem", color: isActive ? C.accent : C.text, fontWeight: isActive ? 600 : 400 }}>
                        {retro.weekKey}
                      </span>
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color }}>{avg}/10</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, fontSize: "0.7rem", color: C.textDim }}>
                      <span>⚡ {retro.energyScore}</span>
                      <span>✓ {retro.satisfactionScore}</span>
                      <span>{retro.completionPct}%</span>
                    </div>
                    {retro.accomplished && (
                      <div style={{ fontSize: "0.7rem", color: C.textMuted, marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {retro.accomplished}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
