"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { company } from "@/content/company";
import { countryCodes } from "@/content/forms";
import { type Locale, ui } from "@/lib/i18n";
import { Info, Mail, Phone } from "../Icons";

export type Errors = Record<string, string>;

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const isPhone = (v: string) => /^\+?[\d\s-]{8,16}$/.test(v.trim());

type Country = { code: string; name: string };
const countryCache = new Map<Locale, Country[]>();
const NO_COUNTRIES: Country[] = [];
const noop = () => () => {};
function countriesFor(locale: Locale) {
  let list = countryCache.get(locale);
  if (!list) {
    const dn = new Intl.DisplayNames([locale], { type: "region" });
    list = countryCodes.map((code) => ({ code, name: dn.of(code) ?? code })).sort((a, b) => a.name.localeCompare(b.name, locale));
    countryCache.set(locale, list);
  }
  return list;
}
/**
 * Country names come from the browser's Intl data. They are rendered on the client only,
 * because Node's and the browser's ICU data differ slightly and would cause a hydration mismatch.
 */
export function useCountries(locale: Locale) {
  return useSyncExternalStore(noop, () => countriesFor(locale), () => NO_COUNTRIES);
}

/**
 * Shared behaviour for every form on the site:
 * - native fields + our own validation (no browser bubbles; errors are announced)
 * - on a valid submit, NOTHING is sent: the visitor sees an honest "not sent" panel with
 *   direct contact routes and an optional pre-filled email. There is no fake success state.
 */
export function useHonestForm(validate: (fd: FormData) => Errors) {
  const [errors, setErrors] = useState<Errors>({});
  const [notSent, setNotSent] = useState<FormData | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [attempt, setAttempt] = useState(0);
  // Move focus after React has committed the new DOM (error summary or not-sent panel)
  useEffect(() => {
    if (!attempt) return;
    (notSent ? panelRef : summaryRef).current?.focus();
  }, [attempt, notSent]);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const errs = validate(fd);
    setErrors(errs);
    setAttempt((a) => a + 1);
    if (Object.keys(errs).length) return;
    setNotSent(fd);
  };
  return { errors, setErrors, notSent, setNotSent, onSubmit, summaryRef, panelRef };
}

export function ErrorSummary({ errors, labels, locale, innerRef }: { errors: Errors; labels: Record<string, string>; locale: Locale; innerRef: React.RefObject<HTMLDivElement | null> }) {
  const keys = Object.keys(errors);
  return (
    <div ref={innerRef} tabIndex={-1} role="alert" className={keys.length ? "rounded-2xl border-2 border-[#a3261e] bg-[#fbeceb] p-5 outline-none" : "sr-only"}>
      {keys.length > 0 && (
        <>
          <p className="font-semibold text-[#a3261e]">{ui.form.errSummary[locale]}</p>
          <ul className="mt-2 list-disc ps-5">
            {keys.map((k) => (
              <li key={k}><a className="underline" href={`#f-${k}`}>{labels[k] ?? k}</a>: {errors[k]}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export function Field({ name, label, required, error, hint, children, locale }: { name: string; label: string; required?: boolean; error?: string; hint?: string; children: ReactNode; locale: Locale }) {
  return (
    <div className="field">
      <label htmlFor={`f-${name}`}>
        {label} {required && <span className="req" aria-hidden>*</span>}
        {required && <span className="sr-only">{ui.form.required[locale]}</span>}
      </label>
      {children}
      {hint && <p id={`h-${name}`} className="text-sm text-muted">{hint}</p>}
      {error && <p id={`e-${name}`} className="field-error">{error}</p>}
    </div>
  );
}

/** Props that wire an input to its label, hint and error. */
export const wire = (name: string, errors: Errors, hint?: boolean) => ({
  id: `f-${name}`,
  name,
  "aria-invalid": errors[name] ? true : undefined,
  "aria-describedby": [hint ? `h-${name}` : "", errors[name] ? `e-${name}` : ""].filter(Boolean).join(" ") || undefined,
});

export function NotSentPanel({ locale, subject, body, onEdit, innerRef, extra }: { locale: Locale; subject: string; body: string; onEdit: () => void; innerRef: React.RefObject<HTMLDivElement | null>; extra?: ReactNode }) {
  const mailto = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return (
    <div ref={innerRef} tabIndex={-1} role="status" data-testid="form-not-sent" className="rounded-[var(--radius-plate)] border-2 border-sun bg-[#fff7e6] p-7 outline-none md:p-9">
      <div className="flex items-start gap-3">
        <Info className="mt-1 size-6 shrink-0 text-date" />
        <div>
          <h3 className="font-sans text-[length:var(--step-1)] font-semibold">{ui.form.notSentTitle[locale]}</h3>
          <p className="mt-2 max-w-2xl">{ui.form.notSentBody[locale]}</p>
        </div>
      </div>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        <li><a className="flex items-center gap-3 rounded-xl bg-white p-4 font-semibold" href={`mailto:${company.email}`}><Mail className="size-5 text-blue" /> <span className="break-all">{company.email}</span></a></li>
        <li><a className="flex items-center gap-3 rounded-xl bg-white p-4 font-semibold" href={company.phone.href}><Phone className="size-5 text-blue" /> <span className="ltr-num">{company.phone.display}</span></a></li>
      </ul>
      {extra}
      <div className="mt-6 flex flex-wrap gap-3">
        <a className="btn btn-primary" href={mailto}>{ui.form.openEmail[locale]}</a>
        <button type="button" className="btn btn-ghost" onClick={onEdit}>{ui.form.edit[locale]}</button>
      </div>
    </div>
  );
}

export const req = (fd: FormData, keys: string[], locale: Locale, errs: Errors) => {
  for (const k of keys) if (!String(fd.get(k) ?? "").trim()) errs[k] = ui.form.errRequired[locale];
};
