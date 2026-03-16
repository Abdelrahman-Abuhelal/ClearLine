'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import LoadingState from '@/components/LoadingState';
import RiskIndicator from '@/components/RiskIndicator';
import IssuesList from '@/components/IssuesList';

interface DiagnosticResponse {
    aiUnderstanding: string;
    issues: {
        missing: string[];
        ambiguity: string[];
        conflicts: string[];
        weakSignals: string[];
    };
    riskLevel: 'Low' | 'Medium' | 'High';
}

function PreviewContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState<DiagnosticResponse | null>(null);
    const [autoSubmitted, setAutoSubmitted] = useState(false);

    // Read URL from query params and auto-submit
    useEffect(() => {
        const urlParam = searchParams.get('url');
        if (urlParam && !autoSubmitted) {
            setUrl(urlParam);
            setAutoSubmitted(true);
            submitUrl(urlParam);
        }
    }, [searchParams, autoSubmitted]);

    const submitUrl = async (productUrl: string) => {
        setError('');
        setResult(null);
        setLoading(true);

        try {
            const response = await fetch('/api/ai-preview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productUrl }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'An error occurred');
                return;
            }

            setResult(data);
        } catch {
            setError('Failed to analyze product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url.trim()) return;
        submitUrl(url.trim());
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
            {/* Top bar */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 100,
                    padding: '16px 0',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderBottom: '1px solid var(--border-subtle)',
                }}
            >
                <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                        onClick={() => router.push('/')}
                        className="logo"
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        <div className="logo-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        </div>
                        HowAiSees
                    </button>
                    <span
                        style={{
                            fontSize: '12px',
                            fontWeight: 500,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase' as const,
                            color: 'var(--accent)',
                            background: 'var(--accent-glow)',
                            border: '1px solid rgba(192, 132, 252, 0.12)',
                            padding: '4px 12px',
                            borderRadius: '100px',
                        }}
                    >
                        AI Sales Agent Preview
                    </span>
                </div>
            </div>

            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '100px 24px 80px' }}>
                {/* Input Section */}
                <div
                    style={{
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                        borderRadius: '16px',
                        padding: '32px',
                        marginBottom: '32px',
                    }}
                >
                    <h1
                        style={{
                            fontSize: '28px',
                            fontWeight: 700,
                            letterSpacing: '-0.03em',
                            marginBottom: '8px',
                            color: 'var(--text-primary)',
                        }}
                    >
                        See How Your AI Sales Agent Would Sell This Product
                    </h1>
                    <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                        Paste a product URL to preview how HowAiSees understands, recommends, and surfaces it to shoppers
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="url-input-wrapper" style={{ maxWidth: '100%' }}>
                            <span className="url-prefix">URL</span>
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://example.com/product-page"
                                aria-label="Product page URL"
                                required
                            />
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={loading}
                                style={loading ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                            >
                                {loading ? 'Previewing...' : 'Preview'}
                            </button>
                        </div>
                    </form>

                    {error && (
                        <div
                            style={{
                                marginTop: '16px',
                                padding: '16px',
                                background: 'var(--red-dim)',
                                border: '1px solid rgba(248, 113, 113, 0.2)',
                                borderRadius: '12px',
                            }}
                        >
                            <p style={{ color: 'var(--red)', fontSize: '14px' }}>{error}</p>
                        </div>
                    )}
                </div>

                {/* Loading State */}
                {loading && (
                    <div
                        style={{
                            background: 'var(--bg-elevated)',
                            border: '1px solid var(--border)',
                            borderRadius: '16px',
                            padding: '32px',
                        }}
                    >
                        <LoadingState />
                    </div>
                )}

                {/* Results Section */}
                {result && !loading && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Section 1: AI Understanding */}
                        <div
                            style={{
                                background: 'var(--bg-elevated)',
                                border: '1px solid var(--border)',
                                borderRadius: '16px',
                                padding: '32px',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                <div
                                    style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: 'var(--green)',
                                    }}
                                ></div>
                                <h2
                                    style={{
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        letterSpacing: '0.08em',
                                        textTransform: 'uppercase' as const,
                                        color: 'var(--green)',
                                    }}
                                >
                                    How Your AI Sales Agent Would Present This Product
                                </h2>
                            </div>
                            <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginBottom: '12px' }}>
                                When a shopper asks about this product, your AI sales agent would describe it like this:
                            </p>
                            <div
                                style={{
                                    padding: '20px',
                                    background: 'var(--bg-surface)',
                                    borderRadius: '12px',
                                    borderLeft: '3px solid var(--green)',
                                }}
                            >
                                <p
                                    style={{
                                        color: 'var(--text-secondary)',
                                        lineHeight: 1.7,
                                        fontSize: '15px',
                                    }}
                                >
                                    {result.aiUnderstanding}
                                </p>
                            </div>
                        </div>

                        {/* Section 2: Where Understanding Breaks */}
                        <div
                            style={{
                                background: 'var(--bg-elevated)',
                                border: '1px solid var(--border)',
                                borderRadius: '16px',
                                padding: '32px',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                                <div
                                    style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: 'var(--red)',
                                    }}
                                ></div>
                                <h2
                                    style={{
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        letterSpacing: '0.08em',
                                        textTransform: 'uppercase' as const,
                                        color: 'var(--red)',
                                    }}
                                >
                                    What May Block Product Discovery
                                </h2>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <IssuesList
                                    title="Missing Product Signals"
                                    subtitle="Key details shoppers ask about that aren't clearly available to your AI sales agent."
                                    items={result.issues.missing}
                                    icon="missing"
                                />
                                <IssuesList
                                    title="Unclear Shopper Value"
                                    items={result.issues.ambiguity}
                                    icon="ambiguity"
                                />
                                <IssuesList
                                    title="Conflicting Information"
                                    items={result.issues.conflicts}
                                    icon="conflicts"
                                />
                                <IssuesList
                                    title="Weak Discovery Signals"
                                    items={result.issues.weakSignals}
                                    icon="weak"
                                />
                            </div>

                            <div
                                style={{
                                    marginTop: '24px',
                                    padding: '24px',
                                    background: 'var(--amber-dim)',
                                    border: '1px solid rgba(251, 191, 36, 0.15)',
                                    borderLeft: '3px solid var(--amber)',
                                    borderRadius: '12px',
                                }}
                            >
                                <h3 style={{ fontWeight: 600, color: 'var(--amber)', marginBottom: '12px', fontSize: '14px' }}>
                                    What Blocks Product Discovery
                                </h3>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                                    Your AI sales agent builds recommendations from the signals on your product page. When key details are missing or unclear, shoppers get weaker answers — or no recommendation at all.
                                </p>
                                <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
                                    Common blockers:
                                </p>
                                <ul style={{ fontSize: '12px', color: 'var(--text-tertiary)', listStyle: 'disc', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <li>Important specs hidden behind tabs or JavaScript rendering</li>
                                    <li>Missing structured data (price, availability, ratings)</li>
                                    <li>Vague or generic product descriptions</li>
                                    <li>No clear differentiators vs. similar products</li>
                                    <li>Inconsistent naming across product details</li>
                                </ul>
                            </div>

                            <RiskIndicator riskLevel={result.riskLevel} />
                        </div>

                        <div
                            style={{
                                padding: '24px',
                                background: 'var(--accent-glow)',
                                border: '1px solid rgba(192, 132, 252, 0.12)',
                                borderLeft: '3px solid var(--accent)',
                                borderRadius: '12px',
                            }}
                        >
                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                                <strong style={{ color: 'var(--accent)', fontWeight: 600 }}>
                                    This is a preview of your AI sales agent.
                                </strong>
                                <br />
                                It shows how HowAiSees can understand your products, guide shoppers to the right choice, and surface demand insights for your store.
                            </p>
                        </div>

                        {/* Next actions */}
                        <div style={{ textAlign: 'center', padding: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                            <button
                                onClick={() => {
                                    window.open('https://howaisees.com', '_blank');
                                }}
                                className="btn-primary"
                                style={{
                                    fontSize: '14px',
                                    padding: '12px 28px',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                }}
                            >
                                Create Your AI Sales Agent
                            </button>
                            <button
                                onClick={() => {
                                    setResult(null);
                                    setUrl('');
                                    setError('');
                                    router.push('/preview');
                                }}
                                style={{
                                    fontSize: '14px',
                                    color: 'var(--text-tertiary)',
                                    background: 'none',
                                    border: '1px solid var(--border)',
                                    padding: '10px 24px',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = 'var(--text-primary)';
                                    e.currentTarget.style.borderColor = 'var(--text-tertiary)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = 'var(--text-tertiary)';
                                    e.currentTarget.style.borderColor = 'var(--border)';
                                }}
                            >
                                Preview another product
                            </button>
                        </div>

                        {/* Debug Section */}
                        {(result as DiagnosticResponse & { _debug?: Record<string, unknown> })._debug && (
                            <details
                                style={{
                                    background: 'var(--bg-surface)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '12px',
                                    padding: '24px',
                                }}
                            >
                                <summary
                                    style={{
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        color: 'var(--text-secondary)',
                                        fontSize: '14px',
                                    }}
                                >
                                    View raw extracted signals (for debugging)
                                </summary>
                                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div>
                                        <h4 style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '13px' }}>
                                            Extracted Signals:
                                        </h4>
                                        <pre
                                            style={{
                                                background: 'var(--bg-elevated)',
                                                padding: '16px',
                                                borderRadius: '8px',
                                                border: '1px solid var(--border)',
                                                overflow: 'auto',
                                                fontSize: '12px',
                                                color: 'var(--text-tertiary)',
                                                fontFamily: "'JetBrains Mono', monospace",
                                            }}
                                        >
                                            {JSON.stringify((result as DiagnosticResponse & { _debug: { extractedSignals: unknown } })._debug.extractedSignals, null, 2)}
                                        </pre>
                                    </div>
                                    <div>
                                        <h4 style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '13px' }}>
                                            Normalized Content:
                                        </h4>
                                        <pre
                                            style={{
                                                background: 'var(--bg-elevated)',
                                                padding: '16px',
                                                borderRadius: '8px',
                                                border: '1px solid var(--border)',
                                                overflow: 'auto',
                                                fontSize: '12px',
                                                color: 'var(--text-tertiary)',
                                                fontFamily: "'JetBrains Mono', monospace",
                                                whiteSpace: 'pre-wrap',
                                            }}
                                        >
                                            {(result as DiagnosticResponse & { _debug: { normalizedContent: string } })._debug.normalizedContent}
                                        </pre>
                                    </div>
                                </div>
                            </details>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function PreviewPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
                    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '100px 24px 80px' }}>
                        <LoadingState />
                    </div>
                </div>
            }
        >
            <PreviewContent />
        </Suspense>
    );
}
