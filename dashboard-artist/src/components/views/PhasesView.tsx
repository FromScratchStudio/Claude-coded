import { C, FONT } from "../../theme";
import { useStore } from "../../store/useStore";
import { PHASES } from "../../data/phases";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import ProgressBar from "../ui/ProgressBar";

export default function PhasesView() {
  const tasks = useStore((s) => s.tasks);
  const toggleTask = useStore((s) => s.toggleTask);

  return (
    <div>
      <div style={{ marginBottom: "1.25rem" }}>
        <h2 style={{ fontFamily: FONT.display, fontSize: "1.2rem", color: C.text, margin: 0 }}>Feuille de route 36 mois</h2>
        <p style={{ fontSize: "0.7rem", color: C.textDim, margin: "0.2rem 0 0", fontFamily: FONT.mono }}>
          Architecture en phases — marquer les tâches au fil de l'avancement
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.25rem" }}>
        {PHASES.map((phase) => {
          const doneCount = phase.tasks.filter((t) => tasks[t.id] ?? t.done).length;
          const total = phase.tasks.length;
          const pct = Math.round((doneCount / total) * 100);
          const isComplete = doneCount === total;

          return (
            <Card key={phase.id} style={{ borderLeft: `3px solid ${phase.accent}` }}>
              {/* Phase header */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <div>
                  <div style={{ fontFamily: FONT.mono, fontSize: "0.62rem", color: phase.accent, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.2rem" }}>
                    {phase.label} · {phase.months}
                  </div>
                  <div style={{ fontFamily: FONT.display, fontSize: "1rem", color: C.text }}>{phase.name}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: FONT.mono, fontSize: "1.2rem", color: isComplete ? C.green : phase.accent, fontWeight: "bold" }}>
                    {isComplete ? "✓" : `${pct}%`}
                  </div>
                  <div style={{ fontSize: "0.6rem", color: C.textDim, fontFamily: FONT.mono }}>{doneCount}/{total}</div>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom: "0.85rem" }}>
                <ProgressBar value={pct} color={phase.accent} height={4} />
              </div>

              {/* Tasks */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {phase.tasks.map((task) => {
                  const isDone = tasks[task.id] ?? task.done;
                  return (
                    <label
                      key={task.id}
                      style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", cursor: "pointer" }}
                    >
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => toggleTask(task.id)}
                        style={{ accentColor: phase.accent, marginTop: 3, flexShrink: 0 }}
                      />
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: isDone ? C.textDim : C.textSoft,
                          textDecoration: isDone ? "line-through" : "none",
                          lineHeight: 1.45,
                          transition: "color 0.2s",
                        }}
                      >
                        {task.text}
                      </span>
                    </label>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Global progress */}
      <Card style={{ marginTop: "1.25rem" }}>
        <SectionTitle accent={C.gold}>Avancement global</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {PHASES.map((phase) => {
            const doneCount = phase.tasks.filter((t) => tasks[t.id] ?? t.done).length;
            const pct = Math.round((doneCount / phase.tasks.length) * 100);
            return (
              <div key={phase.id}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                  <span style={{ fontSize: "0.68rem", color: phase.accent, fontFamily: FONT.mono }}>{phase.label} — {phase.name}</span>
                  <span style={{ fontSize: "0.68rem", color: phase.accent, fontFamily: FONT.mono }}>{doneCount}/{phase.tasks.length}</span>
                </div>
                <ProgressBar value={pct} color={phase.accent} height={5} />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
