"use client";

import { type Locale, ui } from "@/lib/i18n";
import { ErrorSummary, Field, isEmail, isPhone, NotSentPanel, req, useCountries, useHonestForm, wire, type Errors } from "./shared";

/** Fields mirror the live export request form: country, company, mobile (with country code), email, products of interest. */
export default function ExportForm({ locale }: { locale: Locale }) {
  const f = ui.form;
  const countries = useCountries(locale);
  const labels = { country: f.country[locale], company: f.company[locale], mobile: f.mobile[locale], email: f.email[locale], products: f.interested[locale] };
  const { errors, notSent, setNotSent, onSubmit, summaryRef, panelRef } = useHonestForm((fd) => {
    const e: Errors = {};
    req(fd, ["country", "company", "mobile", "email", "products"], locale, e);
    if (!e.email && !isEmail(String(fd.get("email")))) e.email = f.errEmail[locale];
    if (!e.mobile && !isPhone(String(fd.get("mobile")))) e.mobile = f.errPhone[locale];
    return e;
  });

  if (notSent) {
    const country = countries.find((c) => c.code === notSent.get("country"))?.name ?? "";
    const body = [`${labels.country}: ${country}`, `${labels.company}: ${notSent.get("company")}`, `${labels.mobile}: ${notSent.get("mobile")}`, `${labels.email}: ${notSent.get("email")}`, `${labels.products}: ${notSent.get("products")}`].join("\n");
    return <NotSentPanel locale={locale} innerRef={panelRef} subject={ui.home.exportCta[locale]} body={body} onEdit={() => setNotSent(null)} />;
  }

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-6">
      <p className="text-sm text-muted">{f.requiredNote[locale]}</p>
      <ErrorSummary errors={errors} labels={labels} locale={locale} innerRef={summaryRef} />
      <div className="grid gap-6 md:grid-cols-2">
        <Field name="country" label={labels.country} required error={errors.country} locale={locale}>
          <select className="input" required defaultValue="" autoComplete="country" {...wire("country", errors)}>
            <option value="" disabled>{f.chooseCountry[locale]}</option>
            {countries.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
        </Field>
        <Field name="company" label={labels.company} required error={errors.company} locale={locale}>
          <input className="input" type="text" autoComplete="organization" required {...wire("company", errors)} />
        </Field>
        <Field name="mobile" label={labels.mobile} required error={errors.mobile} hint={f.mobileHint[locale]} locale={locale}>
          <input className="input" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" placeholder="+966…" required {...wire("mobile", errors, true)} />
        </Field>
        <Field name="email" label={labels.email} required error={errors.email} locale={locale}>
          <input className="input" type="email" autoComplete="email" dir="ltr" required {...wire("email", errors)} />
        </Field>
      </div>
      <Field name="products" label={labels.products} required error={errors.products} locale={locale}>
        <textarea className="input min-h-32" rows={4} required {...wire("products", errors)} />
      </Field>
      <div><button type="submit" className="btn btn-primary">{f.send[locale]}</button></div>
    </form>
  );
}
