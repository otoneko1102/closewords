const { parentPort, workerData } = require("worker_threads");
const kuromoji = require("kuromoji");
const wanakana = require("wanakana");

let tokenizer;

async function initializeTokenizer() {
  if (tokenizer) return tokenizer;
  const tokenizerBuilder = kuromoji.builder({ dicPath: workerData.dicPath });
  
  return new Promise((resolve, reject) => {
    tokenizerBuilder.build((err, builtTokenizer) => {
      if (err) return reject(new Error("Failed to initialize tokenizer: " + err.message));
      tokenizer = builtTokenizer;
      resolve(tokenizer);
    });
  });
}

(async () => {
  const { words } = workerData;

  try {
    const tokenizerInstance = await initializeTokenizer();

    const romajiWords = words.map((word) => {
      try {
        const tokens = tokenizerInstance.tokenize(word);
        const hiragana = tokens.map((token) => token.reading || token.surface_form).join('');
        return wanakana.toRomaji(hiragana);
      } catch (tokenizeErr) {
        throw new Error(`Error processing word "${word}": ${tokenizeErr.message}`);
      }
    });

    parentPort.postMessage(romajiWords);
  } catch (err) {
    parentPort.postMessage({ error: err.message });
  }
})();
