const uploadErrorMsgTmplEl = document.querySelector('#error').content.querySelector('.error');

const onEscapeKeyDown = (evt) => {
  if (evt.key === 'Escape') {
    evt.stopImmediatePropagation();
    document.querySelector('.error').remove();
    document.removeEventListener('keydown', onEscapeKeyDown);
  }
};

const showUploadErrorMsg = () => {
  const uploadErrorMsgEl = uploadErrorMsgTmplEl.cloneNode(true);
  const errorButton = uploadErrorMsgEl.querySelector('.error__button');
  document.body.append(uploadErrorMsgEl);

  errorButton.addEventListener('click', () => {
    uploadErrorMsgEl.remove();
    document.removeEventListener('keydown', onEscapeKeyDown);
  });
  uploadErrorMsgEl.addEventListener('click', (evt) => {
    if (!evt.target.closest('.error__inner')) {
      uploadErrorMsgEl.remove();
      document.removeEventListener('keydown', onEscapeKeyDown);
    }
  });
  document.addEventListener('keydown', onEscapeKeyDown);
};

export { showUploadErrorMsg };
