import { useState, useMemo, useRef, useEffect } from "react";
import { C, FONT } from "../../theme";
import { useStore } from "../../store/useStore";
import { WORK_MODES } from "../../data/workflow";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import type { DayIndex, ScheduleSlot } from "../../types";

// ─── Constants ────────────────────────────────────────────────────────────────

const HOURS = Array.from({ length: 17 }, (_, i) => i + 6); // 06:00–22:00
const DAYS_SHORT = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

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
  const dayOfWeek = today.getDay();
  const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
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

function isToday(date: Date): boolean {
  const t = new Date();
  return (
    date.getDate() === t.getDate() &&
    date.getMonth() === t.getMonth() &&
    date.getFullYear() === t.getFullYear()
  );
}

function fmtDate(date: Date): string {
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function fmtHour(h: number): string {
  return `${String(h).padStart(2, "0")}:00`;
}

function fmtDuration(min: number): string {
  if (min < 60) return `${min}min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, "0")}`;
}

function fmtTime(totalMin: number): string {
  if (totalMin === 0) return "0min";
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h${String(m).padStart(2, "0")}`;
}

// ─── Slot editor modal ────────────────────────────────────────────────────────

interface SlotEditorProps {
  day: DayIndex;
  hour: number;
  weekKey: string;
  slotDurationMin: number;
  existingSlot: ScheduleSlot | undefined;
  onSave: (data: { workModeId: string | null; projectId: string | null; note: string; utCount: number }) => void;
  onClear: () => void;
  onClose: () => void;
}

function SlotEditor({ day, hour, slotDurationMin, existingSlot, onSave, onClear, onClose }: SlotEditorProps) {
  const projects = useStore((s) => s.projects);
  const [workModeId, setWorkModeId] = useState<string | null>(existingSlot?.workModeId ?? null);
  const [projectId, setProjectId] = useState<string | null>(existingSlot?.projectId ?? null);
  const [note, setNote] = useState(existingSlot?.note ?? "");
  const [utCount, setUtCount] = useState<number>(existingSlot?.utCount ?? 1);

  const durationMin = utCount * slotDurationMin;
  const endTotalMin = hour * 60 + durationMin;
  const endLabel = `${String(Math.floor(endTotalMin / 60)).padStart(2, "0")}:${String(endTotalMin % 60).padStart(2, "0")}`;

  const inp = {
    background: C.surfaceAlt,
    border: `1px solid ${C.border}`,
    color: C.text,
    borderRadius: 4,
    padding: "0.25rem 0.5rem",
    fontSize: "0.75rem",
    fontFamily: FONT.body,
    width: "100%",
    outline: "none",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.borderLight}`,
          borderRadius: 10,
          padding: "1.5rem",
          width: "100%",
          maxWidth: 440,
          display: "flex",
          flexDirection: "column",
          gap: "1.1rem",
        }}
      >
        {/* Title + time range */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.6rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: FONT.display, fontSize: "1rem", color: C.text }}>
              {DAYS_SHORT[day]}
            </span>
            <span
              style={{
                fontFamily: FONT.mono,
                fontSize: "0.78rem",
                color: C.gold,
                fontWeight: "bold",
                letterSpacing: "0.02em",
              }}
            >
              {fmtHour(hour)}–{endLabel}
            </span>
            <span
              style={{
                fontFamily: FONT.mono,
                fontSize: "0.6rem",
                color: C.textVeryDim,
                background: C.surfaceAlt,
                border: `1px solid ${C.border}`,
                borderRadius: 4,
                padding: "0.1rem 0.4rem",
              }}
            >
              {fmtDuration(durationMin)}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "1.2rem", lineHeight: 1 }}
          >×</button>
        </div>

        {/* UT count picker */}
        <div>
          <div style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, marginBottom: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Nombre d’UT
          </div>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {[1, 2, 3, 4, 6].map((n) => {
              const dur = n * slotDurationMin;
              const endMin = hour * 60 + dur;
              const el = `${String(Math.floor(endMin / 60)).padStart(2, "0")}:${String(endMin % 60).padStart(2, "0")}`;
              const active = utCount === n;
              return (
                <button
                  key={n}
                  onClick={() => setUtCount(n)}
                  style={{
                    background: active ? `${C.gold}22` : C.surfaceAlt,
                    border: `1px solid ${active ? C.gold : C.border}`,
                    color: active ? C.gold : C.textMuted,
                    borderRadius: 6,
                    padding: "0.3rem 0.6rem",
                    cursor: "pointer",
                    fontFamily: FONT.mono,
                    fontSize: "0.65rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                    lineHeight: 1.3,
                    fontWeight: active ? "bold" : "normal",
                    transition: "background 0.12s, border-color 0.12s",
                  }}
                >
                  <span>{n} UT</span>
                  <span style={{ fontSize: "0.55rem", color: active ? C.gold : C.textVeryDim }}>
                    {fmtDuration(dur)}
                  </span>
                  <span style={{ fontSize: "0.5rem", color: active ? C.gold + "99" : C.textVeryDim }}>
                    → {el}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Work mode picker */}
        <div>
          <div style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, marginBottom: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Mode de travail
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {WORK_MODES.map((m) => {
              const active = workModeId === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setWorkModeId(active ? null : m.id)}
                  title={m.desc}
                  style={{
                    background: active ? m.color : C.surfaceAlt,
                    border: `1px solid ${active ? m.color : C.border}`,
                    color: active ? "#000" : C.textMuted,
                    borderRadius: 5,
                    padding: "0.3rem 0.65rem",
                    fontSize: "0.68rem",
                    fontFamily: FONT.mono,
                    cursor: "pointer",
                    fontWeight: active ? "bold" : "normal",
                    transition: "background 0.15s, color 0.15s",
                  }}
                >
                  {m.name}
                </button>
              );
            })}
          </div>
          {workModeId && (
            <div style={{ marginTop: "0.45rem", fontSize: "0.62rem", color: C.textDim, fontStyle: "italic" }}>
              {WORK_MODES.find((m) => m.id === workModeId)?.desc}
            </div>
          )}
        </div>

        {/* Project link */}
        <div>
          <div style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, marginBottom: "0.35rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Projet lié (optionnel)
          </div>
          <select
            value={projectId ?? ""}
            onChange={(e) => setProjectId(e.target.value || null)}
            style={{ ...inp, fontFamily: FONT.mono, fontSize: "0.72rem", cursor: "pointer" }}
          >
            <option value="">— Aucun projet —</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Note */}
        <div>
          <div style={{ fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, marginBottom: "0.35rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Note
          </div>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { onSave({ workModeId, projectId, note, utCount }); onClose(); } }}
            placeholder="Objectif, description…"
            style={inp}
          />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "space-between", alignItems: "center" }}>
          {existingSlot ? (
            <button
              onClick={() => { onClear(); onClose(); }}
              style={{
                background: "none",
                border: `1px solid ${C.red}55`,
                color: C.red,
                borderRadius: 6,
                padding: "0.35rem 0.8rem",
                cursor: "pointer",
                fontSize: "0.7rem",
                fontFamily: FONT.mono,
              }}
            >
              Effacer
            </button>
          ) : <div />}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: `1px solid ${C.border}`,
                color: C.textDim,
                borderRadius: 6,
                padding: "0.35rem 0.8rem",
                cursor: "pointer",
                fontSize: "0.7rem",
                fontFamily: FONT.mono,
              }}
            >
              Annuler
            </button>
            <button
              onClick={() => { onSave({ workModeId, projectId, note, utCount }); onClose(); }}
              style={{
                background: C.gold,
                border: "none",
                color: "#000",
                borderRadius: 6,
                padding: "0.35rem 0.9rem",
                cursor: "pointer",
                fontSize: "0.7rem",
                fontFamily: FONT.mono,
                fontWeight: "bold",
              }}
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Copy week modal ──────────────────────────────────────────────────────────

