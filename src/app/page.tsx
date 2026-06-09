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

export default function Home() {
  return (
    <>
      <main>
        {/* ── STORY-FIRST FLOW ──────────────────────────────────────────
            Hero → About → Process → Services → Work → Contact.
            Static imports, no LazySection wrappers - the lazy mount was
            interfering with the Work section's sticky scroll (placeholder
            min-height conflicting with the sticky child's overflow), so
            scrolling past About locked up. Reverted at the user's request
            ('trả về trước khi em fix'). The CPU optimisation pass via
            useAnimationProfile + MotionConfig still applies.
        */}
        <Hero />
        <ImageMarquee />
        <About />
        <CurvedDivider accent="orange" />
        <Process />
        <CurvedDivider accent="blue" flip />
        <Services />
        <SkillsMarquee />
        <Work />
        <CurvedDivider accent="orange" />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
