import { useMemo, useState } from "react";
import gaiaData from "./assets/gaia.json";

// Mapa de botones -> campo de rank en el JSON
const RANK_FIELD = {
  "2P": "2pRank",
  "3P": "3pRank",
  "4P": "4pRank",
};

// Función para asignar colores a los símbolos
function getSymbolColor(symbol) {
  switch (symbol) {
    case "++": return "#16a34a"; // verde
    case "+":  return "#22c55e"; // verde claro
    case ".":  return "#6b7280"; // gris
    case "-":  return "#f59e0b"; // amarillo
    case "--": return "#dc2626"; // rojo
    default:   return "#000";
  }
}

// Componente para pintar los valores
function ScoringItem({ label, value }) {
  return (
    <li>
      <strong>{label}: </strong>
      <span style={{ color: getSymbolColor(value), fontWeight: 600 }}>{value}</span>
    </li>
  );
}

export default function App() {
  const [mode, setMode] = useState("2P");    // 2P | 3P | 4P
  const [openId, setOpenId] = useState(null); // facción actualmente expandida

  const sortedFactions = useMemo(() => {
    const field = RANK_FIELD[mode];
    return [...gaiaData.factions]
      .filter(f => f && typeof f.name === "string" && f[field] != null)
      .sort((a, b) => Number(a[field]) - Number(b[field]));
  }, [mode]);

  return (
    <div id="main-container">
      <div className="content">
        <h1>Gaia Factions</h1>
        <p style={{ textAlign: "center", marginTop: 0, color: "#555" }}>Player Count:</p>

        <div style={{ display: "flex", gap: 8, marginBottom: 16, justifyContent:"center" }}>
          {(["2P", "3P", "4P"]).map(key => (
            <button
              key={key}
              aria-pressed={mode === key}
              onClick={() => setMode(key)}
            >
              {key}
            </button>
          ))}
        </div>

        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
          {sortedFactions.map((f) => {
            const isOpen = openId === f.id;
            return (
              <li key={f.id}>
                {/* El botón engloba el “header” de la facción */}
                <button
                  onClick={() => setOpenId(isOpen ? null : f.id)}
                  aria-expanded={isOpen}
                  aria-controls={`panel-${f.id}`}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "12px 14px",
                    borderRadius: 10,
                    background: "#1a1a1a",
                    cursor: "pointer"
                  }}
                >
                  <h2 style={{ margin: 0 }}>{f.name}</h2>
                  <small style={{ color: "#555" }}>
                    Click to {isOpen ? "hide" : "show"} more info
                  </small>
                </button>

                {/* Panel colapsable */}
                {isOpen && (
                  <div
                    id={`panel-${f.id}`}
                    role="region"
                    aria-labelledby=""
                    style={{
                      border: "1px solid #0000001e",
                      borderTop: "none",
                      borderRadius: "0 0 10px 10px",
                      padding: "12px 14px",
                      backgroundColor: "#ffffff03",
                      marginTop: "-10px"
                    }}
                  >
                    <h4 style={{ margin: "0 0 6px" }}>Final Scoring</h4>
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                      <ScoringItem label="Gaia" value={f["finalScoring-gaia"]} />
                      <ScoringItem label="Planet Type" value={f["finalScoring-planetType"]} />
                      <ScoringItem label="Structures" value={f["finalScoring-structure"]} />
                      <ScoringItem label="Federation Structures" value={f["finalScoring-structureFed"]} />
                      <ScoringItem label="Satellites" value={f["finalScoring-satellite"]} />
                      <ScoringItem label="Sectors" value={f["finalScoring-sector"]} />
                    </ul>

                    <div style={{ marginTop: 10 }}>
                      <p style={{ margin: "8px 0" }}>
                        <strong>Opening:</strong> {f.opening || "—"}
                      </p>
                      <p style={{ margin: 0 }}>
                        <strong>Obs.:</strong> {f.tip || "—"}
                      </p>
                      <p>
                        <strong style={{ margin: 0 }}>Scoring Route:</strong> {f.scoringRoute || "—"}
                      </p>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
