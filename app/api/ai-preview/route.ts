import { NextRequest, NextResponse } from 'next/server';
import {
    fetchProductPage,
    extractProductSignals,
    normalizeProductContent,
    isValidProductUrl,
} from '@/lib/extraction';
import { analyzeProductContent, filterProductSignals } from '@/lib/llm-client';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { productUrl } = body;

        // Validate input
        if (!productUrl || typeof productUrl !== 'string') {
            return NextResponse.json(
                { error: 'Product URL is required' },
                { status: 400 }
            );
        }

        if (!isValidProductUrl(productUrl)) {
            return NextResponse.json(
                { error: 'Invalid URL format' },
                { status: 400 }
            );
        }

        // Fetch and extract product signals
        let html: string;
        try {
            console.log(`Fetching product page: ${productUrl}`);
            html = await fetchProductPage(productUrl);
            console.log(`Successfully fetched HTML (length: ${html.length})`);
        } catch (error) {
            console.error('Error fetching product page:', error);
            return NextResponse.json(
                {
                    error:
                        'This preview works best with physical product pages that include clear descriptions and specifications.',
                },
                { status: 400 }
            );
        }

        const signals = extractProductSignals(html);
        console.log('Extracted signals:', {
            title: signals.title,
            descriptionLength: signals.description.length,
            bulletsCount: signals.bulletPoints.length,
            price: signals.price
        });

        // Check if we have enough content
        if (!signals.title && !signals.description && signals.bulletPoints.length === 0) {
            return NextResponse.json(
                {
                    error:
                        'This preview works best with physical product pages that include clear descriptions and specifications.',
                },
                { status: 400 }
            );
        }

        // Normalize content for LLM
        const normalizedContent = normalizeProductContent(signals);

        // Filter out navigation noise and keep only product-specific signals
        const filteredContent = await filterProductSignals(normalizedContent);

        // Analyze with LLM
        const analysis = await analyzeProductContent(filteredContent);

        return NextResponse.json({
            ...analysis,
            _debug: {
                extractedSignals: signals,
                normalizedContent: normalizedContent.substring(0, 500) + '...', // First 500 chars
                filteredContent: filteredContent.substring(0, 500) + '...' // Show filtered version too
            }
        });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'An error occurred while analyzing the product page' },
            { status: 500 }
        );
    }
}
