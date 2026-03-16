'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
    const router = useRouter();
    const [heroUrl, setHeroUrl] = useState('');
    const [ctaUrl, setCtaUrl] = useState('');
    const [scrolled, setScrolled] = useState(false);
    const heroInputRef = useRef<HTMLInputElement>(null);
    const heroWrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Intersection observer for reveal animations
    useEffect(() => {
        const elements = document.querySelectorAll('.reveal');
        const outputPreview = document.getElementById('output-preview');

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

        if (outputPreview) {
            const outputObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            outputObserver.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.15 }
            );
            outputObserver.observe(outputPreview);
            return () => {
                observer.disconnect();
                outputObserver.disconnect();
            };
        }

        return () => observer.disconnect();
    }, []);

    const handleCTA = () => {
        const url = heroUrl.trim() || ctaUrl.trim();
        if (!url) {
            heroInputRef.current?.focus();
            if (heroWrapperRef.current) {
                heroWrapperRef.current.style.borderColor = 'var(--accent)';
                setTimeout(() => {
                    if (heroWrapperRef.current) {
                        heroWrapperRef.current.style.borderColor = '';
                    }
                }, 2000);
            }
            return;
        }
        router.push(`/preview?url=${encodeURIComponent(url)}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleCTA();
        }
    };

    return (
        <div className="landing-page">
            {/* Navigation */}
            <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
                <div className="container">
                    <div className="logo">
                        <div className="logo-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        </div>
                        HowAiSees
                    </div>
                    <a href="#try" className="nav-cta">Try It Free</a>
                </div>
            </nav>

            {/* Hero */}
            <section className="hero">
                <div className="container container--narrow">
                    <div className="hero-badge reveal">AI Sales Agent for E-Commerce</div>
                    <h1 className="reveal reveal-delay-1">
                        Your AI sales agent that <span className="highlight">knows every product</span> in your store
                    </h1>
                    <p className="hero-sub reveal reveal-delay-2">
                        HowAiSees helps shoppers discover, compare, and choose the right products — powered by an AI sales agent trained on your catalog and brand voice. Set it up in 2 minutes.
                    </p>
                    <div className="hero-cta-group reveal reveal-delay-3">
                        <div className="url-input-wrapper" ref={heroWrapperRef}>
                            <span className="url-prefix">URL</span>
                            <input
                                ref={heroInputRef}
                                type="url"
                                placeholder="paste any product or store URL"
                                aria-label="Product page URL"
                                value={heroUrl}
                                onChange={(e) => setHeroUrl(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <button className="btn-primary" onClick={handleCTA}>
                                Preview Your AI Sales Agent
                            </button>
                        </div>
                        <p className="hero-reassurance">
                            No signup <span>&middot;</span> 2-minute setup <span>&middot;</span> Works with any store
                        </p>
                    </div>
                </div>
            </section>

            {/* Reframe */}
            <section className="reframe">
                <div className="container">
                    <div className="reframe-header">
                        <span className="section-label reveal">The Problem</span>
                        <h2 className="section-title reveal reveal-delay-1">
                            Shoppers leave because they<br />can&apos;t find what they need.
                        </h2>
                        <p className="section-sub reveal reveal-delay-2">
                            Most e-commerce stores lose sales to unanswered questions, bad search, and product pages that don&apos;t speak the shopper&apos;s language.
                        </p>
                    </div>
                    <div className="reframe-grid">
                        <div className="reframe-card old reveal">
                            <span className="card-label">Without AI sales agent</span>
                            <h3>&ldquo;Best gaming laptop under $1200?&rdquo;</h3>
                            <p>Shoppers search, scroll, compare tabs, read reviews — and still leave unsure. Your store can&apos;t answer their real questions.</p>
                        </div>
                        <div className="reframe-card new reveal reveal-delay-1">
                            <span className="card-label">With HowAiSees</span>
                            <h3>Instant, confident product recommendations</h3>
                            <p>Your AI sales agent understands every product in your catalog and recommends the right one — like your best salesperson, available 24/7.</p>
                        </div>
                        <div className="reframe-card old reveal">
                            <span className="card-label">Without AI sales agent</span>
                            <h3>&ldquo;Which wireless earbuds are best under $50?&rdquo;</h3>
                            <p>Filters don&apos;t help. Search returns noise. Shoppers bounce to a competitor who actually answers the question.</p>
                        </div>
                        <div className="reframe-card new reveal reveal-delay-1">
                            <span className="card-label">With HowAiSees</span>
                            <h3>Conversations that convert to purchases</h3>
                            <p>Shoppers ask natural questions and get helpful, personalized answers grounded in your actual product catalog and brand voice.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pipeline */}
            <section className="pipeline">
                <div className="container">
                    <div className="reframe-header">
                        <span className="section-label reveal">How It Works</span>
                        <h2 className="section-title reveal reveal-delay-1">
                            Connect &rarr; Discover &rarr; Insights
                        </h2>
                        <p className="section-sub reveal reveal-delay-2">
                            From setup to your first shopper conversation to actionable demand data — the whole loop in three steps.
                        </p>
                    </div>
                    <div className="pipeline-steps">
                        <div className="pipeline-step reveal">
                            <div className="step-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                                </svg>
                            </div>
                            <h3>Connect Your Store</h3>
                            <p>Paste your store URL or connect your catalog. HowAiSees learns your products, specs, pricing, and brand voice — ready to recommend in minutes.</p>
                        </div>
                        <div className="pipeline-step reveal reveal-delay-1">
                            <div className="step-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                                </svg>
                            </div>
                            <h3>Shoppers Discover Products</h3>
                            <p>Your AI sales agent answers questions, compares options, and guides shoppers to the right product — like asking &ldquo;best 65W USB-C charger for a MacBook&rdquo; and getting a real answer.</p>
                        </div>
                        <div className="pipeline-step reveal reveal-delay-2">
                            <div className="step-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                            <h3>You Get Demand Insights</h3>
                            <p>Every conversation reveals what shoppers actually want — questions asked, products compared, purchase signals. Turn customer conversations into merchandising intelligence.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Output Preview */}
            <section className="output">
                <div className="container">
                    <div className="reframe-header">
                        <span className="section-label reveal">What You&apos;ll See</span>
                        <h2 className="section-title reveal reveal-delay-1">Your AI sales agent in action</h2>
                        <p className="section-sub reveal reveal-delay-2">
                            See how your AI agent would present, recommend, and sell your products to real shoppers.
                        </p>
                    </div>
                    <div className="output-preview reveal" id="output-preview">
                        <div className="output-topbar">
                            <div className="output-dot r"></div>
                            <div className="output-dot y"></div>
                            <div className="output-dot g"></div>
                            <span>ai-sales-agent-preview</span>
                        </div>
                        <div className="output-body">
                            <div className="output-section understood">
                                <h4><span className="dot"></span> How Your AI Agent Would Sell This</h4>
                                <div className="item">Product: wireless noise-cancelling headphones ($349)</div>
                                <div className="item">Best for: commuters and frequent travelers</div>
                                <div className="item">Key selling point: 30-hour battery + premium ANC</div>
                                <div className="item">Comparison edge: lighter than Sony XM5, better call quality</div>
                            </div>
                            <div className="output-section broken">
                                <h4><span className="dot"></span> What May Block Product Discovery</h4>
                                <div className="item">Differentiator vs. competitors → not clearly stated</div>
                                <div className="item">Shopper use cases → missing from product page</div>
                                <div className="item">&ldquo;Best for&rdquo; scenario → not extractable from description</div>
                                <div className="item">Purchase justification → weak signals for price tier</div>
                            </div>
                        </div>
                        <div className="output-footer">
                            <div className="verdict-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                </svg>
                            </div>
                            <p><strong>Recommendation readiness:</strong> Your AI agent can identify this product, but needs stronger signals to confidently recommend it over alternatives. A few improvements would unlock confident, conversion-ready recommendations.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Truths */}
            <section className="truths">
                <div className="container">
                    <div className="reframe-header">
                        <span className="section-label reveal">Why HowAiSees</span>
                        <h2 className="section-title reveal reveal-delay-1">Built for how shoppers actually buy</h2>
                        <p className="section-sub reveal reveal-delay-2">
                            HowAiSees is designed around a simple truth: shoppers want answers, not search results.
                        </p>
                    </div>
                    <div className="truths-grid">
                        <div className="truth-card reveal">
                            <div className="truth-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                            </div>
                            <h3>AI that knows your whole catalog</h3>
                            <p>Your AI sales agent learns every product, spec, and price point — so it can recommend with the same confidence as your best team member.</p>
                        </div>
                        <div className="truth-card reveal reveal-delay-1">
                            <div className="truth-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                                </svg>
                            </div>
                            <h3>Trained on your brand voice</h3>
                            <p>Not a generic chatbot. HowAiSees speaks like your brand, understands your positioning, and recommends products the way you would.</p>
                        </div>
                        <div className="truth-card reveal">
                            <div className="truth-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                                </svg>
                            </div>
                            <h3>Demand insights from every conversation</h3>
                            <p>Every shopper question is a signal. HowAiSees surfaces what customers actually want — trending queries, product gaps, and purchase intent patterns.</p>
                        </div>
                        <div className="truth-card reveal reveal-delay-1">
                            <div className="truth-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                            </div>
                            <h3>Set up in 2 minutes, not 2 weeks</h3>
                            <p>Connect your store, and your AI sales agent is live. No complex integrations, no training data prep, no engineering team required.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision */}
            <section className="vision">
                <div className="container container--narrow">
                    <span className="section-label reveal">The Vision</span>
                    <blockquote className="reveal reveal-delay-1">
                        The stores that win won&apos;t have the best <em>search bar</em>. They&apos;ll have the best <em>salesperson</em> — and it&apos;ll be AI.
                    </blockquote>
                    <p className="vision-body reveal reveal-delay-2">
                        Product discovery is shifting from browse-and-filter to ask-and-get. HowAiSees puts your store on the right side of that shift.
                    </p>
                </div>
            </section>

            {/* Final CTA */}
            <section className="final-cta" id="try">
                <div className="container container--narrow">
                    <span className="section-label reveal">Try It Now</span>
                    <h2 className="section-title reveal reveal-delay-1">Preview your AI sales agent</h2>
                    <p className="section-sub reveal reveal-delay-2">
                        Paste any product URL and see how your AI sales agent would recommend and sell it to shoppers.
                    </p>
                    <div className="hero-cta-group reveal reveal-delay-3">
                        <div className="url-input-wrapper">
                            <span className="url-prefix">URL</span>
                            <input
                                type="url"
                                placeholder="paste any product or store URL"
                                aria-label="Product page URL"
                                value={ctaUrl}
                                onChange={(e) => setCtaUrl(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <button className="btn-primary" onClick={handleCTA}>
                                Preview Your AI Sales Agent
                            </button>
                        </div>
                        <p className="hero-reassurance">
                            No signup <span>&middot;</span> 2-minute setup <span>&middot;</span> Works with any store
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="container">
                    <p>HowAiSees &mdash; AI Commerce Intelligence</p>
                </div>
            </footer>
        </div>
    );
}
