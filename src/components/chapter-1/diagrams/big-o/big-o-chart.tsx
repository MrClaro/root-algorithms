import { useState, useRef, useEffect, useCallback } from "react";

interface BigOChartProps {
  labels?: {
    title?: string;
    xAxis?: string;
    yAxis?: string;
    toggleHint?: string;
    hoverHint?: string;
    operations?: string;
    input?: string;
  };
}

const defaults = {
  title: "// crescimento de operações por tamanho de entrada",
  xAxis: "Tamanho da entrada (n)",
  yAxis: "Operações",
  toggleHint: "Clique nas legendas para mostrar/ocultar",
  hoverHint: "Passe o mouse sobre o gráfico",
  operations: "operações",
  input: "n",
};

interface Curve {
  key: string;
  label: string;
  color: string;
  fn: (n: number) => number;
  dashed?: boolean;
}

const CURVES: Curve[] = [
  { key: "O1", label: "O(1)", color: "var(--ifm-color-primary)", fn: () => 1 },
  {
    key: "Ologn",
    label: "O(log n)",
    color: "var(--terminal-cyan)",
    fn: (n) => Math.log2(n),
  },
  { key: "On", label: "O(n)", color: "var(--terminal-yellow)", fn: (n) => n },
  {
    key: "Onlogn",
    label: "O(n log n)",
    color: "var(--terminal-magenta)",
    fn: (n) => n * Math.log2(n),
  },
  {
    key: "On2",
    label: "O(n²)",
    color: "var(--terminal-red)",
    fn: (n) => n * n,
  },
];

const W = 600;
const H = 340;
const PAD = { top: 20, right: 20, bottom: 48, left: 52 };
const MAX_N = 20;
const STEPS = 100;

function toCanvas(n: number, ops: number, maxOps: number) {
  const x = PAD.left + (n / MAX_N) * (W - PAD.left - PAD.right);
  const y =
    H -
    PAD.bottom -
    (Math.min(ops, maxOps) / maxOps) * (H - PAD.top - PAD.bottom);
  return { x, y };
}

