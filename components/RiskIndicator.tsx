interface RiskIndicatorProps {
    riskLevel: 'Low' | 'Medium' | 'High';
}

export default function RiskIndicator({ riskLevel }: RiskIndicatorProps) {
    const config = {
        Low: {
            color: 'var(--green)',
            bg: 'var(--green-dim)',
            border: 'rgba(74, 222, 128, 0.15)',
            behavior: 'Likely to be recommended when relevant.',
            label: 'Low Risk',
        },
        Medium: {
            color: 'var(--amber)',
            bg: 'var(--amber-dim)',
            border: 'rgba(251, 191, 36, 0.15)',
            behavior: 'May be skipped unless explicitly queried.',
            label: 'Medium Risk',
        },
        High: {
            color: 'var(--red)',
            bg: 'var(--red-dim)',
            border: 'rgba(248, 113, 113, 0.15)',
            behavior: 'Unlikely to be recommended.',
            label: 'High Risk',
        },
    };

    const { color, bg, border, behavior, label } = config[riskLevel];

    return (
        <div
            style={{
                marginTop: '24px',
                padding: '24px',
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
            }}
        >
            <div
                style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: bg,
                    border: `1px solid ${border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                }}
            >
                <div
                    style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        background: color,
                    }}
                ></div>
            </div>
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <h3
                        style={{
                            fontSize: '15px',
                            fontWeight: 600,
                            color: color,
                        }}
                    >
                        {label} — Confidence Risk
                    </h3>
                </div>
                <p style={{ color: color, fontSize: '14px', fontWeight: 500 }}>
                    {behavior}
                </p>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '12px', marginTop: '4px' }}>
                    AI systems tend to favor clearer alternatives when confidence is low.
                </p>
            </div>
        </div>
    );
}
