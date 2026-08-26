// src/lib/blog/search-core.js

import { getBlogPosts } from './loader.js';

/** @typedef {import('./loader.js').BlogPost} BlogPost */

/** @typedef {Object} Chunk
 * @property {string} id - Unique chunk ID
 * @property {string} slug - Post slug
 * @property {string} lang - Language code
 * @property {string} title - Section title
 * @property {string} date - Post date
 * @property {string} speaker - Speaker name if applicable
 * @property {string} text - Full text
 * @property {string} searchText - Normalized text for search
 */

const MAX_CHUNK_CHARS = 1500;
const MIN_CHUNK_LENGTH = 50;

/** @type {Chunk[] | null} */
let _corpus = null;

/** @type {Promise<Chunk[]> | null} */
let _corpusPromise = null;

/**
 * Strip markdown noise so embeddings and lexical tokens see prose.
 * @param {string} md - Markdown text
 * @returns {string} - Plain text
 */
export function plainText(md) {
    return (md || '')
        .replace(/```[\s\S]*?```/g, '') // code blocks
        .replace(/`[^`]+`/g, '') // inline code
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
        .replace(/[#*_~]/g, '') // markdown chars
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Split a section into chunks if it exceeds the ceiling (rare).
 * @param {string} text - Text to split
 * @returns {string[]} - Array of chunks
 */
function splitLengths(text) {
    if (text.length <= MAX_CHUNK_CHARS) return [text];
    const chunks = [];
    let start = 0;
    while (start < text.length) {
        let end = Math.min(start + MAX_CHUNK_CHARS, text.length);
        // Try to break at a sentence boundary
        const boundary = text.lastIndexOf('.', end);
        if (boundary > start + MIN_CHUNK_LENGTH) {
            end = boundary + 1;
        }
        chunks.push(text.slice(start, end).trim());
        start = end;
    }
    return chunks;
}

/**
 * Build the full chunk corpus (deduped posts, both locales' copies).
 * @returns {Promise<Chunk[]>} chunks: {id, slug, lang, title, date,
 *   speaker, text, searchText}
 */
export async function getCorpus() {
    if (_corpus) return _corpus;
    if (_corpusPromise) return _corpusPromise;
    
    _corpusPromise = (async () => {
        const posts = await getBlogPosts('en');
        /** @type {Chunk[]} */
        const chunks = [];
        
        for (const post of posts) {
            const sections = post.sections?.length
                ? post.sections
                : [{ title: '', content: post.content || '' }];
            
            sections.forEach((sec, i) => {
                const speaker = /:$/.test((sec.title || '').trim())
                    ? sec.title.replace(/:$/, '').trim()
                    : '';
                const title = speaker ? '' : (sec.title || '');
                const text = sec.content || '';
                const searchText = plainText(text);
                
                // Skip empty chunks
                if (!searchText.trim()) return;
                
                // Split long sections
                const textChunks = splitLengths(text);
                const searchChunks = splitLengths(searchText);
                
                for (let j = 0; j < textChunks.length; j++) {
                    chunks.push({
                        id: `${post.slug}-${i}-${j}`,
                        slug: post.slug,
                        lang: post.source_lang,
                        title: title,
                        date: post.date,
                        speaker: speaker,
                        text: textChunks[j],
                        searchText: searchChunks[j] || searchChunks[0] || ''
                    });
                }
            });
        }
        
        _corpus = chunks;
        _corpusPromise = null;
        return chunks;
    })();
    
    return _corpusPromise;
}

/**
 * Lowercase, fold accents, keep letters/digits (unicode-aware).
 * @param {string} text - Text to tokenize
 * @returns {string[]} - Array of tokens
 */
export function tokenize(text) {
    const folded = (text || '')
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    return folded ? folded.split(' ') : [];
}

/**
 * tf-idf lexical search over the corpus.
 * @param {string} query - Search query
 * @param {number} [topN=24] - Number of results to return
 * @returns {Promise<Array<{chunk: Chunk, score: number}>>} top-N results
 */
export async function lexicalSearch(query, topN = 24) {
    const corpus = await getCorpus();
    const queryTokens = tokenize(query);
    if (!queryTokens.length || !corpus.length) return [];

    // Build term frequency
    /** @type {Map<string, number>} */
    const df = new Map();
    /** @type {Map<string, Map<string, number>>} */
    const tf = new Map();
    
    for (const chunk of corpus) {
        const tokens = tokenize(chunk.searchText);
        /** @type {Map<string, number>} */
        const chunkTf = new Map();
        for (const t of tokens) {
            chunkTf.set(t, (chunkTf.get(t) || 0) + 1);
            df.set(t, (df.get(t) || 0) + 1);
        }
        tf.set(chunk.id, chunkTf);
    }

    const N = corpus.length;
    /**
     * @param {string} t - Term
     * @returns {number} - IDF score
     */
    const idf = (t) => Math.log(1 + N / (1 + (df.get(t) || 0)));

    // Score each chunk
    /** @type {Array<{chunk: Chunk, score: number}>} */
    const scored = [];
    for (const chunk of corpus) {
        const chunkTf = tf.get(chunk.id);
        if (!chunkTf) continue;
        let score = 0;
        for (const t of queryTokens) {
            const tfVal = chunkTf.get(t) || 0;
            const idfVal = idf(t);
            score += tfVal * idfVal;
        }
        if (score > 0) {
            scored.push({ chunk, score });
        }
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topN);
}

/**
 * Make a snippet from a chunk highlighting query terms.
 * @param {Chunk} chunk - The chunk to snippet
 * @param {string} query - The search query
 * @param {number} [radius=130] - Radius around match
 * @returns {string} - The snippet
 */
export function makeSnippet(chunk, query, radius = 130) {
    const terms = tokenize(query);
    if (!terms.length) return chunk.text.slice(0, 300);

    const text = chunk.text;
    const lower = text.toLowerCase();
    let bestPos = 0;
    let bestScore = 0;

    for (const term of terms) {
        const pos = lower.indexOf(term);
        if (pos !== -1) {
            const score = 1 + Math.min(10, lower.split(term).length - 1);
            if (score > bestScore) {
                bestScore = score;
                bestPos = pos;
            }
        }
    }

    let start = Math.max(0, bestPos - radius);
    let end = Math.min(text.length, bestPos + radius);
    
    // Try to start/end at word boundaries
    if (start > 0) {
        const spaceBefore = text.lastIndexOf(' ', start);
        if (spaceBefore > start - 20) start = spaceBefore + 1;
    }
    if (end < text.length) {
        const spaceAfter = text.indexOf(' ', end);
        if (spaceAfter < end + 20 && spaceAfter !== -1) end = spaceAfter;
    }

    let snippet = text.slice(start, end);
    if (start > 0) snippet = '…' + snippet;
    if (end < text.length) snippet = snippet + '…';

    return snippet;
}
