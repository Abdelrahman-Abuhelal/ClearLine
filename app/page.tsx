'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

const steps = [
    {
        number: '01',
        title: 'Connect your products',
        body: 'Import your catalog.',
    },
    {
        number: '02',
        title: 'Choose what to sell',
        body: 'Focus the experience on your priority products.',
    },
    {
        number: '03',
        title: 'Generate the experience',
        body: 'Create guided shopping journeys automatically.',
    },
    {
        number: '04',
        title: 'Share and measure',
        body: 'Send it out and see what drives revenue.',
    },
];

const problemStats = [
    {
        stat: '98%',
        label: 'of e-commerce visitors do not buy',
    },
    {
        stat: '68-75%',
        label: 'average cart abandonment rate',
    },
    {
        stat: '2x-4x',
        label: 'conversion upside from guided selling',
    },
];

const benefits = [
    {
        stat: '10-15%',
        label: 'revenue lift from guided selling',
    },
    {
        stat: '50%',
        label: 'more revenue if conversion moves from 2% to 3%',
    },
    {
        stat: '$250K',
        label: 'funding target to move from MVP to traction',
    },
];

const companyNotes = [
    'MVP built and core concept working',
    'Focused on proving conversion uplift with real stores',
    'Built as the AI salesperson layer for e-commerce',
];

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 12);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const elements = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );

        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const mailtoHref = useMemo(() => {
        const subject = encodeURIComponent('HowAISees Early Access Request');
        const body = encodeURIComponent(
            `Name: ${name || '-'}\nEmail: ${email || '-'}\n\nI would like early access to the HowAISees demo.`
        );
        return `mailto:contact@howaisees.site?subject=${subject}&body=${body}`;
    }, [name, email]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) return;
        window.location.href = mailtoHref;
        setSubmitted(true);
    };

    return (
        <div className="landing-page simple-landing">
            <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
                <div className="container">
                    <div className="logo">
                        <Image
                            src="/HowAISees-logo.png"
                            alt="HowAISees logo"
                            width={224}
                            height={134}
                            className="brand-logo-image"
                            priority
                        />
                    </div>
                    <a href="#early-access" className="nav-cta">Get Early Access</a>
                </div>
            </nav>

            <section className="simple-hero">
                <div className="container">
                    <div className="simple-hero-grid">
                        <div className="simple-hero-copy">
                            <h1 className="reveal reveal-delay-1">Turn your store into AI-powered salespersons</h1>
                            <p className="simple-subheadline reveal reveal-delay-2">
                                More sales from the traffic you already have
                            </p>
                            <p className="simple-hero-text reveal reveal-delay-2">
                                Guide shoppers to the right product and help them buy faster.
                            </p>
                            <div className="simple-hero-actions reveal reveal-delay-3">
                                <a href="#early-access" className="btn-primary">Get Early Access</a>
                                <a href="#demo" className="btn-secondary">Try Demo</a>
                            </div>
                        </div>

                        <div className="simple-hero-visual reveal reveal-delay-2">
                            <div className="hero-image-card">
                                <Image
                                    src="/bot-v2.png"
                                    alt="AI sales agent hero preview"
                                    width={1280}
                                    height={900}
                                    className="hero-main-image"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-block simple-problem">
                <div className="container">
                    <div className="section-head reveal">
                        <span className="section-label">The Problem</span>
                        <h2>Stores have traffic. What they do not have is enough conversion.</h2>
                        <p>Too many choices, no guidance, and most visitors leave without buying.</p>
                    </div>
                    <div className="problem-grid problem-grid--stats">
                        {problemStats.map((item, index) => (
                            <article key={item.stat} className={`problem-card problem-card--stat reveal reveal-delay-${Math.min(index, 3)}`}>
                                <strong>{item.stat}</strong>
                                <p>{item.label}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section-block simple-solution">
                <div className="container">
                    <div className="section-head reveal">
                        <span className="section-label">The Solution</span>
                        <h2>A smarter way to sell online</h2>
                        <p>HowAISees turns static product catalogs into guided sales experiences.</p>
                    </div>
                    <div className="solution-grid">
                        <article className="solution-card reveal">
                            <h3>Recommends products</h3>
                            <p>Help shoppers find the right option faster.</p>
                        </article>
                        <article className="solution-card reveal reveal-delay-1">
                            <h3>Explains why they fit</h3>
                            <p>Give simple reasons that build confidence.</p>
                        </article>
                        <article className="solution-card reveal reveal-delay-2">
                            <h3>Guides people to purchase</h3>
                            <p>Move visitors from browsing to buying.</p>
                        </article>
                    </div>
                </div>
            </section>

            <section className="section-block simple-company">
                <div className="container">
                    <div className="section-head reveal">
                        <span className="section-label">Company Snapshot</span>
                        <h2>Built for conversion, not just engagement</h2>
                    </div>
                    <div className="company-grid">
                        {companyNotes.map((item, index) => (
                            <article key={item} className={`company-card reveal reveal-delay-${Math.min(index, 3)}`}>
                                <p>{item}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section-block simple-steps">
                <div className="container">
                    <div className="section-head reveal">
                        <span className="section-label">How It Works</span>
                        <h2>Simple from setup to sales</h2>
                    </div>
                    <div className="steps-grid">
                        {steps.map((step, index) => (
                            <article key={step.title} className={`step-card reveal reveal-delay-${Math.min(index, 3)}`}>
                                <div className="step-icon">{step.number}</div>
                                <h3>{step.title}</h3>
                                <p>{step.body}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section-block simple-demo" id="demo">
                <div className="container container--narrow">
                    <div className="section-head reveal">
                        <span className="section-label">Try The Experience</span>
                        <h2>See the AI sales experience</h2>
                        <p>One simple link can guide shoppers toward the right product and a faster decision.</p>
                    </div>
                    <div className="demo-image-card reveal reveal-delay-1">
                        <Image
                            src="/saleseexpp.png"
                            alt="HowAISees AI sales experience preview"
                            width={1600}
                            height={1200}
                            className="demo-main-image"
                        />
                    </div>
                </div>
            </section>

            <section className="section-block simple-benefits">
                <div className="container">
                    <div className="section-head reveal">
                        <span className="section-label">Benefits</span>
                        <h2>Built around business outcomes</h2>
                    </div>
                    <div className="benefits-grid benefits-grid--numbers">
                        {benefits.map((benefit, index) => (
                            <article key={benefit.stat} className={`benefit-card benefit-card--number reveal reveal-delay-${Math.min(index, 3)}`}>
                                <strong>{benefit.stat}</strong>
                                <p>{benefit.label}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section-block early-access-block" id="early-access">
                <div className="container container--narrow">
                    <div className="section-head reveal">
                        <span className="section-label">Early Access</span>
                        <h2>Try the AI Sales Experience</h2>
                        <p>Get early access to see how it works on your store</p>
                    </div>
                    <form className="access-form reveal reveal-delay-1" onSubmit={handleSubmit}>
                        <div className="access-fields">
                            <label className="access-field">
                                <span>Name</span>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your name"
                                    autoComplete="name"
                                />
                            </label>
                            <label className="access-field">
                                <span>Email</span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@company.com"
                                    autoComplete="email"
                                />
                            </label>
                        </div>
                        <button className="btn-primary" type="submit">Request Access</button>
                        {submitted && (
                            <p className="access-note">Your email app should open with the request ready to send.</p>
                        )}
                    </form>
                </div>
            </section>

            <footer className="simple-footer">
                <div className="container">
                    <div className="simple-footer-brand">
                        <Image
                            src="/HowAISees-logo.png"
                            alt="HowAISees logo"
                            width={224}
                            height={134}
                            className="brand-logo-image footer-logo-image"
                        />
                    </div>
                    <div className="simple-footer-links">
                        <a href="https://www.linkedin.com/company/howaisees" target="_blank" rel="noreferrer">LinkedIn</a>
                        <a href="mailto:contact@howaisees.site">contact@howaisees.site</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