interface CopyWeekModalProps {
  sourceWeekKey: string;
  sourceSlots: ScheduleSlot[];
  onCopy: (targetWeekKey: string) => void;
  onClose: () => void;
}

function CopyWeekModal({ sourceWeekKey, sourceSlots, onCopy, onClose }: CopyWeekModalProps) {
  const [targetOffset, setTargetOffset] = useState(1);

  const targetMonday = getMondayOfWeek(targetOffset);
  const targetWeekKey = getISOWeekKey(targetMonday);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.borderLight}`,
          borderRadius: 10,
          padding: "1.5rem",
          width: "100%",
          maxWidth: 380,
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div style={{ fontFamily: FONT.display, fontSize: "1rem", color: C.text }}>Copier le planning</div>
        <div style={{ fontSize: "0.72rem", color: C.textSoft }}>
          Copie les <strong style={{ color: C.gold }}>{sourceSlots.length} créneau{sourceSlots.length !== 1 ? "x" : ""}</strong> de{" "}
          <span style={{ color: C.textDim, fontFamily: FONT.mono }}>{sourceWeekKey}</span> vers :
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            onClick={() => setTargetOffset((o) => o - 1)}
            disabled={targetWeekKey === sourceWeekKey}
            style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 6, padding: "0.3rem 0.65rem", cursor: "pointer", fontFamily: FONT.mono, fontSize: "0.75rem" }}
          >‹</button>
          <div style={{ flex: 1, textAlign: "center", fontFamily: FONT.mono, fontSize: "0.72rem", color: C.gold }}>
            {targetWeekKey}
          </div>
          <button
            onClick={() => setTargetOffset((o) => o + 1)}
            style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 6, padding: "0.3rem 0.65rem", cursor: "pointer", fontFamily: FONT.mono, fontSize: "0.75rem" }}
          >›</button>
        </div>
        {targetWeekKey === sourceWeekKey && (
          <div style={{ fontSize: "0.65rem", color: C.red, fontFamily: FONT.mono }}>
            La semaine cible ne peut pas être la même que la source.
          </div>
        )}
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: "none", border: `1px solid ${C.border}`, color: C.textDim, borderRadius: 6, padding: "0.35rem 0.8rem", cursor: "pointer", fontSize: "0.7rem", fontFamily: FONT.mono }}>Annuler</button>
          <button
            onClick={() => { onCopy(targetWeekKey); onClose(); }}
            disabled={targetWeekKey === sourceWeekKey}
            style={{ background: targetWeekKey === sourceWeekKey ? C.border : C.gold, border: "none", color: "#000", borderRadius: 6, padding: "0.35rem 0.9rem", cursor: targetWeekKey === sourceWeekKey ? "default" : "pointer", fontSize: "0.7rem", fontFamily: FONT.mono, fontWeight: "bold" }}
          >
            Copier
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────

export default function WeeklyCalendarView() {
  const scheduleSlots = useStore((s) => s.scheduleSlots);
  const projects = useStore((s) => s.projects);
  const addScheduleSlot = useStore((s) => s.addScheduleSlot);
  const updateScheduleSlot = useStore((s) => s.updateScheduleSlot);
  const removeScheduleSlot = useStore((s) => s.removeScheduleSlot);
  const clearWeekSlots = useStore((s) => s.clearWeekSlots);
  const setActiveView = useStore((s) => s.setActiveView);
  const degradedMode = useStore((s) => s.degradedMode);
  const degradedModes = useStore((s) => s.degradedModes);
  const defaultSlotDurationMin = useStore((s) => s.defaultSlotDurationMin);

  const activeGardeFou = degradedMode ? degradedModes.find((m) => m.id === degradedMode) : undefined;
  /** Règle : régime normal → 1 UT = defaultSlotDurationMin (90min) ; tout autre régime → 1 UT = 45min */
  const effectiveSlotDurationMin = activeGardeFou ? 45 : defaultSlotDurationMin;

  const [weekOffset, setWeekOffset] = useState(0);
  const [editing, setEditing] = useState<{ day: DayIndex; hour: number } | null>(null);
  const [showCopy, setShowCopy] = useState(false);

  const monday = useMemo(() => getMondayOfWeek(weekOffset), [weekOffset]);
  const weekKey = useMemo(() => getISOWeekKey(monday), [monday]);
  const weekDates = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(monday, i)), [monday]);

  // Slots for this week, indexed by "day-hour"
  const slotMap = useMemo(() => {
    const map = new Map<string, ScheduleSlot>();
    scheduleSlots
      .filter((s) => s.weekKey === weekKey)
      .forEach((s) => map.set(`${s.day}-${s.hour}`, s));
    return map;
  }, [scheduleSlots, weekKey]);

  const weekSlots = useMemo(
    () => scheduleSlots.filter((s) => s.weekKey === weekKey),
    [scheduleSlots, weekKey]
  );

  // Stats
  const totalSlots = weekSlots.length;
  const totalMinutes = useMemo(
    () => weekSlots.reduce((sum, s) => sum + (s.durationMin ?? defaultSlotDurationMin), 0),
    [weekSlots, defaultSlotDurationMin]
  );

  const minsByMode = useMemo(() => {
    const map: Record<string, number> = {};
    weekSlots.forEach((s) => {
      const key = s.workModeId ?? "__none__";
      map[key] = (map[key] ?? 0) + (s.durationMin ?? defaultSlotDurationMin);
    });
    return map;
  }, [weekSlots, defaultSlotDurationMin]);

  const minsByDay = useMemo(() => {
    const arr = [0, 0, 0, 0, 0, 0, 0];
    weekSlots.forEach((s) => { arr[s.day] += (s.durationMin ?? defaultSlotDurationMin); });
    return arr;
  }, [weekSlots, defaultSlotDurationMin]);

  // Day slots map (for absolute-position rendering)
  const timeColW = 52;
  const hourH = 56;  // px per hour
  const gridH = HOURS.length * hourH;  // total grid height px

  // ─── PDF / Print export ──────────────────────────────────────────────────
  function printWeekPlan() {
    const DAYS_FULL = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

    // Build per-day slot list sorted by hour
    const slotsByDay: ScheduleSlot[][] = Array.from({ length: 7 }, (_, d) =>
      weekSlots.filter((s) => s.day === d).sort((a, b) => a.hour - b.hour)
    );

    const totalMinutesLocal = weekSlots.reduce((sum, s) => sum + s.durationMin, 0);

    const minsByModeLocal: Record<string, number> = {};
    weekSlots.forEach((s) => {
      const key = s.workModeId ?? "__none__";
      minsByModeLocal[key] = (minsByModeLocal[key] ?? 0) + s.durationMin;
    });

    // Date range label
    const firstDate = weekDates[0];
    const lastDate = weekDates[6];
    const MONTHS_FR = ["jan", "fév", "mar", "avr", "mai", "jun", "jul", "aoû", "sep", "oct", "nov", "déc"];
    const dateRangeLabel =
      `${firstDate.getDate()} ${MONTHS_FR[firstDate.getMonth()]} → ${lastDate.getDate()} ${MONTHS_FR[lastDate.getMonth()]} ${lastDate.getFullYear()}`;

    // Slot HTML builder
    function slotHtml(slot: ScheduleSlot): string {
      const mode = slot.workModeId ? WORK_MODES.find((m) => m.id === slot.workModeId) : undefined;
      const project = slot.projectId ? projects.find((p) => p.id === slot.projectId) : undefined;
      const endTotalMin = slot.hour * 60 + slot.durationMin;
      const endLbl = `${String(Math.floor(endTotalMin / 60)).padStart(2, "0")}:${String(endTotalMin % 60).padStart(2, "0")}`;
      const color = mode?.color ?? "#888888";
      const utLabel = `${slot.utCount ?? 1}\u00a0UT\u00a0·\u00a0${fmtDuration(slot.durationMin)}`;
      return `
        <div style="border-radius:3px;padding:4px 6px;border-left:3px solid ${color};background:${color}18;margin-bottom:3px;">
          <div style="font-size:7.5pt;font-weight:bold;color:#111;">${fmtHour(slot.hour)}\u2013${endLbl}</div>
          <div style="font-size:7pt;color:#333;margin-top:1px;">${mode?.name ?? "Créneau libre"} <span style="color:#888;font-size:6.5pt;">(${utLabel})</span></div>
          ${project ? `<div style="font-size:6.5pt;color:#555;margin-top:1px;">&#128204; ${project.name}</div>` : ""}
          ${slot.note ? `<div style="font-size:6pt;color:#777;font-style:italic;margin-top:2px;">${slot.note}</div>` : ""}
        </div>`;
    }

    // Day column HTML
    function dayColHtml(dayIdx: number): string {
      const date = weekDates[dayIdx];
      const isWe = dayIdx >= 5;
      const todayFlag = isToday(date);
      const dayMins = slotsByDay[dayIdx].reduce((s, sl) => s + sl.durationMin, 0);
      const headerBg = todayFlag ? "#fff8e0" : isWe ? "#f5f5f5" : "#f0f0f0";
      const slots = slotsByDay[dayIdx];
      return `
        <div style="border:1px solid #ccc;border-radius:4px;overflow:hidden;min-height:60px;break-inside:avoid;">
          <div style="padding:4px 6px;background:${headerBg};border-bottom:1px solid #ddd;">
            <div style="font-size:6.5pt;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;color:${todayFlag ? "#b8860b" : isWe ? "#888" : "#333"};">${DAYS_SHORT[dayIdx]}${todayFlag ? " ★" : ""}</div>
            <div style="font-size:8pt;font-weight:bold;color:${todayFlag ? "#b8860b" : "#111"};">${DAYS_FULL[dayIdx].slice(0, 3)}. ${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}</div>
            ${dayMins > 0 ? `<div style="font-size:6pt;color:#888;margin-top:1px;">${fmtTime(dayMins)}</div>` : ""}
          </div>
          <div style="padding:4px;">
            ${slots.length > 0 ? slots.map(slotHtml).join("") : '<div style="font-size:6.5pt;color:#bbb;font-style:italic;padding:4px 0;">—</div>'}
          </div>
        </div>`;
    }

    // Stats HTML
    function statsHtml(): string {
      const modeRows = WORK_MODES
        .filter((m) => (minsByModeLocal[m.id] ?? 0) > 0)
        .map((m) => {
          const mins = minsByModeLocal[m.id] ?? 0;
          const pct = Math.round((mins / totalMinutesLocal) * 100);
          return `<div style="display:flex;align-items:center;gap:5px;margin-bottom:3px;">
            <div style="width:8px;height:8px;border-radius:50%;background:${m.color};flex-shrink:0;"></div>
            <span style="flex:1;font-size:7pt;color:#333;">${m.name}</span>
            <span style="font-size:7pt;color:#666;font-family:monospace;">${fmtTime(mins)}</span>
            <div style="width:50px;height:4px;background:#eee;border-radius:2px;overflow:hidden;">
              <div style="width:${pct}%;height:100%;background:${m.color};border-radius:2px;"></div>
            </div>
            <span style="font-size:6.5pt;color:#999;">${pct}%</span>
          </div>`;
        }).join("");

      const unassigned = minsByModeLocal["__none__"] ?? 0;
      const unassignedRow = unassigned > 0
        ? `<div style="display:flex;align-items:center;gap:5px;margin-bottom:3px;">
            <div style="width:8px;height:8px;border-radius:50%;background:#999;flex-shrink:0;"></div>
            <span style="flex:1;font-size:7pt;color:#666;">Sans mode</span>
            <span style="font-size:7pt;color:#666;">${fmtTime(unassigned)}</span>
            <div style="width:50px;"></div>
          </div>` : "";

      return `
        <div style="margin-top:10px;border-top:1px solid #ddd;padding-top:8px;display:flex;gap:16px;flex-wrap:wrap;">
          <div style="flex:1;min-width:160px;">
            <div style="font-size:7pt;font-weight:bold;text-transform:uppercase;letter-spacing:0.08em;color:#555;margin-bottom:5px;">Répartition par mode</div>
            ${modeRows}${unassignedRow}
          </div>
          <div style="min-width:140px;">
            <div style="font-size:7pt;font-weight:bold;text-transform:uppercase;letter-spacing:0.08em;color:#555;margin-bottom:5px;">Résumé</div>
            <div style="font-size:8pt;"><strong>${weekSlots.length}</strong> créneau${weekSlots.length !== 1 ? "x" : ""} planifié${weekSlots.length !== 1 ? "s" : ""}</div>
            <div style="font-size:8pt;margin-top:2px;"><strong>${fmtTime(totalMinutesLocal)}</strong> de travail total</div>
            <div style="font-size:7pt;color:#888;margin-top:2px;">1 UT = ${fmtDuration(effectiveSlotDurationMin)}${activeGardeFou ? ` (${activeGardeFou.label})` : " (régime normal)"}</div>
          </div>
        </div>`;
    }

    const html = `<!DOCTYPE html>
