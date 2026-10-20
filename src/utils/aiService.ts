/**
 * FocusVerse AI Notebook Service
 * Clean abstraction supporting live LLM API (Google Gemini / OpenAI compatible)
 * with a high-fidelity local semantic note analyzer fallback.
 */

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
  contextNoteTitle?: string;
  sourceType: 'LIVE_API' | 'LOCAL_ENGINE';
}

export interface GeneratedCardDraft {
  id: string;
  question: string;
  answer: string;
  approved: boolean;
}

export interface AIProviderConfig {
  apiKey: string;
  provider: 'gemini' | 'openai' | 'groq';
  model: string;
}

const STORAGE_KEY_AI_CONFIG = 'focusverse_ai_config';

export class AIService {
  public getConfig(): AIProviderConfig {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AI_CONFIG);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return {
      apiKey: '',
      provider: 'gemini',
      model: 'gemini-1.5-flash',
    };
  }

  public saveConfig(config: AIProviderConfig) {
    try {
      localStorage.setItem(STORAGE_KEY_AI_CONFIG, JSON.stringify(config));
    } catch (_) {}
  }

  public hasLiveApiKey(): boolean {
    const config = this.getConfig();
    return Boolean(config.apiKey && config.apiKey.trim().length > 5);
  }

  /**
   * Ask question about a specific note with contextual understanding
   */
  public async askQuestion(
    noteContent: string,
    noteTitle: string,
    question: string,
    history: AIChatMessage[] = []
  ): Promise<{ answer: string; sourceType: 'LIVE_API' | 'LOCAL_ENGINE'; draftCards?: GeneratedCardDraft[] }> {
    const config = this.getConfig();

    // 1. If valid Gemini API key is configured, call live API
    if (this.hasLiveApiKey()) {
      try {
        const liveResult = await this.callGeminiAPI(config.apiKey, config.model, noteTitle, noteContent, question, history);
        return {
          answer: liveResult,
          sourceType: 'LIVE_API',
        };
      } catch (err: any) {
        console.warn('Live API request failed, falling back to local semantic analyzer:', err);
        // Fall back gracefully with clear explanation
        const local = this.generateLocalSemanticAnswer(noteTitle, noteContent, question);
        return {
          answer: `[API Notice: ${err.message || 'Network/quota error'}. Switched to local analyzer]\n\n${local.answer}`,
          sourceType: 'LOCAL_ENGINE',
          draftCards: local.draftCards,
        };
      }
    }

    // 2. Local Intelligent Semantic Analyzer fallback
    const localResult = this.generateLocalSemanticAnswer(noteTitle, noteContent, question);
    return {
      answer: localResult.answer,
      sourceType: 'LOCAL_ENGINE',
      draftCards: localResult.draftCards,
    };
  }

  /**
   * Call Google Gemini REST API safely without third-party heavy SDKs
   */
  private async callGeminiAPI(
    apiKey: string,
    model: string,
    noteTitle: string,
    noteContent: string,
    question: string,
    history: AIChatMessage[]
  ): Promise<string> {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-1.5-flash'}:generateContent?key=${apiKey.trim()}`;

    const systemPrompt = `You are a knowledgeable, disciplined retro-RPG study companion and academic tutor in FocusVerse.
The user is studying a note titled: "${noteTitle}".

CURRENT NOTE CONTENT:
\"\"\"
${noteContent || '(The note is currently empty)'}
\"\"\"

Guidelines:
1. Ground your answers primarily on the note contents provided above.
2. If the note does not contain enough info to fully answer, state clearly: "Based on your notes..." and then supply helpful academic guidance while distinguishing it from their notes.
3. Keep the tone encouraging, structured, and easy to review with Markdown formatting.
4. If asked to generate flashcards or quizzes, provide clean Question/Answer pairs.`;

    const contents = [
      {
        role: 'user',
        parts: [{ text: `${systemPrompt}\n\nUser Question: ${question}` }],
      },
    ];

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents }),
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      const msg = errorJson.error?.message || `HTTP ${response.status} ${response.statusText}`;
      throw new Error(msg);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('Empty response received from Gemini API');
    }

    return candidateText;
  }

  /**
   * Local Semantic Note Analyzer:
   * Extracts key bullet points, formulas, definitions, and questions deterministically.
   */
  public generateLocalSemanticAnswer(
    noteTitle: string,
    noteContent: string,
    question: string
  ): { answer: string; draftCards?: GeneratedCardDraft[] } {
    const trimmed = (noteContent || '').trim();
    const lowerQ = question.toLowerCase();

    if (!trimmed) {
      return {
        answer: `Your note "${noteTitle}" is currently empty. Add some notes or concepts in the editor, and I'll analyze, summarize, or quiz you on them!`,
      };
    }

    const lines = trimmed.split('\n').map((l) => l.trim()).filter(Boolean);
    const headings = lines.filter((l) => l.startsWith('#')).map((l) => l.replace(/^#+\s*/, ''));
    const bullets = lines.filter((l) => l.startsWith('-') || l.startsWith('*')).map((l) => l.replace(/^[-*]\s*/, ''));
    const sentences = trimmed
      .replace(/#+\s*[^\n]+/g, '')
      .split(/(?<=[.?!])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 10);

    // 1. Generate Flashcards query
    if (lowerQ.includes('flashcard') || lowerQ.includes('card') || lowerQ.includes('deck')) {
      const cards: GeneratedCardDraft[] = [];
      const sources = bullets.length >= 2 ? bullets : sentences.slice(0, 5);

      sources.forEach((item, idx) => {
        if (item.includes(':')) {
          const [term, def] = item.split(':');
          cards.push({
            id: `draft-${Date.now()}-${idx}`,
            question: `What is the definition or role of ${term.trim()}?`,
            answer: def.trim(),
            approved: true,
          });
        } else {
          cards.push({
            id: `draft-${Date.now()}-${idx}`,
            question: `Key Concept (${noteTitle}): ${item.slice(0, 45)}...?`,
            answer: item,
            approved: true,
          });
        }
      });

      if (cards.length === 0) {
        cards.push({
          id: `draft-${Date.now()}-0`,
          question: `What is the core takeaway of "${noteTitle}"?`,
          answer: trimmed.slice(0, 160),
          approved: true,
        });
      }

      return {
        answer: `### 🃏 Flashcards Generated from "${noteTitle}"\n\nI have extracted **${cards.length} key active recall question/answer pairs** from your note. You can review and approve them below to add them directly into your spaced repetition revision deck!`,
        draftCards: cards,
      };
    }

    // 2. Summary query
    if (lowerQ.includes('summar') || lowerQ.includes('brief') || lowerQ.includes('overview')) {
      return {
        answer: `### 📋 Summary of "${noteTitle}"\n\n**Core Topics Covered:**\n${
          headings.length > 0 ? headings.map((h) => `- **${h}**`).join('\n') : `- General overview of ${noteTitle}`
        }\n\n**Key Takeaways:**\n${
          bullets.length > 0
            ? bullets.slice(0, 4).map((b) => `• ${b}`).join('\n')
            : sentences.slice(0, 3).map((s) => `• ${s}`).join('\n')
        }\n\n*Estimated study density:* ${sentences.length} concepts, ${trimmed.split(/\s+/).length} words.`,
      };
    }

    // 3. Practice questions or Quiz query
    if (lowerQ.includes('quiz') || lowerQ.includes('question') || lowerQ.includes('practice') || lowerQ.includes('exam')) {
      const qList: string[] = [];
      if (bullets.length > 0) {
        bullets.slice(0, 4).forEach((b, i) => {
          qList.push(`**Q${i + 1}:** How does "${b.slice(0, 40)}..." apply in practice?`);
        });
      } else {
        qList.push(`**Q1:** What is the primary thesis or objective of "${noteTitle}"?`);
        qList.push(`**Q2:** Identify the most critical constraint or mechanism described in this note.`);
        qList.push(`**Q3:** How would you explain this note's concepts to a beginner without using technical jargon?`);
      }

      return {
        answer: `### 🎯 Practice Quiz for "${noteTitle}"\n\nTest your active recall against these questions derived from your notes:\n\n${qList.join(
          '\n\n'
        )}\n\n*Tip: Try answering from memory before checking the note text!*`,
      };
    }

    // 4. Simple explanation / Beginner query
    if (lowerQ.includes('simple') || lowerQ.includes('beginner') || lowerQ.includes('explain')) {
      return {
        answer: `### 💡 Simple Explanation of "${noteTitle}"\n\nLet's break this down into plain English:\n\n1. **The Big Picture:** This note is about organizing and mastering **${noteTitle}**.\n2. **The Key Building Blocks:**\n${
          bullets.length > 0
            ? bullets.slice(0, 3).map((b, i) => `   - **Step ${i + 1}:** ${b}`).join('\n')
            : `   - Focuses on: ${sentences[0] || trimmed.slice(0, 100)}`
        }\n3. **Practical Analogy:** Think of this like a puzzle where each concept connects directly to your overall study goal.\n\n*Would you like me to turn this into 3 flashcards or quiz you?*`,
      };
    }

    // Default responsive synthesis
    return {
      answer: `### 🧠 Analysis of "${noteTitle}"\n\nRegarding your question: *"${question}"*\n\nBased on the contents of your current note:\n- **Direct Match:** Found ${
        bullets.length
      } bullet points and ${sentences.length} sentences.\n- **Relevant Highlights:**\n${
        lines.slice(0, 4).map((l) => `> ${l}`).join('\n')
      }\n\n*Need a deeper breakdown? Ask me to "Explain this in simple terms", "Summarize key concepts", or "Turn this note into flashcards"!*`,
    };
  }
}

export const aiService = new AIService();
