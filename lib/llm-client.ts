import OpenAI from 'openai';

// Lazy initialization to avoid build-time errors when env vars aren't available
let openrouterClient: OpenAI | null = null;

function getOpenRouterClient(): OpenAI {
    if (!openrouterClient) {
        if (!process.env.OPENROUTER_API_KEY) {
            throw new Error('OPENROUTER_API_KEY environment variable is not set');
        }
        openrouterClient = new OpenAI({
            baseURL: 'https://openrouter.ai/api/v1',
            apiKey: process.env.OPENROUTER_API_KEY,
            defaultHeaders: {
                "HTTP-Referer": process.env.VERCEL_URL 
                    ? `https://${process.env.VERCEL_URL}` 
                    : "http://localhost:3000",
                "X-Title": "ClearLine - AI Product Understanding Preview",
            },
        });
    }
    return openrouterClient;
}

export interface DiagnosticResponse {
    aiUnderstanding: string;
    issues: {
        missing: string[];
        ambiguity: string[];
        conflicts: string[];
        weakSignals: string[];
    };
    riskLevel: 'Low' | 'Medium' | 'High';
}

const DIAGNOSTIC_PROMPT = `You are an AI shopping assistant.
Based ONLY on the information provided below, explain how you understand this product.
Be confident ONLY where information is clear.
If something is missing, ambiguous, or conflicting, reflect that uncertainty.

Respond in valid JSON using the schema below.

Do NOT suggest improvements.
Do NOT optimize language.
Do NOT add marketing tone.

Required JSON Schema:
{
  "aiUnderstanding": "A confident, factual paragraph describing what the product is, who it is for, and when it would be recommended.",
  "issues": {
    "missing": ["Missing definitions or attributes"],
    "ambiguity": ["Unclear or vague statements"],
    "conflicts": ["Contradictory information"],
    "weakSignals": ["Claims without strong supporting data"]
  },
  "riskLevel": "Low | Medium | High"
}`;

/**
 * Filters raw extracted content to keep only product-specific signals.
 * Removes navigation noise, menu items, and site structure.
 * This is a preprocessing step before the main diagnostic analysis.
 */
export async function filterProductSignals(rawContent: string): Promise<string> {
    const FILTER_PROMPT = `From the extracted text below, keep ONLY information that directly describes the product itself.

Include:
- materials
- features
- usage
- fit
- sustainability claims
- variants
- price (if present)

Exclude:
- navigation labels
- menu items
- category links
- site structure
- unrelated cross-links

Return a clean, concise product-focused text block.
Do not rewrite or improve language.
Do not add new information.

---

Extracted Text:
${rawContent}`;

    try {
        console.log('Filtering product signals from raw content...');
        const completion = await getOpenRouterClient().chat.completions.create({
            model: 'google/gemma-3-12b-it:free',
            messages: [
                {
                    role: 'user',
                    content: FILTER_PROMPT,
                },
            ],
            temperature: 0.2, // Low temperature for consistent filtering
        });

        const filteredContent = completion.choices[0]?.message?.content?.trim();
        if (!filteredContent) {
            console.warn('Filter returned empty content, using original');
            return rawContent;
        }

        console.log(`Filtered content length: ${filteredContent.length} (original: ${rawContent.length})`);
        return filteredContent;
    } catch (error) {
        console.error('Signal filtering error:', error);
        console.warn('Falling back to unfiltered content');
        return rawContent; // Fallback to original if filtering fails
    }
}

export async function analyzeProductContent(
    productContent: string
): Promise<DiagnosticResponse> {
    try {
        console.log('Sending request to OpenRouter with model: google/gemma-3-12b-it:free');
        const completion = await getOpenRouterClient().chat.completions.create({
            model: 'google/gemma-3-12b-it:free',
            messages: [
                {
                    role: 'user',
                    content: `${DIAGNOSTIC_PROMPT}\n\n---\n\nProduct Information:\n\n${productContent}`,
                },
            ],
            // response_format: { type: 'json_object' }, // Removed as it might cause 400 with this model
            temperature: 0.3,
        });

        console.log('Received response from OpenRouter:', JSON.stringify(completion.choices[0]?.message, null, 2));
        let responseText = completion.choices[0]?.message?.content;
        if (!responseText) {
            throw new Error('No response from LLM');
        }

        // Clean up markdown code blocks if present
        responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        const parsed = JSON.parse(responseText);

        // Validate the response structure
        if (!parsed.aiUnderstanding || !parsed.issues || !parsed.riskLevel) {
            throw new Error('Invalid response structure from LLM');
        }

        return parsed as DiagnosticResponse;
    } catch (error: any) {
        console.error('LLM analysis error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        if (error.error) {
            console.error('OpenRouter error object:', JSON.stringify(error.error, null, 2));
        }
        throw new Error('Failed to analyze product content with AI');
    }
}
