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
import { SmoothSectionReveal } from "@/components/animations/smooth-section-reveal";

export default function Home() {
  return (
    <>
      <main>
        {/* ── PROOF-FIRST FLOW ──────────────────────────────────────────
            Recruiter scanning 30+ portfolios needs hook in first 5s.
            New order: HOOK (achievements) → CONTEXT (experience) →
            STORY (about) → CAPABILITY (skills) → ACTION (contact).
            Old order put About + Process before any proof, costing 3
            section scrolls before recruiter saw a single contest win.
        */}
        <Hero />
        <ImageMarquee />
        <SmoothSectionReveal>
          <Work />
        </SmoothSectionReveal>
        <CurvedDivider accent="orange" />
        <SmoothSectionReveal>
          <Process />
        </SmoothSectionReveal>
        <CurvedDivider accent="blue" flip />
        <SmoothSectionReveal>
          <About />
        </SmoothSectionReveal>
        <CurvedDivider accent="orange" />
        <SmoothSectionReveal>
          <Services />
        </SmoothSectionReveal>
        <SkillsMarquee />
        <SmoothSectionReveal>
          <Contact />
        </SmoothSectionReveal>
      </main>
      <Footer />
    </>
  );
}
