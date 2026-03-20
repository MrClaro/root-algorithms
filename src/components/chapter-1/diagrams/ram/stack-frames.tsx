import { useState } from "react";

interface StackFramesProps {
  labels?: {
    title?: string;
    pushButton?: string;
    popButton?: string;
    resetButton?: string;
    lifoLabel?: string;
    lifoDesc?: string;
    overflowTitle?: string;
    overflowDesc?: string;
    emptyLabel?: string;
    topLabel?: string;
    baseLabel?: string;
    stepsLabel?: string;
  };
}

interface Frame {
  id: number;
  name: string;
  vars: string;
  isOverflow?: boolean;
}

const defaults = {
  title: "// call stack — visualização interativa",
  pushButton: "↑ Chamar função",
  popButton: "↓ Retornar",
  resetButton: "↺ Resetar",
  lifoLabel: "LIFO",
  lifoDesc: "Last In, First Out — o último frame a entrar é o primeiro a sair.",
  overflowTitle: "⚠ Stack Overflow",
  overflowDesc:
    "Sem espaço para novos frames. Causado por recursão infinita ou chamadas demais.",
  emptyLabel: "stack vazia",
  topLabel: "← topo",
  baseLabel: "base",
  stepsLabel: "passo",
};

const SEQUENCE: Omit<Frame, "id">[] = [
  { name: "main()", vars: "frame base · endereço de retorno" },
  { name: "soma(a, b)", vars: "a = 5, b = 3 · variáveis locais" },
  { name: "print(resultado)", vars: "resultado = 8" },
  { name: "log(msg)", vars: "msg = '8'" },
  {
    name: "⚠ Stack Overflow",
    vars: "sem espaço para novos frames",
    isOverflow: true,
  },
];