<html lang="fr"><head>
  <meta charset="UTF-8">
  <title>STRATEX \u00b7 Fiche priorit\u00e9s \u00b7 ${weekKey}</title>
  <style>
    @page { size: A4 portrait; margin: 12mm 10mm 10mm; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Courier New', Courier, monospace; font-size: 9pt; color: #111; background: #fff; }
  </style>
</head><body>

  <!-- Header -->
  <div style="border-bottom:2px solid #111;padding-bottom:8px;margin-bottom:10px;">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;">
      <div>
        <div style="font-size:13pt;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;">STRATEX \u00b7 Fiche priorit\u00e9s hebdomadaires</div>
        <div style="font-size:8.5pt;color:#444;margin-top:3px;">Semaine <strong>${weekKey}</strong> \u00b7 ${dateRangeLabel}</div>
        ${activeGardeFou ? `<div style="display:inline-block;margin-top:4px;padding:2px 8px;border:1px solid ${activeGardeFou.color};border-radius:3px;font-size:7pt;color:${activeGardeFou.color};">R\u00e9gime \u00ab ${activeGardeFou.label} \u00bb actif \u2014 1 UT = ${fmtDuration(effectiveSlotDurationMin)}</div>` : ""}
      </div>
      <div style="text-align:right;font-size:7pt;color:#999;">
        <div>G\u00e9n\u00e9r\u00e9 le ${new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
        <div style="margin-top:2px;">${weekSlots.length} cr\u00e9neau${weekSlots.length !== 1 ? "x" : ""} \u00b7 ${fmtTime(totalMinutesLocal)} total</div>
      </div>
    </div>
  </div>

  <!-- 7-day grid -->
  <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:5px;">
    ${Array.from({ length: 7 }, (_, i) => dayColHtml(i)).join("")}
  </div>

  ${statsHtml()}

  <!-- Footer -->
  <div style="margin-top:8px;text-align:center;font-size:6pt;color:#bbb;border-top:1px solid #eee;padding-top:4px;">
    STRATEX \u2014 Dashboard artiste ind\u00e9pendant \u00b7 ${weekKey}
  </div>

  <script>window.onload = function() { window.print(); };<\/script>
</body></html>`;

    const win = window.open("", "_blank", "width=900,height=700");
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  }

  // Per-day slot lists for rendering
  const daySlots = useMemo(() => {
    const map = new Map<DayIndex, ScheduleSlot[]>();
    ([0, 1, 2, 3, 4, 5, 6] as DayIndex[]).forEach((d) => map.set(d, []));
    weekSlots.forEach((s) => map.get(s.day)!.push(s));
    return map;
  }, [weekSlots]);

  // Current time indicators
  const now = new Date();
  const currentHour = now.getHours();
  const currentTimePx = (now.getHours() - HOURS[0] + now.getMinutes() / 60) * hourH;

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current && weekOffset === 0) {
      scrollRef.current.scrollTop = Math.max(0, currentTimePx - 160);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleColumnClick(day: DayIndex, e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const hour = Math.max(HOURS[0], Math.min(HOURS[HOURS.length - 1], Math.floor(y / hourH) + HOURS[0]));
    setEditing({ day, hour });
  }

  function handleSave(
    day: DayIndex,
    hour: number,
    data: { workModeId: string | null; projectId: string | null; note: string; utCount: number }
  ) {
    const { utCount, ...rest } = data;
    const durationMin = utCount * effectiveSlotDurationMin;
    const existing = slotMap.get(`${day}-${hour}`);
    if (existing) {
      updateScheduleSlot(existing.id, { ...rest, durationMin, utCount });
    } else {
      addScheduleSlot({ weekKey, day, hour, durationMin, utCount, ...rest });
    }
  }

  function handleClear(day: DayIndex, hour: number) {
    const existing = slotMap.get(`${day}-${hour}`);
    if (existing) removeScheduleSlot(existing.id);
  }

  function handleCopy(targetWeekKey: string) {
    weekSlots.forEach((s) => {
      addScheduleSlot({
        weekKey: targetWeekKey,
        day: s.day,
        hour: s.hour,
        workModeId: s.workModeId,
        projectId: s.projectId,
        note: s.note,
        durationMin: s.durationMin ?? defaultSlotDurationMin,
        utCount: s.utCount ?? 1,
      });
    });
  }

  return (
    <div>
      <style>{`
        .cal-slot { transition: filter 0.12s; }
        .cal-slot:hover { filter: brightness(1.18) !important; }
        .cal-col:hover { background-color: ${C.gold}06 !important; }
      `}</style>

      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.25rem",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <div>
          <h2 style={{ fontFamily: FONT.display, fontSize: "1.2rem", color: C.text, margin: 0 }}>
            Agenda hebdomadaire
          </h2>
          <p style={{ fontSize: "0.7rem", color: C.textDim, margin: "0.2rem 0 0", fontFamily: FONT.mono }}>
            {weekKey}
            {totalSlots > 0 && (
              <> · <span style={{ color: C.text }}>{totalSlots} UT</span>{" "}
                <span style={{ color: C.textVeryDim }}>(à {fmtDuration(effectiveSlotDurationMin)}/créneau = {fmtTime(totalMinutes)})</span>
              </>
            )}
            {weekOffset !== 0 && (
              <span style={{ color: C.amber, marginLeft: "0.5rem" }}>
                ({weekOffset > 0 ? `+${weekOffset}` : weekOffset} sem.)
              </span>
            )}
          </p>
          {activeGardeFou && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                marginTop: "0.4rem",
                background: `${activeGardeFou.color}18`,
                border: `1px solid ${activeGardeFou.color}55`,
                borderRadius: 5,
                padding: "0.2rem 0.6rem",
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: activeGardeFou.color, display: "inline-block", flexShrink: 0 }} />
              <span style={{ fontFamily: FONT.mono, fontSize: "0.62rem", color: activeGardeFou.color }}>
                Régime « {activeGardeFou.label} » — UT = {fmtDuration(effectiveSlotDurationMin)}
              </span>
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => setWeekOffset((o) => o - 1)}
            style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 6, padding: "0.35rem 0.7rem", fontSize: "0.85rem", cursor: "pointer", fontFamily: FONT.mono }}
          >‹</button>
          <button
            onClick={() => setWeekOffset(0)}
            style={{
              background: weekOffset === 0 ? `${C.gold}22` : C.surfaceAlt,
              border: `1px solid ${weekOffset === 0 ? C.gold : C.border}`,
              color: weekOffset === 0 ? C.gold : C.textMuted,
              borderRadius: 6,
              padding: "0.35rem 0.75rem",
              fontSize: "0.68rem",
              cursor: "pointer",
              fontFamily: FONT.mono,
            }}
          >
            Semaine actuelle
          </button>
          <button
            onClick={() => setWeekOffset((o) => o + 1)}
            style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 6, padding: "0.35rem 0.7rem", fontSize: "0.85rem", cursor: "pointer", fontFamily: FONT.mono }}
          >›</button>
          {weekSlots.length > 0 && (
            <>
              <button
                onClick={() => setActiveView("retrospective")}
                style={{ background: "none", border: `1px solid ${C.violet}44`, color: C.violet, borderRadius: 6, padding: "0.35rem 0.7rem", fontSize: "0.65rem", cursor: "pointer", fontFamily: FONT.mono }}
                title="Ouvrir la rétrospective de la semaine"
              >
                ↩ Rétro
              </button>
              <button
                onClick={() => printWeekPlan()}
                style={{ background: C.surfaceAlt, border: `1px solid ${C.violet}66`, color: C.violet, borderRadius: 6, padding: "0.35rem 0.7rem", fontSize: "0.65rem", cursor: "pointer", fontFamily: FONT.mono }}
                title="Exporter la semaine en PDF imprimable"
              >
                &#128438; Fiche PDF
              </button>
              <button
                onClick={() => setShowCopy(true)}
                style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 6, padding: "0.35rem 0.7rem", fontSize: "0.65rem", cursor: "pointer", fontFamily: FONT.mono }}
              >
                Copier →
              </button>
              <button
                onClick={() => { if (confirm("Effacer tous les créneaux de cette semaine ?")) clearWeekSlots(weekKey); }}
                style={{ background: "none", border: `1px solid ${C.red}44`, color: C.red, borderRadius: 6, padding: "0.35rem 0.7rem", fontSize: "0.65rem", cursor: "pointer", fontFamily: FONT.mono }}
              >
                Tout effacer
              </button>
            </>
          )}
        </div>
      </div>

      {/* ─── Calendar grid ───────────────────────────────────────────────── */}
      <Card style={{ padding: "0.75rem 0.75rem 0.85rem" }}>
        <div style={{ overflowX: "auto" }}>
          <div style={{ minWidth: 640 }}>

            {/* Day header row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `${timeColW}px repeat(7, 1fr)`,
                gap: 2,
                marginBottom: 4,
              }}
            >
              <div /> {/* time gutter */}
              {DAYS_SHORT.map((d, i) => {
                const date = weekDates[i];
                const today = isToday(date);
                return (
                  <div
                    key={d}
                    style={{
                      height: 50,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      background: today ? `${C.gold}15` : "transparent",
                      borderRadius: 6,
                      border: `1px solid ${today ? C.gold + "44" : C.border}`,
                      gap: 1,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: FONT.mono,
                        fontSize: "0.6rem",
                        color: today ? C.gold : C.textDim,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      {d}
                    </div>
                    <div
                      style={{
                        fontFamily: FONT.mono,
                        fontSize: "0.78rem",
                        color: today ? C.gold : C.textSoft,
                        fontWeight: today ? "bold" : "normal",
                      }}
                    >
                      {fmtDate(date)}
                    </div>
                    <div style={{ fontFamily: FONT.mono, fontSize: "0.56rem", color: C.textDim, minHeight: 10 }}>
                      {minsByDay[i] > 0 ? fmtTime(minsByDay[i]) : ""}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Absolute-position grid body */}
            <div ref={scrollRef} style={{ maxHeight: 540, overflowY: "auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: `${timeColW}px repeat(7, 1fr)` }}>
                {/* Time column */}
                <div style={{ position: "relative", height: gridH, flexShrink: 0 }}>
                  {HOURS.map((h) => (
                    <div
                      key={h}
                      style={{
                        position: "absolute",
                        top: (h - HOURS[0]) * hourH - 8,
                        right: 8,
                        fontFamily: FONT.mono,
                        fontSize: "0.58rem",
                        color: weekOffset === 0 && h === currentHour ? C.cyan : C.textVeryDim,
                        userSelect: "none",
                        whiteSpace: "nowrap",
                        pointerEvents: "none",
                      }}
                    >
                      {fmtHour(h)}
                    </div>
                  ))}
                </div>

                {/* Day columns */}
                {([0, 1, 2, 3, 4, 5, 6] as DayIndex[]).map((dayIdx) => {
                  const date = weekDates[dayIdx];
                  const today = isToday(date);
                  const isWe = dayIdx >= 5;
                  const slots = daySlots.get(dayIdx) ?? [];

                  return (
                    <div
                      key={dayIdx}
                      className="cal-col"
                      onClick={(e) => handleColumnClick(dayIdx, e)}
                      style={{
                        position: "relative",
                        height: gridH,
                        borderLeft: `1px solid ${C.border}`,
                        background: today ? `${C.gold}08` : isWe ? "#0a0d11" : "transparent",
                        cursor: "crosshair",
                      }}
                    >
                      {/* Hour lines */}
                      {HOURS.map((h) => (
                        <div
                          key={h}
                          style={{
                            position: "absolute",
                            top: (h - HOURS[0]) * hourH,
                            left: 0,
                            right: 0,
                            height: 1,
                            background: h % 2 === 0 ? C.border : C.border + "44",
                            pointerEvents: "none",
                          }}
                        />
                      ))}

                      {/* Current time line */}
                      {weekOffset === 0 && today && (
                        <div
                          style={{
                            position: "absolute",
                            top: currentTimePx,
                            left: 0,
                            right: 0,
                            height: 2,
                            background: C.cyan,
                            zIndex: 5,
                            pointerEvents: "none",
                            boxShadow: `0 0 5px ${C.cyan}`,
                          }}
                        />
                      )}

                      {/* Slots */}
                      {slots.map((slot) => {
                        const mode = slot.workModeId
                          ? WORK_MODES.find((m) => m.id === slot.workModeId)
                          : undefined;
                        const project = slot.projectId
                          ? projects.find((p) => p.id === slot.projectId)
                          : undefined;

                        const topPx = (slot.hour - HOURS[0]) * hourH;
                        const heightPx = (slot.durationMin / 60) * hourH;
                        const endTotalMin = slot.hour * 60 + slot.durationMin;
                        const endLabel = `${String(Math.floor(endTotalMin / 60)).padStart(2, "0")}:${String(endTotalMin % 60).padStart(2, "0")}`;
                        const isPast =
                          weekOffset < 0 ||
                          (weekOffset === 0 && endTotalMin <= now.getHours() * 60 + now.getMinutes());
                        const bgColor = mode
                          ? `${mode.color}${isPast ? "55" : "cc"}`
                          : `${C.textDim}${isPast ? "33" : "66"}`;

                        return (
                          <div
                            key={slot.id}
                            className="cal-slot"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditing({ day: dayIdx, hour: slot.hour });
                            }}
                            title={[
                              `${DAYS_SHORT[dayIdx]} ${fmtHour(slot.hour)}–${endLabel}`,
                              `${slot.utCount ?? 1} UT · ${fmtDuration(slot.durationMin)}`,
                              mode?.name ?? "Créneau",
                              project ? `📌 ${project.name}` : "",
                              slot.note ? `"${slot.note}"` : "",
                            ].filter(Boolean).join(" · ")}
                            style={{
                              position: "absolute",
                              top: topPx + 1,
                              left: 2,
                              right: 2,
                              height: Math.max(heightPx - 3, 14),
                              background: bgColor,
                              borderRadius: 4,
                              padding: "3px 5px",
                              overflow: "hidden",
                              cursor: "pointer",
                              zIndex: 2,
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "flex-start",
                              opacity: isPast ? 0.72 : 1,
                              boxSizing: "border-box",
                            }}
                          >
                            <span
                              style={{
                                fontFamily: FONT.mono,
                                fontSize: "0.54rem",
                                fontWeight: "bold",
                                color: "#000",
                                opacity: isPast ? 0.65 : 1,
                                lineHeight: 1.25,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {fmtHour(slot.hour)}–{endLabel}
                            </span>
                            {heightPx >= 32 && (
                              <span
                                style={{
                                  fontFamily: FONT.mono,
                                  fontSize: "0.51rem",
                                  fontWeight: "bold",
                                  color: "#000",
                                  opacity: isPast ? 0.55 : 0.85,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {mode?.name?.split(" ")[0] ?? "✓"} · {slot.utCount ?? 1}UT
                              </span>
                            )}
                            {heightPx >= 58 && project && (
                              <span
                                style={{
                                  fontFamily: FONT.mono,
                                  fontSize: "0.47rem",
                                  color: "#000",
                                  opacity: isPast ? 0.45 : 0.7,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                📌 {project.name}
                              </span>
                            )}
                            {heightPx >= 80 && slot.note && (
                              <span
                                style={{
                                  fontFamily: FONT.mono,
                                  fontSize: "0.45rem",
                                  color: "#000",
                                  opacity: isPast ? 0.38 : 0.55,
                                  fontStyle: "italic",
                                  overflow: "hidden",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                }}
                              >
                                {slot.note}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ─── Stats row ──────────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>

        {/* Hours by mode */}
        <Card>
          <SectionTitle accent={C.gold}>Répartition par mode</SectionTitle>
          {totalSlots === 0 ? (
            <p style={{ fontSize: "0.72rem", color: C.textDim, fontStyle: "italic", margin: 0 }}>
              Aucun créneau planifié cette semaine.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {WORK_MODES.map((m) => {
                const mins = minsByMode[m.id] ?? 0;
                if (mins === 0) return null;
                const pct = Math.round((mins / totalMinutes) * 100);
                return (
                  <div key={m.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                      <span style={{ fontFamily: FONT.mono, fontSize: "0.65rem", color: m.color }}>{m.name}</span>
                      <span style={{ fontFamily: FONT.mono, fontSize: "0.65rem", color: C.textDim }}>{fmtTime(mins)} · {pct}%</span>
                    </div>
                    <div style={{ height: 5, background: C.border, borderRadius: 3 }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: m.color, borderRadius: 3, transition: "width 0.4s" }} />
                    </div>
                  </div>
                );
              })}
              {(minsByMode["__none__"] ?? 0) > 0 && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                    <span style={{ fontFamily: FONT.mono, fontSize: "0.65rem", color: C.textDim }}>Sans mode</span>
                    <span style={{ fontFamily: FONT.mono, fontSize: "0.65rem", color: C.textDim }}>{fmtTime(minsByMode["__none__"])}</span>
                  </div>
                  <div style={{ height: 5, background: C.border, borderRadius: 3 }}>
                    <div style={{ height: "100%", width: `${Math.round((minsByMode["__none__"] / totalMinutes) * 100)}%`, background: C.textDim, borderRadius: 3 }} />
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Day distribution */}
        <Card>
          <SectionTitle accent={C.cyan}>Charge par jour</SectionTitle>
          {totalSlots === 0 ? (
            <p style={{ fontSize: "0.72rem", color: C.textDim, fontStyle: "italic", margin: 0 }}>
              Aucun créneau planifié cette semaine.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {DAYS_SHORT.map((d, i) => {
                const mins = minsByDay[i];
                const maxMins = Math.max(...minsByDay, 1);
                const today = isToday(weekDates[i]);
                const isWe = i >= 5;
                const barColor = today ? C.gold : isWe ? C.violet : C.cyan;
                return (
                  <div key={d} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span
                      style={{
                        fontFamily: FONT.mono,
                        fontSize: "0.62rem",
                        color: today ? C.gold : isWe ? C.violet : C.textDim,
                        minWidth: 28,
                        fontWeight: today ? "bold" : "normal",
                      }}
                    >
                      {d}
                    </span>
                    <div style={{ flex: 1, height: 6, background: C.border, borderRadius: 3 }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${mins > 0 ? (mins / maxMins) * 100 : 0}%`,
                          background: barColor,
                          borderRadius: 3,
                          transition: "width 0.4s",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontFamily: FONT.mono,
                        fontSize: "0.62rem",
                        color: mins > 0 ? C.textSoft : C.textVeryDim,
                        minWidth: 32,
                        textAlign: "right",
                      }}
                    >
                      {mins > 0 ? fmtTime(mins) : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          {totalSlots > 0 && (
            <div
              style={{
                marginTop: "0.75rem",
                borderTop: `1px solid ${C.border}`,
                paddingTop: "0.55rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <span style={{ fontFamily: FONT.mono, fontSize: "0.62rem", color: C.textDim }}>
                {totalSlots} UT · {fmtDuration(effectiveSlotDurationMin)}/créneau
              </span>
              <span style={{ fontFamily: FONT.mono, fontSize: "0.72rem", color: C.gold, fontWeight: "bold" }}>
                {fmtTime(totalMinutes)}
              </span>
            </div>
          )}
        </Card>
      </div>

      {/* ─── Legend ──────────────────────────────────────────────────────── */}
      <Card style={{ marginTop: "1rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.85rem",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: FONT.mono,
              fontSize: "0.6rem",
              color: C.textDim,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginRight: "0.25rem",
            }}
          >
            Modes :
          </span>
          {WORK_MODES.map((m) => (
            <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: m.color, flexShrink: 0 }} />
              <span style={{ fontFamily: FONT.mono, fontSize: "0.6rem", color: C.textMuted }}>
                {m.name}
              </span>
            </div>
          ))}
          <div
            style={{
              marginLeft: "auto",
              fontFamily: FONT.mono,
              fontSize: "0.58rem",
              color: C.textVeryDim,
            }}
          >
            Cliquer une case pour ajouter · Cliquer à nouveau pour modifier ou effacer
          </div>
        </div>
      </Card>

      {/* ─── Modals ──────────────────────────────────────────────────────── */}
      {editing && (
        <SlotEditor
          day={editing.day}
          hour={editing.hour}
          weekKey={weekKey}
          slotDurationMin={effectiveSlotDurationMin}
          existingSlot={slotMap.get(`${editing.day}-${editing.hour}`)}
          onSave={(data) => handleSave(editing.day, editing.hour, data)}
          onClear={() => handleClear(editing.day, editing.hour)}
          onClose={() => setEditing(null)}
        />
      )}
      {showCopy && (
        <CopyWeekModal
          sourceWeekKey={weekKey}
          sourceSlots={weekSlots}
          onCopy={handleCopy}
          onClose={() => setShowCopy(false)}
        />
      )}
    </div>
  );
}
