import { useState, useEffect } from "react";

interface OverflowSimulatorProps {
  labels?: {
    title?: string;
    typeLabel?: string;
    valueLabel?: string;
    binaryLabel?: string;
    rangeLabel?: string;
    overflowWarning?: string;
    underflowWarning?: string;
    safeLabel?: string;
    addButton?: string;
    subButton?: string;
    resetButton?: string;
    maxLabel?: string;
    minLabel?: string;
    stepLabel?: string;
    explainOverflow?: string;
    explainUnderflow?: string;
    explainSafe?: string;
  };
}

const defaults = {
  title:             "// overflow simulator — o que acontece quando os bits acabam",
  typeLabel:         "Tipo",
  valueLabel:        "Valor atual",
  binaryLabel:       "Representação binária",
  rangeLabel:        "Intervalo",
  overflowWarning:   "⚠ Overflow — o valor ultrapassou o máximo e voltou ao mínimo",
  underflowWarning:  "⚠ Underflow — o valor ultrapassou o mínimo e voltou ao máximo",
  safeLabel:         "✓ Dentro do intervalo",
  addButton:         "+ Incrementar",
  subButton:         "− Decrementar",
  resetButton:       "↺ Resetar",
  maxLabel:          "MAX",
  minLabel:          "MIN",
  stepLabel:         "Passo",
  explainOverflow:   "Quando um inteiro ultrapassa o valor máximo, os bits 'dão a volta'. Não há erro — o número simplesmente começa do mínimo negativo.",
  explainUnderflow:  "Quando um inteiro cai abaixo do valor mínimo, o mesmo acontece no sentido inverso — volta ao máximo positivo.",
  explainSafe:       "O valor está dentro do intervalo suportado pelo tipo. Nenhum dado foi corrompido.",
};

interface IntType {
  key:    string;
  label:  string;
  bits:   number;
  signed: boolean;
  min:    number;
  max:    number;
}

const TYPES: IntType[] = [
  { key: "int8",   label: "int8",   bits: 8,  signed: true,  min: -128,        max: 127          },
  { key: "uint8",  label: "uint8",  bits: 8,  signed: false, min: 0,           max: 255           },
  { key: "int16",  label: "int16",  bits: 16, signed: true,  min: -32768,      max: 32767         },
  { key: "int32",  label: "int32",  bits: 32, signed: true,  min: -2147483648, max: 2147483647    },
];

const STEPS = [1, 10, 100, 1000];

function toBinary(value: number, bits: number, signed: boolean): string {
  let n = value;
  if (n < 0) {
    // two's complement
    n = (1 << bits) + n;
  }
  const bin = (n >>> 0).toString(2).padStart(bits, "0");
  // show only up to `bits` LSBs
  return bin.slice(-bits);
}

function formatBinary(bin: string, bits: number): string {
  // group in 4s for readability
  const groups: string[] = [];
  for (let i = 0; i < bin.length; i += 4) {
    groups.push(bin.slice(i, i + 4));
  }
  return groups.join(" ");
}

function wrap(value: number, type: IntType): { result: number; event: "overflow" | "underflow" | "none" } {
  if (value > type.max) {
    const range = type.max - type.min + 1;
    const wrapped = type.min + ((value - type.min) % range);
    return { result: wrapped, event: "overflow" };
  }
  if (value < type.min) {
    const range = type.max - type.min + 1;
    const wrapped = type.max - ((type.min - value - 1) % range);
    return { result: wrapped, event: "underflow" };
  }
  return { result: value, event: "none" };
}

