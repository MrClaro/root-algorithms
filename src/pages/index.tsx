import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import type { ReactNode } from "react";

import ChaptersSection from "../components/home/chapters-section";
import ContributeSection from "../components/home/contribute-section";
import FeaturesSection from "../components/home/features-section";
import HeroSection from "../components/home/hero-section";
import TipsSection from "../components/home/tips-section";
import styles from "./index.module.scss";

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Algoritmos e estruturas de dados"
    >
      <main className={styles.page}>
        <HeroSection />
        <FeaturesSection />
        <hr className={styles.divider} />
        <ChaptersSection />
        <TipsSection />
        <ContributeSection />
      </main>
    </Layout>
  );
}
