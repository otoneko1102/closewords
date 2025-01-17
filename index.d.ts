/**
 * A type representing an alphabetic string.
 * アルファベット文字列を表す型。
 */
export type AlphabeticString = string & { __alphabeticString?: never };

/**
 * Represents a candidate object with optional pronounce property.
 * pronounce プロパティは任意で、アルファベット文字列のみを受け入れます。
 */
export interface Candidate {
  word: string; // Candidate word. / 候補単語
  pronounce?: AlphabeticString; // Optional alphabetic string. / 任意のアルファベット文字列
}

/**
 * Represents the result of a similarity comparison.
 * 類似度比較の結果を表します。
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
 * @param {string | Candidate} word - The reference word or object. / 比較対象の単語またはオブジェクト
 * @param {Array<string | Candidate>} candidates - Candidate words or objects. / 候補リスト
 * @param {boolean} [raw=false] - Whether to include similarity scores. / 類似度スコアを含むか
 * @returns {Promise<string[] | closeWordsResult[]>} The closest word(s) or detailed scores. / 最も類似した単語または詳細なスコア
 */
export function closeWords(
  word: string | Candidate,
  candidates: Array<string | Candidate>,
  raw?: boolean
): Promise<string[] | closeWordsResult[]>;
