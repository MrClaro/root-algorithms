import { useState } from "react";

interface RamLayoutProps {
  labels?: {
    title?: string;
    stack?: string;
    heap?: string;
    code?: string;
    free?: string;
    hint?: string;
    descriptions?: {
      stack?: string;
      heap?: string;
      code?: string;
      free?: string;
    };
  };
}

type CellType = "stack" | "heap" | "code" | "free";

const defaults = {
  title: "// representação simplificada da RAM",
  stack: "Stack",
  heap: "Heap",
  code: "Código",
  free: "Livre",
  hint: "Clique em uma célula para saber mais",
  descriptions: {
    stack:
      "Região da Stack — armazena variáveis locais e frames de função. Alocada automaticamente, tamanho limitado.",
    heap: "Região do Heap — armazena objetos alocados dinamicamente. Mais flexível, mas requer gerenciamento cuidadoso.",
    code: "Segmento de código — contém as instruções do programa. Alocado em tempo de compilação.",
    free: "Espaço livre — não alocado. Disponível para Stack ou Heap conforme necessário.",
  },
};

const TYPE_COLOR: Record<CellType, string> = {
  stack: "var(--ifm-color-primary)",
  heap: "var(--terminal-cyan)",
  code: "var(--terminal-yellow)",
  free: "var(--muted-foreground)",
};

const ROWS: { addr: string; cells: { label: string; type: CellType }[] }[] = [
  {
    addr: "0x00",
    cells: [
      { label: "main()", type: "code" },
      { label: "fn soma", type: "code" },
      { label: "fn print", type: "code" },
      { label: "—", type: "free" },
    ],
  },
  {
    addr: "0x04",
    cells: [
      { label: "frame", type: "stack" },
      { label: "x = 1", type: "stack" },
      { label: "ret addr", type: "stack" },
      { label: "—", type: "free" },
    ],
  },
  {
    addr: "0x08",
    cells: [
      { label: "—", type: "free" },
      { label: "obj A", type: "heap" },
      { label: "—", type: "free" },
      { label: "obj B", type: "heap" },
    ],
  },
  {
    addr: "0x0C",
    cells: [
      { label: "obj C", type: "heap" },
      { label: "—", type: "free" },
      { label: "—", type: "free" },
      { label: "obj D", type: "heap" },
    ],
  },
];

export default function RamLayout({ labels = {} }: RamLayoutProps) {
  const t = {
    ...defaults,
    ...labels,
    descriptions: { ...defaults.descriptions, ...labels.descriptions },
  };
  const [active, setActive] = useState<CellType | null>(null);
  const toggle = (type: CellType) =>
    setActive((p) => (p === type ? null : type));

  return (
    <div
      style={{
        margin: "24px 0",
        fontFamily: "var(--ifm-font-family-monospace)",
      }}
    >
      <style>{`
        .rc { transition: transform .15s ease, opacity .15s ease, box-shadow .15s ease; cursor: pointer; }
        .rc:hover { transform: scaleY(1.1); }
        .ri { transition: opacity .2s ease, max-height .2s ease, padding .2s ease; overflow: hidden; }
        .rl { transition: color .15s; cursor: pointer; }
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

        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
          {ROWS.map((row) => (
            <div
              key={row.addr}
              style={{ display: "flex", gap: "3px", alignItems: "center" }}
            >
              <span
                style={{
                  fontSize: "11px",
                  color: "var(--muted-foreground)",
                  width: "44px",
                  flexShrink: 0,
                }}
              >
                {row.addr}
              </span>
              {row.cells.map((cell, j) => {
                const c = TYPE_COLOR[cell.type];
                const isActive = active === cell.type;
                const dimmed = active !== null && !isActive;
                return (
                  <div
                    key={j}
                    className="rc"
                    onClick={() => toggle(cell.type)}
                    style={{
                      flex: 1,
                      height: "38px",
                      borderRadius: "var(--radius)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: isActive ? "700" : "500",
                      color: c,
                      background: isActive
                        ? `color-mix(in srgb, ${c} 15%, var(--card))`
                        : "var(--secondary)",
                      border: `1px solid ${isActive ? c : "var(--border)"}`,
                      opacity: dimmed ? 0.3 : 1,
                      boxShadow: isActive ? `0 0 0 1px ${c}` : "none",
                    }}
                  >
                    {cell.label}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div
          className="ri"
          style={{
            marginTop: "12px",
            maxHeight: active ? "80px" : "0",
            padding: active ? "12px 14px" : "0 14px",
            background: active
              ? `color-mix(in srgb, ${TYPE_COLOR[active]} 10%, var(--card))`
              : "transparent",
            border: active
              ? `1px solid color-mix(in srgb, ${TYPE_COLOR[active]} 35%, transparent)`
              : "1px solid transparent",
            borderRadius: "var(--radius)",
          }}
        >
          {active && (
            <p
              style={{
                margin: 0,
                fontSize: "13px",
                color: TYPE_COLOR[active],
                lineHeight: "1.6",
              }}
            >
              {t.descriptions[active]}
            </p>
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: "18px",
            marginTop: "14px",
            flexWrap: "wrap",
          }}
        >
          {(["stack", "heap", "code", "free"] as CellType[]).map((type) => (
            <div
              key={type}
              className="rl"
              onClick={() => toggle(type)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "11px",
                fontWeight: active === type ? "700" : "400",
                color:
                  active === type
                    ? TYPE_COLOR[type]
                    : "var(--muted-foreground)",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "2px",
                  background: `color-mix(in srgb, ${TYPE_COLOR[type]} 20%, var(--card))`,
                  border: `1px solid ${TYPE_COLOR[type]}`,
                }}
              />
              {t[type as keyof typeof t] as string}
            </div>
          ))}
        </div>

        <p
          style={{
            fontSize: "11px",
            color: "var(--muted-foreground)",
            marginTop: "10px",
            marginBottom: 0,
          }}
        >
          {t.hint}
        </p>
      </div>
    </div>
  );
}
