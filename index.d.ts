/**
 * Represents the result of a similarity comparison.
 * 類似度比較の結果を表します。
 *
 * @interface closeWordsResult
 * @property {string} word - Candidate word. / 候補単語
 * @property {number} score - Similarity score. / 類似度スコア
 */
export interface closeWordsResult {
  word: string; // Candidate word. / 候補単語
  score: number; // Similarity score. / 類似度スコア
}

/**
 * Finds the closest strings in an array to the given word.
 * 与えられた単語に最も近い単語を候補リストから探します。
 * 
 * @async
 * @function closeWords
 * @param {string} word - The reference word. / 比較対象の単語
 * @param {string[]} candidates - Array of candidate words. / 候補リスト
 * @param {boolean} [raw=false] - Whether to include similarity scores. / 類似度スコアを含むか
 * @returns {Promise<string[] | Array<{ word: string, score: number }>>} The closest word(s) or detailed scores. / 最も類似した単語または詳細なスコア
 */
export function closeWords(
  word: string,
  candidates: string[],
  raw?: boolean
): string[] | closeWordsResult[];
