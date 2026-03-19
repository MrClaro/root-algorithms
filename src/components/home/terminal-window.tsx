import { ReactNode } from "react";
import styles from "./styles.module.scss";

export default function TerminalWindow({
  filename,
  children,
}: {
  filename: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.terminal}>
      <div className={styles.terminalHeader}>
        <span className={`${styles.dot} ${styles.dotRed}`} />
        <span className={`${styles.dot} ${styles.dotYellow}`} />
        <span className={`${styles.dot} ${styles.dotGreen}`} />
        <span className={styles.terminalFilename}>{filename}</span>
      </div>
      <div className={styles.terminalBody}>{children}</div>
    </div>
  );
}
