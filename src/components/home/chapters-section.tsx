import { Binary, Database, Layers } from "lucide-react";
import styles from "./styles.module.scss";

const chapters = [
  {
    icon: Database,
    label: "Estruturas de Dados",
    items: [
      "Arrays",
      "Linked Lists",
      "Stacks & Queues",
      "Hash Tables",
      "Árvores",
      "Grafos",
    ],
    borderClass: styles.borderCyan,
  },
  {
    icon: Binary,
    label: "Algoritmos",
    items: [
      "Sorting",
      "Searching",
      "Recursão",
      "Dynamic Programming",
      "Greedy",
    ],
    borderClass: styles.borderYellow,
  },
  {
    icon: Layers,
    label: "Patterns",
    items: ["Two Pointers", "Sliding Window", "BFS / DFS", "Backtracking"],
    borderClass: styles.borderMagenta,
  },
];

export default function ChaptersSection() {
  return (
    <section>
      <div className={styles.sectionPrompt}>
        <span className={styles.promptSymbol}>$</span>
        <span>tree chapters/ --depth 1</span>
      </div>
      <h2 className={styles.sectionTitle}>Capítulos</h2>
      <div className={styles.chaptersGrid}>
        {chapters.map(({ icon: Icon, label, items, borderClass }, i) => (
          <div key={i} className={`${styles.chapterCard} ${borderClass}`}>
            <div className={styles.chapterHeader}>
              <Icon className={styles.chapterIcon} />
              <span className={styles.chapterLabel}>{label}</span>
            </div>
            <hr className={styles.chapterDivider} />
            <ul className={styles.chapterList}>
              {items.map((item, j) => (
                <li key={j} className={styles.chapterItem}>
                  <span className={styles.chapterArrow}>▶</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
