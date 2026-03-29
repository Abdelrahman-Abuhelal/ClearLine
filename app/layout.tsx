import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'HowAiSees - AI Sales Funnel Platform',
    description:
        'Turn products into AI sales funnels. Create AI-powered sales experiences, share links anywhere, and track what converts.',
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
