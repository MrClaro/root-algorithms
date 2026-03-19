import styles from "./styles.module.scss";
import TerminalWindow from "./terminal-window";
import TypingText from "./typing-text";
import Link from "@docusaurus/Link";
import {
  Terminal,
  BookOpen,
  Code2,
  Trophy,
  Lightbulb,
  GitPullRequest,
  ChevronRight,
  Sparkles,
  Database,
  Binary,
  Layers,
  ArrowRight,
  Zap,
  Users,
  Github,
} from "lucide-react";

export default function HeroSection() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.prompt}>
          <span className={styles.promptSymbol}>$</span>
          <span>cat README.md</span>
        </div>

        <h1 className={styles.heroTitle}>
          <TypingText text="Root Algorithms" speed={80} />
        </h1>

        <p className={styles.heroDesc}>
          Um projeto <span className={styles.highlight}>open source</span> que
          ensina de forma simples e prática os algoritmos e patterns que todo
          programador deve conhecer. Mantido por uma comunidade apaixonada por
          compartilhar conhecimento.
        </p>

        <div className={styles.heroActions}>
          <Link to="/docs/intro" className={styles.btnPrimary}>
            <Zap className={styles.icon} />
            Começar a Aprender
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnOutline}
          >
            <Github className={styles.icon} />
            Ver no GitHub
          </a>
        </div>
      </section>

      <TerminalWindow filename="install.sh">
        <div className={styles.terminalLine}>
          <span className={styles.iconPrimary}>$</span> git clone
          https://github.com/MrClaro/root-algorithms.git
        </div>
        <div className={styles.terminalLine}>
          <span className={styles.iconPrimary}>$</span> cd root-algorithms
        </div>
        <div className={styles.terminalLine}>
          <span className={styles.iconPrimary}>$</span> echo{" "}
          <span className={styles.iconPrimary}>
            "Pronto! Comece pelo capítulo 1 📖"
          </span>
        </div>
        <div className={`${styles.terminalLine} ${styles.terminalSuccess}`}>
          ✓ Ready to learn algorithms!
        </div>
      </TerminalWindow>
    </>
  );
}
