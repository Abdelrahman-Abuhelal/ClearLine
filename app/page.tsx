'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const steps = [
    {
        title: 'Create AI strategy',
        body: 'Define your funnel goal, product angle, and brand voice in minutes.',
        icon: '01',
    },
    {
        title: 'AI recommends and sells',
        body: 'Guide shoppers with persuasive recommendations and clear purchase paths.',
        icon: '02',
    },
    {
        title: 'Share your funnel',
        body: 'Publish one link and distribute across WhatsApp, ads, DMs, or creators.',
        icon: '03',
    },
    {
        title: 'Track performance',
        body: 'See clicks, intent, and revenue signals to improve every campaign.',
        icon: '04',
    },
];

const useCases = [
    {
        title: 'Store Owners',
        body: 'Turn product pages into guided, high-conversion buying journeys.',
    },
    {
        title: 'Sales Teams',
        body: 'Deploy persuasive funnel flows without waiting on engineering.',
    },
    {
        title: 'Influencers / Affiliates',
        body: 'Share one smart funnel link that converts recommendations into revenue.',
    },
];

const metrics = [
    {
        value: '↑ Conversions',
        body: 'AI-guided recommendations shorten decision time and increase purchase confidence.',
    },
    {
        value: '↑ Revenue / Visitor',
        body: 'Persuasive flows surface better-fit products and increase basket value.',
    },
    {
        value: '↓ Support Load',
        body: 'Let AI handle repetitive pre-purchase questions before they reach support.',
    },
];

