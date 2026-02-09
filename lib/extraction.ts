import * as cheerio from 'cheerio';

export interface ProductSignals {
    title: string;
    metaDescription: string;
    description: string;
    bulletPoints: string[];
    price: string;
    variants: string[];
    structuredData: any;
}

export async function fetchProductPage(url: string): Promise<string> {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch page: ${response.status}`);
        }

        return await response.text();
    } catch (error) {
        console.error('Fetch error:', error);
        throw new Error('Unable to fetch product page. Please check the URL.');
    }
}

export function extractProductSignals(html: string): ProductSignals {
    const $ = cheerio.load(html);

    // Extract title
    const title = $('title').text().trim() ||
        $('h1').first().text().trim() ||
        'No title found';

    // Extract meta description
    const metaDescription = $('meta[name="description"]').attr('content')?.trim() ||
        $('meta[property="og:description"]').attr('content')?.trim() ||
        '';

    // Extract main product description
    const description =
        $('[class*="description"]').first().text().trim() ||
        $('[id*="description"]').first().text().trim() ||
        $('article').first().text().trim() ||
        $('main p').first().text().trim() ||
        '';

    // Extract bullet points / specs
    const bulletPoints: string[] = [];
    $('ul li, ol li').each((_, el) => {
        const text = $(el).text().trim();
        if (text && text.length < 200) {
            bulletPoints.push(text);
        }
    });

    // Extract price
    const price =
        $('[class*="price"]').first().text().trim() ||
        $('[id*="price"]').first().text().trim() ||
        $('[itemprop="price"]').first().text().trim() ||
        '';

    // Extract variants (colors, sizes, etc.)
    const variants: string[] = [];
    $('select option, [class*="variant"] button, [class*="option"] button').each((_, el) => {
        const text = $(el).text().trim();
        if (text && text.length < 50) {
            variants.push(text);
        }
    });

    // Extract structured data (JSON-LD)
    let structuredData: any = null;
    $('script[type="application/ld+json"]').each((_, el) => {
        try {
            const data = JSON.parse($(el).html() || '{}');
            if (data['@type'] === 'Product' || data['@type'] === 'ItemList') {
                structuredData = data;
            }
        } catch (e) {
            // Ignore parsing errors
        }
    });

    return {
        title,
        metaDescription,
        description: description.substring(0, 1000), // Limit length
        bulletPoints: bulletPoints.slice(0, 10), // Limit to 10 items
        price,
        variants: variants.slice(0, 10), // Limit to 10 variants
        structuredData,
    };
}

export function normalizeProductContent(signals: ProductSignals): string {
    let content = '';

    content += `Title: ${signals.title}\n\n`;

    if (signals.metaDescription) {
        content += `Meta Description: ${signals.metaDescription}\n\n`;
    }

    if (signals.description) {
        content += `Product Description:\n${signals.description}\n\n`;
    }

    if (signals.bulletPoints.length > 0) {
        content += `Key Features:\n${signals.bulletPoints.map(bp => `- ${bp}`).join('\n')}\n\n`;
    }

    if (signals.price) {
        content += `Price: ${signals.price}\n\n`;
    }

    if (signals.variants.length > 0) {
        content += `Available Variants:\n${signals.variants.map(v => `- ${v}`).join('\n')}\n\n`;
    }

    if (signals.structuredData) {
        content += `Structured Data:\n${JSON.stringify(signals.structuredData, null, 2)}\n\n`;
    }

    return content.trim();
}

export function isValidProductUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
}
