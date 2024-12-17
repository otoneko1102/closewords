const { closeWords } = require('closewords');

(async () => {
  const word = 'cat';
  const candidates = ['dog', 'mouse', 'cat', 'kitten'];

  try {
    const result = await closeWords(word, candidates);
    console.log('Most similar word:', result);

    // raw: true
    const resultWithScores = await closeWords(word, candidates, true);
    console.log('Detailed result with scores:', resultWithScores);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
