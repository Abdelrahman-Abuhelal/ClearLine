interface RiskIndicatorProps {
    riskLevel: 'Low' | 'Medium' | 'High';
}

export default function RiskIndicator({ riskLevel }: RiskIndicatorProps) {
    const config = {
        Low: {
            emoji: '🟢',
            color: 'text-green-600',
            bg: 'bg-green-50',
            border: 'border-green-200',
        },
        Medium: {
            emoji: '🟡',
            color: 'text-yellow-600',
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
        },
        High: {
            emoji: '🔴',
            color: 'text-red-600',
            bg: 'bg-red-50',
            border: 'border-red-200',
        },
    };

    const { emoji, color, bg, border } = config[riskLevel];

    return (
        <div className={`${bg} ${border} border-2 rounded-lg p-6 mt-8`}>
            <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{emoji}</span>
                <h3 className={`text-xl font-semibold ${color}`}>
                    {riskLevel} Confidence Risk
                </h3>
            </div>
            <p className="text-gray-700 mt-2">
                AI systems tend to favor clearer alternatives when confidence is low.
            </p>
        </div>
    );
}
