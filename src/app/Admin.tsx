import { useState, useEffect } from "react";
import { Save, LogOut, Globe, ChevronDown, ChevronUp, Check } from "lucide-react";
import { fetchContent, saveContent, verifyPassword } from "./api";

type Lang = "he" | "en";

interface Props {
  defaults: Record<Lang, any>;
  onSaved: (lang: Lang, content: any) => void;
}

const EDITABLE_STRINGS: { key: string; label: string; multiline?: boolean }[] = [
  { key: "navCta", label: "Nav CTA Button" },
  { key: "heroBadge", label: "Hero Badge" },
  { key: "heroBtn1", label: "Hero Button 1" },
  { key: "heroBtn2", label: "Hero Button 2" },
  { key: "strip", label: "Statement Strip", multiline: true },
  { key: "workLabel", label: "Work Section Label" },
  { key: "workTitle", label: "Work Section Title" },
  { key: "workSubtitle", label: "Work Section Subtitle", multiline: true },
  { key: "catLearnMore", label: "Category Learn More" },
  { key: "catQuoteBtn", label: "Category Quote Button" },
  { key: "workshopLabel", label: "Workshop Label" },
  { key: "workshopBtn", label: "Workshop Button" },
  { key: "processLabel", label: "Process Label" },
  { key: "processTitle", label: "Process Title" },
  { key: "aboutLabel", label: "About Label" },
  { key: "aboutBtn", label: "About Button" },
  { key: "quoteLabel", label: "Quote Section Label" },
  { key: "quoteSubtitle", label: "Quote Subtitle", multiline: true },
  { key: "formName", label: "Form: Name Label" },
  { key: "formNamePh", label: "Form: Name Placeholder" },
  { key: "formContact", label: "Form: Contact Label" },
  { key: "formContactPh", label: "Form: Contact Placeholder" },
  { key: "formType", label: "Form: Type Label" },
  { key: "formTypePh", label: "Form: Type Placeholder" },
  { key: "formDesc", label: "Form: Description Label" },
  { key: "formDescPh", label: "Form: Description Placeholder", multiline: true },
  { key: "formBudget", label: "Form: Budget Label" },
  { key: "formBudgetPh", label: "Form: Budget Placeholder" },
  { key: "formBudgetNote", label: "Form: Budget Note", multiline: true },
  { key: "formSubmit", label: "Form: Submit Button" },
  { key: "formNote", label: "Form: Footer Note" },
  { key: "footerCopy", label: "Footer Copyright" },
];

function Section({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-sm overflow-hidden mb-4">
      <button
        className="w-full flex items-center justify-between px-5 py-3 bg-secondary hover:bg-muted transition-colors text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium text-foreground text-sm">{title}</span>
        {open ? <ChevronUp size={15} className="text-muted-foreground" /> : <ChevronDown size={15} className="text-muted-foreground" />}
      </button>
      {open && <div className="p-5 space-y-4 bg-card">{children}</div>}
    </div>
  );
}

function Field({ label, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  return (
    <div>
      <label className="block text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</label>
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none rounded-sm"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-primary rounded-sm"
        />
      )}
    </div>
  );
}