export default function OverflowSimulator({ labels = {} }: OverflowSimulatorProps) {
  const t = { ...defaults, ...labels };

  const [typeKey,  setTypeKey]  = useState<string>("int8");
  const [value,    setValue]    = useState<number>(0);
  const [step,     setStep]     = useState<number>(1);
  const [event,    setEvent]    = useState<"overflow" | "underflow" | "none">("none");
  const [flash,    setFlash]    = useState(false);

  const currentType = TYPES.find((t) => t.key === typeKey)!;

  // reset value when type changes
  useEffect(() => {
    setValue(0);
    setEvent("none");
  }, [typeKey]);

  const operate = (delta: number) => {
    const raw = value + delta;
    const { result, event: ev } = wrap(raw, currentType);
    setValue(result);
    setEvent(ev);
    if (ev !== "none") {
      setFlash(true);
      setTimeout(() => setFlash(false), 600);
    }
  };

  const reset = () => {
    setValue(0);
    setEvent("none");
  };

  const bin     = toBinary(value, currentType.bits, currentType.signed);
  const binFmt  = formatBinary(bin, currentType.bits);

  // Progress bar: how full is the range
  const range   = currentType.max - currentType.min;
  const pct     = ((value - currentType.min) / range) * 100;

  const green   = "var(--ifm-color-primary)";
  const cyan    = "var(--terminal-cyan)";
  const yellow  = "var(--terminal-yellow)";
  const red     = "var(--terminal-red)";
  const muted   = "var(--muted-foreground)";

  const isOverflow  = event === "overflow";
  const isUnderflow = event === "underflow";
  const alertColor  = isOverflow || isUnderflow ? red : green;

  return (
    <div style={{ margin: "24px 0", fontFamily: "var(--ifm-font-family-monospace)" }}>
      <style>{`
        .ovf-btn {
          font-family: var(--ifm-font-family-monospace);
          font-size: 12px; font-weight: 600;
          border-radius: var(--radius);
          padding: 7px 14px; cursor: pointer;
          transition: all .15s;
        }
        .ovf-type-btn {
          font-family: var(--ifm-font-family-monospace);
          font-size: 11px; font-weight: 600;
          border-radius: var(--radius);
          padding: 5px 12px; cursor: pointer;
          transition: all .15s;
        }
        .ovf-step-btn {
          font-family: var(--ifm-font-family-monospace);
          font-size: 11px;
          border-radius: var(--radius);
          padding: 4px 10px; cursor: pointer;
          transition: all .15s;
        }
        @keyframes ovf-flash {
          0%   { opacity: 1; }
          25%  { opacity: 0.3; }
          50%  { opacity: 1; }
          75%  { opacity: 0.3; }
          100% { opacity: 1; }
        }
        .ovf-flash { animation: ovf-flash .5s ease; }
        @keyframes ovf-fadein {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ovf-fadein { animation: ovf-fadein .2s ease forwards; }
        @keyframes ovf-shake {
          0%,100% { transform: translateX(0); }
          20%     { transform: translateX(-4px); }
          40%     { transform: translateX(4px); }
          60%     { transform: translateX(-3px); }
          80%     { transform: translateX(3px); }
        }
        .ovf-shake { animation: ovf-shake .4s ease; }
      `}</style>

      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "20px" }}>

        {/* Title */}
        <p style={{ fontSize: "11px", color: muted, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "16px" }}>
          {t.title}
        </p>

        {/* Type selector */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "10px", color: muted, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "8px" }}>
            {t.typeLabel}
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {TYPES.map((type) => (
              <button
                key={type.key}
                className="ovf-type-btn"
                onClick={() => setTypeKey(type.key)}
                style={{
                  border: `1px solid ${typeKey === type.key ? cyan : "var(--border)"}`,
                  background: typeKey === type.key
                    ? `color-mix(in srgb, ${cyan} 12%, var(--card))`
                    : "var(--secondary)",
                  color: typeKey === type.key ? cyan : muted,
                }}
              >
                {type.label}
                <span style={{ fontSize: "9px", marginLeft: "4px", opacity: .7 }}>
                  {type.bits}b
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Step selector */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "10px", color: muted, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "8px" }}>
            {t.stepLabel}
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            {STEPS.map((s) => (
              <button
                key={s}
                className="ovf-step-btn"
                onClick={() => setStep(s)}
                style={{
                  border: `1px solid ${step === s ? yellow : "var(--border)"}`,
                  background: step === s
                    ? `color-mix(in srgb, ${yellow} 12%, var(--card))`
                    : "var(--secondary)",
                  color: step === s ? yellow : muted,
                  fontWeight: step === s ? "700" : "400",
                }}
              >
                {s > 1 ? `+${s}` : `±${s}`}
              </button>
            ))}
          </div>
        </div>

        {/* Main display */}
        <div style={{
          background: "var(--secondary)",
          border: `1px solid ${flash ? red : "var(--border)"}`,
          borderRadius: "var(--radius)",
          padding: "20px",
          marginBottom: "16px",
          transition: "border-color .2s",
        }}>

          {/* Value */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "10px", color: muted, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "6px" }}>
              {t.valueLabel}
            </div>
            <div
              className={flash ? "ovf-shake" : ""}
              style={{
                fontSize: "48px",
                fontWeight: "700",
                color: flash ? red : value === currentType.max ? yellow : value === currentType.min ? yellow : green,
                lineHeight: 1,
                transition: "color .2s",
              }}
            >
              {value.toLocaleString()}
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: muted, marginBottom: "4px" }}>
              <span>{t.minLabel} {currentType.min.toLocaleString()}</span>
              <span>{t.maxLabel} {currentType.max.toLocaleString()}</span>
            </div>
            <div style={{ height: "8px", background: "var(--border)", borderRadius: "4px", overflow: "hidden", position: "relative" }}>
              <div style={{
                position: "absolute",
                left: 0, top: 0, bottom: 0,
                width: `${Math.max(0, Math.min(100, pct))}%`,
                background: pct > 90 || pct < 10 ? red : pct > 75 ? yellow : green,
                borderRadius: "4px",
                transition: "width .2s ease, background .2s ease",
              }} />
            </div>
          </div>

          {/* Binary */}
          <div>
            <div style={{ fontSize: "10px", color: muted, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "6px" }}>
              {t.binaryLabel}
            </div>
            <div
              className={flash ? "ovf-flash" : ""}
              style={{
                fontSize: currentType.bits > 8 ? "11px" : "14px",
                fontWeight: "600",
                color: cyan,
                letterSpacing: ".1em",
                wordBreak: "break-all",
                lineHeight: "1.8",
              }}
            >
              {/* color the sign bit differently for signed types */}
              {currentType.signed ? (
                <>
                  <span style={{ color: red }}>{bin[0]}</span>
                  <span style={{ color: cyan }}> {formatBinary(bin.slice(1), currentType.bits - 1)}</span>
                </>
              ) : (
                <span>{binFmt}</span>
              )}
            </div>
            {currentType.signed && (
              <div style={{ fontSize: "10px", color: muted, marginTop: "4px" }}>
                <span style={{ color: red }}>■</span> bit de sinal &nbsp;
                <span style={{ color: cyan }}>■</span> bits de magnitude
              </div>
            )}
          </div>
        </div>

        {/* Range label */}
        <div style={{ fontSize: "11px", color: muted, marginBottom: "16px" }}>
          {t.rangeLabel}: <span style={{ color: cyan }}>{currentType.min.toLocaleString()}</span> →{" "}
          <span style={{ color: cyan }}>{currentType.max.toLocaleString()}</span>{" "}
          <span style={{ opacity: .6 }}>({currentType.bits} bits)</span>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
          <button
            className="ovf-btn"
            onClick={() => operate(-step)}
            style={{
              border: `1px solid ${red}`,
              background: `color-mix(in srgb, ${red} 10%, var(--card))`,
              color: red,
            }}
          >
            {t.subButton} ({step})
          </button>
          <button
            className="ovf-btn"
            onClick={() => operate(step)}
            style={{
              border: `1px solid ${green}`,
              background: `color-mix(in srgb, ${green} 10%, var(--card))`,
              color: green,
            }}
          >
            {t.addButton} ({step})
          </button>
          <button
            className="ovf-btn"
            onClick={reset}
            style={{
              border: "1px solid var(--border)",
              background: "transparent",
              color: muted,
              fontWeight: "400",
            }}
          >
            {t.resetButton}
          </button>

          {/* Shortcut: jump to max-1 */}
          <button
            className="ovf-btn"
            onClick={() => { setValue(currentType.max); setEvent("none"); }}
            style={{
              border: `1px solid ${yellow}`,
              background: `color-mix(in srgb, ${yellow} 8%, var(--card))`,
              color: yellow,
              fontWeight: "400",
              fontSize: "11px",
            }}
          >
            → {t.maxLabel}
          </button>
          <button
            className="ovf-btn"
            onClick={() => { setValue(currentType.min); setEvent("none"); }}
            style={{
              border: `1px solid ${yellow}`,
              background: `color-mix(in srgb, ${yellow} 8%, var(--card))`,
              color: yellow,
              fontWeight: "400",
              fontSize: "11px",
            }}
          >
            → {t.minLabel}
          </button>
        </div>

        {/* Event feedback */}
        {event !== "none" && (
          <div
            key={event + value}
            className="ovf-fadein"
            style={{
              padding: "12px 14px",
              borderRadius: "var(--radius)",
              border: `1px solid color-mix(in srgb, ${red} 40%, transparent)`,
              background: `color-mix(in srgb, ${red} 8%, var(--card))`,
              fontSize: "12px",
              color: red,
              lineHeight: "1.6",
            }}
          >
            <div style={{ fontWeight: "700", marginBottom: "4px" }}>
              {isOverflow ? t.overflowWarning : t.underflowWarning}
            </div>
            <div style={{ opacity: .8 }}>
              {isOverflow ? t.explainOverflow : t.explainUnderflow}
            </div>
          </div>
        )}

        {event === "none" && value !== 0 && (
          <div style={{ fontSize: "11px", color: green, opacity: .7 }}>
            {t.safeLabel}
          </div>
        )}
      </div>
    </div>
  );
}
