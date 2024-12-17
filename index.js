const { Worker, isMainThread, parentPort, workerData } = require("worker_threads");
const path = require("path");
const wanakana = require("wanakana");
const kuromoji = require("kuromoji");

const tokenizerBuilder = kuromoji.builder({
  dicPath: path.resolve(__dirname, "node_modules/kuromoji/dict")
});

let tokenizer;

/**
 * Initialize the tokenizer for morphological analysis.
 * 形態素解析器を準備します。
 */
async function initializeTokenizer() {
  if (tokenizer) return tokenizer;
  return new Promise((resolve, reject) => {
    tokenizerBuilder.build((err, builtTokenizer) => {
      if (err) reject(err);
      tokenizer = builtTokenizer;
      resolve(builtTokenizer);
    });
  });
}

/**
 * Perform romaji conversion in a worker thread.
 * マルチスレッドでローマ字変換を行います。
 * 
 * @param {string[]} words - List of words to convert.
 * 単語リスト
 * @returns {Promise<string[]>} - List of converted romaji strings.
 * ローマ字変換されたリスト
 */
function convertToRomajiMultiThread(words) {
  return new Promise((resolve, reject) => {
    const workerPath = path.resolve(__dirname, "./index.js");
    const worker = new Worker(workerPath, { workerData: words });
    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", code => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

if (!isMainThread) {
  (async () => {
    await initializeTokenizer();
    const romajiWords = workerData.map(word => {
      const tokens = tokenizer.tokenize(word);
      const hiragana = tokens.map(token => token.reading || token.surface_form).join('');
      return wanakana.toRomaji(hiragana);
    });
    parentPort.postMessage(romajiWords);
  })();
}

/**
 * Measure phonetic similarity using Jaccard coefficient.
 * Jaccard係数を用いて音の類似性を測定します。
 * 
 * @param {string} a - First word in romaji.
 * ローマ字化された単語1
 * @param {string} b - Second word in romaji.
 * ローマ字化された単語2
 * @returns {number} - Similarity score between 0 and 1.
 * 類似度スコア（0〜1）
 */
function jaccardSimilarity(a, b) {
  const setA = new Set(a.split(''));
  const setB = new Set(b.split(''));

  const intersection = [...setA].filter(char => setB.has(char)).length;
  const union = new Set([...setA, ...setB]).size;

  return intersection / union;
}

/**
 * Find the most similar word from a list of candidates.
 * 候補リストの中から最も類似した単語を返します。
 * 
 * @param {string} word - The word to compare.
 * 比較対象の単語
 * @param {string[]} candidates - List of candidate words.
 * 候補リスト
 * @param {boolean} raw - Whether to include similarity scores.
 * 類似度スコアを含むか
 * @returns {Promise<string[] | Array<{ word: string, score: number }>>}
 * Most similar word(s) or detailed scores.
 * 最も類似した単語または詳細なスコア
 */
async function closeWords(word, candidates, raw = false) {
  if (typeof word !== 'string') throw new Error('word must be string.');
  if (!Array.isArray(candidates) || !candidates.every(item => typeof item === 'string')) throw new Error('all elements in the candidates array must be string.');
  if (typeof raw !== 'boolean') throw new Error('raw must be boolean.');

  await initializeTokenizer();

  const romajiWords = await convertToRomajiMultiThread([word, ...candidates]);
  const [romajiWord, ...romajiCandidates] = romajiWords;

  const scores = candidates.map((candidate, index) => ({
    word: candidate,
    score: jaccardSimilarity(romajiWord, romajiCandidates[index]),
  }));

  scores.sort((a, b) => b.score - a.score);

  if (!raw) {
    const maxScore = scores[0]?.score;
    const matchedWords = scores.filter(item => item.score === maxScore).map(item => item.word);

    return matchedWords;
  }

  return scores;
}

module.exports = closeWords;
