const { closeWords } = require('closewords');

(async () => {
  const word = '東京';
  const candidates = ['東京', 'とっこう', '東きょう', 'とう京', 'とうきょう', 'とーきょー'];

  try {
    const result = await closeWords(word, candidates);
    console.log('結果:', result);

    // raw: true
    const resultWithScores = await closeWords(word, candidates, true);
    console.log('スコアを含む結果:', resultWithScores);
  } catch (error) {
    console.error('Error:', error);
  }
})();
