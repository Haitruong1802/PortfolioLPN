import { notFound } from "next/navigation";
import { caseStudies } from "@/lib/content/case-studies";
import { CaseStudyView } from "@/components/sections/case-study-view";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Cursor } from "@/components/site/cursor";
import { ScrollProgress } from "@/components/site/scroll-progress";

export function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const cs = caseStudies.find((c) => c.slug === slug);
  if (!cs) return {};
  return {
    title: `${cs.title.en} — Case study`,
    description: cs.summary.en,
  };
}

export default async function CaseStudyPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const cs = caseStudies.find((c) => c.slug === slug);
  if (!cs) notFound();

  return (
    <>
      <ScrollProgress />
      <Cursor />
      <Header />
      <main className="pt-24">
        <CaseStudyView caseStudy={cs} />
      </main>
      <Footer />
    </>
  );
}