function buildPath(fn: (n: number) => number, maxOps: number): string {
  const pts: string[] = [];
  for (let i = 0; i <= STEPS; i++) {
    const n = (i / STEPS) * MAX_N;
    const ops = fn(Math.max(n, 0.001));
    const { x, y } = toCanvas(n, ops, maxOps);
    pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(" ");
}

export default function BigOChart({ labels = {} }: BigOChartProps) {
  const t = { ...defaults, ...labels };
  const [active, setActive] = useState<Record<string, boolean>>({
    O1: true,
    Ologn: true,
    On: true,
    Onlogn: true,
    On2: true,
  });
  const [hover, setHover] = useState<{
    n: number;
    x: number;
    y: number;
  } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const maxOps = 80; // clamp so O(n²) doesn't dwarf everything

  const toggle = (key: string) => setActive((p) => ({ ...p, [key]: !p[key] }));

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const scaleX = W / rect.width;
    const rawX = (e.clientX - rect.left) * scaleX;
    const n = Math.max(
      0,
      Math.min(MAX_N, ((rawX - PAD.left) / (W - PAD.left - PAD.right)) * MAX_N),
    );
    setHover({ n, x: rawX, y: 0 });
  }, []);

  // Y-axis tick labels
  const yTicks = [0, 20, 40, 60, 80];
  const xTicks = [0, 5, 10, 15, 20];

  return (
    <div
      style={{
        margin: "24px 0",
        fontFamily: "var(--ifm-font-family-monospace)",
      }}
    >
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

        {/* Legend toggles */}
        <div
          style={{
            display: "flex",
            gap: "14px",
            marginBottom: "16px",
            flexWrap: "wrap",
          }}
        >
          {CURVES.map((c) => (
            <button
              key={c.key}
              onClick={() => toggle(c.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 10px",
                borderRadius: "var(--radius)",
                border: `1px solid ${active[c.key] ? c.color : "var(--border)"}`,
                background: active[c.key]
                  ? `color-mix(in srgb, ${c.color} 12%, var(--card))`
                  : "var(--secondary)",
                color: active[c.key] ? c.color : "var(--muted-foreground)",
                fontSize: "12px",
                fontWeight: active[c.key] ? "700" : "400",
                cursor: "pointer",
                fontFamily: "var(--ifm-font-family-monospace)",
                transition: "all .15s",
                opacity: active[c.key] ? 1 : 0.5,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "20px",
                  height: "2px",
                  background: active[c.key]
                    ? c.color
                    : "var(--muted-foreground)",
                  borderRadius: "1px",
                }}
              />
              {c.label}
            </button>
          ))}
        </div>

        {/* SVG Chart */}
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ cursor: "crosshair", display: "block" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHover(null)}
        >
          {/* Grid lines */}
          {yTicks.map((v) => {
            const { y } = toCanvas(0, v, maxOps);
            return (
              <g key={v}>
                <line
                  x1={PAD.left}
                  y1={y}
                  x2={W - PAD.right}
                  y2={y}
                  stroke="var(--border)"
                  strokeWidth=".5"
                  strokeDasharray="3 3"
                />
                <text
                  x={PAD.left - 6}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="var(--muted-foreground)"
                >
                  {v}
                </text>
              </g>
            );
          })}
          {xTicks.map((v) => {
            const { x } = toCanvas(v, 0, maxOps);
            return (
              <g key={v}>
                <line
                  x1={x}
                  y1={PAD.top}
                  x2={x}
                  y2={H - PAD.bottom}
                  stroke="var(--border)"
                  strokeWidth=".5"
                  strokeDasharray="3 3"
                />
                <text
                  x={x}
                  y={H - PAD.bottom + 14}
                  textAnchor="middle"
                  fontSize="10"
                  fill="var(--muted-foreground)"
                >
                  {v}
                </text>
              </g>
            );
          })}

          {/* Axes */}
          <line
            x1={PAD.left}
            y1={PAD.top}
            x2={PAD.left}
            y2={H - PAD.bottom}
            stroke="var(--border)"
            strokeWidth="1"
          />
          <line
            x1={PAD.left}
            y1={H - PAD.bottom}
            x2={W - PAD.right}
            y2={H - PAD.bottom}
            stroke="var(--border)"
            strokeWidth="1"
          />

          {/* Axis labels */}
          <text
            x={(PAD.left + W - PAD.right) / 2}
            y={H - 6}
            textAnchor="middle"
            fontSize="11"
            fill="var(--muted-foreground)"
          >
            {t.xAxis}
          </text>
          <text
            x={12}
            y={(PAD.top + H - PAD.bottom) / 2}
            textAnchor="middle"
            fontSize="11"
            fill="var(--muted-foreground)"
            transform={`rotate(-90, 12, ${(PAD.top + H - PAD.bottom) / 2})`}
          >
            {t.yAxis}
          </text>

          {/* Curves */}
          {CURVES.map((c) =>
            active[c.key] ? (
              <path
                key={c.key}
                d={buildPath(c.fn, maxOps)}
                fill="none"
                stroke={c.color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transition: "opacity .2s" }}
              />
            ) : null,
          )}

          {/* Hover line + dots */}
          {hover && (
            <>
              <line
                x1={hover.x}
                y1={PAD.top}
                x2={hover.x}
                y2={H - PAD.bottom}
                stroke="var(--muted-foreground)"
                strokeWidth=".8"
                strokeDasharray="4 3"
              />
              {CURVES.filter((c) => active[c.key]).map((c) => {
                const ops = c.fn(Math.max(hover.n, 0.001));
                const { x, y } = toCanvas(hover.n, ops, maxOps);
                return (
                  <circle
                    key={c.key}
                    cx={x}
                    cy={y}
                    r="4"
                    fill={c.color}
                    stroke="var(--card)"
                    strokeWidth="1.5"
                  />
                );
              })}
            </>
          )}
        </svg>

        {/* Hover tooltip */}
        {hover ? (
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{ fontSize: "11px", color: "var(--muted-foreground)" }}
            >
              {t.input} = {hover.n.toFixed(1)}
            </span>
            {CURVES.filter((c) => active[c.key]).map((c) => {
              const ops = c.fn(Math.max(hover.n, 0.001));
              const clamped = Math.min(ops, maxOps);
              return (
                <span
                  key={c.key}
                  style={{
                    fontSize: "11px",
                    color: c.color,
                    fontWeight: "600",
                  }}
                >
                  {c.label}: {ops > maxOps ? `>${maxOps}` : clamped.toFixed(1)}{" "}
                  {t.operations}
                </span>
              );
            })}
          </div>
        ) : (
          <p
            style={{
              fontSize: "11px",
              color: "var(--muted-foreground)",
              marginTop: "10px",
            }}
          >
            {t.hoverHint} · {t.toggleHint}
          </p>
        )}
      </div>
    </div>
  );
}
