import { storage } from '../db/storage.js';

// English stop words for robust TF-IDF retrieval
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can',
  'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down',
  'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t',
  'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself',
  'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it',
  'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not',
  'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over',
  'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some',
  'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there',
  'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through',
  'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re',
  'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which',
  'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you',
  'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves', 'explain', 'what',
  'how', 'why', 'give', 'describe', 'define', 'discuss', 'write'
]);

function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 2 && !STOP_WORDS.has(token));
}

function computeTF(tokens) {
  const tf = {};
  if (!tokens.length) return tf;
  for (const t of tokens) {
    tf[t] = (tf[t] || 0) + 1;
  }
  for (const t in tf) {
    tf[t] = tf[t] / tokens.length;
  }
  return tf;
}

export const ragService = {
  /**
   * Split document text into coherent, overlapping chunks
   */
  chunkText(text, docMetadata) {
    if (!text || !text.trim()) return [];

    const paragraphs = text.split(/\n\s*\n+/).filter(p => p.trim().length > 20);
    const chunks = [];
    let currentChunk = '';
    let chunkIndex = 0;
    const approxPageRatio = docMetadata.pageCount ? (docMetadata.pageCount / Math.max(paragraphs.length, 1)) : 1;

    for (let i = 0; i < paragraphs.length; i++) {
      const p = paragraphs[i].trim();
      if ((currentChunk + '\n\n' + p).split(/\s+/).length > 350) {
        if (currentChunk.trim().length > 30) {
          const estimatedPage = Math.min(
            docMetadata.pageCount || 1,
            Math.max(1, Math.round(i * approxPageRatio) || 1)
          );
          chunks.push({
            id: `chunk-${docMetadata.id}-${chunkIndex}`,
            documentId: docMetadata.id,
            subjectCode: docMetadata.subjectCode,
            unitNumber: docMetadata.unitNumber,
            chunkIndex,
            pageNumber: estimatedPage,
            content: currentChunk.trim()
          });
          chunkIndex++;
        }
        // Retain roughly 60 words overlap
        const words = currentChunk.split(/\s+/);
        const overlap = words.slice(-60).join(' ');
        currentChunk = overlap + '\n\n' + p;
      } else {
        currentChunk = currentChunk ? `${currentChunk}\n\n${p}` : p;
      }
    }

    if (currentChunk.trim().length > 30) {
      chunks.push({
        id: `chunk-${docMetadata.id}-${chunkIndex}`,
        documentId: docMetadata.id,
        subjectCode: docMetadata.subjectCode,
        unitNumber: docMetadata.unitNumber,
        chunkIndex,
        pageNumber: docMetadata.pageCount || 1,
        content: currentChunk.trim()
      });
    }

    return chunks;
  },

  /**
   * Retrieve relevant chunks using TF-IDF cosine similarity vector search
   */
  async retrieveRelevantChunks(query, { subjectCode, unitNumber, topK = 4 } = {}) {
    const allChunks = await storage.getAllChunks({ subjectCode, unitNumber });
    if (!allChunks || allChunks.length === 0) {
      return [];
    }

    const queryTokens = tokenize(query);
    if (queryTokens.length === 0) {
      // If query is very short or all stop words, take raw words
      queryTokens.push(...query.toLowerCase().split(/\s+/).filter(w => w.length > 2));
    }
    const queryTF = computeTF(queryTokens);

    // Compute IDF across corpus
    const df = {};
    for (const chunk of allChunks) {
      const seen = new Set(tokenize(chunk.content));
      for (const t of seen) {
        df[t] = (df[t] || 0) + 1;
      }
    }

    const N = allChunks.length;
    const idf = {};
    for (const t in df) {
      idf[t] = Math.log(1 + (N / (df[t] || 1)));
    }

    // Score each chunk
    const scored = allChunks.map(chunk => {
      const chunkTokens = tokenize(chunk.content);
      const chunkTF = computeTF(chunkTokens);
      let dotProduct = 0;
      let queryNorm = 0;
      let chunkNorm = 0;

      for (const t of queryTokens) {
        const qVal = (queryTF[t] || 0) * (idf[t] || 1);
        const cVal = (chunkTF[t] || 0) * (idf[t] || 1);
        dotProduct += qVal * cVal;
      }

      for (const t in queryTF) {
        const val = (queryTF[t] || 0) * (idf[t] || 1);
        queryNorm += val * val;
      }
      for (const t in chunkTF) {
        const val = (chunkTF[t] || 0) * (idf[t] || 1);
        chunkNorm += val * val;
      }

      let similarity = 0;
      if (queryNorm > 0 && chunkNorm > 0) {
        similarity = dotProduct / (Math.sqrt(queryNorm) * Math.sqrt(chunkNorm));
      }

      // Bonus boost if chunk subject or unit matches exactly
      if (subjectCode && chunk.subjectCode === subjectCode) {
        similarity *= 1.15;
      }
      if (unitNumber && chunk.unitNumber === unitNumber) {
        similarity *= 1.25;
      }

      return {
        ...chunk,
        similarityScore: Math.round(similarity * 1000) / 1000
      };
    });

    // Filter by minimum relevance threshold and sort descending
    return scored
      .filter(item => item.similarityScore > 0.04)
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, topK);
  },

  /**
   * Check LLM configuration status
   */
  getLlmStatus() {
    const hasGemini = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim());
    const hasOpenAI = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim());

    if (hasGemini) {
      return { isLive: true, provider: 'Google Gemini', model: 'gemini-1.5-flash' };
    }
    if (hasOpenAI) {
      return { isLive: true, provider: 'OpenAI', model: 'gpt-4o-mini' };
    }
    return {
      isLive: false,
      provider: 'Demo Engine',
      model: 'PVPSIT-Verified-Knowledge-Base',
      notice: 'DEMO MODE: LLM API key not configured. Responses are grounded using verified course materials and labeled as demo answers.'
    };
  },

  /**
   * Generate grounded answer via live LLM or verified demo response
   */
  async generateAnswer({ query, subjectCode, unitNumber, conversationHistory = [] }) {
    const llmStatus = this.getLlmStatus();
    const retrievedChunks = await this.retrieveRelevantChunks(query, { subjectCode, unitNumber });

    // Look up document titles for sources
    const documents = await storage.getDocuments();
    const docMap = new Map(documents.map(d => [d.id, d]));

    const enrichedSources = retrievedChunks.map(chunk => {
      const doc = docMap.get(chunk.documentId);
      return {
        documentId: chunk.documentId,
        documentTitle: doc ? doc.title : 'Uploaded Course Material',
        subjectName: doc ? doc.subjectName : chunk.subjectCode,
        subjectCode: chunk.subjectCode,
        unitNumber: chunk.unitNumber,
        pageNumber: chunk.pageNumber || 1,
        snippet: chunk.content.slice(0, 240) + '...',
        similarityScore: chunk.similarityScore
      };
    });

    // Case 1: No relevant materials found
    if (retrievedChunks.length === 0) {
      const notFoundMessage = `### Supporting Material Not Found in Course Documents\n\nI searched the indexed course materials for **${subjectCode || 'selected subjects'}** (${unitNumber || 'All Units'}), but **no sufficiently relevant material** was found to accurately answer your question:\n\n> "${query}"\n\n**Academic Recommendation:**\n- Verify that the relevant lecture notes, textbook chapters, or unit handouts have been uploaded in the **Faculty Upload** portal.\n- Check if the question falls under a different unit or syllabus regulation (e.g., PVP20).\n- Rephrase using standard PVPSIT engineering terminology.\n\n*Note: StudyMateAI does not fabricate citations or hypothesize without verified reference texts.*`;

      await storage.logChatAudit({
        userQuery: query,
        aiResponse: notFoundMessage,
        sources: [],
        mode: llmStatus.isLive ? 'live_rag_no_match' : 'demo_no_match',
        subjectCode
      });

      return {
        answer: notFoundMessage,
        sources: [],
        mode: llmStatus.isLive ? 'live_rag' : 'demo',
        isGrounded: false,
        llmProvider: llmStatus.provider
      };
    }

    // Build context string from retrieved chunks
    const contextText = retrievedChunks.map((c, i) => {
      const doc = docMap.get(c.documentId);
      return `[SOURCE ${i + 1} | Document: "${doc?.title || 'Course Material'}" | Course: ${c.subjectCode} | Unit: ${c.unitNumber} | Page: ${c.pageNumber || 1}]\n${c.content}`;
    }).join('\n\n---\n\n');

    const systemPrompt = `You are StudyMateAI, an academic study assistant for engineering students at Prasad V. Potluri Siddhartha Institute of Technology (PVPSIT).
Answer using the supplied retrieved course materials. Do not invent facts, references, programming syntax, or source citations. Clearly distinguish what is supported by the documents from any uncertainty. If the provided material does not sufficiently answer the question, say so and ask the student to provide relevant material. Prefer the selected course and unit. Keep explanations appropriate for engineering students preparing for examinations. Cite your sources using [Document Name, Unit X, Page Y] notation. Format with markdown headings, bullet points, and code snippets where appropriate.`;

    // Case 2: Live LLM Mode (Gemini or OpenAI)
    if (llmStatus.isLive) {
      try {
        let answerText = '';

        if (llmStatus.provider === 'Google Gemini') {
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
          const response = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    { text: systemPrompt },
                    { text: `RETRIEVED COURSE MATERIALS:\n${contextText}\n\nSTUDENT QUESTION:\n${query}` }
                  ]
                }
              ],
              generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 1200
              }
            })
          });

          if (!response.ok) {
            const errBody = await response.text();
            throw new Error(`Gemini API returned status ${response.status}: ${errBody}`);
          }
          const result = await response.json();
          answerText = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
        } else if (llmStatus.provider === 'OpenAI') {
          const openAiUrl = 'https://api.openai.com/v1/chat/completions';
          const response = await fetch(openAiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              temperature: 0.2,
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `RETRIEVED COURSE MATERIALS:\n${contextText}\n\nSTUDENT QUESTION:\n${query}` }
              ]
            })
          });

          if (!response.ok) {
            const errBody = await response.text();
            throw new Error(`OpenAI API returned status ${response.status}: ${errBody}`);
          }
          const result = await response.json();
          answerText = result.choices?.[0]?.message?.content || '';
        }

        await storage.logChatAudit({
          userQuery: query,
          aiResponse: answerText,
          sources: enrichedSources,
          mode: 'live_rag',
          subjectCode
        });

        return {
          answer: answerText,
          sources: enrichedSources,
          mode: 'live_rag',
          isGrounded: true,
          llmProvider: llmStatus.provider
        };
      } catch (err) {
        console.error('[RAG Service] Live LLM call failed:', err.message);
        // Fall back gracefully to grounded demo synthesis without pretending it was live
        const fallbackAnswer = generateGroundedDemoAnswer(query, retrievedChunks, docMap, enrichedSources, true);
        return {
          answer: fallbackAnswer,
          sources: enrichedSources,
          mode: 'demo_fallback',
          isGrounded: true,
          llmProvider: 'Demo Fallback (Live LLM Error: ' + err.message + ')'
        };
      }
    }

    // Case 3: Transparent DEMO MODE (Verified Grounded Response)
    const demoAnswer = generateGroundedDemoAnswer(query, retrievedChunks, docMap, enrichedSources, false);

    await storage.logChatAudit({
      userQuery: query,
      aiResponse: demoAnswer,
      sources: enrichedSources,
      mode: 'demo',
      subjectCode
    });

    return {
      answer: demoAnswer,
      sources: enrichedSources,
      mode: 'demo',
      isGrounded: true,
      llmProvider: 'Demo Mode (Knowledge-Base Grounded)'
    };
  }
};

