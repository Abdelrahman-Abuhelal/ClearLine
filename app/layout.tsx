import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'AI Product Understanding Preview',
    description: 'Discover how AI systems currently interpret your product page',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body suppressHydrationWarning>{children}</body>
        </html>
    );
}
