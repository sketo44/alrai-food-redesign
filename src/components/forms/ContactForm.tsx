"use client";

import { type Locale, ui } from "@/lib/i18n";
import { ErrorSummary, Field, isEmail, isPhone, NotSentPanel, req, useHonestForm, wire, type Errors } from "./shared";

export default function ContactForm({ locale }: { locale: Locale }) {
  const f = ui.form;
  const labels = { name: f.fullName[locale], mobile: f.mobile[locale], email: f.email[locale], message: f.message[locale] };
  const { errors, notSent, setNotSent, onSubmit, summaryRef, panelRef } = useHonestForm((fd) => {
    const e: Errors = {};
    req(fd, ["name", "mobile", "email", "message"], locale, e);
    if (!e.email && !isEmail(String(fd.get("email")))) e.email = f.errEmail[locale];
    if (!e.mobile && !isPhone(String(fd.get("mobile")))) e.mobile = f.errPhone[locale];
    return e;
  });

  if (notSent) {
    const body = [`${labels.name}: ${notSent.get("name")}`, `${labels.mobile}: ${notSent.get("mobile")}`, `${labels.email}: ${notSent.get("email")}`, "", String(notSent.get("message"))].join("\n");
    return <NotSentPanel locale={locale} innerRef={panelRef} subject={ui.nav.contact[locale]} body={body} onEdit={() => setNotSent(null)} />;
  }

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-6" aria-describedby="contact-req">
      <p id="contact-req" className="text-sm text-muted">{f.requiredNote[locale]}</p>
      <ErrorSummary errors={errors} labels={labels} locale={locale} innerRef={summaryRef} />
      <div className="grid gap-6 md:grid-cols-2">
        <Field name="name" label={labels.name} required error={errors.name} locale={locale}>
          <input className="input" type="text" autoComplete="name" required {...wire("name", errors)} />
        </Field>
        <Field name="mobile" label={labels.mobile} required error={errors.mobile} locale={locale}>
          <input className="input" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" required {...wire("mobile", errors)} />
        </Field>
      </div>
      <Field name="email" label={labels.email} required error={errors.email} locale={locale}>
        <input className="input" type="email" autoComplete="email" dir="ltr" required {...wire("email", errors)} />
      </Field>
      <Field name="message" label={labels.message} required error={errors.message} locale={locale}>
        <textarea className="input min-h-40" rows={6} required {...wire("message", errors)} />
      </Field>
      <div><button type="submit" className="btn btn-primary">{f.send[locale]}</button></div>
    </form>
  );
}
