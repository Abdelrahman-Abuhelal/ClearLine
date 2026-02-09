export default function LoadingState() {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '64px 0',
            }}
        >
            <div style={{ position: 'relative' }}>
                <div
                    style={{
                        width: '48px',
                        height: '48px',
                        border: '3px solid var(--border)',
                        borderTopColor: 'var(--accent)',
                        borderRadius: '50%',
                    }}
                    className="animate-spin"
                ></div>
            </div>
            <p
                style={{
                    marginTop: '24px',
                    fontSize: '15px',
                    color: 'var(--text-secondary)',
                }}
            >
                Analyzing how AI understands this product...
            </p>
            <div
                style={{
                    marginTop: '16px',
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                }}
            >
                <div
                    style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: 'var(--accent)',
                        animation: 'pulse-dot 2s ease-in-out infinite',
                    }}
                ></div>
                <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                    Extracting signals, filtering noise, running diagnosis
                </span>
            </div>
        </div>
    );
}
