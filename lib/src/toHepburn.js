const wanakana = require("wanakana");

function toHepburn(str) {
  const result = wanakana.toRomaji(wanakana.toHiragana(str));
  return result;
}

module.exports = toHepburn;
