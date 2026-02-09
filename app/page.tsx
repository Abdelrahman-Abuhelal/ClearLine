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
                    <a href="#try" className="nav-cta">Try Preview</a>
                </div>
            </nav>

            {/* Hero */}
            <section className="hero">
                <div className="container container--narrow">
                    <div className="hero-badge reveal">Diagnostic Preview</div>
                    <h1 className="reveal reveal-delay-1">
                        See how AI <span className="highlight">actually understands</span> your product
                    </h1>
                    <p className="hero-sub reveal reveal-delay-2">
                        AI systems don&apos;t rank pages. They interpret products. See exactly what they understand, where that understanding breaks, and why they hesitate to recommend.
                    </p>
                    <div className="hero-cta-group reveal reveal-delay-3">
                        <div className="url-input-wrapper" ref={heroWrapperRef}>
                            <span className="url-prefix">URL</span>
                            <input
                                ref={heroInputRef}
                                type="url"
                                placeholder="paste any product page URL"
                                aria-label="Product page URL"
                                value={heroUrl}
                                onChange={(e) => setHeroUrl(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <button className="btn-primary" onClick={handleCTA}>
                                Preview AI Understanding
                            </button>
                        </div>
                        <p className="hero-reassurance">
                            No signup <span>&middot;</span> No optimization <span>&middot;</span> Just diagnosis
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
                            This isn&apos;t about rankings.<br />It&apos;s about understanding.
                        </h2>
                        <p className="section-sub reveal reveal-delay-2">
                            Every SEO tool asks &ldquo;how do you rank?&rdquo; We ask something fundamentally different.
                        </p>
                    </div>
                    <div className="reframe-grid">
                        <div className="reframe-card old reveal">
                            <span className="card-label">Old thinking</span>
                            <h3>&ldquo;Optimize your page for AI search&rdquo;</h3>
                            <p>Add structured data. Follow checklists. Chase scores. Treat AI like another search engine to game.</p>
                        </div>
                        <div className="reframe-card new reveal reveal-delay-1">
                            <span className="card-label">New reality</span>
                            <h3>AI interprets your product meaning</h3>
                            <p>AI reads your page and constructs an understanding. If that understanding is fragmented, no optimization can fix it.</p>
                        </div>
                        <div className="reframe-card old reveal">
                            <span className="card-label">Old thinking</span>
                            <h3>&ldquo;More content, better visibility&rdquo;</h3>
                            <p>Longer descriptions. More keywords. More pages. Flood the system with signals.</p>
                        </div>
                        <div className="reframe-card new reveal reveal-delay-1">
                            <span className="card-label">New reality</span>
                            <h3>AI aggressively filters noisy pages</h3>
                            <p>When product meaning is cluttered, AI doesn&apos;t try harder. It moves on. Noise isn&apos;t ignored — it&apos;s penalizing.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pipeline */}
            <section className="pipeline">
                <div className="container">
                    <div className="reframe-header">
                        <span className="section-label reveal">How AI Decides</span>
                        <h2 className="section-title reveal reveal-delay-1">
                            Understanding &rarr; Selection &rarr; Conversion
                        </h2>
                        <p className="section-sub reveal reveal-delay-2">
                            Before AI can recommend your product, it must understand it. Before it can convert a user, it must select it. Each stage is a gate.
                        </p>
                    </div>
                    <div className="pipeline-steps">
                        <div className="pipeline-step reveal">
                            <div className="step-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                                </svg>
                            </div>
                            <h3>Understanding</h3>
                            <p>AI reads your product page and constructs a mental model. What is this product? Who is it for? What problem does it solve? If this step fails, nothing downstream works.</p>
                        </div>
                        <div className="pipeline-step reveal reveal-delay-1">
                            <div className="step-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                                </svg>
                            </div>
                            <h3>Selection</h3>
                            <p>From hundreds of options, AI narrows down. Products with clear, coherent meaning survive this filter. Ambiguous products get quietly dropped.</p>
                        </div>
                        <div className="pipeline-step reveal reveal-delay-2">
                            <div className="step-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                            <h3>Conversion</h3>
                            <p>AI recommends with confidence only when understanding is complete. Partial understanding produces hedged, weak recommendations that users skip.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Output Preview */}
            <section className="output">
                <div className="container">
                    <div className="reframe-header">
                        <span className="section-label reveal">What You&apos;ll See</span>
                        <h2 className="section-title reveal reveal-delay-1">A diagnosis, not a score</h2>
                        <p className="section-sub reveal reveal-delay-2">
                            No pass/fail. No points. Just a clear view of how AI currently interprets your product — and where it gets lost.
                        </p>
                    </div>
                    <div className="output-preview reveal" id="output-preview">
                        <div className="output-topbar">
                            <div className="output-dot r"></div>
                            <div className="output-dot y"></div>
                            <div className="output-dot g"></div>
                            <span>ai-understanding-preview.analysis</span>
                        </div>
                        <div className="output-body">
                            <div className="output-section understood">
                                <h4><span className="dot"></span> What AI Understands</h4>
                                <div className="item">Product category: wireless noise-cancelling headphones</div>
                                <div className="item">Primary use case: commute and travel audio</div>
                                <div className="item">Price positioning: premium tier ($349)</div>
                                <div className="item">Brand identity: established consumer electronics</div>
                            </div>
                            <div className="output-section broken">
                                <h4><span className="dot"></span> Where Understanding Breaks</h4>
                                <div className="item">Differentiator vs. competitors → unclear</div>
                                <div className="item">Target user persona → conflicting signals</div>
                                <div className="item">&ldquo;Best for&rdquo; scenario → not extractable</div>
                                <div className="item">Key purchase justification → missing</div>
                            </div>
                        </div>
                        <div className="output-footer">
                            <div className="verdict-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                </svg>
                            </div>
                            <p><strong>AI hesitation signal:</strong> This product would likely receive a hedged recommendation. AI can identify it, but can&apos;t confidently explain why a user should choose it.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Truths */}
            <section className="truths">
                <div className="container">
                    <div className="reframe-header">
                        <span className="section-label reveal">What We Believe</span>
                        <h2 className="section-title reveal reveal-delay-1">Principles, not promises</h2>
                        <p className="section-sub reveal reveal-delay-2">
                            This tool is built on a different set of beliefs about what products need in an AI-mediated world.
                        </p>
                    </div>
                    <div className="truths-grid">
                        <div className="truth-card reveal">
                            <div className="truth-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                            </div>
                            <h3>This is diagnosis, not optimization</h3>
                            <p>We show you what&apos;s happening. We don&apos;t tell you what to change. Diagnosis must come before prescription.</p>
                        </div>
                        <div className="truth-card reveal reveal-delay-1">
                            <div className="truth-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                                </svg>
                            </div>
                            <h3>Product meaning is fragmented</h3>
                            <p>Your product&apos;s meaning is scattered across pages, reviews, and specs. No one owns the complete picture — especially not AI.</p>
                        </div>
                        <div className="truth-card reveal">
                            <div className="truth-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                                </svg>
                            </div>
                            <h3>AI doesn&apos;t reward effort</h3>
                            <p>More content, more tags, more data — none of it helps if the core meaning isn&apos;t coherent. AI rewards clarity, not volume.</p>
                        </div>
                        <div className="truth-card reveal reveal-delay-1">
                            <div className="truth-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                            </div>
                            <h3>Seeing the problem is the first step</h3>
                            <p>You can&apos;t fix what you can&apos;t see. Most brands have never seen how AI actually interprets their product. This changes that.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision */}
            <section className="vision">
                <div className="container container--narrow">
                    <span className="section-label reveal">The Shift</span>
                    <blockquote className="reveal reveal-delay-1">
                        The brands that win in an AI-mediated world won&apos;t be the ones who <em>optimize</em> the best. They&apos;ll be the ones who are <em>understood</em> the best.
                    </blockquote>
                    <p className="vision-body reveal reveal-delay-2">
                        Product meaning is becoming the most important asset a brand owns — and right now, almost no one is paying attention to it.
                    </p>
                </div>
            </section>

            {/* Final CTA */}
            <section className="final-cta" id="try">
                <div className="container container--narrow">
                    <span className="section-label reveal">Try It Now</span>
                    <h2 className="section-title reveal reveal-delay-1">See what AI sees</h2>
                    <p className="section-sub reveal reveal-delay-2">
                        Paste any product URL. Get an instant diagnostic of how AI currently understands your product.
                    </p>
                    <div className="hero-cta-group reveal reveal-delay-3">
                        <div className="url-input-wrapper">
                            <span className="url-prefix">URL</span>
                            <input
                                type="url"
                                placeholder="paste any product page URL"
                                aria-label="Product page URL"
                                value={ctaUrl}
                                onChange={(e) => setCtaUrl(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <button className="btn-primary" onClick={handleCTA}>
                                Preview AI Understanding
                            </button>
                        </div>
                        <p className="hero-reassurance">
                            No signup <span>&middot;</span> No optimization <span>&middot;</span> Just diagnosis
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="container">
                    <p>HowAiSees &mdash; AI Product Understanding Preview</p>
                </div>
            </footer>
        </div>
    );
}
