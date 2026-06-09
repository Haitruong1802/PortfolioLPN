import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/hero";
import { ImageMarquee } from "@/components/sections/image-marquee";
import { Footer } from "@/components/site/footer";
import { CurvedDivider } from "@/components/site/curved-divider";

// Below-the-fold sections are dynamically imported so the initial JS
// bundle only contains Hero + Marquee + Footer + Divider. The rest is
// loaded just before the user scrolls into it.
// Each section is itself a heavy client component (motion components,
// scroll subscriptions, image grids).
const About = dynamic(() =>
  import("@/components/sections/about").then((m) => m.About),
);
const Process = dynamic(() =>
  import("@/components/sections/process").then((m) => m.Process),
);
const Services = dynamic(() =>
  import("@/components/sections/services").then((m) => m.Services),
);
const Work = dynamic(() =>
  import("@/components/sections/work").then((m) => m.Work),
);
const Contact = dynamic(() =>
  import("@/components/sections/contact").then((m) => m.Contact),
);
const SkillsMarquee = dynamic(() =>
  import("@/components/sections/skills-marquee").then((m) => m.SkillsMarquee),
);
const SmoothSectionReveal = dynamic(() =>
  import("@/components/animations/smooth-section-reveal").then(
    (m) => m.SmoothSectionReveal,
  ),
);

export default function Home() {
  return (
    <>
      <main>
        {/* ── STORY-FIRST FLOW ──────────────────────────────────────────
            Reverted to the original narrative order: introduce Nam first,
            walk through his journey, then close with the proof + CTA.
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
