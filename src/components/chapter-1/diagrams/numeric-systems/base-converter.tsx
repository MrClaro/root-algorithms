import { useState, useCallback } from "react";

interface BaseConverterProps {
  labels?: {
    title?: string;
    decimalLabel?: string;
    binaryLabel?: string;
    hexLabel?: string;
    binaryPrefix?: string;
    hexPrefix?: string;
    errorInvalid?: string;
    errorRange?: string;
    stepsTitle?: string;
    stepDecToBin?: string;
    stepDecToHex?: string;
    bitLabel?: string;
    byteLabel?: string;
    remainderLabel?: string;
    readLabel?: string;
  };
}

const defaults = {
  title:          "// conversor de bases",
  decimalLabel:   "Decimal",
  binaryLabel:    "Binário",
  hexLabel:       "Hexadecimal",
  binaryPrefix:   "0b",
  hexPrefix:      "0x",
  errorInvalid:   "Valor inválido",
  errorRange:     "Use um valor entre 0 e 65535",
  stepsTitle:     "Como chegamos nisso",
  stepDecToBin:   "Decimal → Binário (divisões sucessivas por 2)",
  stepDecToHex:   "Decimal → Hexadecimal (grupos de 4 bits)",
  bitLabel:       "bit",
  byteLabel:      "byte",
  remainderLabel: "resto",
  readLabel:      "leia de baixo para cima →",
};

const HEX_DIGITS = "0123456789ABCDEF";

function decToBin(n: number): string {
  if (n === 0) return "0";
  return n.toString(2);
}

function decToHex(n: number): string {
  return n.toString(16).toUpperCase();
}

function binToDec(s: string): number | null {
  const n = parseInt(s, 2);
  return isNaN(n) ? null : n;
}

function hexToDec(s: string): number | null {
  const n = parseInt(s, 16);
  return isNaN(n) ? null : n;
}

function getDivisionSteps(n: number): { dividend: number; quotient: number; remainder: number }[] {
  const steps: { dividend: number; quotient: number; remainder: number }[] = [];
  let cur = n;
  while (cur > 0) {
    steps.push({ dividend: cur, quotient: Math.floor(cur / 2), remainder: cur % 2 });
    cur = Math.floor(cur / 2);
  }
  return steps;
}

function formatBinary(bin: string): { bits: string[]; colored: boolean } {
  const padded = bin.padStart(Math.ceil(bin.length / 4) * 4, "0");
  return { bits: padded.split(""), colored: true };
}

type InputMode = "decimal" | "binary" | "hex";

