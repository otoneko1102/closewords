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
The highest score is 1 (the lowest is 0).<br>
A score of 1 means a perfect character-by-character match.<br>
スコアの最高値は1です(最低値は0です)。<br>
スコアが1の場合、文字列が完全に一致していることを示します。

### Example
```js
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
```
### Result
```
結果: [ '猫' ]
スコアを含む結果: [
  { word: '猫', score: 0.5 },
  { word: 'ねころび', score: 0.44999999999999996 },
  { word: 'ねずみ', score: 0.31481481481481477 },
  { word: 'いぬ', score: 0.2638888888888889 }
]
```

## Change Log
### 1.0.2 --> 2.0.0
Introduced `fast-levenshtein` and fixed score calculation. The similarity of the original strings is also evaluated.<br>
`fast-levenshtein` を導入し、スコア計算方法を修正しました。元の文字列の一致度も評価されるようになりました。
### 1.0.1 --> 1.0.2
Introduced `jaro-winkler` and optimized.<br>
`jaro-winkler` を導入し、最適化しました。
### 1.0.0 --> 1.0.1
Fixed score calculation.<br>
スコア計算方法を修正しました。
### 0.x --> 1.0.0
Package released! Introducing morphological analysis.<br>
パッケージをリリース！ 形態素解析を導入しました。
## Get Support
<a href="https://discord.gg/yKW8wWKCnS"><img src="https://discordapp.com/api/guilds/1005287561582878800/widget.png?style=banner4" alt="Discord Banner"/></a>
