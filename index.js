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
 * @param {string} word - The reference word. / 比較対象の単語
 * @param {string[]} candidates - Array of candidate words. / 候補リスト
 * @param {boolean} [raw=false] - Whether to include similarity scores. / 類似度スコアを含むか
 * @returns {Promise<string[] | Array<{ word: string, score: number }>>} The closest word(s) or detailed scores. / 最も類似した単語または詳細なスコア
 */
async function closeWords(word, candidates, raw = false) {
  return new Promise(async (resolve, reject) => {
    try {
      if (typeof word !== "string") throw new Error("word must be string.");
      if (
        !Array.isArray(candidates) ||
        !candidates.every((item) => typeof item === "string")
      ) throw new Error("all elements in the candidates array must be string.");
      if (typeof raw !== "boolean") throw new Error("raw must be boolean.");

      const romajiWords = await convertToRomajiMultiThread([word, ...candidates]);
      const [romajiWord, ...romajiCandidates] = romajiWords;

      const baseLength = word.length;

      const scores = candidates.map((candidate, index) => {
        const candidateLength = candidate.length;
        const romajiScore = jaroWinkler(romajiWord, romajiCandidates[index]);
        const stringScore = 1 - levenshtein.get(word, candidate) / Math.max(baseLength, candidateLength);
        const lengthPenalty = Math.min(1, baseLength / candidateLength);
        const substringBonus = candidate.includes(word) ? 0.1 : 0;
        const combinedScore = (romajiScore * 0.5 + stringScore * 0.5) * lengthPenalty + substringBonus;
        const finalScore = Math.min(combinedScore, 1);
        return {
          word: candidate,
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
