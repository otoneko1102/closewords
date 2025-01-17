const { closeWords } = require('closewords');

(async () => {
  const word = '東京';
  const candidates = ['東京', 'とっこう', '東きょう', 'とう京', 'とうきょう', 'とーきょー'];

  try {
    const result = await closeWords(word, candidates);
    console.log('Result:', result);

    // raw: true
    const resultWithScores = await closeWords(word, candidates, true);
    console.log('Result with score:', resultWithScores);
  } catch (error) {
    console.error('Error:', error);
  }
})();
