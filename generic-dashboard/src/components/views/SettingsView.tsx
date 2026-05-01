import { useState, type ChangeEvent } from "react";
import { useStore } from "../../store/useStore";
import { C, applyAccentColor } from "../../theme";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { SectionTitle } from "../ui/SectionTitle";
import { Card } from "../ui/Card";
import { btnPrimary, btnSecondary, btnDanger, inputStyle, labelStyle, formRow } from "../ui/Modal";
import type { RingConfig, AllocationCategory } from "../../types";

const ACCENT_PRESETS = [
  "#4c7fc9", "#7c5cd1", "#27ae7a", "#e07a3c",
  "#d15c7f", "#1a9ecf", "#b8a800", "#e04c6f",
];

function genId() {
  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export default function SettingsView() {
  const appConfig = useStore((s) => s.appConfig);
  const updateAppConfig = useStore((s) => s.updateAppConfig);
  const resetToDefaults = useStore((s) => s.resetToDefaults);
  const importState = useStore((s) => s.importState);

  const { isMobile, isTablet } = useBreakpoint();

  const [saved, setSaved] = useState(false);
  const [importError, setImportError] = useState("");

  // Tab
  const [tab, setTab] = useState<"general" | "rings" | "categories" | "modules" | "time" | "data">("general");

  // Ring editing
  const [editRingId, setEditRingId] = useState<string | null>(null);
  const [rLabel, setRLabel] = useState("");
  const [rDesc, setRDesc] = useState("");
  const [rColor, setRColor] = useState("#4c7fc9");
  const [rDefaultPct, setRDefaultPct] = useState(25);

  // Category editing
  const [editCatId, setEditCatId] = useState<string | null>(null);
  const [cLabel, setCLabel] = useState("");
  const [cColor, setCColor] = useState("#4c7fc9");

  function flashSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function handleAccentChange(hex: string) {
    if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return;
    updateAppConfig({ accentColor: hex });
    applyAccentColor(hex);
    flashSave();
  }

  function openEditRing(ring: RingConfig) {
    setEditRingId(ring.id);
    setRLabel(ring.label);
    setRDesc(ring.description);
    setRColor(ring.color);
    setRDefaultPct(ring.defaultPct);
  }

  function saveRing() {
    if (!editRingId) return;
    const rings = appConfig.rings.map((r) =>
      r.id === editRingId
        ? { ...r, label: rLabel, description: rDesc, color: rColor, defaultPct: rDefaultPct }
        : r
    );
    updateAppConfig({ rings });
    setEditRingId(null);
    flashSave();
  }

  function addRing() {
    const id = `ring-${genId()}`;
    const newRing: RingConfig = {
      id,
      label: "New Ring",
      description: "",
      color: "#7c5cd1",
      defaultPct: 10,
    };
    updateAppConfig({ rings: [...appConfig.rings, newRing] });
  }

  function removeRing(id: string) {
    updateAppConfig({ rings: appConfig.rings.filter((r) => r.id !== id) });
  }

  function openEditCat(cat: AllocationCategory) {
    setEditCatId(cat.id);
    setCLabel(cat.label);
    setCColor(cat.color);
  }

  function saveCat() {
    if (!editCatId) return;
    const cats = appConfig.allocationCategories.map((c) =>
      c.id === editCatId ? { ...c, label: cLabel, color: cColor } : c
    );
    updateAppConfig({ allocationCategories: cats });
    setEditCatId(null);
    flashSave();
  }

  function addCategory() {
    const id = `cat-${genId()}`;
    const newCat: AllocationCategory = { id, label: "New Category", color: "#27ae7a" };
    updateAppConfig({ allocationCategories: [...appConfig.allocationCategories, newCat] });
  }

  function removeCategory(id: string) {
    updateAppConfig({ allocationCategories: appConfig.allocationCategories.filter((c) => c.id !== id) });
  }

  function exportData() {
    const state = useStore.getState();
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `generic-dashboard-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        importState(data);
        setImportError("");
        flashSave();
      } catch {
        setImportError("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  const TABS = [
    { id: "general", label: "General" },
    { id: "rings", label: "Rings" },
    { id: "categories", label: "Categories" },
    { id: "modules", label: "Modules" },
    { id: "time", label: "Time units" },
    { id: "data", label: "Data" },
  ] as const;

  return (
    <div>
      <SectionTitle sub="Configure your dashboard">
        Settings
        {saved && (
          <span style={{ marginLeft: 12, fontSize: "0.75rem", color: C.green }}>✓ Saved</span>
        )}
      </SectionTitle>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: 4, marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "0.4rem 1rem",
              borderRadius: 6,
              background: tab === t.id ? C.accent : C.surfaceAlt,
              color: tab === t.id ? "#fff" : C.textSoft,
              border: "none",
              cursor: "pointer",
              fontSize: "0.82rem",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* General */}
      {tab === "general" && (
        <Card style={{ maxWidth: 600 }}>
          <div style={formRow}>
            <label style={labelStyle}>App name</label>
            <input
              value={appConfig.appName}
              onChange={(e) => updateAppConfig({ appName: e.target.value })}
              onBlur={flashSave}
              style={inputStyle}
            />
          </div>
          <div style={formRow}>
            <label style={labelStyle}>Tagline</label>
            <input
              value={appConfig.appTagline}
              onChange={(e) => updateAppConfig({ appTagline: e.target.value })}
              onBlur={flashSave}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Accent color</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 4 }}>
              <input
                type="color"
                value={appConfig.accentColor}
                onChange={(e) => handleAccentChange(e.target.value)}
                style={{ width: 40, height: 32, border: "none", background: "none", cursor: "pointer" }}
              />
              <input
                value={appConfig.accentColor}
                onChange={(e) => handleAccentChange(e.target.value)}
                style={{ ...inputStyle, flex: 1 }}
                placeholder="#4c7fc9"
              />
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              {ACCENT_PRESETS.map((color) => (
                <button
                  key={color}
                  onClick={() => handleAccentChange(color)}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 4,
                    background: color,
                    border: appConfig.accentColor === color ? "2px solid #fff" : "2px solid transparent",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 8 }}>
            {(
              [
                ["personasLabel", "Personas section label"],
                ["contentHubLabel", "Content hub section label"],
                ["contentSeriesLabel", "Series label"],
                ["contentItemLabel", "Item label"],
                ["pipelineItemLabel", "Pipeline item label"],
                ["pipelineItemPluralLabel", "Pipeline item plural label"],
                ["quarterGoalLabel", "Quarter goal label"],
                ["quarterThemeLabel", "Quarter theme label"],
              ] as Array<[keyof typeof appConfig, string]>
            ).map(([key, label]) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <input
                  value={appConfig[key] as string}
                  onChange={(e) => updateAppConfig({ [key]: e.target.value })}
                  onBlur={flashSave}
                  style={inputStyle}
                />
              </div>
            ))}
          </div>

          <div style={{ marginTop: "1rem" }}>
            <button
              onClick={() => { updateAppConfig({ onboardingComplete: false }); }}
              style={btnSecondary}
            >
              Re-launch onboarding wizard
            </button>
          </div>
        </Card>
      )}

      {/* Rings */}
      {tab === "rings" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.75rem" }}>
            <button onClick={addRing} style={{ ...btnPrimary, fontSize: "0.8rem" }}>+ Ring</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {appConfig.rings.map((ring) => (
              <Card key={ring.id} style={{ borderLeft: `3px solid ${ring.color}` }}>
                {editRingId === ring.id ? (
                  <div>
                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr auto" : "1fr 1fr auto", gap: 8, marginBottom: "0.75rem" }}>
                      <input value={rLabel} onChange={(e) => setRLabel(e.target.value)} style={inputStyle} placeholder="Label" />
                      <input value={rDesc} onChange={(e) => setRDesc(e.target.value)} style={inputStyle} placeholder="Description" />
                      <input type="color" value={rColor} onChange={(e) => setRColor(e.target.value)} style={{ width: 40, height: 38, border: "none", background: "none", cursor: "pointer" }} />
                    </div>
                    <div style={{ marginBottom: "0.75rem" }}>
                      <label style={labelStyle}>Default %: {rDefaultPct}</label>
                      <input type="range" min={0} max={100} value={rDefaultPct} onChange={(e) => setRDefaultPct(Number(e.target.value))} style={{ width: "100%" }} />
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={saveRing} style={btnPrimary}>Save</button>
                      <button onClick={() => setEditRingId(null)} style={btnSecondary}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: "0.88rem", color: ring.color, fontWeight: 600 }}>{ring.label}</div>
                      <div style={{ fontSize: "0.75rem", color: C.textDim }}>{ring.description} · {ring.defaultPct}%</div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => openEditRing(ring)} style={{ ...btnSecondary, fontSize: "0.78rem" }}>Edit</button>
                      <button onClick={() => removeRing(ring.id)} style={{ ...btnDanger, fontSize: "0.78rem" }}>×</button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      {tab === "categories" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.75rem" }}>
            <button onClick={addCategory} style={{ ...btnPrimary, fontSize: "0.8rem" }}>+ Category</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {appConfig.allocationCategories.map((cat) => (
              <Card key={cat.id} style={{ borderLeft: `3px solid ${cat.color}` }}>
                {editCatId === cat.id ? (
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input value={cLabel} onChange={(e) => setCLabel(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                    <input type="color" value={cColor} onChange={(e) => setCColor(e.target.value)} style={{ width: 40, height: 38, border: "none", background: "none", cursor: "pointer" }} />
                    <button onClick={saveCat} style={btnPrimary}>Save</button>
                    <button onClick={() => setEditCatId(null)} style={btnSecondary}>Cancel</button>
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.88rem", color: cat.color, fontWeight: 600 }}>{cat.label}</span>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => openEditCat(cat)} style={{ ...btnSecondary, fontSize: "0.78rem" }}>Edit</button>
                      <button onClick={() => removeCategory(cat.id)} style={{ ...btnDanger, fontSize: "0.78rem" }}>×</button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Modules */}
      {tab === "modules" && (
        <Card style={{ maxWidth: 500 }}>
          <div
            style={{
              fontSize: "0.75rem",
              color: C.textMuted,
              marginBottom: "1rem",
              lineHeight: 1.5,
            }}
          >
            Toggle which modules are visible in the navigation. Disabled modules retain their data.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {(
              [
                ["pipeline", "Pipeline (Kanban workflow)"],
                ["projects", "Projects"],
                ["kpis", "KPIs"],
                ["quarter", "Quarterly plan"],
                ["phases", "Phases & milestones"],
                ["guardrails", "Guardrails"],
                ["personas", "Personas"],
                ["ideas", "Ideas"],
                ["contentHub", "Content hub"],
                ["weeklyCalendar", "Weekly calendar"],
                ["retrospective", "Retrospective"],
              ] as Array<[keyof typeof appConfig.modules, string]>
            ).map(([key, label]) => {
              const enabled = appConfig.modules[key];
              return (
                <label
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    cursor: "pointer",
                    padding: "0.5rem 0.75rem",
                    background: enabled ? `${C.accent}08` : C.surfaceAlt,
                    border: `1px solid ${enabled ? C.accent + "30" : C.border}`,
                    borderRadius: 8,
                    transition: "background 0.15s",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) =>
                      updateAppConfig({
                        modules: { ...appConfig.modules, [key]: e.target.checked },
                      })
                    }
                    style={{ accentColor: C.accent }}
                  />
                  <span style={{ fontSize: "0.85rem", color: enabled ? C.text : C.textMuted }}>
                    {label}
                  </span>
                </label>
              );
            })}
          </div>
        </Card>
      )}

      {/* Time units */}
      {tab === "time" && (
        <Card style={{ maxWidth: 500 }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
            <div style={formRow}>
              <label style={labelStyle}>Unit label (singular)</label>
              <input
                value={appConfig.timeUnitLabel}
                onChange={(e) => updateAppConfig({ timeUnitLabel: e.target.value })}
                onBlur={flashSave}
                style={inputStyle}
                placeholder="UT"
              />
            </div>
            <div style={formRow}>
              <label style={labelStyle}>Unit label (plural)</label>
              <input
                value={appConfig.timeUnitPluralLabel}
                onChange={(e) => updateAppConfig({ timeUnitPluralLabel: e.target.value })}
                onBlur={flashSave}
                style={inputStyle}
                placeholder="UTs"
              />
            </div>
            <div style={formRow}>
              <label style={labelStyle}>Minutes per unit</label>
              <input
                type="number"
                min={15}
                max={480}
                step={15}
                value={appConfig.timeUnitMinutes}
                onChange={(e) => updateAppConfig({ timeUnitMinutes: Number(e.target.value) })}
                onBlur={flashSave}
                style={inputStyle}
              />
            </div>
            <div style={formRow}>
              <label style={labelStyle}>Weekly target (units)</label>
              <input
                type="number"
                min={1}
                max={100}
                value={appConfig.weeklyTimeUnitTarget}
                onChange={(e) => updateAppConfig({ weeklyTimeUnitTarget: Number(e.target.value) })}
                onBlur={flashSave}
                style={inputStyle}
              />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "1fr 1fr 1fr", gap: 12, marginTop: 8 }}>
            <div style={formRow}>
              <label style={labelStyle}>Energy label</label>
              <input value={appConfig.energyLabel} onChange={(e) => updateAppConfig({ energyLabel: e.target.value })} onBlur={flashSave} style={inputStyle} />
            </div>
            <div style={formRow}>
              <label style={labelStyle}>Satisfaction label</label>
              <input value={appConfig.satisfactionLabel} onChange={(e) => updateAppConfig({ satisfactionLabel: e.target.value })} onBlur={flashSave} style={inputStyle} />
            </div>
            <div style={formRow}>
              <label style={labelStyle}>Capacity label</label>
              <input value={appConfig.capacityLabel} onChange={(e) => updateAppConfig({ capacityLabel: e.target.value })} onBlur={flashSave} style={inputStyle} />
            </div>
          </div>
        </Card>
      )}

      {/* Data */}
      {tab === "data" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 500 }}>
          <Card>
            <div style={{ fontSize: "0.85rem", color: C.textSoft, marginBottom: "0.75rem", fontWeight: 600 }}>
              Export
            </div>
            <p style={{ fontSize: "0.8rem", color: C.textMuted, margin: "0 0 0.75rem" }}>
              Download all data as a JSON file for backup or transfer.
            </p>
            <button onClick={exportData} style={btnPrimary}>
              Export JSON
            </button>
          </Card>

          <Card>
            <div style={{ fontSize: "0.85rem", color: C.textSoft, marginBottom: "0.75rem", fontWeight: 600 }}>
              Import
            </div>
            <p style={{ fontSize: "0.8rem", color: C.textMuted, margin: "0 0 0.75rem" }}>
              Import a previously exported JSON file. Only valid fields will be imported.
            </p>
            <label
              style={{
                ...btnSecondary,
                cursor: "pointer",
                display: "inline-block",
              }}
            >
              Choose file
              <input type="file" accept=".json" onChange={handleImport} style={{ display: "none" }} />
            </label>
            {importError && (
              <p style={{ color: C.red, fontSize: "0.78rem", marginTop: "0.5rem" }}>{importError}</p>
            )}
          </Card>

          <Card style={{ border: `1px solid ${C.red}30` }}>
            <div style={{ fontSize: "0.85rem", color: C.red, marginBottom: "0.75rem", fontWeight: 600 }}>
              Reset
            </div>
            <p style={{ fontSize: "0.8rem", color: C.textMuted, margin: "0 0 0.75rem" }}>
              Reset all data to factory defaults. This cannot be undone.
            </p>
            <button
              onClick={() => {
                if (confirm("Reset all data to defaults? This cannot be undone.")) {
                  resetToDefaults();
                }
              }}
              style={btnDanger}
            >
              Reset to defaults
            </button>
          </Card>
        </div>
      )}
    </div>
  );
}
