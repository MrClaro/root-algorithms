import TerminalWindow from "./terminal-window";
import styles from "./styles.module.scss";
import { Lightbulb, Sparkles } from "lucide-react";

const tips = [
  "Leia atentamente as explicações e exemplos de cada seção.",
  "Implemente os algoritmos por conta própria antes de ver a solução.",
  "Foque na lógica, não na sintaxe da linguagem.",
  "Travou? Pare, respire e tente uma abordagem diferente.",
  "Persistência é a chave — continue praticando.",
  "Siga a ordem dos capítulos para melhor compreensão.",
];

export default function TipsSection() {
  return (
    <>
      <TerminalWindow filename="como-aprender.sh">
        <h2
          className={styles.featureTitle}
          style={{
            fontSize: "1rem",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Lightbulb className={`${styles.iconYellow} ${styles.icon}`} />
          Como ter a melhor experiência
        </h2>
        <div className={styles.tipsList}>
          {tips.map((tip, i) => (
            <div key={i} className={styles.tipItem}>
              <span className={styles.tipNumber}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </TerminalWindow>

      <TerminalWindow filename="pre-requisitos.sh">
        <h2
          className={styles.featureTitle}
          style={{
            fontSize: "1rem",
            marginBottom: "0.75rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Sparkles className={`${styles.iconCyan} ${styles.icon}`} />
          Pré-requisitos
        </h2>
        <p className={styles.prereqText}>
          Conhecimentos básicos em alguma linguagem de programação (foco em
          JavaScript, mas adaptável para qualquer outra). Um ambiente de
          desenvolvimento configurado para praticar os algoritmos. Vontade de
          aprender e persistência!
        </p>
      </TerminalWindow>
    </>
  );
}
