import { useState, useEffect, useRef } from "react";

interface ComplexityItem {
  notation: string;
  name: string;
  desc: string;
  analogy: string;
  example: string;
  color: string;
  stepsFn: (n: number) => number;
}

interface BigOComplexityProps {
  n?: number;
  labels?: {
    title?: string;
    analogyLabel?: string;
    exampleLabel?: string;
    stepsLabel?: string;
    inputLabel?: string;
    simulateButton?: string;
    runningButton?: string;
    items?: Partial<ComplexityItem>[];
  };
}

const defaults: ComplexityItem[] = [
  {
    notation: "O(1)",
    name: "Constante",
    color: "var(--ifm-color-primary)",
    desc: "O tempo de execução é o mesmo independentemente do tamanho da entrada.",
    analogy:
      "Abrir um dicionário direto na página da palavra — sem precisar ler as outras.",
    example: "Acessar array[5]",
    stepsFn: () => 1,
  },
  {
    notation: "O(log n)",
    name: "Logarítmica",
    color: "var(--terminal-cyan)",
    desc: "O tempo cresce proporcionalmente ao logaritmo da entrada.",
    analogy:
      "Abrir o dicionário no meio, descartar a metade errada, repetir — cada passo corta o problema pela metade.",
    example: "Busca binária",
    stepsFn: (n) => Math.ceil(Math.log2(n)),
  },
  {
    notation: "O(n)",
    name: "Linear",
    color: "var(--terminal-yellow)",
    desc: "O tempo cresce proporcionalmente ao tamanho da entrada.",
    analogy: "Ler cada palavra do dicionário uma a uma até encontrar a certa.",
    example: "Percorrer um array",
    stepsFn: (n) => n,
  },
  {
    notation: "O(n log n)",
    name: "Linear-logarítmica",
    color: "var(--terminal-magenta)",
    desc: "Combina divisão e conquista — mais lento que linear mas bem melhor que quadrático.",
    analogy:
      "Organizar o dicionário dividindo em pilhas menores e ordenando cada uma.",
    example: "Merge Sort, Quick Sort",
    stepsFn: (n) => Math.ceil(n * Math.log2(n)),
  },
  {
    notation: "O(n²)",
    name: "Quadrática",
    color: "var(--terminal-red)",
    desc: "O tempo cresce com o quadrado da entrada. Dois loops aninhados é o caso clássico.",
    analogy:
      "Comparar cada palavra do dicionário com todas as outras palavras.",
    example: "Bubble Sort, loops aninhados",
    stepsFn: (n) => n * n,
  },
];

const DEFAULT_N = 16;

