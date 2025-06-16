const COMMON_WORDS = {
  3: ['THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'ALL', 'CAN', 'HER', 'WAS', 'ONE', 'OUR', 'HAD', 'HAS', 'HIS', 'HIM', 'OLD', 'SEE', 'NOW', 'WAY', 'WHO', 'ITS', 'DID', 'GET', 'MAY', 'HIM', 'NEW', 'HAS', 'MAN', 'TWO', 'HOW', 'ITS', 'OUR', 'OUT', 'DAY', 'HAD', 'HIS', 'HAS', 'HER', 'YOU', 'ALL', 'ANY', 'CAN', 'SAY', 'SHE', 'USE', 'HER', 'HOW', 'NOW', 'ITS', 'WHO', 'OIL', 'SIT', 'SET', 'BUT', 'NOT'],
  4: ['THAT', 'WITH', 'HAVE', 'THIS', 'WILL', 'YOUR', 'FROM', 'THEY', 'KNOW', 'WANT', 'BEEN', 'GOOD', 'MUCH', 'SOME', 'TIME', 'VERY', 'WHEN', 'COME', 'HERE', 'JUST', 'LIKE', 'LONG', 'MAKE', 'MANY', 'OVER', 'SUCH', 'TAKE', 'THAN', 'THEM', 'WELL', 'WERE', 'WHAT', 'WORK', 'YEAR', 'WHERE', 'WHICH', 'THEIR', 'WOULD', 'THERE', 'COULD', 'OTHER', 'AFTER', 'FIRST', 'NEVER', 'THESE', 'THINK', 'WHERE', 'BEING', 'EVERY', 'GREAT', 'MIGHT', 'SHALL', 'STILL', 'THOSE', 'UNDER', 'WHILE'],
  5: ['WHICH', 'THEIR', 'WOULD', 'THERE', 'COULD', 'OTHER', 'AFTER', 'FIRST', 'NEVER', 'THESE', 'THINK', 'WHERE', 'BEING', 'EVERY', 'GREAT', 'MIGHT', 'SHALL', 'STILL', 'THOSE', 'UNDER', 'WHILE', 'HOUSE', 'WORLD', 'NIGHT', 'WATER', 'MONEY', 'PLACE', 'RIGHT', 'SMALL', 'SOUND', 'STILL', 'STUDY', 'THINK', 'THREE', 'UNTIL', 'VALUE', 'WOMAN', 'YOUNG'],
  6: ['PEOPLE', 'BEFORE', 'AROUND', 'THOUGH', 'LITTLE', 'NUMBER', 'PUBLIC', 'SCHOOL', 'SYSTEM', 'FOLLOW', 'DURING', 'ALWAYS', 'CHANGE', 'COURSE', 'FAMILY', 'FRIEND', 'FUTURE', 'GARDEN', 'HEALTH', 'INSIDE', 'LETTER', 'MARKET', 'MOTHER', 'NATURE', 'OFFICE', 'PERSON', 'PLANET', 'REASON', 'RESULT', 'SEASON'],
  7: ['ANOTHER', 'BECAUSE', 'BETWEEN', 'COMPANY', 'COUNTRY', 'DEVELOP', 'EXAMPLE', 'GENERAL', 'HISTORY', 'NOTHING', 'PROBLEM', 'PROGRAM', 'ANOTHER', 'ARTICLE', 'BECAUSE', 'BETWEEN', 'COMPANY', 'COUNTRY', 'DEVELOP', 'EXAMPLE', 'GENERAL', 'HISTORY', 'MILLION', 'NOTHING', 'PROBLEM', 'PROGRAM', 'QUALITY', 'REALITY', 'SCIENCE', 'SERVICE'],
  8: ['ALTHOUGH', 'ANALYSIS', 'BUILDING', 'BUSINESS', 'COMPUTER', 'DECISION', 'ECONOMIC', 'FACEBOOK', 'FUNCTION', 'INDUSTRY', 'INTEREST', 'LANGUAGE', 'MATERIAL', 'NATIONAL', 'ORIGINAL', 'POLITICS', 'POSITION', 'POSSIBLE', 'PRACTICE', 'QUESTION', 'RESPONSE', 'SECURITY', 'STANDARD', 'STRENGTH', 'TOGETHER', 'UNIVERSE', 'WHATEVER', 'YOURSELF']
};

export function isCommonWord(word) {
  const upperWord = word.toUpperCase();
  const length = word.length;
  return COMMON_WORDS[length]?.includes(upperWord) || false;
}

export function validateWordFormat(word) {
  return {
    isValid: /^[A-Za-z]+$/.test(word),
    hasValidLength: word.length >= 3 && word.length <= 8,
    isAlphabetic: /^[A-Za-z]+$/.test(word),
  };
}

export function generateRandomWord(length, category = 'general') {
  const words = COMMON_WORDS[length] || COMMON_WORDS[5];
  return words[Math.floor(Math.random() * words.length)];
}