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
        {/* ── STORY-FIRST FLOW ──────────────────────────────────────────
            Reverted to the original narrative order: introduce Nam first,
            walk through his journey, then close with the proof + CTA.

            Note: tried next/dynamic on below-fold sections to slim the
            initial bundle, but on real mobile the dynamic-import promises
            were tripping the root error boundary mid-hydration. Reverted
            to static imports - the other optimisations (profile system,
            unused-dep removal, marquee off-screen pause, rAF mousemove)
            still ship the main perf wins without that risk.
        */}
        <Hero />
        <ImageMarquee />
        {/* About skips SmoothSectionReveal: the section already has its own
            whileInView reveals, and on mobile the wrapper's scroll-driven
            opacity dim made the section look blank until intersection fired,
            then everything popped in at once. */}
        <About />
        <CurvedDivider accent="orange" />
        <SmoothSectionReveal>
          <Process />
        </SmoothSectionReveal>
        <CurvedDivider accent="blue" flip />
        <SmoothSectionReveal>
          <Services />
        </SmoothSectionReveal>
        <SkillsMarquee />
        <SmoothSectionReveal>
          <Work />
        </SmoothSectionReveal>
        <CurvedDivider accent="orange" />
        <SmoothSectionReveal>
          <Contact />
        </SmoothSectionReveal>
      </main>
      <Footer />
    </>
  );
}
