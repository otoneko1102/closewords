const { closeWords } = require('closewords');

(async () => {
  const word = 'ねこ';
  const candidates = ['いぬ', 'ねずみ', '猫', 'ねころび'];

  try {
    const result = await closeWords(word, candidates);
    console.log('結果:', result);

    // raw: true
    const resultWithScores = await closeWords(word, candidates, true);
    console.log('スコアを含む結果:', resultWithScores);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
