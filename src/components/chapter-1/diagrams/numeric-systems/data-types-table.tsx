interface DataTypesTableProps {
  labels?: {
    groupValue?: string;
    groupRef?: string;
    colType?: string;
    colSize?: string;
    colBits?: string;
    colRange?: string;
    badgeValue?: string;
    badgeRef?: string;
    footerNote?: string;
  };
}

const defaults = {
  groupValue: "tipos de valor (stack)",
  groupRef: "tipos de referência (heap)",
  colType: "tipo",
  colSize: "tamanho",
  colBits: "bits",
  colRange: "intervalo / exemplo",
  badgeValue: "valor",
  badgeRef: "ref",
  footerNote:
    "* Em JavaScript, todos os números são double (64 bits, IEEE 754) — não existe int nativo.",
};

interface TypeRow {
  name: string;
  kind: "value" | "ref";
  color: string;
  size: string;
  bits: string;
  barPct: number;
  range: string;
}

const VALUE_TYPES: TypeRow[] = [
  {
    name: "boolean",
    kind: "value",
    color: "#639922",
    size: "1 byte",
    bits: "8 bits",
    barPct: 1.5,
    range: "true / false",
  },
  {
    name: "char",
    kind: "value",
    color: "#1D9E75",
    size: "1 byte",
    bits: "8 bits",
    barPct: 1.5,
    range: "'a', '1', '@' (ASCII)",
  },
  {
    name: "short",
    kind: "value",
    color: "#0F6E56",
    size: "2 bytes",
    bits: "16 bits",
    barPct: 3,
    range: "-32.768 → 32.767",
  },
  {
    name: "int",
    kind: "value",
    color: "#BA7517",
    size: "4 bytes",
    bits: "32 bits",
    barPct: 6,
    range: "-2.147.483.648 → 2.147.483.647",
  },
  {
    name: "float",
    kind: "value",
    color: "#EF9F27",
    size: "4 bytes",
    bits: "32 bits",
    barPct: 6,
    range: "~±3.4 × 10³⁸ (7 dígitos)",
  },
  {
    name: "long",
    kind: "value",
    color: "#378ADD",
    size: "8 bytes",
    bits: "64 bits",
    barPct: 12,
    range: "-9.2 × 10¹⁸ → 9.2 × 10¹⁸",
  },
  {
    name: "double",
    kind: "value",
    color: "#185FA5",
    size: "8 bytes",
    bits: "64 bits",
    barPct: 12,
    range: "~±1.8 × 10³⁰⁸ (15 dígitos)",
  },
];

const REF_TYPES: TypeRow[] = [
  {
    name: "string",
    kind: "ref",
    color: "#8F77DD",
    size: "variável",
    bits: "n × 8–32",
    barPct: 45,
    range: '"olá" = 3–12 bytes (UTF-8)',
  },
  {
    name: "array / object",
    kind: "ref",
    color: "#D4537E",
    size: "variável",
    bits: "ilimitado",
    barPct: 80,
    range: "[1, 2, 3], { key: val }",
  },
];

