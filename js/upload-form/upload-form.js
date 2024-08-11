import { initScale, resetScale } from './scale-img.js';
import { initEffect, resetEffect } from './effect-img.js';
import { sendPicture } from './../api.js';
import { showUploadSuccessMsg } from './success-msg.js';
import { showUploadErrorMsg } from './error-msg.js';

const VALID_HASTAG_REGEX = /^#[0-9a-zа-яё]{1,19}$/i;
const MAX_AMOUNT_HASHTAGS = 5;
const MAX_COMMENT_LENGTH = 140;
const FILE_TYPES = ['jpg', 'jpeg', 'png'];

const formEl = document.querySelector('#upload-select-image');
const fileInputEl = formEl.querySelector('#upload-file');
const imagePreviewEl = formEl.querySelector('.img-upload__preview img');
const effectsPreviewListEl = formEl.querySelectorAll('.effects__preview');
const hashtagsEl = formEl.querySelector('input[name="hashtags"]');
const commentEl = formEl.querySelector('textarea[name="description"]');
const formSubmitBtn = formEl.querySelector('#upload-submit');
const editPhotoModalEl = formEl.querySelector('.img-upload__overlay');
const editPhotoModalCloseEl = editPhotoModalEl.querySelector('.img-upload__cancel');

const pristine = new Pristine(formEl, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__field-wrapper--error',
});

const hideModal = () => {
  editPhotoModalEl.classList.add('hidden');
  document.body.classList.remove('modal-open');
  formEl.reset();
  pristine.reset();
  resetScale();
  resetEffect();
};

const onEscapeKeyDown = (evt) => {
  if (evt.key === 'Escape' && document.activeElement !== hashtagsEl
    && document.activeElement !== commentEl && document.querySelector('.error') === null) {
    hideModal();
    document.removeEventListener('keydown', onEscapeKeyDown);
  }
};

const closeEditPhotoModal = () => {
  hideModal();
  document.removeEventListener('keydown', onEscapeKeyDown);
};

const setPreviewImage = () => {
  if (fileInputEl.files.length === 1) {
    const file = fileInputEl.files[0];
    const fileName = file.name.toLowerCase();

    const matches = FILE_TYPES.some((fileType) => fileName.endsWith(fileType));

    if (matches) {
      const blobUrl = URL.createObjectURL(file);
      imagePreviewEl.src = blobUrl;
      Array.from(effectsPreviewListEl).forEach((effectPreviewEl) => {
        effectPreviewEl.style.backgroundImage = `url('${blobUrl}')`;
      });
    }
  }
};

const openEditPhotoModal = () => {
  editPhotoModalEl.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onEscapeKeyDown);
};

const normalizeTags = (value) => value.trim().split(' ').filter((tag) => !!tag);

const checkHashtagsToCorrect = (value) => {
  const hashtags = normalizeTags(value);
  // Если ничего не введено, то всё норм.
  // Считаем, что валидация удалась, т.к. поле заполнять необязательно
  if (hashtags.length === 0) {
    return true;
  }

  return hashtags.every((hashtag) => VALID_HASTAG_REGEX.test(hashtag));
};

const checkUniqueHashtags = (value) => {
  const hashtags = normalizeTags(value);
  const uniqueHashtags = new Set(hashtags.map((hashtag) => hashtag.toLowerCase()));

  return hashtags.length === uniqueHashtags.size;
};

const checkAmountHashtags = (value) => normalizeTags(value).length <= MAX_AMOUNT_HASHTAGS;

const checkCommentLength = (value) => value.trim().length <= MAX_COMMENT_LENGTH;

const initValidateRules = () => {
  pristine.addValidator(hashtagsEl, checkHashtagsToCorrect, 'Введён невалидный хэштег');
  pristine.addValidator(hashtagsEl, checkUniqueHashtags, 'Присутствуют неуникальные хэштеги');
  pristine.addValidator(hashtagsEl, checkAmountHashtags, 'Превышено количество хэштегов');
  pristine.addValidator(commentEl, checkCommentLength, 'Комментарий не может быть больше 140 символов');
};

const onFormSubmit = (evt) => {
  evt.preventDefault();
  formSubmitBtn.disabled = true;

  if (pristine.validate()) {
    const formData = new FormData(formEl);
    sendPicture(
      formData,
      () => {
        closeEditPhotoModal();
        formSubmitBtn.disabled = false;
        showUploadSuccessMsg();
      },
      () => {
        formSubmitBtn.disabled = false;
        showUploadErrorMsg();
      }
    );
  } else {
    formSubmitBtn.disabled = false;
  }
};

const initUploadForm = () => {
  fileInputEl.addEventListener('change', () => {
    setPreviewImage();
    openEditPhotoModal();
  });
  editPhotoModalCloseEl.addEventListener('click', () => closeEditPhotoModal());
  initValidateRules();
  formEl.addEventListener('submit', onFormSubmit);

  initScale();
  initEffect();
};

export { initUploadForm };
