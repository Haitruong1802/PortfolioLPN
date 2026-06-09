"use client";

import * as React from "react";
import { useActionState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { submitContact, type ContactResult } from "@/app/actions/contact";
import { useLocale } from "@/lib/i18n/provider";
import { Magnetic } from "@/components/animations/magnetic";
import { cn } from "@/lib/utils";

const BUDGETS_VI = [
  "Dưới 20tr",
  "20-50tr",
  "50-200tr",
  "Trên 200tr",
  "Chưa xác định",
];
const BUDGETS_EN = ["<$1k", "$1-5k", "$5-20k", ">$20k", "TBD"];

const TYPES_VI = ["Performance", "Brand", "Social", "SEO", "Integrated"];
const TYPES_EN = ["Performance", "Brand", "Social", "SEO", "Integrated"];

export function ContactForm({
  onSuccess,
}: {
  onSuccess?: (anchorEl: HTMLElement | null) => void;
} = {}) {
  const { locale } = useLocale();
  const [state, formAction, pending] = useActionState<ContactResult | null, FormData>(
    submitContact,
    null,
  );
  const submitBtnRef = React.useRef<HTMLButtonElement>(null);

  // Fire onSuccess once when state flips to ok=true
  const prevOkRef = React.useRef(false);
  React.useEffect(() => {
    if (state?.ok === true && !prevOkRef.current) {
      prevOkRef.current = true;
      onSuccess?.(submitBtnRef.current);
    }
    if (state?.ok !== true) {
      prevOkRef.current = false;
    }
  }, [state, onSuccess]);

  const budgets = locale === "vi" ? BUDGETS_VI : BUDGETS_EN;
  const types = locale === "vi" ? TYPES_VI : TYPES_EN;

  const labels = {
    vi: {
      name: "Tên",
      email: "Email",
      company: "Công ty (tùy chọn)",
      budget: "Ngân sách dự kiến",
      type: "Loại dịch vụ",
      message: "Tin nhắn",
      messagePh: "Mô tả ngắn về dự án, mục tiêu, timeline...",
      send: "Gửi tin nhắn",
      sending: "Đang gửi...",
    },
    en: {
      name: "Name",
      email: "Email",
      company: "Company (optional)",
      budget: "Estimated budget",
      type: "Service type",
      message: "Message",
      messagePh: "Brief project description, goals, timeline...",
      send: "Send message",
      sending: "Sending...",
    },
  }[locale];

  return (
    <motion.form
      action={formAction}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="rounded-2xl border border-border bg-card p-6 md:p-8"
    >
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute h-0 w-0 opacity-0"
        aria-hidden
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label={labels.name}
          name="name"
          required
          error={state?.ok === false && state.field === "name" ? state.error : null}
        />
        <Field
          label={labels.email}
          name="email"
          type="email"
          required
          error={state?.ok === false && state.field === "email" ? state.error : null}
        />
        <Field label={labels.company} name="company" />
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            {labels.budget}
          </label>
          <select
            name="budget"
            defaultValue=""
            className="h-11 rounded-xl border border-border bg-background px-4 text-base text-foreground focus:border-foreground/30 focus:outline-none md:text-sm"
          >
            <option value="">—</option>
            {budgets.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          {labels.type}
        </label>
        <div className="flex flex-wrap gap-2">
          {types.map((opt) => (
            <ChipRadio key={opt} value={opt} />
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          {labels.message}
        </label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder={labels.messagePh}
          className={cn(
            "rounded-xl border border-border bg-background px-4 py-3 text-base leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none md:text-sm",
            state?.ok === false &&
              state.field === "message" &&
              "border-red-500/60",
          )}
        />
        {state?.ok === false && state.field === "message" && (
          <p className="text-xs text-red-500">{state.error}</p>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Magnetic strength={0.35}>
          <button
            ref={submitBtnRef}
            type="submit"
            disabled={pending}
            className={cn(
              "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-orange via-primary to-brand-blue px-7 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 active:scale-[0.98] disabled:opacity-60",
            )}
          >
            {pending ? (
              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-r-transparent" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {pending ? labels.sending : labels.send}
          </button>
        </Magnetic>

        {state?.ok && (
          <p className="inline-flex items-center gap-2 text-sm text-brand-orange">
            <CheckCircle2 className="h-4 w-4" />
            {state.message}
          </p>
        )}
        {state?.ok === false && !state.field && (
          <p className="inline-flex items-center gap-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            {state.error}
          </p>
        )}
      </div>
    </motion.form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string | null;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        className={cn(
          "h-11 rounded-xl border border-border bg-background px-4 text-base text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none md:text-sm",
          error && "border-red-500/60",
        )}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function ChipRadio({ value }: { value: string }) {
  const [checked, setChecked] = React.useState(false);
  return (
    <label
      className={cn(
        "inline-flex min-h-[40px] cursor-pointer touch-manipulation items-center rounded-full border px-4 py-2 text-sm font-medium transition-colors md:min-h-0 md:px-3.5 md:py-1.5 md:text-xs",
        checked
          ? "border-primary/60 bg-primary/15 text-primary"
          : "border-border bg-transparent text-muted-foreground hover:bg-muted",
      )}
    >
      <input
        type="checkbox"
        name="projectType"
        value={value}
        className="sr-only"
        onChange={(e) => setChecked(e.target.checked)}
      />
      {value}
    </label>
  );
}