export default function Admin({ defaults, onSaved }: Props) {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [lang, setLang] = useState<Lang>("he");
  const [content, setContent] = useState<Record<Lang, any>>({ he: null, en: null });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!authed) return;
    const load = async () => {
      const he = await fetchContent("he");
      const en = await fetchContent("en");
      setContent({
        he: he ?? JSON.parse(JSON.stringify(defaults.he)),
        en: en ?? JSON.parse(JSON.stringify(defaults.en)),
      });
    };
    load();
  }, [authed]);

  const handleLogin = async () => {
    setAuthLoading(true);
    setAuthError(false);
    const ok = await verifyPassword(password);
    setAuthLoading(false);
    if (ok) setAuthed(true);
    else setAuthError(true);
  };

  const current = content[lang] ?? defaults[lang];

  const update = (key: string, value: any) => {
    setContent((c) => ({ ...c, [lang]: { ...c[lang], [key]: value } }));
    setSaved(false);
  };

  const updateNested = (path: string[], value: any) => {
    setContent((c) => {
      const copy = JSON.parse(JSON.stringify(c[lang]));
      let obj = copy;
      for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]];
      obj[path[path.length - 1]] = value;
      return { ...c, [lang]: copy };
    });
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await saveContent("he", content.he ?? defaults.he);
    await saveContent("en", content.en ?? defaults.en);
    onSaved("he", content.he ?? defaults.he);
    onSaved("en", content.en ?? defaults.en);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="w-full max-w-sm p-8 bg-card border border-border">
          <img src="/src/imports/Asset_9_4x.png" alt="Pinea Studio" className="h-10 brightness-0 invert mb-8 opacity-70" />
          <h1 className="text-foreground text-xl font-medium mb-6" style={{ fontFamily: "'Karantina', sans-serif" }}>Admin Panel</h1>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full bg-secondary border border-border text-foreground placeholder-muted-foreground/50 px-4 py-3 text-sm focus:outline-none focus:border-primary"
            />
            {authError && <p className="text-destructive text-xs">Incorrect password.</p>}
            <button
              onClick={handleLogin}
              disabled={authLoading}
              className="w-full py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50"
            >
              {authLoading ? "Checking..." : "Enter"}
            </button>
          </div>
          <p className="text-muted-foreground text-xs mt-6">Default password: <code className="text-foreground">pinea2024</code></p>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading content...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div className="fixed top-0 inset-x-0 z-50 bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-foreground font-medium text-sm" style={{ fontFamily: "'Karantina', sans-serif", fontSize: "18px" }}>
              Pinea Admin
            </span>
            <div className="flex items-center gap-1 border border-border rounded-sm overflow-hidden">
              {(["he", "en"] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1 text-xs font-medium transition-colors flex items-center gap-1 ${lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Globe size={11} />
                  {l === "he" ? "עברית" : "English"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-muted-foreground hover:text-foreground text-xs transition-colors flex items-center gap-1">
              <LogOut size={13} /> View Site
            </a>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm disabled:opacity-50"
            >
              {saved ? <><Check size={14} /> Saved</> : saving ? "Saving..." : <><Save size={14} /> Save All</>}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-20">
        <p className="text-muted-foreground text-sm mb-8">
          Editing: <strong className="text-foreground">{lang === "he" ? "Hebrew" : "English"}</strong> content.
          Changes affect both languages when you click Save All.
        </p>

        {/* General Text */}
        <Section title="General Text" defaultOpen>
          {EDITABLE_STRINGS.map(({ key, label, multiline }) => (
            <Field
              key={key}
              label={label}
              value={typeof current[key] === "string" ? current[key] : ""}
              onChange={(v) => update(key, v)}
              multiline={multiline}
            />
          ))}
        </Section>

        {/* Hero Headline */}
        <Section title="Hero Headline (3 lines)">
          {[0, 1, 2].map((i) => (
            <Field
              key={i}
              label={`Line ${i + 1}${i === 1 ? " (accent color)" : ""}`}
              value={current.heroH1?.[i] ?? ""}
              onChange={(v) => {
                const arr = [...(current.heroH1 ?? ["", "", ""])];
                arr[i] = v;
                update("heroH1", arr);
              }}
            />
          ))}
        </Section>

        {/* Hero Body */}
        <Section title="Hero Body Text">
          <Field label="Body" value={current.heroBody ?? ""} onChange={(v) => update("heroBody", v)} multiline />
        </Section>

        {/* About Title */}
        <Section title="About Title (2 lines)">
          {[0, 1].map((i) => (
            <Field
              key={i}
              label={`Line ${i + 1}`}
              value={current.aboutTitle?.[i] ?? ""}
              onChange={(v) => {
                const arr = [...(current.aboutTitle ?? ["", ""])];
                arr[i] = v;
                update("aboutTitle", arr);
              }}
            />
          ))}
        </Section>

        {/* About Body */}
        <Section title="About Body Text (3 paragraphs)">
          {[0, 1, 2].map((i) => (
            <Field
              key={i}
              label={`Paragraph ${i + 1}`}
              value={current.aboutBody?.[i] ?? ""}
              onChange={(v) => {
                const arr = [...(current.aboutBody ?? ["", "", ""])];
                arr[i] = v;
                update("aboutBody", arr);
              }}
              multiline
            />
          ))}
        </Section>

        {/* Quote Title */}
        <Section title="Quote Section Title (3 lines)">
          {[0, 1, 2].map((i) => (
            <Field
              key={i}
              label={`Line ${i + 1}`}
              value={current.quoteTitle?.[i] ?? ""}
              onChange={(v) => {
                const arr = [...(current.quoteTitle ?? ["", "", ""])];
                arr[i] = v;
                update("quoteTitle", arr);
              }}
            />
          ))}
        </Section>

        {/* Workshop Headline */}
        <Section title="Workshop Headline (3 lines)">
          {[0, 1, 2].map((i) => (
            <Field
              key={i}
              label={`Line ${i + 1}`}
              value={current.workshopH2?.[i] ?? ""}
              onChange={(v) => {
                const arr = [...(current.workshopH2 ?? ["", "", ""])];
                arr[i] = v;
                update("workshopH2", arr);
              }}
            />
          ))}
        </Section>

        {/* Contact Info */}
        <Section title="Contact Details">
          {(current.contacts ?? []).map((c: any, i: number) => (
            <div key={i} className="grid grid-cols-2 gap-3">
              <Field
                label={`Label ${i + 1}`}
                value={c.label ?? ""}
                onChange={(v) => {
                  const arr = JSON.parse(JSON.stringify(current.contacts));
                  arr[i].label = v;
                  update("contacts", arr);
                }}
              />
              <Field
                label={`Value ${i + 1}`}
                value={c.value ?? ""}
                onChange={(v) => {
                  const arr = JSON.parse(JSON.stringify(current.contacts));
                  arr[i].value = v;
                  update("contacts", arr);
                }}
              />
            </div>
          ))}
        </Section>

        {/* Categories */}
        <Section title="Category Descriptions">
          {(current.categories ?? []).map((cat: any, i: number) => (
            <div key={i} className="border border-border p-4 rounded-sm space-y-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{cat.name}</p>
              <Field
                label="Name"
                value={cat.name ?? ""}
                onChange={(v) => {
                  const arr = JSON.parse(JSON.stringify(current.categories));
                  arr[i].name = v;
                  update("categories", arr);
                }}
              />
              <Field
                label="Description"
                value={cat.desc ?? ""}
                onChange={(v) => {
                  const arr = JSON.parse(JSON.stringify(current.categories));
                  arr[i].desc = v;
                  update("categories", arr);
                }}
                multiline
              />
            </div>
          ))}
        </Section>

        {/* Process Steps */}
        <Section title="Process Steps">
          {(current.processSteps ?? []).map((step: any, i: number) => (
            <div key={i} className="border border-border p-4 rounded-sm space-y-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Step {step.num}</p>
              <Field
                label="Title"
                value={step.title ?? ""}
                onChange={(v) => {
                  const arr = JSON.parse(JSON.stringify(current.processSteps));
                  arr[i].title = v;
                  update("processSteps", arr);
                }}
              />
              <Field
                label="Body"
                value={step.body ?? ""}
                onChange={(v) => {
                  const arr = JSON.parse(JSON.stringify(current.processSteps));
                  arr[i].body = v;
                  update("processSteps", arr);
                }}
                multiline
              />
            </div>
          ))}
        </Section>

        {/* Budget Options */}
        <Section title="Budget Options">
          {(current.formBudgetOpts ?? []).map((opt: string, i: number) => (
            <Field
              key={i}
              label={`Option ${i + 1}`}
              value={opt}
              onChange={(v) => {
                const arr = [...(current.formBudgetOpts ?? [])];
                arr[i] = v;
                update("formBudgetOpts", arr);
              }}
            />
          ))}
        </Section>

        <div className="sticky bottom-6 flex justify-end mt-8">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 shadow-lg"
          >
            {saved ? <><Check size={16} /> Saved!</> : saving ? "Saving..." : <><Save size={16} /> Save All Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
}