export default function LandingPage() {
    const router = useRouter();
    const [heroUrl, setHeroUrl] = useState('');
    const [scrolled, setScrolled] = useState(false);
    const heroInputRef = useRef<HTMLInputElement>(null);
    const heroWrapperRef = useRef<HTMLDivElement>(null);

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

    const handleCreateFunnel = () => {
        const url = heroUrl.trim();
        if (!url) {
            heroInputRef.current?.focus();
            if (heroWrapperRef.current) {
                heroWrapperRef.current.style.borderColor = 'var(--accent)';
                setTimeout(() => {
                    if (heroWrapperRef.current) heroWrapperRef.current.style.borderColor = '';
                }, 1400);
            }
            return;
        }
        router.push(`/preview?url=${encodeURIComponent(url)}`);
    };

    const handleCreateFromFinalCta = () => {
        if (heroUrl.trim()) {
            router.push(`/preview?url=${encodeURIComponent(heroUrl.trim())}`);
            return;
        }
        router.push('/preview');
    };

    return (
        <div className="landing-page">
            <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
                <div className="container">
                    <div className="logo">
                        <Image
                            src="/HowAISees-logo.png"
                            alt="HowAiSees logo"
                            width={224}
                            height={134}
                            className="brand-logo-image"
                            priority
                        />
                    </div>
                    <a href="#final-cta" className="nav-cta">Try It Free</a>
                </div>
            </nav>

            <section className="saas-hero">
                <div className="container">
                    <div className="hero-grid">
                        <div className="hero-copy">
                            <span className="hero-kicker reveal">HowAiSees - AI Funnel Platform</span>
                            <h1 className="reveal reveal-delay-1">Turn Your Products into AI Sales Funnels</h1>
                            <p className="reveal reveal-delay-2">
                                Create AI-powered sales experiences, share them anywhere, and track what converts.
                            </p>
                            <div className="hero-input-shell reveal reveal-delay-3" ref={heroWrapperRef}>
                                <span>URL</span>
                                <input
                                    ref={heroInputRef}
                                    type="url"
                                    placeholder="paste product or store URL"
                                    value={heroUrl}
                                    onChange={(e) => setHeroUrl(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleCreateFunnel();
                                        }
                                    }}
                                />
                            </div>
                            <div className="hero-actions reveal reveal-delay-3">
                                <button className="btn-primary" onClick={handleCreateFunnel}>Create Your First Funnel</button>
                                <a href="#demo" className="btn-secondary">Try Demo</a>
                            </div>
                        </div>

                        <div className="hero-visual reveal reveal-delay-2">
                            <div className="mock-chat">
                                <div className="chat-head">AI Funnel Assistant</div>
                                <div className="chat-line user">Need a camera under $500 for travel vlogs.</div>
                                <div className="chat-line ai">Top pick: ZV-E10 bundle. Light, stabilized, creator-friendly.</div>
                                <div className="chat-cta">Recommended funnel: Travel Creator Starter Kit</div>
                            </div>
                            <div className="share-link-card">
                                <p>Shareable funnel link</p>
                                <div className="link-pill">howaisees.com/funnel/travel-kit-x8q2</div>
                                <div className="flow-strip">
                                    <span>AI</span>
                                    <span>Link</span>
                                    <span>User</span>
                                    <span>Purchase</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-block">
                <div className="container">
                    <div className="section-head reveal">
                        <span className="section-label">How It Works</span>
                        <h2>From Setup to Revenue in 4 Steps</h2>
                    </div>
                    <div className="steps-grid">
                        {steps.map((step, idx) => (
                            <article key={step.title} className={`step-card reveal reveal-delay-${Math.min(idx, 3)}`}>
                                <div className="step-icon">{step.icon}</div>
                                <h3>{step.title}</h3>
                                <p>{step.body}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section-block compare-block">
                <div className="container">
                    <div className="section-head reveal">
                        <span className="section-label">Differentiation</span>
                        <h2>Not a chatbot. A revenue engine.</h2>
                    </div>
                    <div className="compare-wrap">
                        <article className="compare-column muted reveal">
                            <h3>Others</h3>
                            <ul>
                                <li>Answer questions</li>
                                <li>Passive interactions</li>
                                <li>No funnel control</li>
                            </ul>
                        </article>
                        <article className="compare-column strong reveal reveal-delay-1">
                            <h3>HowAiSees</h3>
                            <ul>
                                <li>Drives purchases</li>
                                <li>Persuasive AI flows</li>
                                <li>Shareable funnel links</li>
                            </ul>
                        </article>
                    </div>
                </div>
            </section>

            <section className="section-block">
                <div className="container">
                    <div className="section-head reveal">
                        <span className="section-label">Use Cases</span>
                        <h2>Who Is It For?</h2>
                    </div>
                    <div className="usecase-grid">
                        {useCases.map((item, idx) => (
                            <article key={item.title} className={`usecase-card reveal reveal-delay-${Math.min(idx, 3)}`}>
                                <h3>{item.title}</h3>
                                <p>{item.body}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section-block demo-block" id="demo">
                <div className="container">
                    <div className="section-head reveal">
                        <span className="section-label">Demo</span>
                        <h2>See It In Action</h2>
                    </div>
                    <div className="demo-shell reveal">
                        <div className="demo-top">Live Funnel Preview</div>
                        <div className="demo-body">
                            <div className="demo-chat">
                                <p className="msg-user">User: best running watch for beginners under $250?</p>
                                <p className="msg-ai">AI: Garmin Forerunner 165. Easy UI, accurate GPS, strong battery.</p>
                                <p className="msg-ai">AI: Compare with Coros Pace 3 if you prefer lighter weight.</p>
                            </div>
                            <div className="demo-product">
                                <h4>Recommended Product</h4>
                                <p>Garmin Forerunner 165</p>
                                <span>Estimated conversion intent: High</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-block metrics-block">
                <div className="container">
                    <div className="section-head reveal">
                        <span className="section-label">Metrics</span>
                        <h2>Built for Revenue</h2>
                    </div>
                    <div className="metrics-grid">
                        {metrics.map((metric, idx) => (
                            <article key={metric.value} className={`metric-card reveal reveal-delay-${Math.min(idx, 3)}`}>
                                <h3>{metric.value}</h3>
                                <p>{metric.body}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="final-cta-saas" id="final-cta">
                <div className="container container--narrow">
                    <h2 className="reveal">Start selling with AI today</h2>
                    <p className="reveal reveal-delay-1">Launch your first AI funnel and start tracking revenue signals from every conversation.</p>
                    <div className="final-actions reveal reveal-delay-2">
                        <button className="btn-primary" onClick={handleCreateFromFinalCta}>Create Funnel</button>
                        <a className="btn-secondary" href="mailto:abd.hilal14@gmail.com?subject=HowAiSees Demo Request">Book Demo</a>
                    </div>
                </div>
            </section>
        </div>
    );
}
