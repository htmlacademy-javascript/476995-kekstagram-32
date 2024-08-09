const SCALE_STEP = 25;
const SCALE_DIVIDER = 100;
const MIN_SCALE_VALUE = 25;
const MAX_SCALE_VALUE = 100;
const DEFAULT_SCALE_VALUE = 100;


const modalEl = document.querySelector('.img-upload');
const scaleDownBtn = modalEl.querySelector('.scale__control--smaller');
const scaleUpBtn = modalEl.querySelector('.scale__control--bigger');
const scaleInputEl = modalEl.querySelector('.scale__control--value');
const imageEl = modalEl.querySelector('.img-upload__preview img');

const scaleImg = (value) => {
  imageEl.style.transform = `scale(${value / SCALE_DIVIDER})`;
  scaleInputEl.value = `${value}%`;
};

const resetScale = () => scaleImg(DEFAULT_SCALE_VALUE);
const initScale = () => {
  scaleDownBtn.addEventListener('click', () => {
    scaleImg(Math.max(parseInt(scaleInputEl.value, 10) - SCALE_STEP, MIN_SCALE_VALUE));
  });

  scaleUpBtn.addEventListener('click', () => {
    scaleImg(Math.min(parseInt(scaleInputEl.value, 10) + SCALE_STEP, MAX_SCALE_VALUE));
  });
};

export { initScale, resetScale };
