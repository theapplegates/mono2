
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const createPrompt = (readmeContent: string, format: 'table' | 'list'): string => {
  const commonInstructions = `
You are an expert GitHub README writer specializing in making technical documentation visually engaging, scannable, and compelling. Your task is to take a plain Markdown list of features and enhance it.

RULES:
1.  Analyze the input, which is a Markdown list under a header like "## Key Features".
2.  For each list item, you must:
    a. Make the feature name bold.
    b. Add one or two relevant emojis right after the feature name.
    c. Write a concise, compelling description for the feature.
3.  Also add a relevant emoji to the main header (e.g., "## Key Features" becomes "## ✨ Key Features").
4.  Preserve the original feature names. Do not rephrase them.
5.  Return ONLY the modified Markdown content. Do not include any explanations, greetings, or markdown code fences like \`\`\`markdown.
`;

  if (format === 'list') {
    return `
${commonInstructions}
6.  Format the output as a bulleted list, where each line looks like this: \`- **Feature Name** 🚀 – Compelling description.\`

---
EXAMPLE (LIST FORMAT)
---
INPUT:
## Key Features
- Astro v5 Fast
- Tailwind v4
- Accessible, semantic HTML markup

OUTPUT:
## ✨ Key Features
- **Astro v5 Fast** 🚀 – Blazing-fast static site generation.
- **Tailwind v4** 🎨 – Utility-first styling at your fingertips.
- **Accessible, semantic HTML markup** ♿️ – WCAG-compliant, screen-reader friendly.
---

Now, transform the following README content into the ENHANCED LIST format:

${readmeContent}
`;
  }

  if (format === 'table') {
    return `
${commonInstructions}
6.  Format the output as a three-column Markdown table with headers: "Feature", "Emoji 💡", and "Description".

---
EXAMPLE (TABLE FORMAT)
---
INPUT:
## Key Features
- Astro v5 Fast
- Tailwind v4
- Accessible, semantic HTML markup

OUTPUT:
## ✨ Key Features

| Feature | Emoji 💡 | Description |
|---|---|---|
| **Astro v5 Fast** | 🚀 | Blazing-fast static site generation. |
| **Tailwind v4** | 🎨 | Utility-first styling at your fingertips. |
| **Accessible, semantic HTML markup** | ♿️ | WCAG-compliant, screen-reader friendly. |
---

Now, transform the following README content into the ENHANCED TABLE format:

${readmeContent}
`;
  }

  // Fallback just in case
  return readmeContent;
};

export const emojifyReadme = async (readmeContent: string, format: 'table' | 'list'): Promise<string> => {
    try {
        const prompt = createPrompt(readmeContent, format);
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.4,
            }
        });

        // The model should return clean markdown, but we trim just in case.
        let text = response.text.trim();
        
        // Sometimes the model might still wrap the output in markdown fences
        if (text.startsWith('```markdown')) {
            text = text.substring(10);
        }
        if (text.endsWith('```')) {
            text = text.substring(0, text.length - 3);
        }

        return text.trim();

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred while communicating with the Gemini API.");
    }
};
