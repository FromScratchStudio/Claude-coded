import { useState, useMemo, useEffect } from "react";
import { useStore } from "../../store/useStore";
import { C } from "../../theme";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { SectionTitle } from "../ui/SectionTitle";
import { Card } from "../ui/Card";
import { ProgressBar } from "../ui/ProgressBar";
import { labelStyle, formRow, btnPrimary, btnSecondary } from "../ui/Modal";
import { formatHourToTime, getSlotFallbackEndTime } from "../../utils/scheduleSlot";

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
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DEFAULT_EFFECTIVE_PCT = 100;

function getEffectivePct(value?: number): number {
  const safeValue = typeof value === "number" && Number.isFinite(value) ? value : DEFAULT_EFFECTIVE_PCT;
  return Math.max(0, Math.min(100, safeValue));
}

function getEffectiveStars(value: number): number {
  return Math.max(0, Math.min(5, Math.round(value / 20)));
}

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

function isUnplannedSlot(slot: { slotType?: string }): boolean {
  return (slot.slotType ?? "planned") === "unplanned";
}

/** Returns the Monday (UTC midnight) for the given ISO year+week. */
function getMondayOfISOWeek(year: number, week: number): Date {
  // Jan 4 of any year is always in ISO week 1
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const dayOfWeek = jan4.getUTCDay() || 7; // Mon=1 … Sun=7
  const monday = new Date(jan4);
  monday.setUTCDate(jan4.getUTCDate() - dayOfWeek + 1 + (week - 1) * 7);
  return monday;
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
  const defaultSlotDurationMin = useStore((s) => s.defaultSlotDurationMin);
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

  // Reset form fields only when the displayed week changes.
  // weeklyRetros is intentionally excluded from deps: including it would reset
  // the form every time the user saves, discarding edits in progress.
  useEffect(() => {
    const ex = weeklyRetros.find((r) => r.weekKey === weekKey);
    setEnergy(ex?.energyScore ?? 7);
    setSatisfaction(ex?.satisfactionScore ?? 7);
    setCompletion(ex?.completionPct ?? 0);
    setAccomplished(ex?.accomplished ?? "");
    setBlockers(ex?.blockers ?? "");
    setLearnings(ex?.learnings ?? "");
    setNextIntent(ex?.nextWeekIntent ?? "");
    setSaved(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- see comment above
  }, [weekKey]);

  // Scheduled slots for this week
  const weekSlots = useMemo(
    () => scheduleSlots.filter((s) => s.weekKey === weekKey),
    [scheduleSlots, weekKey]
  );

  const plannedWeekSlots = useMemo(
    () => weekSlots.filter((slot) => !isUnplannedSlot(slot)),
    [weekSlots]
  );
  const unplannedSlots = useMemo(
    () =>
      weekSlots
        .filter((slot) => isUnplannedSlot(slot))
        .sort((a, b) => {
          if (a.day !== b.day) return a.day - b.day;
          const aStart = a.startTime ?? `${String(a.hour).padStart(2, "0")}:00`;
          const bStart = b.startTime ?? `${String(b.hour).padStart(2, "0")}:00`;
          return aStart.localeCompare(bStart);
        }),
    [weekSlots]
  );

  const totalUtCount = plannedWeekSlots.reduce((acc, s) => acc + s.utCount, 0);
  const totalPlannedMin = plannedWeekSlots.reduce((acc, s) => acc + s.durationMin, 0);
  const effectivePlannedMin = plannedWeekSlots.reduce(
    (acc, s) => acc + s.durationMin * (getEffectivePct(s.effectivePct) / 100),
    0
  );
  const effectiveCompletionPct = totalPlannedMin > 0
    ? Math.round((effectivePlannedMin / totalPlannedMin) * 100)
    : 0;
  const effectiveStars = getEffectiveStars(effectiveCompletionPct);
  const effectiveStarsLabel = `${"★".repeat(effectiveStars)}${"☆".repeat(5 - effectiveStars)}`;
  const totalUnplannedMin = unplannedSlots.reduce((acc, s) => acc + s.durationMin, 0);
  const totalCalendarMin = totalPlannedMin + totalUnplannedMin;
  const unplannedShareOfCalendar = totalCalendarMin > 0 ? Math.round((totalUnplannedMin / totalCalendarMin) * 100) : 0;
  const unplannedUtEquivalent = defaultSlotDurationMin > 0 ? totalUnplannedMin / defaultSlotDurationMin : 0;
  const unplannedVsPlannedUtPct = totalUtCount > 0 ? Math.round((unplannedUtEquivalent / totalUtCount) * 100) : 0;
  const unplannedUtEquivalentLabel = unplannedUtEquivalent > 0 && unplannedUtEquivalent < 0.1
    ? "< 0.1"
    : unplannedUtEquivalent.toFixed(1);

  const slotsByMode = useMemo(() => {
    const map: Record<string, number> = {};
    for (const s of plannedWeekSlots) {
      const key = s.workModeId ?? "__none__";
      map[key] = (map[key] ?? 0) + s.durationMin;
    }
    return map;
  }, [plannedWeekSlots]);

  const sortedRetros = useMemo(
    () => [...weeklyRetros].sort((a, b) => b.weekKey.localeCompare(a.weekKey)),
    [weeklyRetros]
  );

  const currentISOWeekKey = getISOWeekKey(new Date());
  const isFutureWeek = weekKey > currentISOWeekKey;

  const { isMobile } = useBreakpoint();

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

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 320px", gap: "1.5rem", alignItems: "start" }}>
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
                  <span style={{ fontSize: "0.82rem", color: C.textMuted }}>{fmtDuration(totalPlannedMin)} planned</span>
                </div>
                <div style={{ marginBottom: "0.75rem", padding: "0.5rem 0.65rem", border: `1px solid ${C.border}`, borderRadius: 6, background: C.surfaceAlt }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ fontSize: "0.76rem", color: C.textMuted }}>Effective completion</span>
                    <span style={{ fontSize: "0.76rem", color: C.accent, fontWeight: 700 }}>{effectiveCompletionPct}%</span>
                  </div>
                  <div style={{ marginTop: 3, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: "0.9rem", color: C.amber, letterSpacing: "0.04em" }}>{effectiveStarsLabel}</span>
                    <span style={{ fontSize: "0.7rem", color: C.textDim }}>based on slot-level effective %</span>
                  </div>
                </div>
                <div style={{ marginBottom: "0.75rem", padding: "0.55rem 0.65rem", border: `1px solid ${C.border}`, borderRadius: 6, background: C.surfaceAlt }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: "0.76rem", color: C.textMuted }}>
                    <span>Unplanned volume</span>
                    <span style={{ color: C.orange, fontWeight: 600 }}>{fmtDuration(totalUnplannedMin)}</span>
                  </div>
                  <div style={{ marginTop: 4, fontSize: "0.72rem", color: C.textDim, lineHeight: 1.4 }}>
                    {totalUtCount > 0
                      ? `${unplannedUtEquivalentLabel} ${appConfig.timeUnitLabel} equivalent (${unplannedVsPlannedUtPct}% of planned ${appConfig.timeUnitLabel})`
                      : `0 ${appConfig.timeUnitLabel} planned this week`}
                    {" · "}
                    {totalCalendarMin > 0
                      ? `${unplannedShareOfCalendar}% of recorded calendar time (total: ${fmtDuration(totalCalendarMin)})`
                      : "No recorded calendar time"}
                  </div>
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
                {unplannedSlots.length > 0 && (
                  <div style={{ marginTop: "0.85rem", borderTop: `1px solid ${C.border}`, paddingTop: "0.75rem" }}>
                    <div style={{ fontSize: "0.72rem", color: C.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
                      Unplanned tasks ({unplannedSlots.length})
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      {unplannedSlots.map((slot) => (
                        <div key={slot.id} style={{ border: `1px solid ${C.orange}40`, background: `${C.orange}10`, borderRadius: 6, padding: "0.45rem 0.55rem" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: slot.description ? 3 : 0 }}>
                            <span style={{ fontSize: "0.74rem", color: C.orange, fontWeight: 600 }}>{slot.title || "Unplanned task"}</span>
                            <span style={{ fontSize: "0.7rem", color: C.textMuted }}>
                              {DAYS[slot.day]} · {slot.startTime ?? formatHourToTime(slot.hour)}–{slot.endTime ?? getSlotFallbackEndTime(slot.hour, slot.durationMin)}
                            </span>
                          </div>
                          {slot.description && (
                            <div style={{ fontSize: "0.72rem", color: C.textMuted }}>{slot.description}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                      // Parse YYYY-Wnn reliably instead of relying on Date string parsing
                      const match = retro.weekKey.match(/^(\d{4})-W(\d{2})$/);
                      if (!match) return;
                      const retroMonday = getMondayOfISOWeek(Number(match[1]), Number(match[2]));
                      const todayMonday = getMondayOfWeek(0);
                      const diff = Math.round((retroMonday.getTime() - todayMonday.getTime()) / (7 * 86400000));
                      setRetroWeekOffset(diff);
                    }}
                    style={{
                      background: isActive ? `color-mix(in srgb, var(--accent) 15%, transparent)` : C.surface,
                      border: `1px solid ${isActive ? `color-mix(in srgb, var(--accent) 50%, transparent)` : C.border}`,
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
