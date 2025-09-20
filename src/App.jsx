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
case "++":
return "#16a34a"; // verde
case "+":
return "#22c55e"; // verde claro
case ".":
return "#6b7280"; // gris
case "-":
return "#f59e0b"; // amarillo
case "--":
return "#dc2626"; // rojo
default:
return "#000";
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
  const [mode, setMode] = useState("2P"); // 2P | 3P | 4P

  const sortedFactions = useMemo(() => {
    const field = RANK_FIELD[mode];
    return [...gaiaData.factions]
      .filter(f => f && typeof f.name === "string" && f[field] != null)
      .sort((a, b) => Number(a[field]) - Number(b[field]));
  }, [mode]);

  return (
    <div style={{ fontFamily: "system-ui, Roboto, Arial, sans-serif", padding: 24 }}>
      <h1>Gaia Factions</h1>
      <p style={{ marginTop: 0, color: "#555" }}>Player Count: {mode}</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
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
        {sortedFactions.map((f) => (
          <li
            key={f.id}
          >
            <h2>{f.name}</h2>
            <h4>Final Scoring:</h4>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <ScoringItem label="Gaia" value={f["finalScoring-gaia"]} />
              <ScoringItem label="Planet Type" value={f["finalScoring-planetType"]} />
              <ScoringItem label="Structures" value={f["finalScoring-structure"]} />
              <ScoringItem label="Federation Structures" value={f["finalScoring-structureFed"]} />
              <ScoringItem label="Satellites" value={f["finalScoring-satellite"]} />
              <ScoringItem label="Sectors" value={f["finalScoring-sector"]} />
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
