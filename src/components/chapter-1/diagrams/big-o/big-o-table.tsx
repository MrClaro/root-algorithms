import { useState } from "react";

interface BigOTableProps {
  labels?: {
    title?: string;
    colN?: string;
    hint?: string;
    worst?: string;
    best?: string;
  };
}

const defaults = {
  title: "// crescimento de operações por complexidade",
  colN: "Elementos (n)",
  hint: "Clique em uma linha para destacar",
  worst: "pior",
  best: "melhor",
};

interface Column {
  key: string;
  label: string;
  color: string;
  fn: (n: number) => number;
  fmt?: (v: number) => string;
}

const COLS: Column[] = [
  {
    key: "logn",
    label: "O(log n)",
    color: "var(--terminal-cyan)",
    fn: (n) => Math.log2(n),
    fmt: (v) => `~${Math.round(v)}`,
  },
  {
    key: "n",
    label: "O(n)",
    color: "var(--terminal-yellow)",
    fn: (n) => n,
    fmt: (v) => v.toLocaleString(),
  },
  {
    key: "nlogn",
    label: "O(n log n)",
    color: "var(--terminal-magenta)",
    fn: (n) => n * Math.log2(n),
    fmt: (v) => `~${Math.round(v).toLocaleString()}`,
  },
  {
    key: "n2",
    label: "O(n²)",
    color: "var(--terminal-red)",
    fn: (n) => n * n,
    fmt: (v) => v.toLocaleString(),
  },
];

const ROWS = [10, 100, 1_000, 10_000, 100_000];

function barWidth(value: number, rowMax: number): string {
  if (rowMax === 0) return "0%";
  const pct = Math.sqrt(value / rowMax); // sqrt for visual balance
  return `${Math.min(100, pct * 100).toFixed(1)}%`;
}

export default function BigOTable({ labels = {} }: BigOTableProps) {
  const t = { ...defaults, ...labels };
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const [activeCol, setActiveCol] = useState<string | null>(null);

  return (
    <div
      style={{
        margin: "24px 0",
        fontFamily: "var(--ifm-font-family-monospace)",
      }}
    >
      <style>{`
        .bot-row { transition: background .15s; cursor: pointer; }
        .bot-row:hover td { background: color-mix(in srgb, var(--ifm-color-primary) 6%, var(--card)) !important; }
        .bot-cell { transition: background .15s, color .15s; }
        .bot-bar  { transition: width .4s cubic-bezier(.4,0,.2,1); }
        .bot-col-btn { transition: all .15s; cursor: pointer; font-family: var(--ifm-font-family-monospace); }
      `}</style>

      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "20px",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            color: "var(--muted-foreground)",
            letterSpacing: "1px",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}
        >
          {t.title}
        </p>

        {/* Column toggles */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "16px",
            flexWrap: "wrap",
          }}
        >
          {COLS.map((c) => (
            <button
              key={c.key}
              className="bot-col-btn"
              onClick={() => setActiveCol(activeCol === c.key ? null : c.key)}
              style={{
                padding: "4px 10px",
                borderRadius: "var(--radius)",
                fontSize: "12px",
                fontWeight: activeCol === c.key ? "700" : "400",
                border: `1px solid ${activeCol === c.key ? c.color : "var(--border)"}`,
                background:
                  activeCol === c.key
                    ? `color-mix(in srgb, ${c.color} 12%, var(--card))`
                    : "var(--secondary)",
                color:
                  activeCol === c.key ? c.color : "var(--muted-foreground)",
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13px",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "8px 12px",
                    borderBottom: "1px solid var(--border)",
                    color: "var(--muted-foreground)",
                    fontSize: "11px",
                    letterSpacing: ".06em",
                    fontWeight: "600",
                  }}
                >
                  {t.colN}
                </th>
                {COLS.map((c) => (
                  <th
                    key={c.key}
                    style={{
                      textAlign: "right",
                      padding: "8px 12px",
                      borderBottom: `1px solid ${activeCol === c.key ? c.color : "var(--border)"}`,
                      color:
                        activeCol === c.key
                          ? c.color
                          : "var(--muted-foreground)",
                      fontSize: "11px",
                      letterSpacing: ".06em",
                      fontWeight: "600",
                      transition: "color .15s, border-color .15s",
                    }}
                  >
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((n, ri) => {
                const rowMax = COLS[COLS.length - 1].fn(n);
                const isActive = activeRow === ri;
                return (
                  <tr
                    key={n}
                    className="bot-row"
                    onClick={() => setActiveRow(isActive ? null : ri)}
                  >
                    {/* N column */}
                    <td
                      style={{
                        padding: "10px 12px",
                        borderBottom: "1px solid var(--border)",
                        color: isActive
                          ? "var(--ifm-color-primary)"
                          : "var(--foreground)",
                        fontWeight: isActive ? "700" : "500",
                        background: isActive
                          ? `color-mix(in srgb, var(--ifm-color-primary) 6%, var(--card))`
                          : "transparent",
                      }}
                    >
                      {n.toLocaleString()}
                    </td>

                    {/* Value columns */}
                    {COLS.map((c) => {
                      const val = c.fn(n);
                      const display = c.fmt ? c.fmt(val) : val.toLocaleString();
                      const isColActive = activeCol === c.key;
                      const highlight = isActive || isColActive;

                      return (
                        <td
                          key={c.key}
                          className="bot-cell"
                          style={{
                            padding: "10px 12px",
                            borderBottom: "1px solid var(--border)",
                            textAlign: "right",
                            background: highlight
                              ? `color-mix(in srgb, ${c.color} 10%, var(--card))`
                              : "transparent",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-end",
                              gap: "4px",
                            }}
                          >
                            <span
                              style={{
                                color: highlight
                                  ? c.color
                                  : "var(--muted-foreground)",
                                fontWeight: highlight ? "700" : "400",
                                fontSize: "13px",
                              }}
                            >
                              {display}
                            </span>
                            {/* Bar */}
                            <div
                              style={{
                                width: "80px",
                                height: "3px",
                                background: "var(--secondary)",
                                borderRadius: "2px",
                                overflow: "hidden",
                              }}
                            >
                              <div
                                className="bot-bar"
                                style={{
                                  height: "100%",
                                  width: barWidth(val, rowMax),
                                  background: c.color,
                                  opacity: highlight ? 1 : 0.4,
                                  borderRadius: "2px",
                                }}
                              />
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p
          style={{
            fontSize: "11px",
            color: "var(--muted-foreground)",
            marginTop: "12px",
            marginBottom: 0,
          }}
        >
          {t.hint}
        </p>
      </div>
    </div>
  );
}
