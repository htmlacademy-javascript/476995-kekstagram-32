const Effect = {
  DEFAULT: 'none',
  CHROME: 'chrome',
  SEPIA: 'sepia',
  MARVIN: 'marvin',
  PHOBOS: 'phobos',
  HEAT: 'heat'
};

const EffectFilterOptions = {
  [Effect.CHROME]: { style: 'grayscale', unit: '' },
  [Effect.SEPIA]: { style: 'sepia', unit: '' },
  [Effect.MARVIN]: { style: 'invert', unit: '%' },
  [Effect.PHOBOS]: { style: 'blur', unit: 'px' },
  [Effect.HEAT]: { style: 'brightness', unit: '' },
};

const EffectSliderOptions = {
  [Effect.DEFAULT]: { min: 0, max: 100, step: 1 },
  [Effect.CHROME]: { min: 0, max: 1, step: 0.1 },
  [Effect.SEPIA]: { min: 0, max: 1, step: 0.1 },
  [Effect.MARVIN]: { min: 0, max: 100, step: 1 },
  [Effect.PHOBOS]: { min: 0, max: 3, step: 0.1 },
  [Effect.HEAT]: { min: 1, max: 3, step: 0.1 }
};

const modalEl = document.querySelector('.img-upload');
const imageEl = modalEl.querySelector('.img-upload__preview img');
const sliderContainerEl = modalEl.querySelector('.effect-level');
const sliderEl = modalEl.querySelector('.effect-level__slider');
const effectsListEl = modalEl.querySelector('.effects');
const effectValueEl = modalEl.querySelector('.effect-level__value');

let currentEffect = Effect.DEFAULT;

const updateSliderOptions = () => {
  const { min, max, step } = EffectSliderOptions[currentEffect];

  sliderEl.noUiSlider.updateOptions({
    range: { min, max },
    step,
    start: max
  });
};

const updateSliderVisibleState = () => {
  if (currentEffect === Effect.DEFAULT) {
    sliderContainerEl.classList.add('hidden');
  } else {
    sliderContainerEl.classList.remove('hidden');
  }
};

const updateSlider = () => {
  updateSliderOptions();
  updateSliderVisibleState();
};

const setEffect = () => {
  if (currentEffect === Effect.DEFAULT) {
    imageEl.style.filter = null;
    return;
  }

  const { style, unit } = EffectFilterOptions[currentEffect];
  const { value } = effectValueEl;
  imageEl.style.filter = `${style}(${value}${unit})`;
};

const onSliderUpdate = () => {
  effectValueEl.value = sliderEl.noUiSlider.get();
  setEffect();
};

const createSlider = () => {
  const { min, max, step } = EffectSliderOptions[currentEffect];

  noUiSlider.create(sliderEl, {
    range: { min, max },
    step,
    start: max,
    format: {
      to: (value) => +value,
      from: (value) => +value
    }
  });
  sliderEl.noUiSlider.on('update', onSliderUpdate);

  updateSliderVisibleState();
};

const updateEffect = (effect) => {
  currentEffect = effect;
  updateSlider();
};

const initEffect = () => {
  createSlider();
  effectsListEl.addEventListener('change', (evt) => updateEffect(evt.target.value));
};

const resetEffect = () => updateEffect(Effect.DEFAULT);

export { initEffect, resetEffect };