export default function DataTypesTable({ labels = {} }: DataTypesTableProps) {
  const t = { ...defaults, ...labels };

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "140px 1fr 80px 1fr",
    gap: 0,
    alignItems: "center",
  };

  return (
    <div
      style={{
        margin: "24px 0",
        fontFamily: "var(--ifm-font-family-monospace)",
      }}
    >
      <style>{`
        .dtt-row { transition: background .12s ease; border-radius: var(--radius); }
        .dtt-row:hover { background: var(--secondary); }
        .dtt-bar-bg { flex: 1; height: 5px; border-radius: 3px; background: var(--border); overflow: hidden; max-width: 110px; }
        .dtt-bar-fill { height: 100%; border-radius: 3px; }
      `}</style>

      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            ...gridStyle,
            borderBottom: "1px solid var(--border)",
            padding: "10px 0",
          }}
        >
          {[t.colType, t.colSize, t.colBits, t.colRange].map((label, i) => (
            <span
              key={i}
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "var(--muted-foreground)",
                textTransform: "uppercase",
                letterSpacing: ".08em",
                padding: "0 12px",
              }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Group: Value types */}
        <GroupLabel label={t.groupValue} />

        {VALUE_TYPES.map((row) => (
          <Row key={row.name} row={row} gridStyle={gridStyle} t={t} />
        ))}

        {/* Separator */}
        <div
          style={{ height: "1px", background: "var(--border)", margin: "4px 0" }}
        />

        {/* Group: Reference types */}
        <GroupLabel label={t.groupRef} />

        {REF_TYPES.map((row) => (
          <Row key={row.name} row={row} gridStyle={gridStyle} t={t} />
        ))}

        {/* Footer note */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            padding: "10px 12px",
            fontSize: "11px",
            color: "var(--muted-foreground)",
            lineHeight: "1.6",
          }}
        >
          {t.footerNote.split("double").map((part, i) =>
            i === 0 ? (
              <span key={i}>{part}</span>
            ) : (
              <span key={i}>
                <span
                  style={{
                    color: "var(--ifm-color-primary)",
                    fontWeight: 600,
                  }}
                >
                  double
                </span>
                {part.split("int").map((p, j) =>
                  j === 0 ? (
                    <span key={j}>{p}</span>
                  ) : (
                    <span key={j}>
                      <span
                        style={{
                          color: "var(--ifm-color-primary)",
                          fontWeight: 600,
                        }}
                      >
                        int
                      </span>
                      {p}
                    </span>
                  )
                )}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function GroupLabel({ label }: { label: string }) {
  return (
    <div
      style={{
        fontSize: "10px",
        fontWeight: 700,
        color: "var(--muted-foreground)",
        textTransform: "uppercase",
        letterSpacing: ".08em",
        padding: "10px 12px 4px",
      }}
    >
      {label}
    </div>
  );
}

function Row({
  row,
  gridStyle,
  t,
}: {
  row: TypeRow;
  gridStyle: React.CSSProperties;
  t: typeof defaults;
}) {
  const isRef = row.kind === "ref";

  const badgeStyle: React.CSSProperties = {
    fontSize: "9px",
    fontWeight: 600,
    padding: "1px 6px",
    borderRadius: "var(--radius)",
    letterSpacing: ".04em",
    background: isRef
      ? `color-mix(in srgb, #8F77DD 14%, var(--card))`
      : `color-mix(in srgb, ${row.color} 14%, var(--card))`,
    color: isRef ? "#8F77DD" : row.color,
    border: `1px solid ${isRef ? "color-mix(in srgb, #8F77DD 30%, transparent)" : `color-mix(in srgb, ${row.color} 30%, transparent)`}`,
  };

  return (
    <div className="dtt-row" style={{ ...gridStyle }}>
      {/* Name + badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          padding: "9px 12px",
          fontSize: "12px",
          fontWeight: 500,
          color: "var(--foreground)",
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: row.color,
            flexShrink: 0,
          }}
        />
        {row.name}
        <span style={badgeStyle}>{isRef ? t.badgeRef : t.badgeValue}</span>
      </div>

      {/* Size + bar */}
      <div
        style={{
          padding: "9px 12px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div className="dtt-bar-bg">
          <div
            className="dtt-bar-fill"
            style={{ width: `${row.barPct}%`, background: row.color }}
          />
        </div>
        <span
          style={{
            fontSize: "12px",
            color: "var(--muted-foreground)",
            whiteSpace: "nowrap",
          }}
        >
          {row.size}
        </span>
      </div>

      {/* Bits */}
      <div
        style={{
          padding: "9px 12px",
          fontSize: "12px",
          color: "var(--muted-foreground)",
        }}
      >
        {row.bits}
      </div>

      {/* Range */}
      <div
        style={{
          padding: "9px 12px",
          fontSize: "11px",
          color: "var(--muted-foreground)",
          lineHeight: "1.5",
        }}
      >
        {row.range}
      </div>
    </div>
  );
}
