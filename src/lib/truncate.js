const truncate = require(`lodash.truncate`);

const DEFAULT_MAXLENGTH = 130;

module.exports = (text, length = DEFAULT_MAXLENGTH) => truncate(text, {
	length,
	separator: /[.,?!]?\s+/,
	omission: `…`
});