export default function BaseConverter({ labels = {} }: BaseConverterProps) {
  const t = { ...defaults, ...labels };

  const [mode,    setMode]    = useState<InputMode>("decimal");
  const [rawDec,  setRawDec]  = useState("171");
  const [rawBin,  setRawBin]  = useState("");
  const [rawHex,  setRawHex]  = useState("");
  const [error,   setError]   = useState<string | null>(null);
  const [showSteps, setShowSteps] = useState(false);

  // Derive the canonical decimal value from whichever field is active
  const getValue = (): number | null => {
    if (mode === "decimal") {
      const n = parseInt(rawDec, 10);
      return isNaN(n) ? null : n;
    }
    if (mode === "binary")  return binToDec(rawBin.replace(/^0b/i, ""));
    if (mode === "hex")     return hexToDec(rawHex.replace(/^0x/i, ""));
    return null;
  };

  const value = getValue();
  const valid = value !== null && value >= 0 && value <= 65535;

  const binStr = valid ? decToBin(value!) : "";
  const hexStr = valid ? decToHex(value!) : "";
  const decStr = valid ? String(value!)   : "";

  const steps = valid ? getDivisionSteps(value!) : [];

  const handleDecChange = useCallback((v: string) => {
    setMode("decimal");
    setRawDec(v);
    const n = parseInt(v, 10);
    if (v === "" || isNaN(n))              { setError(t.errorInvalid); return; }
    if (n < 0 || n > 65535)               { setError(t.errorRange);   return; }
    setError(null);
  }, [t]);

  const handleBinChange = useCallback((v: string) => {
    setMode("binary");
    const clean = v.replace(/^0b/i, "").replace(/[^01]/g, "");
    setRawBin(clean);
    const n = binToDec(clean);
    if (!clean || n === null)              { setError(t.errorInvalid); return; }
    if (n < 0 || n > 65535)               { setError(t.errorRange);   return; }
    setError(null);
  }, [t]);

  const handleHexChange = useCallback((v: string) => {
    setMode("hex");
    const clean = v.replace(/^0x/i, "").replace(/[^0-9a-fA-F]/g, "").toUpperCase();
    setRawHex(clean);
    const n = hexToDec(clean);
    if (!clean || n === null)              { setError(t.errorInvalid); return; }
    if (n < 0 || n > 65535)               { setError(t.errorRange);   return; }
    setError(null);
  }, [t]);

  // Color groups of 4 bits
  const groupColors = [
    "var(--ifm-color-primary)",
    "var(--terminal-cyan)",
    "var(--terminal-yellow)",
    "var(--terminal-magenta)",
  ];

  const renderBitGroups = (bin: string) => {
    const padded = bin.padStart(Math.ceil(bin.length / 4) * 4, "0");
    const groups: string[] = [];
    for (let i = 0; i < padded.length; i += 4) groups.push(padded.slice(i, i + 4));
    return groups.map((group, gi) => (
      <span key={gi} style={{ display: "inline-flex", gap: "1px", marginRight: "6px" }}>
        {group.split("").map((bit, bi) => (
          <span key={bi} style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: "22px", height: "28px",
            borderRadius: "var(--radius)",
            background: `color-mix(in srgb, ${groupColors[gi % groupColors.length]} 14%, var(--card))`,
            border: `1px solid color-mix(in srgb, ${groupColors[gi % groupColors.length]} 35%, transparent)`,
            color: groupColors[gi % groupColors.length],
            fontSize: "13px", fontWeight: "700",
            fontFamily: "var(--ifm-font-family-monospace)",
          }}>{bit}</span>
        ))}
      </span>
    ));
  };

  const renderHexDigits = (hex: string) => {
    const padded = hex.padStart(Math.ceil(hex.length / 2) * 2, "0");
    const pairs: string[] = [];
    for (let i = 0; i < padded.length; i += 2) pairs.push(padded.slice(i, i + 2));
    return pairs.map((pair, pi) => (
      <span key={pi} style={{ display: "inline-flex", gap: "2px", marginRight: "6px" }}>
        {pair.split("").map((digit, di) => {
          const decVal = parseInt(digit, 16);
          return (
            <span key={di} style={{
              display: "inline-flex", flexDirection: "column", alignItems: "center",
              padding: "3px 8px",
              borderRadius: "var(--radius)",
              background: `color-mix(in srgb, ${groupColors[(pi * 2 + di) % groupColors.length]} 14%, var(--card))`,
              border: `1px solid color-mix(in srgb, ${groupColors[(pi * 2 + di) % groupColors.length]} 35%, transparent)`,
              color: groupColors[(pi * 2 + di) % groupColors.length],
            }}>
              <span style={{ fontSize: "14px", fontWeight: "700", fontFamily: "var(--ifm-font-family-monospace)" }}>{digit}</span>
              <span style={{ fontSize: "9px", opacity: .6, marginTop: "1px" }}>{decVal}</span>
            </span>
          );
        })}
      </span>
    ));
  };

  const inputStyle = (active: boolean): React.CSSProperties => ({
    width: "100%",
    padding: "10px 12px",
    borderRadius: "var(--radius)",
    border: `1px solid ${active ? "var(--ifm-color-primary)" : "var(--border)"}`,
    background: active
      ? `color-mix(in srgb, var(--ifm-color-primary) 6%, var(--card))`
      : "var(--secondary)",
    color: active ? "var(--ifm-color-primary)" : "var(--foreground)",
    fontFamily: "var(--ifm-font-family-monospace)",
    fontSize: "15px",
    fontWeight: "600",
    outline: "none",
    transition: "border-color .15s, background .15s",
    boxSizing: "border-box",
  });

  const labelStyle: React.CSSProperties = {
    fontSize: "10px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: ".1em",
    marginBottom: "6px",
    display: "block",
  };

  return (
    <div style={{ margin: "24px 0", fontFamily: "var(--ifm-font-family-monospace)" }}>
      <style>{`
        .bc-input:focus { box-shadow: 0 0 0 2px color-mix(in srgb, var(--ifm-color-primary) 25%, transparent); }
        .bc-toggle { transition: all .15s; cursor: pointer; }
      `}</style>

      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "20px" }}>

        <p style={{ fontSize: "11px", color: "var(--muted-foreground)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "20px" }}>
          {t.title}
        </p>

        {/* Input fields */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "20px" }}>

          {/* Decimal */}
          <div>
            <label style={{ ...labelStyle, color: mode === "decimal" ? "var(--ifm-color-primary)" : "var(--muted-foreground)" }}>
              {t.decimalLabel}
            </label>
            <input
              className="bc-input"
              style={inputStyle(mode === "decimal")}
              value={mode === "decimal" ? rawDec : decStr}
              onChange={(e) => handleDecChange(e.target.value)}
              onFocus={() => { setMode("decimal"); setRawDec(decStr || rawDec); }}
              placeholder="0"
            />
          </div>

          {/* Binary */}
          <div>
            <label style={{ ...labelStyle, color: mode === "binary" ? "var(--terminal-cyan)" : "var(--muted-foreground)" }}>
              {t.binaryLabel}
            </label>
            <input
              className="bc-input"
              style={{ ...inputStyle(mode === "binary"), color: mode === "binary" ? "var(--terminal-cyan)" : "var(--foreground)", borderColor: mode === "binary" ? "var(--terminal-cyan)" : "var(--border)", background: mode === "binary" ? `color-mix(in srgb, var(--terminal-cyan) 6%, var(--card))` : "var(--secondary)" }}
              value={mode === "binary" ? rawBin : binStr}
              onChange={(e) => handleBinChange(e.target.value)}
              onFocus={() => { setMode("binary"); setRawBin(binStr || rawBin); }}
              placeholder="0"
            />
          </div>

          {/* Hex */}
          <div>
            <label style={{ ...labelStyle, color: mode === "hex" ? "var(--terminal-yellow)" : "var(--muted-foreground)" }}>
              {t.hexLabel}
            </label>
            <input
              className="bc-input"
              style={{ ...inputStyle(mode === "hex"), color: mode === "hex" ? "var(--terminal-yellow)" : "var(--foreground)", borderColor: mode === "hex" ? "var(--terminal-yellow)" : "var(--border)", background: mode === "hex" ? `color-mix(in srgb, var(--terminal-yellow) 6%, var(--card))` : "var(--secondary)" }}
              value={mode === "hex" ? rawHex : hexStr}
              onChange={(e) => handleHexChange(e.target.value)}
              onFocus={() => { setMode("hex"); setRawHex(hexStr || rawHex); }}
              placeholder="0"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <p style={{ fontSize: "12px", color: "var(--terminal-red)", marginBottom: "16px" }}>⚠ {error}</p>
        )}

        {/* Visual breakdown */}
        {valid && (
          <>
            {/* Bit groups */}
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontSize: "10px", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "8px" }}>
                {t.binaryPrefix}{binStr} — grupos de 4 bits = 1 dígito hex
              </p>
              <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px" }}>
                {renderBitGroups(binStr)}
                <span style={{ fontSize: "12px", color: "var(--muted-foreground)", margin: "0 4px" }}>→</span>
                {renderHexDigits(hexStr)}
                <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>= {t.hexPrefix}{hexStr}</span>
              </div>
            </div>

            {/* Byte usage */}
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontSize: "10px", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "6px" }}>
                uso de memória
              </p>
              <div style={{ display: "flex", gap: "3px", flexWrap: "wrap" }}>
                {Array.from({ length: 16 }).map((_, i) => {
                  const bitIndex = 15 - i;
                  const bitVal   = valid ? (value! >> bitIndex) & 1 : 0;
                  const isUsed   = bitVal === 1;
                  return (
                    <div key={i} style={{
                      width: "22px", height: "22px",
                      borderRadius: "var(--radius)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "11px", fontWeight: "700",
                      background: isUsed
                        ? `color-mix(in srgb, var(--ifm-color-primary) 20%, var(--card))`
                        : "var(--secondary)",
                      border: `1px solid ${isUsed ? "var(--ifm-color-primary)" : "var(--border)"}`,
                      color: isUsed ? "var(--ifm-color-primary)" : "var(--muted-foreground)",
                      opacity: isUsed ? 1 : .4,
                    }}>{bitVal}</div>
                  );
                })}
                <span style={{ fontSize: "11px", color: "var(--muted-foreground)", alignSelf: "center", marginLeft: "6px" }}>
                  {binStr.length} {t.bitLabel}{binStr.length !== 1 ? "s" : ""} / {Math.ceil(binStr.length / 8)} {t.byteLabel}{Math.ceil(binStr.length / 8) !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Steps toggle */}
            <button
              className="bc-toggle"
              onClick={() => setShowSteps((p) => !p)}
              style={{
                padding: "6px 14px", borderRadius: "var(--radius)", fontSize: "12px",
                border: `1px solid ${showSteps ? "var(--ifm-color-primary)" : "var(--border)"}`,
                background: showSteps ? `color-mix(in srgb, var(--ifm-color-primary) 10%, var(--card))` : "var(--secondary)",
                color: showSteps ? "var(--ifm-color-primary)" : "var(--muted-foreground)",
                fontFamily: "var(--ifm-font-family-monospace)",
                marginBottom: showSteps ? "14px" : "0",
              }}
            >
              {showSteps ? "▾" : "▸"} {t.stepsTitle}
            </button>

            {/* Division steps */}
            {showSteps && steps.length > 0 && (
              <div style={{ background: "var(--secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "14px" }}>
                <p style={{ fontSize: "10px", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "10px" }}>
                  {t.stepDecToBin}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {steps.map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: "12px", fontSize: "12px", alignItems: "center" }}>
                      <span style={{ color: "var(--muted-foreground)", minWidth: "60px" }}>{s.dividend} ÷ 2</span>
                      <span style={{ color: "var(--foreground)" }}>= {s.quotient}</span>
                      <span style={{ color: "var(--muted-foreground)" }}>{t.remainderLabel}:</span>
                      <span style={{
                        color: s.remainder === 1 ? "var(--ifm-color-primary)" : "var(--muted-foreground)",
                        fontWeight: "700", minWidth: "12px",
                      }}>{s.remainder}</span>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: "11px", color: "var(--ifm-color-primary)", marginTop: "10px", marginBottom: 0 }}>
                  ↑ {t.readLabel} {t.binaryPrefix}{binStr}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
