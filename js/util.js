const getRandomInteger = (min, max) => {
  const lower = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  const upper = Math.floor(Math.max(Math.abs(min), Math.abs(max)));
  const result = Math.random() * (upper - lower + 1) + lower;

  return Math.floor(result);
};

const getRandomValuesFromArray = (arr, amount) => {
  const values = [];

  while (values.length < amount && values.length !== arr.length) {
    const index = getRandomInteger(0, arr.length - 1);
    const value = arr[index];

    if (!values.includes(value)) {
      values.push(value);
    }
  }

  return values;
};

const debounce = (callback, timeoutDelay = 500) => {
  let timeoutId;

  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

export { getRandomInteger, getRandomValuesFromArray, debounce };
