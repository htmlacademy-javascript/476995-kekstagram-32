import { initScale, resetScale } from './scale-img.js';
import { initEffect, resetEffect } from './effect-img.js';
import { sendPicture } from './../api.js';

const VALID_HASTAG_REGEX = /^#[0-9a-zа-яё]{1,19}$/i;
const MAX_AMOUNT_HASHTAGS = 5;
const MAX_COMMENT_LENGTH = 140;

const formEl = document.querySelector('#upload-select-image');
const fileInputEl = formEl.querySelector('#upload-file');
const hashtagsEl = formEl.querySelector('input[name="hashtags"]');
const commentEl = formEl.querySelector('textarea[name="description"]');
const formSubmitBtn = formEl.querySelector('#upload-submit');
const editPhotoModalEl = formEl.querySelector('.img-upload__overlay');
const editPhotoModalCloseEl = editPhotoModalEl.querySelector('.img-upload__cancel');
const uploadSuccessMsgTmplEl = document.querySelector('#success').content.querySelector('.success');
const uploadErrorMsgTmplEl = document.querySelector('#error').content.querySelector('.error');

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

const closeEditModalByEsc = (e) => {
  if (e.key === 'Escape' && document.activeElement !== hashtagsEl
    && document.activeElement !== commentEl && document.querySelector('.error') === null) {
    hideModal();
    document.removeEventListener('keydown', closeEditModalByEsc);
  }
};

const closeEditPhotoModal = () => {
  hideModal();
  document.removeEventListener('keydown', closeEditModalByEsc);
};

const openEditPhotoModal = () => {
  editPhotoModalEl.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', closeEditModalByEsc);
};

const checkHashtagsToCorrect = (value) => {
  const trimmedValue = value.trim();
  // Если ничего не введено, то всё норм.
  // Считаем, что валидация удалась, т.к. поле заполнять необязательно
  if (trimmedValue.length === 0) {
    return true;
  }

  const hashtags = trimmedValue.split(' ');

  return hashtags.every((ht) => VALID_HASTAG_REGEX.test(ht));
};

const checkUniqueHashtags = (value) => {
  const hashtags = value.trim().split(' ');
  const uniqueHashtags = new Set(hashtags.map((ht) => ht.toLowerCase()));

  return hashtags.length === uniqueHashtags.size;
};

const checkAmountHashtags = (value) => value.trim().split(' ').length <= MAX_AMOUNT_HASHTAGS;

const checkCommentLength = (value) => value.trim().length <= MAX_COMMENT_LENGTH;

const initValidateRules = () => {
  pristine.addValidator(hashtagsEl, checkHashtagsToCorrect, 'Введён невалидный хэштег');
  pristine.addValidator(hashtagsEl, checkUniqueHashtags, 'Присутствуют неуникальные хэштеги');
  pristine.addValidator(hashtagsEl, checkAmountHashtags, 'Превышено количество хэштегов');
  pristine.addValidator(commentEl, checkCommentLength, 'Комментарий не может быть больше 140 символов');
};

const closeUploadSuccessMsgByEsc = (e) => {
  if (e.key === 'Escape') {
    document.querySelector('.success').remove();
    document.removeEventListener('keydown', closeUploadSuccessMsgByEsc);
  }
};

const showUploadSuccessMsg = () => {
  const uploadSuccessMsgEl = uploadSuccessMsgTmplEl.cloneNode(true);
  const successButton = uploadSuccessMsgEl.querySelector('.success__button');
  document.body.append(uploadSuccessMsgEl);

  successButton.addEventListener('click', () => {
    uploadSuccessMsgEl.remove();
    document.removeEventListener('keydown', closeUploadSuccessMsgByEsc);
  });
  uploadSuccessMsgEl.addEventListener('click', (e) => {
    if (!e.target.closest('.success__inner')) {
      uploadSuccessMsgEl.remove();
      document.removeEventListener('keydown', closeUploadSuccessMsgByEsc);
    }
  });
  document.addEventListener('keydown', closeUploadSuccessMsgByEsc);
};

const closeUploadErrorMsgByEsc = (e) => {
  if (e.key === 'Escape') {
    e.stopImmediatePropagation();
    document.querySelector('.error').remove();
    document.removeEventListener('keydown', closeUploadErrorMsgByEsc);
  }
};

const showUploadErrorMsg = () => {
  const uploadErrorMsgEl = uploadErrorMsgTmplEl.cloneNode(true);
  const errorButton = uploadErrorMsgEl.querySelector('.error__button');
  document.body.append(uploadErrorMsgEl);

  errorButton.addEventListener('click', () => {
    uploadErrorMsgEl.remove();
    document.removeEventListener('keydown', closeUploadErrorMsgByEsc);
  });
  uploadErrorMsgEl.addEventListener('click', (e) => {
    if (!e.target.closest('.error__inner')) {
      uploadErrorMsgEl.remove();
      document.removeEventListener('keydown', closeUploadErrorMsgByEsc);
    }
  });
  document.addEventListener('keydown', closeUploadErrorMsgByEsc);
};

const onFormSubmit = (e) => {
  e.preventDefault();
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
  }
};

const initUploadForm = () => {
  fileInputEl.addEventListener('change', openEditPhotoModal);
  editPhotoModalCloseEl.addEventListener('click', closeEditPhotoModal);
  initValidateRules();
  formEl.addEventListener('submit', onFormSubmit);

  initScale();
  initEffect();
};

export { initUploadForm };
