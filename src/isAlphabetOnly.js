function isAlphabetOnly(str) {
  return /^[A-Za-z-]+$/.test(str);
}

module.exports = isAlphabetOnly;
