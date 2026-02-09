import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'ClearLine — AI Product Understanding Preview',
    description:
        'See how AI actually understands your product. Discover what AI systems interpret, where understanding breaks, and why they hesitate to recommend.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body suppressHydrationWarning>{children}</body>
        </html>
    );
}
