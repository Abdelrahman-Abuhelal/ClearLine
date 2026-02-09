'use client';

import { useState } from 'react';
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

export default function PreviewPage() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState<DiagnosticResponse | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setResult(null);
        setLoading(true);

        try {
            const response = await fetch('/api/ai-preview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productUrl: url }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'An error occurred');
                return;
            }

            setResult(data);
        } catch (err) {
            setError('Failed to analyze product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        AI Product Understanding Preview
                    </h1>
                    <p className="text-lg text-gray-600">
                        Discover how AI systems currently interpret your product page
                    </p>
                </div>

                {/* Input Section */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <form onSubmit={handleSubmit}>
                        <label
                            htmlFor="product-url"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Product URL
                        </label>
                        <div className="flex gap-3">
                            <input
                                id="product-url"
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://example.com/product-page"
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                required
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? 'Analyzing...' : 'Preview AI Understanding'}
                            </button>
                        </div>
                    </form>

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <LoadingState />
                    </div>
                )}

                {/* Results Section */}
                {result && !loading && (
                    <div className="space-y-8">
                        {/* Section 1: AI Understanding */}
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                How AI Understands Your Product
                            </h2>
                            <p className="text-gray-600 text-sm mb-4">
                                This understanding is based on what AI systems can confidently extract from the page.
                            </p>
                            <p className="text-gray-700 leading-relaxed text-lg">
                                {result.aiUnderstanding}
                            </p>
                        </div>

                        {/* Section 2: Where Understanding Breaks */}
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Where This Understanding Breaks
                            </h2>

                            <div className="space-y-6">
                                <div className="mb-6">
                                    <h4 className="font-semibold text-lg mb-1 flex items-center gap-2">
                                        <span>❌</span>
                                        Missing or Unavailable to AI
                                    </h4>
                                    <p className="text-xs text-gray-600 italic mb-3">
                                        These details may exist on the site, but are not clearly exposed to AI systems.
                                    </p>
                                    {result.issues.missing.length > 0 ? (
                                        <ul className="space-y-2">
                                            {result.issues.missing.map((item, index) => (
                                                <li key={index} className="flex items-start gap-2">
                                                    <span className="text-gray-400 mt-1">•</span>
                                                    <span className="text-gray-700">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500 italic">
                                            No major issues detected in this area.
                                        </p>
                                    )}
                                </div>
                                <IssuesList
                                    title="Ambiguity"
                                    items={result.issues.ambiguity}
                                    icon="❓"
                                />
                                <IssuesList
                                    title="Conflicts"
                                    items={result.issues.conflicts}
                                    icon="⚠️"
                                />
                                <IssuesList
                                    title="Weak Signals"
                                    items={result.issues.weakSignals}
                                    icon="📉"
                                />
                            </div>

                            {/* Why AI Hesitates Section */}
                            <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-6 mt-6">
                                <h3 className="font-semibold text-gray-900 mb-3">Why AI Hesitates</h3>
                                <p className="text-sm text-gray-700 mb-2">Possible causes (not page-specific):</p>
                                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                                    <li>Product details embedded in navigation or non-semantic elements</li>
                                    <li>Missing structured data</li>
                                    <li>Overloaded pages with mixed intent content</li>
                                    <li>JavaScript-rendered specs</li>
                                    <li>Inconsistent terminology across sections</li>
                                </ul>
                            </div>

                            <RiskIndicator riskLevel={result.riskLevel} />
                        </div>

                        {/* Disclaimer */}
                        <div className="bg-gray-50 border-l-4 border-blue-500 rounded-lg p-6">
                            <p className="text-gray-700">
                                <strong className="font-semibold">This is a diagnostic preview.</strong>
                                <br />
                                It shows how AI systems currently interpret your product — not how to optimize it.
                            </p>
                        </div>

                        {/* Debug Section */}
                        {(result as any)._debug && (
                            <details className="bg-gray-100 rounded-lg p-6">
                                <summary className="cursor-pointer font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                                    🔍 View raw extracted signals (for debugging)
                                </summary>
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-2">Extracted Signals:</h4>
                                        <pre className="bg-white p-4 rounded border border-gray-300 overflow-x-auto text-sm">
                                            {JSON.stringify((result as any)._debug.extractedSignals, null, 2)}
                                        </pre>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-2">Normalized Content (Before Filtering):</h4>
                                        <pre className="bg-white p-4 rounded border border-gray-300 overflow-x-auto text-sm whitespace-pre-wrap">
                                            {(result as any)._debug.normalizedContent}
                                        </pre>
                                    </div>
                                    {(result as any)._debug.filteredContent && (
                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-2">Filtered Content (After AI Preprocessing):</h4>
                                            <pre className="bg-white p-4 rounded border border-gray-300 overflow-x-auto text-sm whitespace-pre-wrap">
                                                {(result as any)._debug.filteredContent}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </details>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
