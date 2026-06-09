import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="grid min-h-[100svh] place-items-center container-px noise-bg relative isolate overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 30%, color-mix(in srgb, var(--color-primary) 25%, transparent), transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-xl text-center">
        <p className="mb-4 text-xs font-mono uppercase tracking-[0.3em] text-brand-orange">
          404 · Lost in space
        </p>
        <h1 className="font-display text-7xl font-bold leading-none tracking-tighter sm:text-8xl md:text-9xl">
          <span className="gradient-text">404</span>
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          Trang anh tìm không tồn tại hoặc đã được di chuyển. Có thể quay lại
          trang chủ thử nhé.
        </p>
        <p className="mt-2 text-sm text-muted-foreground/70">
          Page not found. It may have been moved or never existed.
        </p>

        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-all hover:bg-accent active:scale-[0.98]"
        >
          <Home className="h-4 w-4" />
          Về trang chủ / Back home
        </Link>
      </div>
    </main>
  );
}
