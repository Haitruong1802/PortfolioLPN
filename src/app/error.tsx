"use client";

import * as React from "react";

/**
 * Root error boundary - Next.js auto-wraps the app with this when present.
 * Catches anything the providers don't, so a stray runtime error renders a
 * friendly fallback instead of the blank white page that was occasionally
 * showing up on weak office machines.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    if (typeof console !== "undefined") {
      console.error("Portfolio runtime error:", error);
    }
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-brand-orange">
        Something broke
      </div>
      <h1 className="font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
        Trang đang gặp lỗi.
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Anh thử tải lại trang. Nếu vẫn lỗi, ghi lại nội dung lỗi bên dưới và
        báo Nam nhé.
      </p>
      <button
        type="button"
        onClick={reset}
        className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-brand-orange to-brand-blue px-6 text-sm font-semibold text-white shadow-lg shadow-brand-orange/30 transition-shadow hover:shadow-brand-blue/40 active:scale-[0.97]"
      >
        Tải lại trang
      </button>
      {error?.digest && (
        <p className="font-mono text-[10px] text-muted-foreground/60">
          ref: {error.digest}
        </p>
      )}
    </div>
  );
}
