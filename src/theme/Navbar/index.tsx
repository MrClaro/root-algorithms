import Link from "@docusaurus/Link";
import { useColorMode, useThemeConfig } from "@docusaurus/theme-common";
import { GithubIcon, MoonIcon, SunIcon } from "lucide-react";
import OriginalNavbar from "@theme-original/Navbar";
import styles from "./styles.module.scss";
import SearchBar from "@theme/SearchBar";

export default function NavbarWrapper(props) {
  const { colorMode, setColorMode } = useColorMode();
  const { navbar } = useThemeConfig();
  const ThemeIcon = colorMode === "dark" ? SunIcon : MoonIcon;

  return (
    <>
      <div style={{ display: "none" }}>
        <OriginalNavbar {...props} />
      </div>

      <header className={styles.navbar}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <span className={styles.logoSymbol}>{"_>"}</span>
          <span className={styles.logoText}>root@algorithms</span>
          <span className={styles.logoSuffix}>~$</span>
          <span className={styles.cursor} />
        </Link>

        {/* Routes of docusaurus.config.ts */}
        <nav className={styles.nav}>
          {navbar.items.map((item: any, i: number) => {
            const href =
              item.to ??
              item.href ??
              (item.type === "docSidebar" ? "/docs/intro" : "/");

            const isExternal =
              typeof href === "string" && href.startsWith("http");

            return isExternal ? (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.navLink}
              >
                {item.label}
              </a>
            ) : (
              <Link key={i} to={href} className={styles.navLink}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          <div className={styles.search}>
            <SearchBar />
          </div>

          <button
            className={styles.iconBtn}
            onClick={() =>
              setColorMode(colorMode === "dark" ? "light" : "dark")
            }
            aria-label="Change theme"
          >
            <ThemeIcon className={styles.icon} />
          </button>
          <a
            href="https://github.com/MrClaro/root-algorithms"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.iconBtn}
            aria-label="GitHub"
          >
            <GithubIcon className={styles.icon} />
          </a>
        </div>
      </header>
    </>
  );
}
