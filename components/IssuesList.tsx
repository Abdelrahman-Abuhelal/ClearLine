interface IssuesListProps {
    title: string;
    items: string[];
    icon: string;
}

export default function IssuesList({ title, items, icon }: IssuesListProps) {
    return (
        <div className="mb-6">
            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <span>{icon}</span>
                {title}
            </h4>
            {items.length > 0 ? (
                <ul className="space-y-2">
                    {items.map((item, index) => (
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
    );
}
