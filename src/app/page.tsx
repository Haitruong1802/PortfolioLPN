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
            SmoothSectionReveal wrapper removed entirely - it was driving
            opacity from scroll position with edge=0.7, which read as a
            black flash on mobile when the section was just below the
            fold. Sections now render plain; they each handle their own
            internal whileInView reveals.
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
