module.exports = {
  extends: "standard",
  plugins: ["jest"],
  rules: {
    semi: 0,
    quotes: 0,
    camelcase: 0,
    "comma-dangle": 0,
    "eol-last": 0,
    'space-before-function-paren': 0,
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error",
  },
  env: {
    jest: true,
  },
};
