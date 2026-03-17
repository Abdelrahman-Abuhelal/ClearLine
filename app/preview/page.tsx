'use client';

import Image from 'next/image';
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
                        <Image
                            src="/HowAISees-logo.png"
                            alt="HowAISees logo"
                            width={224}
                            height={134}
                            className="brand-logo-image"
                            priority
                        />
                    </button>
                    <span
                        style={{
                            fontSize: '12px',
                            fontWeight: 500,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase' as const,
                            color: 'var(--accent-deep)',
                            background: 'var(--accent-glow)',
                            border: '1px solid rgba(45, 201, 199, 0.26)',
                            padding: '4px 12px',
                            borderRadius: '100px',
                        }}
                    >
                        AI Salesperson Preview
                    </span>
                </div>
            </div>

            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '100px 24px 80px' }}>
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
                        See How Your AI Salesperson Agent Would Sell This Product
                    </h1>
                    <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                        Paste a product URL to preview recommendations and Revenue Signals for conversion and AI-search discoverability.
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

                {result && !loading && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
                                    How Your AI Salesperson Agent Would Present This Product
                                </h2>
                            </div>
                            <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginBottom: '12px' }}>
                                When a shopper asks about this product, your AI Salesperson Agent would describe and position it like this:
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
                                    What May Block Product Discovery and Revenue Signals
                                </h2>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <IssuesList
                                    title="Missing Product Signals"
                                    subtitle="Key details shoppers ask about that are not clearly available to your AI Salesperson Agent."
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
                                    What Blocks Revenue from Discovery
                                </h3>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                                    Your AI Salesperson Agent builds recommendations from product-page signals. When key details are missing or unclear, shoppers get weaker answers and teams lose valuable Revenue Signals.
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
                                border: '1px solid rgba(45, 201, 199, 0.26)',
                                borderLeft: '3px solid var(--accent)',
                                borderRadius: '12px',
                            }}
                        >
                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                                <strong style={{ color: 'var(--accent)', fontWeight: 600 }}>
                                    This is a preview of your AI Salesperson Agent and Revenue Signals engine.
                                </strong>
                                <br />
                                It shows how HowAISees can guide product discovery, improve conversion readiness, and surface demand intelligence for campaign and AI-search optimization.
                            </p>
                        </div>

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
                                Create Your AI Salesperson Agent
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
