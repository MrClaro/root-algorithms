import { BookOpen, Code, Code2, Terminal, Trophy } from "lucide-react";
import styles from "./styles.module.scss";

const features = [
  {
    icon: BookOpen,
    title: "Explicações Claras",
    desc: "Conceitos fundamentais de algoritmos e estruturas de dados explicados de forma simples.",
    iconClass: styles.iconCyan,
  },
  {
    icon: Terminal,
    title: "Foco em Entrevistas",
    desc: "Algoritmos mais cobrados em entrevistas técnicas das maiores empresas de tecnologia.",
    iconClass: styles.iconPrimary,
  },
  {
    icon: Code2,
    title: "Exemplos em JS",
    desc: "Implementações práticas em JavaScript que você pode rodar e modificar.",
    iconClass: styles.iconYellow,
  },
  {
    icon: Trophy,
    title: "Desafios Práticos",
    desc: "Exercícios para praticar e consolidar seu aprendizado a cada capítulo.",
    iconClass: styles.iconMagenta,
  },
];

export default function FeaturesSection() {
  return (
    <section>
      <div className={styles.sectionPrompt}>
        <span className={styles.promptSymbol}>$</span>
        <span>ls features/</span>
      </div>
      <div className={styles.featuresGrid}>
        {features.map(({ icon: Icon, title, desc, iconClass }, i) => (
          <div key={i} className={styles.featureCard}>
            <div className={styles.featureHeader}>
              <div className={styles.featureIconWrapper}>
                <Icon className={`${styles.featureIcon} ${iconClass}`} />
              </div>
              <h3 className={styles.featureTitle}>{title}</h3>
            </div>
            <p className={styles.featureDesc}>{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
