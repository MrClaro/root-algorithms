import { useState, useRef } from "react";

interface ValueVsReferenceProps {
  labels?: {
    title?: string;
    primitiveTitle?: string;
    primitiveDesc?: string;
    referenceTitle?: string;
    referenceDesc?: string;
    varA?: string;
    varB?: string;
    assignButton?: string;
    modifyButton?: string;
    resetButton?: string;
    addItemButton?: string;
    removeItemButton?: string;
    stackLabel?: string;
    heapLabel?: string;
    valueLabel?: string;
    addressLabel?: string;
    stepAssign?: string;
    stepModify?: string;
    stepInitial?: string;
    primitiveNote?: string;
    referenceNote?: string;
    editHint?: string;
    newValueLabel?: string;
    arrayItemLabel?: string;
  };
}

const defaults = {
  title:            "// valor vs referência — visualização interativa",
  primitiveTitle:   "Tipo de Valor (Primitivo)",
  primitiveDesc:    "Armazenado na Stack. A variável contém o valor diretamente.",
  referenceTitle:   "Tipo de Referência (Objeto)",
  referenceDesc:    "Armazenado no Heap. A variável contém um endereço (ponteiro).",
  varA:             "a",
  varB:             "b",
  assignButton:     "b = a",
  modifyButton:     "Modificar b",
  resetButton:      "↺ Resetar",
  addItemButton:    "+ item",
  removeItemButton: "− item",
  stackLabel:       "STACK",
  heapLabel:        "HEAP",
  valueLabel:       "valor",
  addressLabel:     "endereço",
  stepInitial:      "Estado inicial — apenas a existe",
  stepAssign:       "b = a executado",
  stepModify:       "b foi modificado",
  primitiveNote:    "b recebeu uma CÓPIA — modificar b não afeta a.",
  referenceNote:    "b recebeu o ENDEREÇO de a — ambos apontam para o mesmo objeto no Heap.",
  editHint:         "Clique no valor para editar",
  newValueLabel:    "Novo valor para b:",
  arrayItemLabel:   "Novo item:",
};

type Step = "initial" | "assigned" | "modified";

