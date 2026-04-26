import { useState } from "react";
import { C, FONT } from "../../theme";
import { HETERONYMS } from "../../data/heteronyms";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import type { Heteronym } from "../../types";

function HeteronymDetail({ h }: { h: Heteronym }) {
  return (
    <div>
      {/* Detail */}
      <p style={{ fontSize: "0.78rem", color: C.textSoft, lineHeight: 1.6, margin: "0 0 1rem" }}>{h.detail}</p>

      {/* Members (La Posse) */}
      {h.members && (
        <>
          <SectionTitle accent={h.color}>Membres</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem", marginBottom: "1rem" }}>
            {h.members.map((member) => (
              <div key={member.name} style={{ background: C.bg, borderRadius: 8, padding: "0.75rem", border: `1px solid ${h.color}25` }}>
                <div style={{ fontFamily: FONT.display, fontSize: "0.9rem", color: h.color, marginBottom: "0.3rem" }}>{member.name}</div>
                <div style={{ fontSize: "0.65rem", color: C.textMuted, marginBottom: "0.5rem" }}>{member.role}</div>
                <div style={{ fontSize: "0.68rem", color: C.textSoft, fontStyle: "italic", marginBottom: "0.4rem" }}>
                  "{member.voice}"
                </div>
                <div style={{ fontSize: "0.6rem", color: C.textDim, fontFamily: FONT.mono }}>{member.refs}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Inspirations */}
      {h.inspirations && h.inspirations.length > 0 && (
        <>
          <SectionTitle accent={h.color}>Inspirations</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
            {h.inspirations.map((insp) => (
              <div key={insp.nom} style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "0.75rem", padding: "0.5rem", background: C.bg, borderRadius: 6 }}>
                <div>
                  <div style={{ fontFamily: FONT.mono, fontSize: "0.68rem", color: h.color }}>{insp.nom}</div>
                  <div style={{ fontSize: "0.62rem", color: C.textDim, fontStyle: "italic" }}>{insp.oeuvre}</div>
                </div>
                <div style={{ fontSize: "0.7rem", color: C.textSoft, lineHeight: 1.4 }}>{insp.apport}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Lexique */}
      {h.lexique && (
        <>
          <SectionTitle accent={C.textDim}>Lexique</SectionTitle>
          <p style={{ fontFamily: FONT.mono, fontSize: "0.68rem", color: C.textMuted, lineHeight: 1.8, margin: "0 0 1rem" }}>{h.lexique}</p>
        </>
      )}

      {/* Playlist */}
      {h.playlist && h.playlist.length > 0 && (
        <>
          <SectionTitle accent={C.textDim}>Playlist / Références</SectionTitle>
          <ul style={{ margin: 0, paddingLeft: "1rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            {h.playlist.map((item) => (
              <li key={item} style={{ fontSize: "0.7rem", color: C.textSoft }}>{item}</li>
            ))}
          </ul>
        </>
      )}

      {/* Persona / ton */}
      {(h.persona || h.ton) && (
        <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {h.persona && (
            <div style={{ padding: "0.5rem 0.75rem", background: `${h.color}10`, borderRadius: 6, borderLeft: `2px solid ${h.color}` }}>
              <p style={{ fontSize: "0.7rem", color: C.textSoft, margin: 0, fontStyle: "italic", lineHeight: 1.5 }}>{h.persona}</p>
            </div>
          )}
          {h.ton && (
            <div style={{ padding: "0.4rem 0.75rem", background: C.bg, borderRadius: 6 }}>
              <span style={{ fontFamily: FONT.mono, fontSize: "0.62rem", color: C.textDim, display: "block", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.1em" }}>Ton</span>
              <p style={{ fontFamily: FONT.display, fontSize: "0.82rem", color: h.color, margin: 0, fontStyle: "italic" }}>"{h.ton}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ReferentielView() {
  const [selectedId, setSelectedId] = useState<string>(HETERONYMS[0].id);
  const selected = HETERONYMS.find((h) => h.id === selectedId) ?? HETERONYMS[0];

  return (
    <div>
      <div style={{ marginBottom: "1.25rem" }}>
        <h2 style={{ fontFamily: FONT.display, fontSize: "1.2rem", color: C.text, margin: 0 }}>Référentiel des régimes de signature</h2>
        <p style={{ fontSize: "0.7rem", color: C.textDim, margin: "0.2rem 0 0", fontFamily: FONT.mono }}>
          Cinq régimes — aucun glissement sans décision documentée
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "1.25rem", alignItems: "start" }}>
        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {HETERONYMS.map((h) => {
            const isSelected = selectedId === h.id;
            return (
              <Card
                key={h.id}
                onClick={() => setSelectedId(h.id)}
                style={{
                  padding: "0.75rem",
                  cursor: "pointer",
                  borderLeft: `3px solid ${isSelected ? h.color : "transparent"}`,
                  background: isSelected ? C.surfaceAlt : C.surface,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                  <span style={{ fontFamily: FONT.mono, fontSize: "0.7rem", color: h.color, background: `${h.color}18`, borderRadius: 4, padding: "0.1rem 0.35rem" }}>
                    Rég. {h.code}
                  </span>
                  <span style={{ fontFamily: FONT.display, fontSize: "0.9rem", color: isSelected ? h.color : C.text }}>{h.name}</span>
                </div>
                <p style={{ fontSize: "0.65rem", color: C.textDim, margin: 0, lineHeight: 1.4 }}>{h.label}</p>
              </Card>
            );
          })}
        </div>

        {/* Detail panel */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <span style={{ fontFamily: FONT.mono, fontSize: "0.75rem", color: selected.color, background: `${selected.color}18`, borderRadius: 6, padding: "0.2rem 0.6rem" }}>
              Régime {selected.code}
            </span>
            <div>
              <div style={{ fontFamily: FONT.display, fontSize: "1.2rem", color: selected.color }}>{selected.name}</div>
              <div style={{ fontSize: "0.68rem", color: C.textMuted }}>{selected.label}</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem", marginBottom: "1rem" }}>
            <div style={{ padding: "0.4rem 0.6rem", background: C.bg, borderRadius: 6 }}>
              <span style={{ fontFamily: FONT.mono, fontSize: "0.6rem", color: C.textDim, display: "block", marginBottom: 2, textTransform: "uppercase" }}>Visibilité</span>
              <span style={{ fontSize: "0.72rem", color: C.textSoft }}>{selected.public}</span>
            </div>
            <div style={{ padding: "0.4rem 0.6rem", background: C.bg, borderRadius: 6 }}>
              <span style={{ fontFamily: FONT.mono, fontSize: "0.6rem", color: C.textDim, display: "block", marginBottom: 2, textTransform: "uppercase" }}>Rôle</span>
              <span style={{ fontSize: "0.72rem", color: C.textSoft }}>{selected.role}</span>
            </div>
          </div>

          <HeteronymDetail h={selected} />
        </Card>
      </div>
    </div>
  );
}
