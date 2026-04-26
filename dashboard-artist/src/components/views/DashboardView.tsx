import { C, FONT } from "../../theme";
import { useStore } from "../../store/useStore";
import { RINGS } from "../../data/projects";
import { PHASES } from "../../data/phases";
import { DEGRADED_MODES } from "../../data/principles";
import { computeBank, countHooks } from "../../data/workflow";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import ProgressBar from "../ui/ProgressBar";
import RingDonut from "../ui/RingDonut";

export default function DashboardView() {
  const energy = useStore((s) => s.energy);
  const setEnergy = useStore((s) => s.setEnergy);
  const plaisir = useStore((s) => s.plaisir);
  const setPlaisir = useStore((s) => s.setPlaisir);
  const joursEpuises = useStore((s) => s.joursEpuises);
  const setJoursEpuises = useStore((s) => s.setJoursEpuises);
  const ulWeek = useStore((s) => s.ulWeek);
  const setUlWeek = useStore((s) => s.setUlWeek);
  const degradedMode = useStore((s) => s.degradedMode);
  const setDegradedMode = useStore((s) => s.setDegradedMode);
  const tasks = useStore((s) => s.tasks);
  const projects = useStore((s) => s.projects);
  const chapters = useStore((s) => s.chapters);
  const ideas = useStore((s) => s.ideas);
  const quarter = useStore((s) => s.quarter);
  const setActiveView = useStore((s) => s.setActiveView);

  const allTasks = PHASES.flatMap((p) => p.tasks);
  const doneTasks = allTasks.filter((t) => tasks[t.id] ?? t.done).length;
  const activeProjects = projects.filter((p) => p.status === "active").length;
  const bank = computeBank(chapters);
  const hooks = countHooks(chapters);
  const ideasCount = ideas.filter((i) => i.stage === "raw").length;
  const ulAvg = ulWeek.reduce((s, n) => s + n, 0) / 4;

  const sustainabilityStatus =
    energy >= 7 && plaisir >= 7 && joursEpuises < 1
      ? { label: "✓ Régime sain — continuer", color: C.green, bg: C.greenDark }
      : energy <= 4 || plaisir <= 4 || joursEpuises >= 3
      ? { label: "⚠ Signal d'alerte — recalibrer", color: C.red, bg: C.redDark }
      : { label: "~ Surveiller", color: C.amber, bg: "#2d1e00" };

  return (
    <div style={{ display: "grid", gap: "1.25rem", gridTemplateColumns: "1fr 1fr 1fr" }}>

      {/* ─── Allocation */}
      <Card>
        <SectionTitle accent={C.gold}>Allocation du trimestre</SectionTitle>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <RingDonut rings={RINGS} allocation={quarter.allocation} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.45rem" }}>
            {RINGS.map((ring) => {
              const key = ring.id === "centre" ? "centre" : ring.id === "anneau1" ? "ampli" : ring.id === "anneau2" ? "collab" : "opt";
              const value = quarter.allocation[key as keyof typeof quarter.allocation] ?? 0;
              return (
                <div key={ring.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                    <span style={{ fontFamily: FONT.mono, fontSize: "0.64rem", color: ring.color }}>{ring.label}</span>
                    <span style={{ fontFamily: FONT.mono, fontSize: "0.64rem", color: ring.color }}>{value}%</span>
                  </div>
                  <ProgressBar value={value} color={ring.color} height={3} />
                </div>
              );
            })}
          </div>
        </div>
        <button
          onClick={() => setActiveView("trimestre")}
          style={{ marginTop: "0.75rem", fontSize: "0.62rem", color: C.textDim, cursor: "pointer", background: "none", border: "none", padding: 0, fontStyle: "italic", borderTop: `1px solid ${C.border}`, paddingTop: "0.55rem", width: "100%", textAlign: "left" }}
        >
          → Onglet <span style={{ color: C.gold }}>Trimestre</span> pour ajuster
        </button>
      </Card>

      {/* ─── UL Weekly */}
      <Card>
        <SectionTitle accent={C.cyan}>Livrables hebdomadaires (UL)</SectionTitle>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "0.4rem", height: 72, marginBottom: "0.75rem" }}>
          {ulWeek.map((v, i) => {
            const isCurrent = i === 3;
            const barH = Math.max((v / 10) * 60, 2);
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
                <span style={{ fontSize: "0.62rem", color: isCurrent ? C.cyan : C.textDim, fontFamily: FONT.mono }}>{v}</span>
                <div style={{ width: "100%", height: barH, background: isCurrent ? C.cyan : "#0891b2", borderRadius: "2px 2px 0 0", boxShadow: isCurrent ? `0 0 8px ${C.cyan}55` : "none", transition: "height 0.3s" }} />
                <span style={{ fontSize: "0.55rem", color: C.textVeryDim, fontFamily: FONT.mono }}>
                  {isCurrent ? "Cette sem." : `S-${3 - i}`}
                </span>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "0.7rem", color: C.textSoft }}>UL cette semaine</span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <button
              onClick={() => setUlWeek((p) => [p[0], p[1], p[2], Math.max(0, p[3] - 1)])}
              style={{ background: C.surfaceAlt, border: "none", color: C.text, width: 22, height: 22, borderRadius: 4, cursor: "pointer", fontSize: "0.8rem" }}
            >−</button>
            <span style={{ fontSize: "0.9rem", color: C.cyan, fontFamily: FONT.mono, minWidth: 22, textAlign: "center" }}>{ulWeek[3]}</span>
            <button
              onClick={() => setUlWeek((p) => [p[0], p[1], p[2], p[3] + 1])}
              style={{ background: C.cyan, border: "none", color: "#000", width: 22, height: 22, borderRadius: 4, cursor: "pointer", fontSize: "0.8rem", fontWeight: "bold" }}
            >+</button>
          </div>
        </div>
        <div style={{ fontSize: "0.62rem", color: C.textDim, borderTop: `1px solid ${C.border}`, paddingTop: "0.45rem", display: "flex", justifyContent: "space-between" }}>
          <span>Moyenne roulante 4 sem.</span>
          <span style={{ color: C.cyan, fontFamily: FONT.mono }}>{ulAvg.toFixed(1)} UL/sem</span>
        </div>
      </Card>

      {/* ─── Sustainability */}
      <Card>
        <SectionTitle accent={C.red}>Durabilité — ce mois</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {([
            { label: "Énergie créative", val: energy, set: setEnergy, max: 10, color: C.green, suffix: undefined as string | undefined },
            { label: "Plaisir créatif", val: plaisir, set: setPlaisir, max: 10, color: C.amber, suffix: undefined as string | undefined },
            { label: "Jours épuisés / sem.", val: joursEpuises, set: setJoursEpuises, max: 7, color: joursEpuises >= 1 ? C.red : C.green, suffix: " < 1 obj." as string | undefined },
          ]).map((s, i) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                <span style={{ fontSize: "0.7rem", color: C.textSoft }}>{s.label}</span>
                <span style={{ fontSize: "0.7rem", color: s.color, fontFamily: FONT.mono }}>
                  {s.val}/{s.max}
                  {s.suffix && <span style={{ color: C.textDim }}>{s.suffix}</span>}
                </span>
              </div>
              <input
                type="range"
                min={s.label.includes("épuisés") ? 0 : 1}
                max={s.max}
                value={s.val}
                onChange={(e) => s.set(Number(e.target.value))}
                style={{ width: "100%", accentColor: s.color }}
              />
            </div>
          ))}
          <div style={{ padding: "0.5rem 0.65rem", borderRadius: 6, background: sustainabilityStatus.bg, border: `1px solid ${sustainabilityStatus.color}44` }}>
            <span style={{ fontSize: "0.68rem", fontFamily: FONT.mono, color: sustainabilityStatus.color }}>
              {sustainabilityStatus.label}
            </span>
          </div>
        </div>
      </Card>

      {/* ─── Banque d'avance */}
      <Card>
        <SectionTitle accent={C.violet}>Banque d'avance</SectionTitle>
        <p style={{ fontSize: "0.62rem", color: C.textDim, marginBottom: "0.75rem", margin: "0 0 0.75rem" }}>
          Cible : 3–4 chapitres au stade 4–5 non publiés
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <span style={{ fontSize: "2.2rem", fontFamily: FONT.display, color: bank >= 3 ? C.green : bank >= 2 ? C.amber : C.red, fontWeight: "bold" }}>
            {bank}
          </span>
          <span style={{ fontSize: "0.72rem", color: C.textSoft }}>chapitres prêts</span>
        </div>
        <div style={{ display: "flex", gap: "0.3rem", marginBottom: "0.75rem" }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} style={{ flex: 1, height: 8, borderRadius: 2, background: n <= bank ? (n <= 2 ? C.red : n <= 4 ? C.green : C.amber) : C.border, transition: "background 0.3s" }} />
          ))}
        </div>
        <div style={{ fontSize: "0.62rem", color: C.textDim, lineHeight: 1.6 }}>
          <div>0–1 : zéro buffer, fragile</div>
          <div>2 : risque de mode panique</div>
          <div style={{ color: C.green }}>3–4 : sain — un mois de respiration</div>
          <div>5+ : sur-production, publier</div>
        </div>
      </Card>

      {/* ─── Stats overview */}
      <Card>
        <SectionTitle accent={C.orange}>Vue synthétique</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
          {[
            { label: "Tâches", value: `${doneTasks}/${allTasks.length}`, sub: "toutes phases", color: C.green },
            { label: "Projets actifs", value: activeProjects, sub: `sur ${projects.length} total`, color: C.gold },
            { label: "Idées en pipeline", value: ideasCount, sub: "à trier", color: C.cyan },
            { label: "Hooks transmédia", value: hooks, sub: "amplifiables", color: C.orange },
          ].map((stat) => (
            <div key={stat.label} style={{ background: C.bg, borderRadius: 8, padding: "0.7rem", border: `1px solid ${stat.color}18` }}>
              <div style={{ fontSize: "1.5rem", fontFamily: FONT.display, color: stat.color, fontWeight: "bold" }}>{stat.value}</div>
              <div style={{ fontSize: "0.7rem", color: C.textSoft, marginTop: 2 }}>{stat.label}</div>
              <div style={{ fontSize: "0.6rem", color: C.textDim }}>{stat.sub}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* ─── Degraded mode */}
      <Card>
        <SectionTitle accent={C.pink}>Mode dégradé</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <button
            type="button"
            onClick={() => setDegradedMode(null)}
            style={{ padding: "0.45rem 0.65rem", borderRadius: 6, cursor: "pointer", background: !degradedMode ? C.greenDark : C.bg, border: `1px solid ${!degradedMode ? C.green : C.border}`, width: "100%", textAlign: "left" }}
          >
            <span style={{ fontSize: "0.7rem", color: !degradedMode ? C.green : C.textMuted }}>✓ Régime normal</span>
          </button>
          {DEGRADED_MODES.map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setDegradedMode(mode.id)}
              style={{ padding: "0.45rem 0.65rem", borderRadius: 6, cursor: "pointer", background: degradedMode === mode.id ? `${mode.color}18` : C.bg, border: `1px solid ${degradedMode === mode.id ? mode.color : C.border}`, width: "100%", textAlign: "left" }}
            >
              <span style={{ fontSize: "0.7rem", color: degradedMode === mode.id ? mode.color : C.textMuted }}>{mode.label}</span>
            </button>
          ))}
        </div>
        <button
          onClick={() => setActiveView("garde-fous")}
          style={{ marginTop: "0.55rem", fontSize: "0.6rem", color: C.textDim, cursor: "pointer", background: "none", border: "none", padding: 0, fontStyle: "italic", borderTop: `1px solid ${C.border}`, paddingTop: "0.45rem", width: "100%", textAlign: "left" }}
        >
          → Détails dans <span style={{ color: C.pink }}>Garde-fous</span>
        </button>
      </Card>

      {/* ─── Principle quote — full width */}
      <Card
        style={{
          gridColumn: "1 / 4",
          background: `linear-gradient(135deg, ${C.surface}, #1a0f2e)`,
          border: `1px solid ${C.border}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "2.5rem", fontFamily: FONT.display, color: C.gold, lineHeight: 1 }}>"</span>
          <div>
            <p style={{ fontSize: "0.95rem", fontFamily: FONT.display, color: C.text, lineHeight: 1.5, margin: 0 }}>
              Tu n'optimises pas ton talent. Tu optimises ta capacité à continuer.
            </p>
            <p style={{ fontSize: "0.6rem", color: C.textDim, marginTop: "0.4rem", fontFamily: FONT.mono, letterSpacing: "0.1em" }}>
              — PRINCIPE DIRECTEUR UNIQUE · MÉTHODE UNIFIÉE
            </p>
          </div>
        </div>
      </Card>

    </div>
  );
}
