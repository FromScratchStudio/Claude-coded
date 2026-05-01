import { useState, useMemo, Fragment } from "react";
import { useStore } from "../../store/useStore";
import { C } from "../../theme";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { SectionTitle } from "../ui/SectionTitle";
import { Modal, inputStyle, labelStyle, formRow, btnPrimary, btnSecondary, btnDanger } from "../ui/Modal";
import type { DayIndex, ScheduleSlot } from "../../types";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 17 }, (_, i) => i + 6);
const SLOT_HEIGHT = 36;

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

export default function WeeklyCalendarView() {
  const appConfig = useStore((s) => s.appConfig);
  const scheduleSlots = useStore((s) => s.scheduleSlots);
  const workModes = useStore((s) => s.workModes);
  const projects = useStore((s) => s.projects);
  const defaultSlotDurationMin = useStore((s) => s.defaultSlotDurationMin);
  const addScheduleSlot = useStore((s) => s.addScheduleSlot);
  const updateScheduleSlot = useStore((s) => s.updateScheduleSlot);
  const removeScheduleSlot = useStore((s) => s.removeScheduleSlot);
  const clearWeekSlots = useStore((s) => s.clearWeekSlots);
  const setRetroWeekOffset = useStore((s) => s.setRetroWeekOffset);
  const setActiveView = useStore((s) => s.setActiveView);

  const [weekOffset, setWeekOffset] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editSlot, setEditSlot] = useState<ScheduleSlot | null>(null);
  const [activeMobileDay, setActiveMobileDay] = useState<DayIndex>(0);

  const [sDay, setSDay] = useState<DayIndex>(0);
  const [sHour, setSHour] = useState(9);
  const [sDuration, setSDuration] = useState(defaultSlotDurationMin);
  const [sUtCount, setSUtCount] = useState(1);
  const [sModeId, setSModeId] = useState<string | null>(null);
  const [sProjectId, setSProjectId] = useState<string | null>(null);
  const [sNote, setSNote] = useState("");

  const monday = useMemo(() => getMondayOfWeek(weekOffset), [weekOffset]);
  const weekKey = useMemo(() => getISOWeekKey(monday), [monday]);

  const weekSlots = useMemo(
    () => scheduleSlots.filter((s) => s.weekKey === weekKey),
    [scheduleSlots, weekKey]
  );

  const utCount = weekSlots.reduce((sum, s) => sum + s.utCount, 0);
  const weeklyTarget = appConfig.weeklyTimeUnitTarget;
  const { timeUnitLabel } = appConfig;

  function openNewSlot(day: DayIndex, hour: number) {
    setEditSlot(null);
    setSDay(day);
    setSHour(hour);
    setSDuration(defaultSlotDurationMin);
    setSUtCount(1);
    setSModeId(workModes[0]?.id ?? null);
    setSProjectId(null);
    setSNote("");
    setShowModal(true);
  }

  function openEditSlot(slot: ScheduleSlot) {
    setEditSlot(slot);
    setSDay(slot.day);
    setSHour(slot.hour);
    setSDuration(slot.durationMin);
    setSUtCount(slot.utCount);
    setSModeId(slot.workModeId);
    setSProjectId(slot.projectId);
    setSNote(slot.note ?? "");
    setShowModal(true);
  }

  function save() {
    if (editSlot) {
      updateScheduleSlot(editSlot.id, {
        day: sDay,
        hour: sHour,
        durationMin: sDuration,
        utCount: sUtCount,
        workModeId: sModeId,
        projectId: sProjectId,
        note: sNote,
      });
    } else {
      addScheduleSlot({
        weekKey,
        day: sDay,
        hour: sHour,
        durationMin: sDuration,
        utCount: sUtCount,
        workModeId: sModeId,
        projectId: sProjectId,
        note: sNote,
      });
    }
    setShowModal(false);
  }

  const fmtDuration = (min: number) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h === 0 ? `${m}min` : m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, "0")}`;
  };

  const { isMobile } = useBreakpoint();

  return (
    <div>
      <SectionTitle
        sub={`${utCount} / ${weeklyTarget} ${timeUnitLabel} scheduled · ${weekKey}`}
        action={
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setWeekOffset((o) => o - 1)} style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: "0.82rem" }}>&#8249;</button>
            <button onClick={() => setWeekOffset(0)} style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: "0.75rem" }}>Today</button>
            <button onClick={() => setWeekOffset((o) => o + 1)} style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textMuted, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: "0.82rem" }}>&#8250;</button>
            <button
              onClick={() => { if (confirm("Clear all slots for this week?")) clearWeekSlots(weekKey); }}
              style={{ background: "none", border: `1px solid ${C.border}`, color: C.textDim, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: "0.75rem" }}
            >Clear</button>
            <button
              onClick={() => { setRetroWeekOffset(weekOffset); setActiveView("retrospective"); }}
              style={{ background: `${C.accent}20`, border: `1px solid ${C.accent}50`, color: C.accent, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: "0.75rem" }}
            >Retro →</button>
          </div>
        }
      >
        Weekly Calendar
      </SectionTitle>

      <div style={{ display: "flex", gap: 4, marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {Array.from({ length: weeklyTarget }, (_, i) => (
          <div key={i} style={{ width: 18, height: 18, borderRadius: 3, background: i < utCount ? C.accent : C.surfaceAlt, border: `1px solid ${i < utCount ? C.accent : C.border}`, transition: "background 0.15s" }} />
        ))}
        <span style={{ marginLeft: 8, fontSize: "0.78rem", color: C.textMuted, alignSelf: "center" }}>{utCount} {timeUnitLabel} filled</span>
      </div>

      {/* Mobile: day tabs + single-day list */}
      {isMobile && (
        <div>
          <div style={{ display: "flex", gap: 4, marginBottom: "0.75rem", overflowX: "auto", scrollbarWidth: "none" }}>
            {DAYS.map((day, i) => {
              const daySlots = weekSlots.filter((s) => s.day === i);
              return (
                <button
                  key={day}
                  onClick={() => setActiveMobileDay(i as DayIndex)}
                  style={{
                    flexShrink: 0,
                    padding: "6px 14px",
                    borderRadius: 6,
                    background: activeMobileDay === i ? C.accent : C.surfaceAlt,
                    border: `1px solid ${activeMobileDay === i ? C.accent : C.border}`,
                    color: activeMobileDay === i ? "#fff" : C.textMuted,
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: activeMobileDay === i ? 600 : 400,
                    position: "relative",
                  }}
                >
                  {day}
                  {daySlots.length > 0 && (
                    <span style={{ marginLeft: 4, fontSize: "0.65rem", opacity: 0.8 }}>·{daySlots.length}</span>
                  )}
                </button>
              );
            })}
          </div>
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", background: C.surface }}>
            {HOURS.map((hour) => {
              const slotsInCell = weekSlots.filter((s) => s.day === activeMobileDay && s.hour === hour);
              return (
                <div
                  key={hour}
                  onClick={() => openNewSlot(activeMobileDay, hour)}
                  style={{ display: "flex", gap: 8, padding: "0.4rem 0.75rem", borderBottom: `1px solid ${C.border}`, cursor: "pointer", minHeight: SLOT_HEIGHT, alignItems: "flex-start", boxSizing: "border-box" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = `${C.accent}08`)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <span style={{ fontSize: "0.68rem", color: C.textVeryDim, width: 36, flexShrink: 0, paddingTop: 2 }}>{hour}:00</span>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
                    {slotsInCell.map((slot) => {
                      const slotMode = workModes.find((m) => m.id === slot.workModeId);
                      const color = slotMode?.color ?? C.accent;
                      return (
                        <div
                          key={slot.id}
                          onClick={(e) => { e.stopPropagation(); openEditSlot(slot); }}
                          style={{ background: `${color}25`, border: `1px solid ${color}60`, borderRadius: 4, padding: "3px 8px", fontSize: "0.75rem", color, cursor: "pointer" }}
                        >
                          {slot.utCount > 0 && <span style={{ marginRight: 4 }}>&#9670;</span>}
                          {slot.note || slotMode?.name || "–"}
                          <span style={{ marginLeft: 4, opacity: 0.6, fontSize: "0.68rem" }}>{fmtDuration(slot.durationMin)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Desktop: full 7-column grid */}
      {!isMobile && (
        <div style={{ display: "grid", gridTemplateColumns: "50px repeat(7, 1fr)", border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", background: C.surface }}>
          <div style={{ background: C.surfaceAlt, borderBottom: `1px solid ${C.border}` }} />
          {DAYS.map((day, i) => (
            <div key={day} style={{ padding: "0.5rem", textAlign: "center", fontSize: "0.78rem", color: C.textMuted, fontWeight: 600, background: C.surfaceAlt, borderBottom: `1px solid ${C.border}`, borderLeft: i > 0 ? `1px solid ${C.border}` : undefined }}>
              {day}
            </div>
          ))}
        {HOURS.map((hour) => (
          <Fragment key={`row-${hour}`}>
            <div style={{ padding: "0.25rem 0.5rem", fontSize: "0.68rem", color: C.textVeryDim, textAlign: "right", borderBottom: `1px solid ${C.border}`, height: SLOT_HEIGHT, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "flex-end", background: C.surfaceAlt }}>
              {hour}:00
            </div>
            {DAYS.map((_, dayIdx) => {
              const slotsInCell = weekSlots.filter((s) => s.day === dayIdx && s.hour === hour);
              return (
                <div
                  key={`cell-${hour}-${dayIdx}`}
                  onClick={() => openNewSlot(dayIdx as DayIndex, hour)}
                  style={{ height: SLOT_HEIGHT, borderBottom: `1px solid ${C.border}`, borderLeft: `1px solid ${C.border}`, position: "relative", cursor: "pointer", background: "transparent", transition: "background 0.1s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = `${C.accent}08`)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {slotsInCell.map((slot) => {
                    const slotMode = workModes.find((m) => m.id === slot.workModeId);
                    const color = slotMode?.color ?? C.accent;
                    const heightPx = Math.round((slot.durationMin / 60) * SLOT_HEIGHT);
                    return (
                      <div
                        key={slot.id}
                        onClick={(e) => { e.stopPropagation(); openEditSlot(slot); }}
                        style={{ position: "absolute", top: 1, left: 2, right: 2, height: Math.max(heightPx - 2, 20), background: `${color}25`, border: `1px solid ${color}60`, borderRadius: 4, padding: "2px 4px", fontSize: "0.65rem", color, overflow: "hidden", cursor: "pointer", zIndex: 1 }}
                      >
                        {slot.utCount > 0 && <span style={{ marginRight: 2 }}>&#9670;</span>}
                        {slot.note || slotMode?.name || "–"}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </Fragment>
        ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: "1rem", flexWrap: "wrap" }}>
        {workModes.map((mode) => (
          <div key={mode.id} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.72rem" }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: mode.color, display: "inline-block" }} />
            <span style={{ color: C.textMuted }}>{mode.name}</span>
          </div>
        ))}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editSlot ? "Edit Slot" : "New Slot"}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "0.85rem" }}>
          <div>
            <label style={labelStyle}>Day</label>
            <select value={sDay} onChange={(e) => setSDay(Number(e.target.value) as DayIndex)} style={{ ...inputStyle, cursor: "pointer" }}>
              {DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Hour</label>
            <select value={sHour} onChange={(e) => setSHour(Number(e.target.value))} style={{ ...inputStyle, cursor: "pointer" }}>
              {HOURS.map((h) => <option key={h} value={h}>{h}:00</option>)}
            </select>
          </div>
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Duration: {fmtDuration(sDuration)}</label>
          <input type="range" min={15} max={360} step={15} value={sDuration} onChange={(e) => setSDuration(Number(e.target.value))} style={{ width: "100%" }} />
        </div>
        <div style={formRow}>
          <label style={labelStyle}>{timeUnitLabel} count</label>
          <div style={{ display: "flex", gap: 6 }}>
            {[0, 1, 2, 3].map((n) => (
              <button key={n} onClick={() => setSUtCount(n)} style={{ background: sUtCount === n ? `${C.accent}25` : C.surfaceAlt, border: `1px solid ${sUtCount === n ? C.accent : C.border}`, color: sUtCount === n ? C.accent : C.textMuted, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: "0.8rem" }}>
                {n}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "0.85rem" }}>
          <div>
            <label style={labelStyle}>Work mode</label>
            <select value={sModeId ?? ""} onChange={(e) => setSModeId(e.target.value || null)} style={{ ...inputStyle, cursor: "pointer" }}>
              <option value="">None</option>
              {workModes.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Project</label>
            <select value={sProjectId ?? ""} onChange={(e) => setSProjectId(e.target.value || null)} style={{ ...inputStyle, cursor: "pointer" }}>
              <option value="">None</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Note</label>
          <input value={sNote} onChange={(e) => setSNote(e.target.value)} style={inputStyle} placeholder="What is this slot?" autoFocus />
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
          {editSlot && <button onClick={() => { removeScheduleSlot(editSlot.id); setShowModal(false); }} style={btnDanger}>Delete</button>}
          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            <button onClick={() => setShowModal(false)} style={btnSecondary}>Cancel</button>
            <button onClick={save} style={btnPrimary}>Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
