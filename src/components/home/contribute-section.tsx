import { ArrowRight, GitPullRequest, Users } from "lucide-react";
import styles from "./styles.module.scss";

export default function ContributeSection() {
  return (
    <div className={styles.contribute}>
      <div className={styles.contributeIcon}>
        <Users className={styles.contributeIconInner} />
      </div>
      <h2 className={styles.contributeTitle}>Contribua com o projeto</h2>
      <p className={styles.contributeDesc}>
        O Root Algorithms é open source e está sempre aberto a contribuições.
        Explicações, exemplos, desafios — toda contribuição é bem-vinda e ajuda
        a comunidade a crescer.
      </p>
      <a
        href="https://github.com/MrClaro/root-algorithms/pulls"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.contributeBtn}
      >
        <GitPullRequest className={styles.icon} />
        Abrir Pull Request
        <ArrowRight className={styles.icon} />
      </a>
    </div>
  );
}
