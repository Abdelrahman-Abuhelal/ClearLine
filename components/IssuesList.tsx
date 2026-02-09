export interface IssuesListProps {
    title: string;
    subtitle?: string;
    items: string[];
    icon: string;
}

export default function IssuesList({ title, subtitle, items, icon }: IssuesListProps) {
    const iconConfig: Record<string, { color: string; bg: string; symbol: string }> = {
        missing: { color: 'var(--red)', bg: 'var(--red-dim)', symbol: '\u2715' },
        ambiguity: { color: 'var(--amber)', bg: 'var(--amber-dim)', symbol: '?' },
        conflicts: { color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)', symbol: '!' },
        weak: { color: 'var(--blue)', bg: 'var(--blue-dim)', symbol: '\u2193' },
    };

    const cfg = iconConfig[icon] || { color: 'var(--text-tertiary)', bg: 'var(--bg-surface)', symbol: icon };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div
                    style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        background: cfg.bg,
                        color: cfg.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 700,
                        flexShrink: 0,
                    }}
                >
                    {cfg.symbol}
                </div>
                <h4
                    style={{
                        fontWeight: 600,
                        fontSize: '14px',
                        color: 'var(--text-primary)',
                    }}
                >
                    {title}
                </h4>
            </div>
            {subtitle && (
                <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '10px', paddingLeft: '34px' }}>
                    {subtitle}
                </p>
            )}
            {items.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '34px' }}>
                    {items.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                padding: '10px 14px',
                                background: 'var(--bg-surface)',
                                borderRadius: '8px',
                                borderLeft: `3px solid ${cfg.color}`,
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                                fontFamily: "'JetBrains Mono', monospace",
                                lineHeight: 1.5,
                            }}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            ) : (
                <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', fontStyle: 'italic', paddingLeft: '34px' }}>
                    No major issues detected in this area.
                </p>
            )}
        </div>
    );
}
