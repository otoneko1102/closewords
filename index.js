const jaroWinkler = require("jaro-winkler");
const levenshtein = require("fast-levenshtein");
const { Worker } = require("worker_threads");
const path = require("path");

function convertToRomajiMultiThread(words) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve(__dirname, "./src/worker.js"), {
      workerData: { words, dicPath: path.resolve(__dirname, "./lib/dict") },
    });

    let hasResponded = false;

    worker.on("message", (message) => {
      hasResponded = true;
      if (message.error) {
        reject(new Error(message.error));
      } else {
        resolve(message);
      }
    });

    worker.on("error", (err) => {
      hasResponded = true;
      reject(err);
    });

    worker.on("exit", (code) => {
      if (!hasResponded) {
        reject(new Error(`Worker stopped unexpectedly with exit code ${code}`));
      }
    });
  });
}

/**
 * Finds the closest strings in an array to the given word.
 * 与えられた単語に最も近い単語を候補リストから探します。
 * 
 * @async
 * @function closeWords
 * @param {string | { word: string, pronounce: string }} word - The reference word or object. / 比較対象の単語またはオブジェクト
 * @param {Array<string | { word: string, pronounce: string }>} candidates - Candidate words or objects. / 候補リスト
 * @param {boolean} [raw=false] - Whether to include similarity scores. / 類似度スコアを含むか
 * @returns {Promise<string[] | Array<{ word: string, score: number }>>} The closest word(s) or detailed scores. / 最も類似した単語または詳細なスコア
 */
async function closeWords(word, candidates, raw = false) {
  return new Promise(async (resolve, reject) => {
    try {
      if (typeof word !== "string") throw new Error("word must be a string.");
      if (
        !Array.isArray(candidates) ||
        !candidates.every(
          (item) => typeof item === "string" || 
          (typeof item === "object" && item.word && item.pronounce)
        )
      ) throw new Error("Candidates must be an array of strings or objects with 'word' and 'pronounce'.");
      if (typeof raw !== "boolean") throw new Error("raw must be boolean.");

      const romajiWords = await convertToRomajiMultiThread([word, ...candidates]);
      const [romajiWord, ...romajiCandidates] = romajiWords;

      const baseLength = word.length;

      const scores = candidates.map((candidate, index) => {
        const candidateWord = typeof candidate === "string" ? candidate : candidate.word;
        const candidateLength = candidateWord.length;

        const romajiScore = jaroWinkler(romajiWord, romajiCandidates[index]);

        const stringScore = 1 - levenshtein.get(word, candidateWord) / Math.max(baseLength, candidateLength);

        // 部分一致
        const commonSubstringLength = Math.min(
          word.length,
          candidateWord.length,
          [...word].filter((char, i) => char === candidateWord[i]).length
        );
        const substringRatio = commonSubstringLength / Math.max(word.length, candidateWord.length);

        // 漢字の一致率
        const kanjiMatchCount = [...word].filter((char) => candidateWord.includes(char)).length;
        const kanjiRatio = kanjiMatchCount / Math.max(word.length, candidateWord.length);

        // 特定の漢字一致
        const exactKanjiBonus = word === candidateWord ? 0.3 : kanjiRatio * 0.4;

        // 長さペナルティ
        const lengthPenalty = Math.max(0.7, 1 - Math.abs(baseLength - candidateLength) / baseLength);

        // 部分一致
        const substringBonus = substringRatio > 0.5 ? substringRatio * 0.1 : 0;

        const combinedScore =
          (romajiScore * 0.6 + stringScore * 0.1 + kanjiRatio * 0.3) * lengthPenalty +
          exactKanjiBonus +
          substringBonus;

        const finalScore = Math.min(combinedScore, 1);

        return {
          word: candidateWord,
          score: finalScore,
        };
      });

      scores.sort((a, b) => b.score - a.score);

      if (!raw) {
        const maxScore = scores[0]?.score;
        const result = scores
          .filter((item) => item.score === maxScore)
          .map((item) => item.word);
        resolve(result);
      } else {
        resolve(scores);
      }
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { closeWords };