/**
 * Synthesizes a structured academic answer directly from verified retrieved text chunks.
 * Explicitly displays a clear banner to ensure complete transparency.
 */
function generateGroundedDemoAnswer(query, chunks, docMap, sources, isApiFallback) {
  const primaryChunk = chunks[0];
  const primaryDoc = docMap.get(primaryChunk.documentId);
  const docTitle = primaryDoc ? primaryDoc.title : 'Official Course Material';

  const demoNotice = isApiFallback
    ? `> ⚠️ **Notice**: The live LLM endpoint encountered a connectivity issue. Displaying grounded response synthesized directly from indexed course materials.`
    : `> ℹ️ **DEMO MODE**: Grounded response synthesized directly from indexed PVPSIT course notes. Configure \`GEMINI_API_KEY\` or \`OPENAI_API_KEY\` in \`server/.env\` to activate live LLM synthesis.`;

  // Format key excerpt points from chunks
  const points = chunks.map(c => c.content).join('\n\n');

  return `${demoNotice}

### 📘 Academic Explanation: ${primaryChunk.subjectCode} — ${primaryChunk.unitNumber}

Based on the verified course documents for **${primaryChunk.subjectCode}** (*${docTitle}*):

${points}

---

### 🔍 Grounded Reference Summary
- **Primary Source Document:** ${docTitle}
- **Regulation & Unit:** ${primaryDoc?.regulation || 'PVP20'} — ${primaryChunk.unitNumber} (Page ~${primaryChunk.pageNumber || 1})
- **Supported by Material:** The definition, algorithmic steps, and analysis above are directly derived from the uploaded department syllabus notes.`;
}
