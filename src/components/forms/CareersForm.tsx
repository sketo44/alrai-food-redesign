"use client";

import { useState } from "react";
import { declaration, departments, education } from "@/content/forms";
import { type Locale, ui } from "@/lib/i18n";
import { Minus, Plus } from "../Icons";
import { ErrorSummary, Field, isEmail, isPhone, NotSentPanel, req, useCountries, useHonestForm, wire, type Errors } from "./shared";

/** Mirrors the live "انضم إلينا" Gravity Form field by field (see docs/content-inventory.md). */
export default function CareersForm({ locale }: { locale: Locale }) {
  const c = ui.careers;
  const f = ui.form;
  const countries = useCountries(locale);
  const [rows, setRows] = useState([0]);
  const [nextId, setNextId] = useState(1);
  const labels = {
    department: c.department[locale], fullName: c.threeName[locale], dob: c.dob[locale], gender: c.gender[locale],
    nationality: c.nationality[locale], education: c.education[locale], address: c.address[locale],
    mobile: f.mobile[locale], email: f.email[locale], cv: c.cv[locale], declaration: c.declarationTitle[locale],
  };

  const { errors, notSent, setNotSent, onSubmit, summaryRef, panelRef } = useHonestForm((fd) => {
    const e: Errors = {};
    req(fd, ["department", "fullName", "dob", "gender", "nationality", "education", "address", "mobile", "email"], locale, e);
    if (!e.email && !isEmail(String(fd.get("email")))) e.email = f.errEmail[locale];
    if (!e.mobile && !isPhone(String(fd.get("mobile")))) e.mobile = f.errPhone[locale];
    const cv = fd.get("cv");
    if (!(cv instanceof File) || cv.size === 0) e.cv = f.errRequired[locale];
    else if (!/\.pdf$/i.test(cv.name) || cv.size > 5 * 1024 * 1024) e.cv = f.errFile[locale];
    if (!fd.get("declaration")) e.declaration = f.errRequired[locale];
    return e;
  });

  if (notSent) {
    const g = (k: string) => String(notSent.get(k) ?? "");
    const exp = rows
      .map((id) => [g(`exp-title-${id}`), g(`exp-company-${id}`), g(`exp-duration-${id}`)].filter(Boolean).join(" / "))
      .filter(Boolean);
    const body = [
      `${labels.department}: ${departments.find((d) => d.value === g("department"))?.label[locale] ?? ""}`,
      ...(exp.length ? [`${c.experience[locale]}:`, ...exp.map((x) => `- ${x}`)] : []),
      `${labels.fullName}: ${g("fullName")}`,
      `${labels.dob}: ${g("dob")}`,
      `${labels.gender}: ${g("gender")}`,
      `${labels.nationality}: ${countries.find((x) => x.code === g("nationality"))?.name ?? ""}`,
      `${labels.education}: ${g("education")}`,
      `${labels.address}: ${g("address")}`,
      `${labels.mobile}: ${g("mobile")}`,
      `${labels.email}: ${g("email")}`,
    ].join("\n");
    return (
      <NotSentPanel
        locale={locale}
        innerRef={panelRef}
        subject={c.title[locale]}
        body={body}
        onEdit={() => setNotSent(null)}
        extra={<p className="mt-4 text-sm font-semibold">{c.cvNote[locale]}</p>}
      />
    );
  }

  const legend = "font-display text-[length:var(--step-2)] mb-5";
  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-12">
      <div className="grid gap-4">
        <p className="text-sm text-muted">{f.requiredNote[locale]}</p>
        <ErrorSummary errors={errors} labels={labels} locale={locale} innerRef={summaryRef} />
      </div>

      <fieldset className="grid gap-6">
        <legend className={legend}>{c.professional[locale]}</legend>
        <Field name="department" label={labels.department} required error={errors.department} locale={locale}>
          <select className="input" defaultValue="" required {...wire("department", errors)}>
            <option value="" disabled>{c.chooseDept[locale]}</option>
            {departments.map((d) => <option key={d.value} value={d.value}>{d.label[locale]}</option>)}
          </select>
        </Field>
        <div className="grid gap-3">
          <p className="font-semibold">{c.experience[locale]}</p>
          {rows.map((id, i) => (
            <div key={id} role="group" aria-label={`${c.experience[locale]} ${i + 1}`} className="grid items-end gap-3 rounded-2xl bg-cream p-4 md:grid-cols-[1fr_1fr_1fr_auto]">
              <div className="field"><label htmlFor={`exp-title-${id}`}>{c.jobTitle[locale]}</label><input className="input" id={`exp-title-${id}`} name={`exp-title-${id}`} /></div>
              <div className="field"><label htmlFor={`exp-company-${id}`}>{c.expCompany[locale]}</label><input className="input" id={`exp-company-${id}`} name={`exp-company-${id}`} /></div>
              <div className="field"><label htmlFor={`exp-duration-${id}`}>{c.duration[locale]}</label><input className="input" id={`exp-duration-${id}`} name={`exp-duration-${id}`} /></div>
              <div className="flex gap-2">
                <button type="button" className="inline-flex size-12 items-center justify-center rounded-full border border-line bg-white hover:border-ink" onClick={() => { setRows((r) => [...r.slice(0, i + 1), nextId, ...r.slice(i + 1)]); setNextId((n) => n + 1); }}>
                  <Plus className="size-5" /><span className="sr-only">{c.add[locale]}</span>
                </button>
                {rows.length > 1 && (
                  <button type="button" className="inline-flex size-12 items-center justify-center rounded-full border border-line bg-white hover:border-ink" onClick={() => setRows((r) => r.filter((x) => x !== id))}>
                    <Minus className="size-5" /><span className="sr-only">{c.remove[locale]}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      <fieldset className="grid gap-6">
        <legend className={legend}>{c.personal[locale]}</legend>
        <div className="grid gap-6 md:grid-cols-2">
          <Field name="fullName" label={labels.fullName} required error={errors.fullName} locale={locale}>
            <input className="input" autoComplete="name" required {...wire("fullName", errors)} />
          </Field>
          <Field name="dob" label={labels.dob} required error={errors.dob} locale={locale}>
            <input className="input" type="date" min="1920-01-01" autoComplete="bday" required {...wire("dob", errors)} />
          </Field>
        </div>
        <fieldset className="field" aria-describedby={errors.gender ? "e-gender" : undefined}>
          <legend id="f-gender" tabIndex={-1}>{labels.gender} <span className="req" aria-hidden>*</span><span className="sr-only">{f.required[locale]}</span></legend>
          <div className="flex flex-wrap gap-3">
            {[c.male, c.female].map((g) => (
              <label key={g.en} className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line bg-white px-4">
                <input type="radio" name="gender" value={g.ar} className="size-4 accent-blue" /> {g[locale]}
              </label>
            ))}
          </div>
          {errors.gender && <p id="e-gender" className="field-error">{errors.gender}</p>}
        </fieldset>
        <div className="grid gap-6 md:grid-cols-2">
          <Field name="nationality" label={labels.nationality} required error={errors.nationality} locale={locale}>
            <select className="input" defaultValue="" required {...wire("nationality", errors)}>
              <option value="" disabled>{c.chooseNationality[locale]}</option>
              {countries.map((x) => <option key={x.code} value={x.code}>{x.name}</option>)}
            </select>
          </Field>
          <Field name="education" label={labels.education} required error={errors.education} locale={locale}>
            <select className="input" defaultValue="" required {...wire("education", errors)}>
              <option value="" disabled>{f.choose[locale]}</option>
              {education.map((x) => <option key={x.ar} value={x.ar}>{x[locale]}</option>)}
            </select>
          </Field>
        </div>
      </fieldset>

      <fieldset className="grid gap-6">
        <legend className={legend}>{c.contactInfo[locale]}</legend>
        <Field name="address" label={labels.address} required error={errors.address} locale={locale}>
          <input className="input" autoComplete="street-address" required {...wire("address", errors)} />
        </Field>
        <div className="grid gap-6 md:grid-cols-2">
          <Field name="mobile" label={labels.mobile} required error={errors.mobile} hint={f.mobileHint[locale]} locale={locale}>
            <input className="input" type="tel" inputMode="tel" dir="ltr" placeholder="+9665xxxxxxx" autoComplete="tel" required {...wire("mobile", errors, true)} />
          </Field>
          <Field name="email" label={labels.email} required error={errors.email} locale={locale}>
            <input className="input" type="email" dir="ltr" autoComplete="email" required {...wire("email", errors)} />
          </Field>
        </div>
      </fieldset>

      <fieldset className="grid gap-6">
        <legend className={legend}>{c.attachments[locale]}</legend>
        <Field name="cv" label={labels.cv} required error={errors.cv} hint={c.cvHint[locale]} locale={locale}>
          <input className="input file:me-4 file:rounded-full file:border-0 file:bg-blue file:px-4 file:py-2 file:font-semibold file:text-white" type="file" accept="application/pdf,.pdf" required {...wire("cv", errors, true)} />
        </Field>
      </fieldset>

      <fieldset className="grid gap-3 rounded-2xl bg-cream p-6">
        <legend className="sr-only">{labels.declaration}</legend>
        <p className="font-semibold">{labels.declaration} <span className="req" aria-hidden>*</span></p>
        <p id="decl-text" className="text-sm leading-relaxed text-ink/85">{declaration[locale]}</p>
        <label className="inline-flex min-h-11 cursor-pointer items-center gap-3 font-semibold">
          <input type="checkbox" value="1" className="size-5 accent-blue" aria-describedby={["decl-text", errors.declaration ? "e-declaration" : ""].filter(Boolean).join(" ")} {...{ id: "f-declaration", name: "declaration", "aria-invalid": errors.declaration ? true : undefined }} />
          {c.declarationYes[locale]}
        </label>
        {errors.declaration && <p id="e-declaration" className="field-error">{errors.declaration}</p>}
      </fieldset>

      <div><button type="submit" className="btn btn-primary">{c.submit[locale]}</button></div>
    </form>
  );
}
