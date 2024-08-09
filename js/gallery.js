import { getRandomValuesFromArray, debounce } from './util.js';
import { getPictures } from './api.js';
import { renderThumbnails } from './thumbnails.js';
import { openPictureModal } from './picture-modal/picture-modal.js';

const CLOSE_TIMEOUT = 5000;
const Filters = {
  DEFAULT: 'default',
  RANDOM: 'random',
  DISCUSSED: 'discussed'
};
const MAX_AMOUNT_RANDOM_PICS = 10;

const filtersEl = document.querySelector('.img-filters');
const errTmplEl = document.querySelector('#data-error').content.querySelector('.data-error');
const showErrorMsg = () => {
  const errEl = errTmplEl.cloneNode(true);
  document.body.append(errEl);

  setTimeout(() => errEl.remove(), CLOSE_TIMEOUT);
};

let pictures = [];
const doFilter = debounce(renderThumbnails);

const filterPictures = (filterType) => {
  let filteredPictures = [];

  switch (filterType) {
    case Filters.DEFAULT:
      filteredPictures = pictures.slice();
      break;

    case Filters.RANDOM:
      filteredPictures = getRandomValuesFromArray(pictures.slice(), MAX_AMOUNT_RANDOM_PICS);
      break;

    case Filters.DISCUSSED:
      filteredPictures = pictures.slice().sort((a, b) => b.comments.length - a.comments.length);
      break;
  }

  doFilter(filteredPictures, openPictureModal);
};

const initFilters = () => {
  filtersEl.classList.remove('img-filters--inactive');
  filtersEl.addEventListener('click', (e) => {
    if (e.target.closest('.img-filters__button')) {
      const filterBtnEl = e.target.closest('.img-filters__button');
      const filterType = filterBtnEl.id.split('-')[1];

      filtersEl.querySelector('.img-filters__button--active').classList.remove('img-filters__button--active');
      filterBtnEl.classList.add('img-filters__button--active');
      filterPictures(filterType);
    }
  });
};

const makeGallery = () => {
  getPictures(
    (picturesData) => {
      pictures = picturesData;
      renderThumbnails(pictures, openPictureModal);
      initFilters();
    },
    () => showErrorMsg()
  );
};

export { makeGallery };
