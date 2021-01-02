const isMinSize = (value, size) => {
    return value.length >= size ? true : false;
};

const isSame = (a, b) => {
    return a === b ? true : false;
};

const emailIsValid = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validator = { isMinSize, isSame, emailIsValid };

module.exports = validator;
