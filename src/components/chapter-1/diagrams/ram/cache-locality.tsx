import { useState, useEffect, useRef } from "react";

interface CacheLocalityProps {
  labels?: {
    arrayTitle?: string;
    linkedTitle?: string;
    hitBadge?: string;
    missBadge?: string;
    arrayNote?: string;
    linkedNote?: string;
    cacheLineLabel?: string;
    playButton?: string;
    playingButton?: string;
    resetButton?: string;
    cpuLabel?: string;
    ramLabel?: string;
    temporalTitle?: string;
    temporalDesc?: string;
    spatialTitle?: string;
    spatialDesc?: string;
  };
}

const defaults = {
  arrayTitle: "Array",
  linkedTitle: "Lista Encadeada",
  hitBadge: "cache hit ✓",
  missBadge: "cache miss ✗",
  arrayNote:
    "Elementos contíguos. Após o primeiro acesso, os vizinhos já estão no cache.",
  linkedNote: "Nós espalhados. Cada acesso força uma nova ida à RAM.",
  cacheLineLabel: "← Cache Line carregada de uma vez →",
  playButton: "▶ Simular acesso",
  playingButton: "▶ Simulando...",
  resetButton: "↺ Resetar",
  cpuLabel: "CPU",
  ramLabel: "⚡ RAM",
  temporalTitle: "Localidade Temporal",
  temporalDesc:
    "Dado acessado recentemente tende a ser acessado de novo. Ex: variável de controle num loop.",
  spatialTitle: "Localidade Espacial",
  spatialDesc:
    "Dados próximos ao acessado tendem a ser necessários em seguida. Ex: percorrer um array.",
};

const ARRAY_DATA: [string, string][] = [
  ["10", "0x01"],
  ["20", "0x02"],
  ["30", "0x03"],
  ["40", "0x04"],
  ["50", "0x05"],
];
const LINKED_DATA: [string, string][] = [
  ["10", "0xA1"],
  ["20", "0xF3"],
  ["30", "0xB7"],
];

