const getRandomInteger = (min, max) => {
  const lower = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  const upper = Math.floor(Math.max(Math.abs(min), Math.abs(max)));
  const result = Math.random() * (upper - lower + 1) + lower;

  return Math.floor(result);
};

const getRandomValuesFromArray = (values, amount) => {
  const randomValues = [];

  while (randomValues.length < amount && randomValues.length !== values.length) {
    const index = getRandomInteger(0, values.length - 1);
    const value = values[index];

    if (!randomValues.includes(value)) {
      randomValues.push(value);
    }
  }

  return randomValues;
};

const debounce = (callback, timeoutDelay = 500) => {
  let timeoutId;

  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

export { getRandomInteger, getRandomValuesFromArray, debounce };
