'use client';

import Image from 'next/image';
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
                    <a href="#try" className="nav-cta">Try It Free</a>
                </div>
            </nav>

            <section className="hero">
                <div className="container container--narrow">
                    <div className="hero-badge reveal">AI Salesperson Agent + Revenue Signals</div>
                    <h1 className="reveal reveal-delay-1">
                        Turn shopper questions into <span className="highlight">sales and revenue signals</span>.
                    </h1>
                    <p className="hero-sub reveal reveal-delay-2">
                        HowAISees gives your store one AI Salesperson layer trained on catalog and brand voice. It recommends the right products in natural language and turns every conversation into demand intelligence your team can act on.
                    </p>
                    <ul className="hero-proof-list reveal reveal-delay-2" aria-label="Why teams use HowAISees">
                        <li>Guided discovery that lifts conversion</li>
                        <li>Commerce intelligence from real questions</li>
                        <li>Arabic-first, multilingual by design</li>
                    </ul>
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
                                Preview My AI Salesperson
                            </button>
                        </div>
                        <p className="hero-reassurance">
                            No signup <span>&middot;</span> 2-minute setup <span>&middot;</span> Website-first MVP
                        </p>
                    </div>
                </div>
            </section>

            <section className="reframe">
                <div className="container">
                    <div className="reframe-header">
                        <span className="section-label reveal">Why Stores Lose Sales</span>
                        <h2 className="section-title reveal reveal-delay-1">
                            Search and filters cannot answer buying intent.
                        </h2>
                        <p className="section-sub reveal reveal-delay-2">
                            Shoppers ask specific product questions before they buy. If your store cannot answer clearly, conversion drops and demand signals are lost.
                        </p>
                    </div>
                    <div className="reframe-grid">
                        <div className="reframe-card old reveal">
                            <span className="card-label">Without AI Salesperson</span>
                            <h3>&ldquo;Best running shoes for flat feet under $140?&rdquo;</h3>
                            <p>Too many products, no clear recommendation, low buyer confidence. High-intent shoppers leave before checkout.</p>
                        </div>
                        <div className="reframe-card new reveal reveal-delay-1">
                            <span className="card-label">With HowAISees</span>
                            <h3>Recommend the right product in seconds</h3>
                            <p>The AI Salesperson answers in your brand voice, compares options, and guides the shopper to a best-fit purchase path.</p>
                        </div>
                        <div className="reframe-card old reveal">
                            <span className="card-label">Without Revenue Signals</span>
                            <h3>&ldquo;Do you have a lighter carry-on under 2kg?&rdquo;</h3>
                            <p>Questions reveal demand, but teams cannot operationalize it. Merchandising and campaign decisions stay guess-based.</p>
                        </div>
                        <div className="reframe-card new reveal reveal-delay-1">
                            <span className="card-label">With HowAISees</span>
                            <h3>Turn questions into growth signals</h3>
                            <p>Revenue Signals surface high-demand queries, price sensitivity, and catalog gaps so marketing can execute faster.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pipeline">
                <div className="container">
                    <div className="reframe-header">
                        <span className="section-label reveal">How It Works</span>
                        <h2 className="section-title reveal reveal-delay-1">
                            Sales Agent &rarr; Shopper Actions &rarr; Revenue Signals
                        </h2>
                        <p className="section-sub reveal reveal-delay-2">
                            Customer asks. AI recommends. Shopper clicks. Merchant learns. Catalog and campaigns improve.
                        </p>
                    </div>
                    <div className="pipeline-steps">
                        <div className="pipeline-step reveal">
                            <div className="step-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                                </svg>
                            </div>
                            <h3>AI Salesperson Agent</h3>
                            <p>Set up store identity, voice, language behavior, and goals. The agent learns your catalog and sales strategy.</p>
                        </div>
                        <div className="pipeline-step reveal reveal-delay-1">
                            <div className="step-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                                </svg>
                            </div>
                            <h3>Shopper Actions</h3>
                            <p>Shoppers ask natural-language questions, compare products, and get recommendation paths that reduce buying friction.</p>
                        </div>
                        <div className="pipeline-step reveal reveal-delay-2">
                            <div className="step-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                            <h3>Revenue Signals</h3>
                            <p>Capture demand language, top comparisons, and missed opportunities to improve merchandising and campaign planning.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="impact">
                <div className="container">
                    <div className="reframe-header">
                        <span className="section-label reveal">Business Impact</span>
                        <h2 className="section-title reveal reveal-delay-1">Immediate sales value, compounding intelligence</h2>
                        <p className="section-sub reveal reveal-delay-2">
                            Most tools do one thing. HowAISees combines conversational selling, product intelligence, and commerce intelligence in one loop.
                        </p>
                    </div>
                    <div className="impact-grid">
                        <div className="impact-card reveal">
                            <h3>Conversion Lift</h3>
                            <p>Increase conversion by guiding high-intent shoppers to best-fit products faster.</p>
                            <div className="impact-example">Most compared products before purchase</div>
                        </div>
                        <div className="impact-card reveal reveal-delay-1">
                            <h3>Campaign Intelligence</h3>
                            <p>Plan campaigns using real demand language, comparison patterns, and buyer objections.</p>
                            <div className="impact-example">Top price bands customers ask for</div>
                        </div>
                        <div className="impact-card reveal reveal-delay-2">
                            <h3>AI Search Positioning</h3>
                            <p>Improve discoverability for AI-native shopping by strengthening product intent coverage.</p>
                            <div className="impact-example">High demand query with no matching product</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="output">
                <div className="container">
                    <div className="reframe-header">
                        <span className="section-label reveal">Product Preview</span>
                        <h2 className="section-title reveal reveal-delay-1">See the Salesperson + Intelligence loop</h2>
                        <p className="section-sub reveal reveal-delay-2">
                            From one product URL, preview shopper-facing recommendations and the signals your growth team can use next.
                        </p>
                    </div>
                    <div className="output-preview reveal" id="output-preview">
                        <div className="output-topbar">
                            <div className="output-dot r"></div>
                            <div className="output-dot y"></div>
                            <div className="output-dot g"></div>
                            <span>ai-salesperson-preview</span>
                        </div>
                        <div className="output-body">
                            <div className="output-section understood">
                                <h4><span className="dot"></span> Salesperson output</h4>
                                <div className="item">Product: wireless noise-cancelling headphones ($349)</div>
                                <div className="item">Best for: commuters and frequent travelers</div>
                                <div className="item">Key selling point: 30-hour battery + premium ANC</div>
                                <div className="item">Comparison edge: lighter than Sony XM5, better call quality</div>
                            </div>
                            <div className="output-section broken">
                                <h4><span className="dot"></span> Revenue signal blockers</h4>
                                <div className="item">Differentiator vs. competitors - not clearly stated</div>
                                <div className="item">Shopper use cases - missing from product page</div>
                                <div className="item">&ldquo;Best for&rdquo; scenario - not extractable from description</div>
                                <div className="item">Purchase justification - weak signals for price tier</div>
                            </div>
                        </div>
                            <div className="output-footer">
                            <div className="verdict-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                </svg>
                            </div>
                            <p><strong>Revenue readiness:</strong> This product is recommendable, but clearer positioning signals would improve conversion performance and AI-search visibility.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="final-cta" id="try">
                <div className="container container--narrow">
                    <span className="section-label reveal">Try It Free</span>
                    <h2 className="section-title reveal reveal-delay-1">Build your AI Salesperson layer in minutes</h2>
                    <p className="section-sub reveal reveal-delay-2">
                        Website-first MVP. Paste a URL to see conversion guidance and demand intelligence in one preview.
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
                                Preview My AI Salesperson
                            </button>
                        </div>
                        <p className="hero-reassurance">
                            No signup <span>&middot;</span> 2-minute setup <span>&middot;</span> Website-first MVP
                        </p>
                    </div>
                </div>
            </section>

            <footer className="landing-footer">
                <div className="container">
                    <div className="footer-brand">
                        <Image
                            src="/HowAISees-logo.png"
                            alt="HowAISees logo"
                            width={224}
                            height={134}
                            className="brand-logo-image footer-logo-image"
                        />
                        <p>AI Salesperson + Commerce Intelligence</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
