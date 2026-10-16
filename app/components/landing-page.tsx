"use client";

import type { CSSProperties, FormEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

const cities = {
  accra: {
    name: "Accra / Tema",
    expected: 3600,
    living: 3840.11,
    actual: 2865.98,
    coverage: 74.6,
    gap: 974.13,
    statement:
      "Actual salary leaves the largest monthly shortfall among the four markets.",
  },
  takoradi: {
    name: "Takoradi",
    expected: 3200,
    living: 2682.56,
    actual: 2320.71,
    coverage: 86.5,
    gap: 361.85,
    statement:
      "Salary expectations exceed the benchmark, but actual pay still falls short.",
  },
  kumasi: {
    name: "Kumasi",
    expected: 3400,
    living: 2596.77,
    actual: 2136.27,
    coverage: 82.3,
    gap: 460.5,
    statement: "The widest expectation-to-pay gap appears in Kumasi.",
  },
  cape: {
    name: "Cape Coast",
    expected: 3100,
    living: 2210.34,
    actual: 1920.15,
    coverage: 86.9,
    gap: 290.19,
    statement:
      "The lowest living-wage benchmark still sits above median actual pay.",
  },
} as const;

type CityKey = keyof typeof cities;

const currency = (value: number) =>
  `GHS ${Math.round(value).toLocaleString("en-GH", {
    maximumFractionDigits: 0,
  })}`;

const percentageStyle = (value: number) =>
  ({ "--value": `${value}%` }) as CSSProperties;

export default function LandingPage() {
  const [selectedCity, setSelectedCity] = useState<CityKey>("accra");
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const city = cities[selectedCity];
  const maxSalary = useMemo(
    () => Math.max(city.expected, city.living, city.actual),
    [city],
  );

  useEffect(() => {
    document.body.classList.toggle("modal-open", modalOpen);
    if (modalOpen) {
      window.setTimeout(() => nameInputRef.current?.focus(), 50);
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && modalOpen) setModalOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("modal-open");
    };
  }, [modalOpen]);

  const openDownload = (trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setError("");
    setMessage("");
    setMenuOpen(false);
    setModalOpen(true);
  };

  const closeDownload = () => {
    if (submitting) return;
    setModalOpen(false);
    setError("");
    setMessage("");
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  };

  const submitDownload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/report-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(form.get("name") || "").trim(),
          email: String(form.get("email") || "").trim(),
          company: String(form.get("company") || ""),
        }),
      });

      const result = (await response.json()) as {
        downloadUrl?: string;
        error?: string;
      };

      if (!response.ok || !result.downloadUrl) {
        throw new Error(result.error || "We could not prepare the report.");
      }

      setMessage("Thank you. Your secure download is starting now.");
      window.location.assign(result.downloadUrl);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header" id="top">
        <div className="shell header-inner">
          <a
            className="report-label"
            href="#top"
            aria-label="Ghana Living Wage Report home"
          >
            <span>Ghana Living Wage</span>
            <strong>2025</strong>
          </a>
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
          <nav
            className={`nav${menuOpen ? " open" : ""}`}
            aria-label="Primary navigation"
          >
            <a href="#findings" onClick={() => setMenuOpen(false)}>
              Findings
            </a>
            <a href="#cities" onClick={() => setMenuOpen(false)}>
              Cities
            </a>
            <a href="#method" onClick={() => setMenuOpen(false)}>
              Method
            </a>
            <a href="#actions" onClick={() => setMenuOpen(false)}>
              Actions
            </a>
            <button
              className="nav-cta download-trigger"
              type="button"
              onClick={(event) => openDownload(event.currentTarget)}
            >
              Download report
            </button>
          </nav>
        </div>
      </header>

      <main id="main">
        <section className="hero">
          <div className="shell hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">
                <span /> Second edition · 2025
              </p>
              <h1>What does it take to live—not merely survive?</h1>
              <p className="hero-lead">
                A city-by-city benchmark for the monthly income an entry-level
                graduate needs to maintain a basic but decent independent life in
                Ghana.
              </p>
              <div className="hero-actions">
                <a className="button button-gold" href="#cities">
                  Explore the findings
                </a>
                <button
                  className="text-link download-trigger"
                  type="button"
                  onClick={(event) => openDownload(event.currentTarget)}
                >
                  Download full report <span aria-hidden="true">↓</span>
                </button>
              </div>
              <div className="hero-meta" aria-label="Report scope">
                <div><strong>3,257</strong><span>salary observations</span></div>
                <div><strong>4</strong><span>urban labour markets</span></div>
                <div><strong>1</strong><span>independent worker</span></div>
              </div>
            </div>

            <div className="benchmark-card" aria-label="2025 net living wage by city">
              <div className="card-kicker">2025 net living wage</div>
              <div className="benchmark-list">
                {[
                  ["Accra / Tema", "GHS 3,840", 100],
                  ["Takoradi", "GHS 2,683", 70],
                  ["Kumasi", "GHS 2,597", 68],
                  ["Cape Coast", "GHS 2,210", 58],
                ].map(([label, amount, value]) => (
                  <div className="benchmark-row" key={String(label)}>
                    <div className="benchmark-label">
                      <span>{label}</span><strong>{amount}</strong>
                    </div>
                    <div className="track">
                      <span style={percentageStyle(Number(value))} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="card-note">
                Monthly net income, including a 5% sustainability margin.
              </p>
            </div>
          </div>
        </section>

        <section className="signal" id="findings">
          <div className="shell signal-grid">
            <p className="section-number">01 / The central finding</p>
            <div>
              <h2>Actual salaries fall short in every city.</h2>
              <p>
                Median take-home pay covers only <strong>74.6% to 86.9%</strong> of
                the amount needed for essential urban living. A salary can be
                common in the market and still be inadequate.
              </p>
            </div>
          </div>
        </section>

        <section className="city-section" id="cities">
          <div className="shell">
            <div className="section-heading">
              <div>
                <p className="section-number">02 / City comparison</p>
                <h2>One country. Four different realities.</h2>
              </div>
              <p>Select a city to compare expectations, living costs and actual pay.</p>
            </div>
            <div className="city-tabs" role="tablist" aria-label="Select a city">
              {(Object.keys(cities) as CityKey[]).map((key) => (
                <button
                  className={`city-tab${selectedCity === key ? " active" : ""}`}
                  role="tab"
                  aria-selected={selectedCity === key}
                  key={key}
                  onClick={() => setSelectedCity(key)}
                >
                  {cities[key].name}
                </button>
              ))}
            </div>
            <div className="city-panel" aria-live="polite">
              <div className="city-intro">
                <p className="city-label">{city.name}</p>
                <p className="city-statement">{city.statement}</p>
                <div
                  className="coverage-ring"
                  style={{ "--coverage": city.coverage } as CSSProperties}
                >
                  <div>
                    <strong>{city.coverage.toFixed(1)}%</strong>
                    <span>wage coverage</span>
                  </div>
                </div>
              </div>
              <div className="metric-stack">
                {[
                  ["Expected salary", city.expected, "expected"],
                  ["Net living wage", city.living, "living"],
                  ["Actual salary", city.actual, "actual"],
                ].map(([label, amount, className]) => (
                  <div className="metric-row" key={String(label)}>
                    <div><span>{label}</span><strong>{currency(Number(amount))}</strong></div>
                    <div className="metric-track">
                      <span
                        className={`bar ${className}`}
                        style={{ width: `${(Number(amount) / maxSalary) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
                <div className="gap-line">
                  <span>Monthly shortfall</span><strong>{currency(city.gap)}</strong>
                </div>
              </div>
            </div>
            <p className="data-note">
              Values shown are monthly medians or estimated monthly net benchmarks.
              Figures are rounded for display.
            </p>
          </div>
        </section>

        <section className="why-section">
          <div className="shell why-grid">
            <div className="why-quote">
              <span className="quote-mark" aria-hidden="true">“</span>
              <blockquote>Market acceptance and wage adequacy are different.</blockquote>
            </div>
            <div className="why-copy">
              <p className="section-number">03 / Why this matters</p>
              <h2>The gap is paid for somewhere.</h2>
              <p>
                When wages do not cover essential costs, workers bridge the
                difference through family support, borrowing, delayed healthcare,
                reduced food quality or additional work. Employers may feel the
                same pressure through disengagement, early-career attrition and
                difficulty retaining trained talent.
              </p>
            </div>
          </div>
        </section>

        <section className="method-section" id="method">
          <div className="shell">
            <div className="section-heading">
              <div>
                <p className="section-number">04 / Research approach</p>
                <h2>A practical benchmark, grounded in local costs.</h2>
              </div>
              <p>
                The study updates the 2024 city baskets with 2025 official price,
                fare and tariff evidence.
              </p>
            </div>
            <ol className="method-list">
              {[
                ["01", "Define the worker", "One graduate entry-level worker, living independently and without dependants."],
                ["02", "Update essential costs", "Food, rent, transport, utilities, health, connectivity and other basic needs."],
                ["03", "Compare three measures", "Jobseeker expectations, the net living-wage benchmark and verified actual salary."],
                ["04", "Test adequacy", "Measure how much of the city benchmark actual take-home pay can cover."],
              ].map(([number, title, copy]) => (
                <li key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></li>
              ))}
            </ol>
            <div className="sample-note">
              <strong>Evidence base</strong>
              <p>987 jobseeker expectations + 2,270 verified payroll or worker-earnings records.</p>
            </div>
          </div>
        </section>

        <section className="action-section" id="actions">
          <div className="shell">
            <div className="section-heading">
              <div>
                <p className="section-number">05 / From evidence to action</p>
                <h2>What employers can do now.</h2>
              </div>
            </div>
            <div className="action-grid">
              {[
                ["01", "Use adequacy as a reference", "Compare entry-level take-home pay with the relevant city benchmark—not only the legal minimum or competitor bands."],
                ["02", "Close gaps in phases", "Quantify the shortfall, prioritise the lowest coverage and adopt a clear, time-bound adjustment plan."],
                ["03", "Design benefits that count", "Target transport, meals, healthcare, data and housing costs—and measure the expense genuinely replaced."],
              ].map(([number, title, copy]) => (
                <article key={number}>
                  <span className="action-index">{number}</span><h3>{title}</h3><p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="download-section">
          <div className="shell download-grid">
            <div>
              <p className="eyebrow light"><span /> Ghana Living Wage Report 2025</p>
              <h2>See the evidence behind the numbers.</h2>
              <p>
                Read the full methodology, city analysis, year-on-year comparisons
                and implementation framework.
              </p>
            </div>
            <button
              className="button button-light download-trigger"
              type="button"
              onClick={(event) => openDownload(event.currentTarget)}
            >
              Download full report <span aria-hidden="true">↓</span>
            </button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="shell footer-grid">
          <p className="footer-name">Ghana Living Wage 2025</p>
          <p>Ghana Living Wage Research Programme · Second Edition</p>
          <p>Accra, Ghana · 2025</p>
        </div>
      </footer>

      {modalOpen && (
        <div className="download-modal">
          <button
            className="download-modal-backdrop"
            type="button"
            aria-label="Close download form"
            onClick={closeDownload}
          />
          <section
            className="download-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="download-dialog-title"
            aria-describedby="download-dialog-copy"
          >
            <button
              className="download-modal-close"
              type="button"
              aria-label="Close download form"
              onClick={closeDownload}
              disabled={submitting}
            >×</button>
            <p className="eyebrow"><span /> Free report access</p>
            <h2 id="download-dialog-title">Get the full report</h2>
            <p id="download-dialog-copy">
              Enter your name and a valid email address to securely download the
              2025 Ghana Living Wage Report.
            </p>
            <form className="download-form" onSubmit={submitDownload}>
              <label>
                <span>Full name</span>
                <input ref={nameInputRef} name="name" type="text" autoComplete="name" minLength={2} maxLength={120} required />
              </label>
              <label>
                <span>Email address</span>
                <input name="email" type="email" autoComplete="email" maxLength={254} required />
              </label>
              <label className="honeypot" aria-hidden="true">
                <span>Company website</span>
                <input name="company" type="text" tabIndex={-1} autoComplete="off" />
              </label>
              <p className="download-form-error" role="alert" aria-live="polite">{error}</p>
              <p className="download-form-success" role="status" aria-live="polite">{message}</p>
              <button className="button button-gold download-submit" type="submit" disabled={submitting}>
                {submitting ? "Preparing report…" : "Continue to download"}
                {!submitting && <span aria-hidden="true">↓</span>}
              </button>
            </form>
            <p className="download-privacy">
              We use these details only to provide the report and understand its
              readership. They are not displayed publicly.
            </p>
          </section>
        </div>
      )}
    </>
  );
}
