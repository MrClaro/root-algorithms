import React from "react";
import Link from "@docusaurus/Link";
import { useThemeConfig } from "@docusaurus/theme-common";
import styles from "./styles.module.scss";

export default function FooterWrapper() {
  const { footer } = useThemeConfig();

  if (!footer) return null;

  const { links, copyright } = footer as any;

  return (
    <footer className={styles.footer}>
      <div className={styles.terminalBar}>
        <span className={styles.terminalBarText}>
          {"─".repeat(20)} root@algorithms {"─".repeat(20)}
        </span>
      </div>

      {links?.length > 0 && (
        <div className={styles.columns}>
          {links.map((col: any, i: number) => (
            <div key={i} className={styles.column}>
              <p className={styles.columnTitle}>
                <span className={styles.promptSymbol}>$</span> {col.title}
              </p>
              <ul className={styles.columnList}>
                {col.items.map((item: any, j: number) => (
                  <li key={j} className={styles.columnItem}>
                    <span className={styles.arrow}>▶</span>
                    {item.to ? (
                      <Link to={item.to} className={styles.link}>
                        {item.label}
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {copyright && (
        <div className={styles.copyright}>
          <span className={styles.copyrightText}>{copyright}</span>
        </div>
      )}
    </footer>
  );
}
