# closewords
A library for finding the most similar word from a list of words, supporting Japanese (including kanji).<br>
最も似た単語を単語群から検索する日本語(漢字含む)対応のライブラリ

> Note: it may be a little slow because it uses morphological analysis. By adopting `worker_threads`, the processing speed is slightly improved compared to the standard.<br>
> 注意: 形態素解析を利用しているため多少遅い可能性があります。`worker_threads` を採用しているため、標準より少しは処理速度は改善されています。

##### Teams
<a href="https://oto.pet/"><img src="https://www.otoneko.cat/img/logo.png" alt="OTONEKO.CAT" style="display: block; width: auto; height: 100px;"/></a>
<a href="https://www.otoho.me/"><img src="https://www.otoho.me/img/logo.png" alt="Oto Home" style="display: block; width: auto; height: 100px;"/></a>

## Usage
- **closeWords(word: string, candidates: string[], raw?:boolean(default: false)): Promise\<string[] | Array\<{ word: string, score: number }\>\>**

### Example
```js
const { closeWords } = require('closeword');

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
```
### Result
```
結果: [ '猫' ]
スコアを含む結果: [
  { word: '猫', score: 1 },
  { word: 'ねころび', score: 0.5714285714285714 },
  { word: 'ねずみ', score: 0.25 },
  { word: 'いぬ', score: 0.16666666666666666 }
]
```

## Get Support
<a href="https://discord.gg/yKW8wWKCnS"><img src="https://discordapp.com/api/guilds/1005287561582878800/widget.png?style=banner4" alt="Discord Banner"/></a>