export default function StackFrames({ labels = {} }: StackFramesProps) {
  const t = { ...defaults, ...labels };
  const [frames, setFrames] = useState<Frame[]>([]);
  const [steps, setSteps] = useState(0);

  const push = () => {
    const next = SEQUENCE[frames.length];
    if (!next) return;
    setFrames((p) => [...p, { ...next, id: Date.now() }]);
    setSteps((s) => s + 1);
  };

  const pop = () => {
    if (!frames.length) return;
    setFrames((p) => p.slice(0, -1));
    setSteps((s) => s + 1);
  };

  const reset = () => {
    setFrames([]);
    setSteps(0);
  };

  const isOverflow = frames.length >= SEQUENCE.length;
  const canPush = !isOverflow;
  const canPop = frames.length > 0;

  return (
    <div
      style={{
        margin: "24px 0",
        fontFamily: "var(--ifm-font-family-monospace)",
      }}
    >
      <style>{`
        @keyframes sf-in {
          from { opacity: 0; transform: translateY(-10px) scaleY(.88); }
          to   { opacity: 1; transform: translateY(0) scaleY(1); }
        }
        @keyframes sf-overflow {
          0%,100% { opacity: 1; }
          50%      { opacity: .5; }
        }
        .sf-frame { animation: sf-in .2s cubic-bezier(.34,1.56,.64,1) forwards; }
        .sf-overflow { animation: sf-overflow .8s ease infinite; }
        .sf-btn {
          font-family: var(--ifm-font-family-monospace);
          font-size: 12px; font-weight: 600;
          border-radius: var(--radius);
          padding: 7px 16px; cursor: pointer;
          transition: background .15s, border-color .15s, color .15s, opacity .15s;
        }
        .sf-btn:disabled { cursor: not-allowed; opacity: .35; }
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
            marginBottom: "18px",
          }}
        >
          {t.title}
        </p>

        {/* Controls */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "20px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <button
            className="sf-btn"
            onClick={push}
            disabled={!canPush}
            style={{
              border: `1px solid ${canPush ? "var(--ifm-color-primary)" : "var(--border)"}`,
              background: canPush
                ? `color-mix(in srgb, var(--ifm-color-primary) 12%, var(--card))`
                : "var(--secondary)",
              color: canPush
                ? "var(--ifm-color-primary)"
                : "var(--muted-foreground)",
            }}
          >
            {t.pushButton}
          </button>

          <button
            className="sf-btn"
            onClick={pop}
            disabled={!canPop}
            style={{
              border: `1px solid ${canPop ? "var(--terminal-red)" : "var(--border)"}`,
              background: canPop
                ? `color-mix(in srgb, var(--terminal-red) 12%, var(--card))`
                : "var(--secondary)",
              color: canPop ? "var(--terminal-red)" : "var(--muted-foreground)",
            }}
          >
            {t.popButton}
          </button>

          <button
            className="sf-btn"
            onClick={reset}
            style={{
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--muted-foreground)",
              fontWeight: "400",
            }}
          >
            {t.resetButton}
          </button>

          {steps > 0 && (
            <span
              style={{ fontSize: "11px", color: "var(--muted-foreground)" }}
            >
              {steps} {t.stepsLabel}
              {steps !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Stack area */}
        <div
          style={{
            minHeight: "260px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              color: "var(--muted-foreground)",
              marginBottom: "8px",
            }}
          >
            ↑ cresce para cima
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column-reverse",
              gap: "3px",
            }}
          >
            {frames.length === 0 && (
              <div
                style={{
                  padding: "18px",
                  borderRadius: "var(--radius)",
                  textAlign: "center",
                  background: "var(--secondary)",
                  border: "1px dashed var(--border)",
                  fontSize: "12px",
                  color: "var(--muted-foreground)",
                }}
              >
                {t.emptyLabel}
              </div>
            )}

            {frames.map((frame, index) => {
              const isTop = index === frames.length - 1;
              const isBase = index === 0;
              const isOvf = !!frame.isOverflow;
              // opacity gradient: base slightly dimmer, top is full
              const opacity =
                frames.length <= 1
                  ? 1
                  : 0.65 + (index / (frames.length - 1)) * 0.35;

              return (
                <div
                  key={frame.id}
                  className={`sf-frame${isOvf ? " sf-overflow" : ""}`}
                  style={{
                    padding: "11px 14px",
                    borderRadius: "var(--radius)",
                    background: isOvf
                      ? `color-mix(in srgb, var(--terminal-red) 10%, var(--card))`
                      : `color-mix(in srgb, var(--ifm-color-primary) 8%, var(--card))`,
                    border: `1px solid ${
                      isTop && !isOvf
                        ? "var(--ifm-color-primary)"
                        : isOvf
                          ? "var(--terminal-red)"
                          : "var(--border)"
                    }`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    opacity,
                    boxShadow:
                      isTop && !isOvf
                        ? `0 0 0 1px var(--ifm-color-primary)`
                        : "none",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: "700",
                        color: isOvf
                          ? "var(--terminal-red)"
                          : "var(--ifm-color-primary)",
                      }}
                    >
                      {frame.name}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--muted-foreground)",
                        marginTop: "2px",
                      }}
                    >
                      {frame.vars}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: "10px",
                      paddingLeft: "12px",
                      whiteSpace: "nowrap",
                      color: isOvf
                        ? "var(--terminal-red)"
                        : "var(--ifm-color-primary)",
                      opacity: 0.6,
                    }}
                  >
                    {isTop && !isOvf
                      ? t.topLabel
                      : isBase && !isOvf
                        ? t.baseLabel
                        : ""}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Overflow message */}
        {isOverflow && (
          <div
            style={{
              marginTop: "14px",
              padding: "12px 14px",
              borderRadius: "var(--radius)",
              background: `color-mix(in srgb, var(--terminal-red) 8%, var(--card))`,
              border: "1px solid var(--terminal-red)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "13px",
                fontWeight: "700",
                color: "var(--terminal-red)",
                marginBottom: "4px",
              }}
            >
              {t.overflowTitle}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: "var(--muted-foreground)",
                lineHeight: "1.6",
              }}
            >
              {t.overflowDesc}
            </p>
          </div>
        )}

        {/* LIFO badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "18px",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              fontWeight: "700",
              letterSpacing: ".08em",
              color: "var(--ifm-color-primary)",
              background: `color-mix(in srgb, var(--ifm-color-primary) 12%, var(--card))`,
              border: "1px solid var(--ifm-color-primary)",
              padding: "3px 8px",
              borderRadius: "var(--radius)",
            }}
          >
            {t.lifoLabel}
          </span>
          <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
            {t.lifoDesc}
          </span>
        </div>
      </div>
    </div>
  );
}