export default function ValueVsReference({ labels = {} }: ValueVsReferenceProps) {
  const t = { ...defaults, ...labels };

  // ── Primitive state ──
  const [primAVal, setPrimAVal]       = useState(10);
  const [primBVal, setPrimBVal]       = useState<number | null>(null);
  const [primStep, setPrimStep]       = useState<Step>("initial");
  const [editingPrimA, setEditingPrimA] = useState(false);
  const [editingPrimB, setEditingPrimB] = useState(false);
  const [primAInput, setPrimAInput]   = useState("10");
  const [primBInput, setPrimBInput]   = useState("");
  const [primBNew,   setPrimBNew]     = useState("99");

  // ── Reference state ──
  const [refArr, setRefArr]           = useState([1, 2, 3]);
  const [refStep, setRefStep]         = useState<Step>("initial");
  const [newItem, setNewItem]         = useState("4");
  const [removeMode, setRemoveMode]   = useState(false);

  const green  = "var(--ifm-color-primary)";
  const cyan   = "var(--terminal-cyan)";
  const yellow = "var(--terminal-yellow)";
  const red    = "var(--terminal-red)";
  const muted  = "var(--muted-foreground)";

  // ── Primitive actions ──
  const primAssign = () => {
    setPrimBVal(primAVal);
    setPrimBInput(String(primAVal));
    setPrimStep("assigned");
  };

  const primModify = () => {
    const v = parseInt(primBNew, 10);
    if (isNaN(v)) return;
    setPrimBVal(v);
    setPrimStep("modified");
  };

  const primReset = () => {
    setPrimAVal(10); setPrimAInput("10");
    setPrimBVal(null); setPrimBInput(""); setPrimBNew("99");
    setPrimStep("initial");
    setEditingPrimA(false); setEditingPrimB(false);
  };

  // ── Reference actions ──
  const refAssign = () => setRefStep("assigned");

  const refAddItem = () => {
    const v = parseInt(newItem, 10);
    if (isNaN(v)) return;
    setRefArr((p) => [...p, v]);
    setRefStep("modified");
  };

  const refRemoveItem = () => {
    if (refArr.length === 0) return;
    setRefArr((p) => p.slice(0, -1));
    setRefStep("modified");
  };

  const refReset = () => {
    setRefArr([1, 2, 3]);
    setRefStep("initial");
    setNewItem("4");
  };

  // ── Shared styles ──
  const boxStyle = (color: string): React.CSSProperties => ({
    padding: "10px 14px",
    borderRadius: "var(--radius)",
    border: `1px solid ${color}`,
    background: `color-mix(in srgb, ${color} 10%, var(--card))`,
    transition: "all .3s ease",
  });

  const dimBoxStyle: React.CSSProperties = {
    padding: "10px 14px",
    borderRadius: "var(--radius)",
    border: "1px solid var(--border)",
    background: "var(--secondary)",
    transition: "all .3s ease",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "10px", fontWeight: "700",
    textTransform: "uppercase", letterSpacing: ".08em",
    color: muted, marginBottom: "4px",
  };

  const varNameStyle = (color: string): React.CSSProperties => ({
    fontSize: "13px", fontWeight: "700", color, marginBottom: "4px",
  });

  const addrStyle: React.CSSProperties = {
    fontSize: "10px", color: muted, marginTop: "4px",
  };

  const inputStyle: React.CSSProperties = {
    background: "var(--secondary)",
    border: "1px solid var(--ifm-color-primary)",
    borderRadius: "var(--radius)",
    color: "var(--foreground)",
    fontFamily: "var(--ifm-font-family-monospace)",
    fontSize: "14px", fontWeight: "700",
    padding: "2px 6px", width: "64px",
    outline: "none",
  };

  const smallInputStyle: React.CSSProperties = {
    ...inputStyle,
    fontSize: "12px", width: "52px", padding: "2px 5px",
  };

  const SectionLabel = ({ text, color }: { text: string; color: string }) => (
    <div style={{
      fontSize: "10px", fontWeight: "700", letterSpacing: ".12em",
      textTransform: "uppercase", color,
      borderBottom: `1px solid color-mix(in srgb, ${color} 30%, transparent)`,
      paddingBottom: "6px", marginBottom: "10px",
    }}>
      {text}
    </div>
  );

  const ArrowRight = ({ color }: { color: string }) => (
    <div style={{ display: "flex", alignItems: "center", padding: "0 6px", flexShrink: 0 }}>
      <svg width="36" height="14" viewBox="0 0 36 14">
        <line x1="0" y1="7" x2="28" y2="7" stroke={color} strokeWidth="1.5" strokeDasharray="3 2" />
        <polygon points="28,3 36,7 28,11" fill={color} />
      </svg>
    </div>
  );

  const Btn = ({
    onClick, disabled = false, color, children,
  }: {
    onClick: () => void; disabled?: boolean; color: string; children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        fontFamily: "var(--ifm-font-family-monospace)",
        fontSize: "12px", fontWeight: "600",
        borderRadius: "var(--radius)", padding: "6px 12px",
        border: `1px solid ${disabled ? "var(--border)" : color}`,
        background: disabled ? "var(--secondary)" : `color-mix(in srgb, ${color} 12%, var(--card))`,
        color: disabled ? muted : color,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? .35 : 1,
        transition: "all .15s",
      }}
    >
      {children}
    </button>
  );

  const stepMsg = (step: Step) => {
    if (step === "initial")  return t.stepInitial;
    if (step === "assigned") return t.stepAssign;
    return t.stepModify;
  };

  return (
    <div style={{ margin: "24px 0", fontFamily: "var(--ifm-font-family-monospace)" }}>
      <style>{`
        @keyframes vvr-fadein {
          from { opacity: 0; transform: translateY(-5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .vvr-fadein { animation: vvr-fadein .2s ease forwards; }
        @keyframes vvr-pop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .vvr-pop { animation: vvr-pop .2s ease; }
        .vvr-chip {
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 32px; height: 32px; padding: 0 8px;
          border-radius: var(--radius);
          font-size: 13px; font-weight: 700;
          transition: all .2s ease;
          cursor: default;
        }
        .vvr-editval {
          cursor: pointer;
          border-bottom: 1px dashed var(--muted-foreground);
        }
        .vvr-editval:hover { border-bottom-color: var(--ifm-color-primary); }
      `}</style>

      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "20px" }}>

        <p style={{ fontSize: "11px", color: muted, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "20px" }}>
          {t.title}
        </p>

        {/* ════════════════════════════════════════
            TOP: two panels side by side
        ════════════════════════════════════════ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

          {/* ── LEFT: Primitive ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: "700", color: green, marginBottom: "3px" }}>{t.primitiveTitle}</div>
              <div style={{ fontSize: "11px", color: muted, lineHeight: "1.5" }}>{t.primitiveDesc}</div>
            </div>

            {/* Controls */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
              <Btn onClick={primAssign} disabled={primStep !== "initial"} color={green}>{t.assignButton}</Btn>
              <Btn onClick={primReset} disabled={false} color={muted}>{t.resetButton}</Btn>
            </div>

            {/* Step msg */}
            <div style={{ fontSize: "11px", color: muted }}>{stepMsg(primStep)}</div>

            {/* Stack visualization */}
            <div style={{ background: "var(--secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "12px" }}>
              <SectionLabel text={t.stackLabel} color={green} />

              {/* var a — editable */}
              <div style={{ ...boxStyle(green), marginBottom: "6px" }}>
                <div style={labelStyle}>{t.valueLabel}</div>
                <div style={varNameStyle(green)}>{t.varA}</div>
                {editingPrimA ? (
                  <input
                    autoFocus
                    style={inputStyle}
                    value={primAInput}
                    onChange={(e) => setPrimAInput(e.target.value)}
                    onBlur={() => {
                      const v = parseInt(primAInput, 10);
                      if (!isNaN(v)) setPrimAVal(v);
                      else setPrimAInput(String(primAVal));
                      setEditingPrimA(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const v = parseInt(primAInput, 10);
                        if (!isNaN(v)) setPrimAVal(v);
                        else setPrimAInput(String(primAVal));
                        setEditingPrimA(false);
                      }
                    }}
                  />
                ) : (
                  <div
                    className="vvr-editval"
                    title={t.editHint}
                    onClick={() => { if (primStep === "initial") { setPrimAInput(String(primAVal)); setEditingPrimA(true); } }}
                    style={{
                      fontSize: "22px", fontWeight: "700", color: green,
                      cursor: primStep === "initial" ? "pointer" : "default",
                      display: "inline-block",
                    }}
                  >
                    {primAVal}
                  </div>
                )}
                <div style={addrStyle}>0x01</div>
              </div>

              {/* var b */}
              {primStep !== "initial" && (
                <div key={`primb-${primStep}`} className="vvr-fadein" style={boxStyle(primStep === "modified" ? yellow : green)}>
                  <div style={labelStyle}>{t.valueLabel}</div>
                  <div style={varNameStyle(primStep === "modified" ? yellow : green)}>{t.varB}</div>

                  {primStep === "assigned" ? (
                    /* show modify controls inline */
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <div style={{ fontSize: "22px", fontWeight: "700", color: green }}>{primBVal}</div>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        <input
                          style={smallInputStyle}
                          value={primBNew}
                          onChange={(e) => setPrimBNew(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") primModify(); }}
                          placeholder="99"
                        />
                        <Btn onClick={primModify} disabled={false} color={yellow}>{t.modifyButton}</Btn>
                      </div>
                    </div>
                  ) : (
                    <div className="vvr-pop" style={{ fontSize: "22px", fontWeight: "700", color: yellow }}>{primBVal}</div>
                  )}
                  <div style={addrStyle}>0x02</div>
                </div>
              )}
            </div>

            {/* Note */}
            {primStep === "modified" && (
              <div className="vvr-fadein" style={{
                padding: "10px 12px", borderRadius: "var(--radius)",
                background: `color-mix(in srgb, ${green} 8%, var(--card))`,
                border: `1px solid color-mix(in srgb, ${green} 30%, transparent)`,
                fontSize: "12px", color: green, lineHeight: "1.6",
              }}>
                {t.primitiveNote}
              </div>
            )}
          </div>

          {/* ── RIGHT: Reference ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: "700", color: cyan, marginBottom: "3px" }}>{t.referenceTitle}</div>
              <div style={{ fontSize: "11px", color: muted, lineHeight: "1.5" }}>{t.referenceDesc}</div>
            </div>

            {/* Controls */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
              <Btn onClick={refAssign} disabled={refStep !== "initial"} color={cyan}>{t.assignButton}</Btn>
              <Btn onClick={refReset} disabled={false} color={muted}>{t.resetButton}</Btn>
            </div>

            {/* Step msg */}
            <div style={{ fontSize: "11px", color: muted }}>{stepMsg(refStep)}</div>

            {/* Stack + Heap visualization */}
            <div style={{ background: "var(--secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "12px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0" }}>

                {/* Stack column */}
                <div style={{ flex: "0 0 auto", minWidth: "80px" }}>
                  <SectionLabel text={t.stackLabel} color={cyan} />

                  <div style={{ ...boxStyle(cyan), marginBottom: "6px" }}>
                    <div style={labelStyle}>{t.addressLabel}</div>
                    <div style={varNameStyle(cyan)}>{t.varA}</div>
                    <div style={{ fontSize: "12px", fontWeight: "700", color: cyan }}>0xA1</div>
                    <div style={addrStyle}>0x01</div>
                  </div>

                  {refStep !== "initial" && (
                    <div className="vvr-fadein" style={boxStyle(cyan)}>
                      <div style={labelStyle}>{t.addressLabel}</div>
                      <div style={varNameStyle(cyan)}>{t.varB}</div>
                      <div style={{ fontSize: "12px", fontWeight: "700", color: cyan }}>0xA1</div>
                      <div style={addrStyle}>0x02</div>
                    </div>
                  )}
                </div>

                {/* Arrows */}
                <div style={{ display: "flex", flexDirection: "column", paddingTop: "26px", gap: "34px", alignItems: "center" }}>
                  <ArrowRight color={cyan} />
                  {refStep !== "initial" && (
                    <ArrowRight color={refStep === "modified" ? red : cyan} />
                  )}
                </div>

                {/* Heap column */}
                <div style={{ flex: 1 }}>
                  <SectionLabel text={t.heapLabel} color={cyan} />

                  <div style={boxStyle(refStep === "modified" ? red : cyan)}>
                    <div style={labelStyle}>0xA1</div>

                    {/* Array chips */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "8px" }}>
                      {refArr.map((v, i) => (
                        <span
                          key={`${i}-${v}`}
                          className="vvr-chip"
                          style={{
                            background: `color-mix(in srgb, ${refStep === "modified" ? red : cyan} 18%, var(--card))`,
                            border: `1px solid ${refStep === "modified" ? red : cyan}`,
                            color: refStep === "modified" ? red : cyan,
                          }}
                        >
                          {v}
                        </span>
                      ))}
                    </div>

                    {/* Add/remove controls — only after assign */}
                    {refStep !== "initial" && (
                      <div className="vvr-fadein" style={{ display: "flex", gap: "5px", alignItems: "center", flexWrap: "wrap" }}>
                        <input
                          style={{ ...smallInputStyle, width: "44px" }}
                          value={newItem}
                          onChange={(e) => setNewItem(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") refAddItem(); }}
                          placeholder="4"
                        />
                        <Btn onClick={refAddItem} disabled={false} color={cyan}>{t.addItemButton}</Btn>
                        <Btn onClick={refRemoveItem} disabled={refArr.length === 0} color={red}>{t.removeItemButton}</Btn>
                      </div>
                    )}

                    {refStep === "modified" && (
                      <div className="vvr-fadein" style={{ fontSize: "10px", color: red, marginTop: "6px" }}>
                        ← modificado via {t.varB}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Note */}
            {refStep !== "initial" && (
              <div className="vvr-fadein" style={{
                padding: "10px 12px", borderRadius: "var(--radius)",
                background: `color-mix(in srgb, ${red} 8%, var(--card))`,
                border: `1px solid color-mix(in srgb, ${red} 30%, transparent)`,
                fontSize: "12px", color: red, lineHeight: "1.6",
              }}>
                {t.referenceNote}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
