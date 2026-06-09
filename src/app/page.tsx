import { Hero } from "@/components/sections/hero";
import { ImageMarquee } from "@/components/sections/image-marquee";
import { About } from "@/components/sections/about";
import { Services } from "@/components/sections/services";
import { Process } from "@/components/sections/process";
import { Work } from "@/components/sections/work";
import { Contact } from "@/components/sections/contact";
import { SkillsMarquee } from "@/components/sections/skills-marquee";
import { Footer } from "@/components/site/footer";
import { CurvedDivider } from "@/components/site/curved-divider";
import { LazySection } from "@/components/site/lazy-section";

export default function Home() {
  return (
    <>
      <main>
        {/* ── STORY-FIRST FLOW ──────────────────────────────────────────
            Below-fold sections (About / Process / Services / Work / Contact)
            are wrapped in LazySection so they only mount when the user has
            scrolled within ~one viewport of them. This keeps the React tree
            small at first paint - the only live motion components on initial
            render are Hero's. Each section animates in normally when its
            placeholder fires the IntersectionObserver. min-height numbers
            are eyeballed from production renders; if a placeholder is too
            short the page bumps when content swaps, too tall and there's
            a brief gap.
        */}
        <Hero />
        <ImageMarquee />
        <LazySection minHeight="220vh">
          <About />
        </LazySection>
        <CurvedDivider accent="orange" />
        <LazySection minHeight="260vh">
          <Process />
        </LazySection>
        <CurvedDivider accent="blue" flip />
        <LazySection minHeight="140vh">
          <Services />
        </LazySection>
        <SkillsMarquee />
        <LazySection minHeight="320vh">
          <Work />
        </LazySection>
        <CurvedDivider accent="orange" />
        <LazySection minHeight="100vh">
          <Contact />
        </LazySection>
      </main>
      <Footer />
    </>
  );
}