export default function BigOComplexity({
  n: initN = DEFAULT_N,
  labels = {},
}: BigOComplexityProps) {
  const items: ComplexityItem[] = defaults.map((d, i) => ({
    ...d,
    ...(labels.items?.[i] ?? {}),
  }));

  const title = labels.title ?? "// complexidades mais comuns";
  const analogyLabel = labels.analogyLabel ?? "Analogia";
  const exampleLabel = labels.exampleLabel ?? "Exemplo";
  const stepsLabel = labels.stepsLabel ?? "operações para n =";
  const simulateButton = labels.simulateButton ?? "▶ Simular";
  const runningButton = labels.runningButton ?? "▶ Executando...";

  const [n, setN] = useState(initN);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [running, setRunning] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAll = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => () => clearAll(), []);

  const simulate = () => {
    if (running) return;
    clearAll();
    setRunning(true);
    setProgress({});

    // Animate each bar filling proportionally — slowest fills last
    const maxSteps = items[items.length - 1].stepsFn(n);

    items.forEach((item) => {
      const steps = item.stepsFn(n);
      const duration = 1200; // ms total for each bar
      const fps = 30;
      const interval = duration / fps;
      let frame = 0;

      const tick = () => {
        frame++;
        const pct = Math.min(1, frame / fps);
        setProgress((prev) => ({ ...prev, [item.notation]: pct * steps }));
        if (pct < 1) timers.current.push(setTimeout(tick, interval));
      };
      timers.current.push(setTimeout(tick, 0));
    });

    timers.current.push(setTimeout(() => setRunning(false), 1400));
  };

  return (
    <div
      style={{
        margin: "24px 0",
        fontFamily: "var(--ifm-font-family-monospace)",
      }}
    >
      <style>{`
        .boc-card {
          transition: border-color .15s, background .15s;
          cursor: pointer;
        }
        .boc-card:hover { border-color: var(--ifm-color-primary) !important; }
        .boc-bar { transition: width .05s linear; }
        .boc-detail {
          overflow: hidden;
          transition: max-height .25s ease, opacity .25s ease, padding .25s ease;
        }
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
          {title}
        </p>

        {/* Controls */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={simulate}
            disabled={running}
            style={{
              padding: "7px 16px",
              borderRadius: "var(--radius)",
              fontSize: "12px",
              fontWeight: "600",
              border: `1px solid ${running ? "var(--border)" : "var(--ifm-color-primary)"}`,
              background: running
                ? "var(--secondary)"
                : `color-mix(in srgb, var(--ifm-color-primary) 12%, var(--card))`,
              color: running
                ? "var(--muted-foreground)"
                : "var(--ifm-color-primary)",
              cursor: running ? "not-allowed" : "pointer",
              opacity: running ? 0.6 : 1,
              fontFamily: "var(--ifm-font-family-monospace)",
              transition: "all .15s",
            }}
          >
            {running ? runningButton : simulateButton}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label
              style={{ fontSize: "12px", color: "var(--muted-foreground)" }}
            >
              n =
            </label>
            <input
              type="range"
              min="4"
              max="64"
              step="4"
              value={n}
              onChange={(e) => setN(Number(e.target.value))}
              style={{
                accentColor: "var(--ifm-color-primary)",
                width: "120px",
              }}
            />
            <span
              style={{
                fontSize: "12px",
                color: "var(--ifm-color-primary)",
                fontWeight: "700",
                minWidth: "24px",
              }}
            >
              {n}
            </span>
          </div>
        </div>

        {/* Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {items.map((item) => {
            const steps = item.stepsFn(n);
            const maxSteps = items[items.length - 1].stepsFn(n);
            const barPct =
              Math.sqrt(Math.min(steps, maxSteps) / maxSteps) * 100;
            const animPct =
              progress[item.notation] !== undefined
                ? Math.sqrt(
                    Math.min(progress[item.notation], maxSteps) / maxSteps,
                  ) * 100
                : 0;
            const isOpen = expanded === item.notation;

            return (
              <div
                key={item.notation}
                className="boc-card"
                onClick={() => setExpanded(isOpen ? null : item.notation)}
                style={{
                  border: `1px solid ${isOpen ? item.color : "var(--border)"}`,
                  borderRadius: "var(--radius)",
                  background: isOpen
                    ? `color-mix(in srgb, ${item.color} 6%, var(--card))`
                    : "var(--secondary)",
                  overflow: "hidden",
                }}
              >
                {/* Header row */}
                <div
                  style={{
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  {/* Notation badge */}
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "700",
                      color: item.color,
                      minWidth: "90px",
                      flexShrink: 0,
                    }}
                  >
                    {item.notation}
                  </span>

                  {/* Bar */}
                  <div
                    style={{
                      flex: 1,
                      height: "6px",
                      background: "var(--border)",
                      borderRadius: "3px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      className="boc-bar"
                      style={{
                        height: "100%",
                        borderRadius: "3px",
                        background: item.color,
                        width: `${Object.keys(progress).length > 0 ? animPct : barPct}%`,
                        opacity: 0.8,
                      }}
                    />
                  </div>

                  {/* Steps count */}
                  <span
                    style={{
                      fontSize: "12px",
                      color: item.color,
                      fontWeight: "600",
                      minWidth: "80px",
                      textAlign: "right",
                    }}
                  >
                    {steps > 9999
                      ? `${(steps / 1000).toFixed(0)}k`
                      : steps.toLocaleString()}
                  </span>

                  {/* Name */}
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--muted-foreground)",
                      minWidth: "120px",
                      textAlign: "right",
                    }}
                  >
                    {item.name}
                  </span>

                  <span
                    style={{
                      fontSize: "11px",
                      color: isOpen ? item.color : "var(--muted-foreground)",
                      transition: "transform .2s",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      display: "inline-block",
                    }}
                  >
                    ▾
                  </span>
                </div>

                {/* Expandable detail */}
                <div
                  className="boc-detail"
                  style={{
                    maxHeight: isOpen ? "300px" : "0",
                    opacity: isOpen ? 1 : 0,
                    padding: isOpen ? "0 14px 14px" : "0 14px",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 10px",
                      fontSize: "13px",
                      color: "var(--foreground)",
                      lineHeight: "1.7",
                      borderLeft: `2px solid ${item.color}`,
                      paddingLeft: "10px",
                    }}
                  >
                    {item.desc}
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          margin: "0 0 4px",
                          fontSize: "10px",
                          color: item.color,
                          textTransform: "uppercase",
                          letterSpacing: ".08em",
                          fontWeight: "700",
                        }}
                      >
                        {analogyLabel}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "12px",
                          color: "var(--muted-foreground)",
                          lineHeight: "1.6",
                        }}
                      >
                        {item.analogy}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          margin: "0 0 4px",
                          fontSize: "10px",
                          color: item.color,
                          textTransform: "uppercase",
                          letterSpacing: ".08em",
                          fontWeight: "700",
                        }}
                      >
                        {exampleLabel}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "12px",
                          color: "var(--muted-foreground)",
                          lineHeight: "1.6",
                        }}
                      >
                        {item.example}
                      </p>
                    </div>
                  </div>
                  <p
                    style={{
                      margin: "10px 0 0",
                      fontSize: "11px",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {stepsLabel} {n}:{" "}
                    <span style={{ color: item.color, fontWeight: "700" }}>
                      {steps.toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