export default function CacheLocality({ labels = {} }: CacheLocalityProps) {
  const t = { ...defaults, ...labels };

  const [arrayStep, setArrayStep] = useState(-1);
  const [linkedStep, setLinkedStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [cacheLine, setCacheLine] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const reset = () => {
    clearTimers();
    setArrayStep(-1);
    setLinkedStep(-1);
    setPlaying(false);
    setCacheLine(false);
  };

  const play = () => {
    if (playing) return;
    reset();
    setPlaying(true);
    const add = (fn: () => void, ms: number) =>
      timers.current.push(setTimeout(fn, ms));

    add(() => setCacheLine(true), 300);
    ARRAY_DATA.forEach((_, i) => add(() => setArrayStep(i), 600 + i * 480));
    LINKED_DATA.forEach((_, i) => add(() => setLinkedStep(i), 600 + i * 860));

    const done =
      600 + Math.max(ARRAY_DATA.length * 480, LINKED_DATA.length * 860) + 400;
    add(() => setPlaying(false), done);
  };

  useEffect(() => () => clearTimers(), []);

  // Derived booleans
  const arrayDone = arrayStep >= ARRAY_DATA.length - 1;
  const linkedDone = linkedStep >= LINKED_DATA.length - 1;

  return (
    <div
      style={{
        margin: "24px 0",
        fontFamily: "var(--ifm-font-family-monospace)",
      }}
    >
      <style>{`
        @keyframes cl-pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        .cl-ram { animation: cl-pulse .55s ease; }
        @keyframes cl-fadein { from{opacity:0;transform:scaleX(.8)} to{opacity:1;transform:scaleX(1)} }
        .cl-line { animation: cl-fadein .25s ease forwards; }
        .cl-btn { transition: background .15s, border-color .15s, color .15s, opacity .15s; cursor: pointer; font-family: var(--ifm-font-family-monospace); }
        .cl-cell { transition: background .25s ease, border-color .25s ease, color .25s ease, box-shadow .25s ease; }
      `}</style>

      {/* Type cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          marginBottom: "14px",
        }}
      >
        {[
          {
            title: t.temporalTitle,
            desc: t.temporalDesc,
            color: "var(--ifm-color-primary)",
          },
          {
            title: t.spatialTitle,
            desc: t.spatialDesc,
            color: "var(--terminal-cyan)",
          },
        ].map(({ title, desc, color }) => (
          <div
            key={title}
            style={{
              background: "var(--card)",
              border: `1px solid var(--border)`,
              borderLeft: `3px solid ${color}`,
              borderRadius: "var(--radius)",
              padding: "12px 14px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: "700",
                color,
                letterSpacing: ".08em",
                textTransform: "uppercase",
                marginBottom: "5px",
              }}
            >
              {title}
            </div>
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: "var(--muted-foreground)",
                lineHeight: "1.6",
              }}
            >
              {desc}
            </p>
          </div>
        ))}
      </div>

      {/* Main panel */}
      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "20px",
        }}
      >
        {/* Controls */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          <button
            className="cl-btn"
            onClick={play}
            disabled={playing}
            style={{
              padding: "7px 16px",
              borderRadius: "var(--radius)",
              border: `1px solid ${playing ? "var(--border)" : "var(--ifm-color-primary)"}`,
              background: playing
                ? "var(--secondary)"
                : `color-mix(in srgb, var(--ifm-color-primary) 12%, var(--card))`,
              color: playing
                ? "var(--muted-foreground)"
                : "var(--ifm-color-primary)",
              fontSize: "12px",
              fontWeight: "600",
              opacity: playing ? 0.6 : 1,
            }}
          >
            {playing ? t.playingButton : t.playButton}
          </button>
          <button
            className="cl-btn"
            onClick={reset}
            style={{
              padding: "7px 16px",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--muted-foreground)",
              fontSize: "12px",
            }}
          >
            {t.resetButton}
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1px 1fr",
            gap: "0 20px",
          }}
        >
          {/* LEFT — Array */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "var(--terminal-cyan)",
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                }}
              >
                {t.arrayTitle}
              </span>
              <span
                style={{
                  fontSize: "10px",
                  padding: "2px 7px",
                  borderRadius: "var(--radius)",
                  background: `color-mix(in srgb, var(--ifm-color-primary) 10%, var(--card))`,
                  border: "1px solid var(--ifm-color-primary)",
                  color: "var(--ifm-color-primary)",
                }}
              >
                {t.hitBadge}
              </span>
            </div>

            {cacheLine && (
              <p
                className="cl-line"
                style={{
                  fontSize: "10px",
                  color: "var(--terminal-cyan)",
                  marginBottom: "6px",
                  opacity: 0.8,
                }}
              >
                {t.cacheLineLabel}
              </p>
            )}

            <div style={{ display: "flex", gap: "3px", marginBottom: "14px" }}>
              {ARRAY_DATA.map(([val, addr], i) => {
                const isActive = arrayStep === i;
                const isLoaded = cacheLine && arrayStep > i;
                return (
                  <div
                    key={i}
                    className="cl-cell"
                    style={{
                      flex: 1,
                      height: "52px",
                      borderRadius: "var(--radius)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      color: isActive
                        ? "var(--terminal-cyan)"
                        : isLoaded
                          ? "var(--ifm-color-primary)"
                          : "var(--muted-foreground)",
                      background: isActive
                        ? `color-mix(in srgb, var(--terminal-cyan) 15%, var(--card))`
                        : isLoaded
                          ? `color-mix(in srgb, var(--ifm-color-primary) 10%, var(--card))`
                          : "var(--secondary)",
                      border: `1px solid ${isActive ? "var(--terminal-cyan)" : isLoaded ? "var(--ifm-color-primary)" : "var(--border)"}`,
                      boxShadow: isActive
                        ? `0 0 0 1px var(--terminal-cyan)`
                        : "none",
                    }}
                  >
                    <span style={{ fontSize: "14px", fontWeight: "700" }}>
                      {val}
                    </span>
                    <span
                      style={{
                        fontSize: "9px",
                        color: "var(--muted-foreground)",
                        marginTop: "2px",
                      }}
                    >
                      {addr}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* CPU indicator */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <div
                style={{
                  width: "1px",
                  height: "14px",
                  background:
                    arrayStep >= 0 ? "var(--terminal-cyan)" : "var(--border)",
                  transition: "background .3s",
                }}
              />
              <div
                className="cl-cell"
                style={{
                  padding: "6px 18px",
                  borderRadius: "var(--radius)",
                  fontSize: "12px",
                  fontWeight: "600",
                  color:
                    arrayStep >= 0
                      ? "var(--terminal-cyan)"
                      : "var(--muted-foreground)",
                  background:
                    arrayStep >= 0
                      ? `color-mix(in srgb, var(--terminal-cyan) 12%, var(--card))`
                      : "var(--secondary)",
                  border: `1px solid ${arrayStep >= 0 ? "var(--terminal-cyan)" : "var(--border)"}`,
                }}
              >
                {t.cpuLabel}
              </div>
            </div>

            <p
              style={{
                fontSize: "11px",
                color: "var(--muted-foreground)",
                marginTop: "12px",
                lineHeight: "1.6",
              }}
            >
              {t.arrayNote}
            </p>
          </div>

          {/* Divider */}
          <div style={{ background: "var(--border)" }} />

          {/* RIGHT — Linked list */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "var(--terminal-red)",
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                }}
              >
                {t.linkedTitle}
              </span>
              <span
                style={{
                  fontSize: "10px",
                  padding: "2px 7px",
                  borderRadius: "var(--radius)",
                  background: `color-mix(in srgb, var(--terminal-red) 10%, var(--card))`,
                  border: "1px solid var(--terminal-red)",
                  color: "var(--terminal-red)",
                }}
              >
                {t.missBadge}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                marginBottom: "14px",
              }}
            >
              {LINKED_DATA.map(([val, addr], i) => {
                const isActive = linkedStep === i;
                const wasDone = linkedStep > i;
                return (
                  <div key={i}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div
                        className="cl-cell"
                        style={{
                          width: "50px",
                          height: "38px",
                          borderRadius: "var(--radius)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                          fontWeight: "700",
                          color:
                            isActive || wasDone
                              ? "var(--terminal-red)"
                              : "var(--muted-foreground)",
                          background:
                            isActive || wasDone
                              ? `color-mix(in srgb, var(--terminal-red) 12%, var(--card))`
                              : "var(--secondary)",
                          border: `1px solid ${isActive || wasDone ? "var(--terminal-red)" : "var(--border)"}`,
                          boxShadow: isActive
                            ? `0 0 0 1px var(--terminal-red)`
                            : "none",
                        }}
                      >
                        {val}
                      </div>
                      <span
                        style={{
                          fontSize: "10px",
                          color: "var(--muted-foreground)",
                          flex: 1,
                        }}
                      >
                        → {addr}
                      </span>
                      <span
                        className={isActive ? "cl-ram" : ""}
                        style={{
                          fontSize: "11px",
                          fontWeight: "600",
                          color: "var(--terminal-red)",
                          opacity: isActive ? 1 : wasDone ? 0.35 : 0.1,
                          transition: "opacity .3s",
                        }}
                      >
                        {t.ramLabel}
                      </span>
                    </div>
                    {i < LINKED_DATA.length - 1 && (
                      <div
                        style={{
                          marginLeft: "24px",
                          width: "1px",
                          height: "8px",
                          background: `color-mix(in srgb, var(--terminal-red) 40%, transparent)`,
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* CPU indicator */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <div
                style={{
                  width: "1px",
                  height: "14px",
                  background:
                    linkedStep >= 0 ? "var(--terminal-red)" : "var(--border)",
                  transition: "background .3s",
                }}
              />
              <div
                className="cl-cell"
                style={{
                  padding: "6px 18px",
                  borderRadius: "var(--radius)",
                  fontSize: "12px",
                  fontWeight: "600",
                  color:
                    linkedStep >= 0
                      ? "var(--terminal-red)"
                      : "var(--muted-foreground)",
                  background:
                    linkedStep >= 0
                      ? `color-mix(in srgb, var(--terminal-red) 12%, var(--card))`
                      : "var(--secondary)",
                  border: `1px solid ${linkedStep >= 0 ? "var(--terminal-red)" : "var(--border)"}`,
                }}
              >
                {t.cpuLabel}
              </div>
            </div>

            <p
              style={{
                fontSize: "11px",
                color: "var(--muted-foreground)",
                marginTop: "12px",
                lineHeight: "1.6",
              }}
            >
              {t.linkedNote}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
