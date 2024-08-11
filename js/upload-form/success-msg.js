const uploadSuccessMsgTmplEl = document.querySelector('#success').content.querySelector('.success');

const onEscapeKeyDown = (evt) => {
  if (evt.key === 'Escape') {
    document.querySelector('.success').remove();
    document.removeEventListener('keydown', onEscapeKeyDown);
  }
};

const showUploadSuccessMsg = () => {
  const uploadSuccessMsgEl = uploadSuccessMsgTmplEl.cloneNode(true);
  const successButton = uploadSuccessMsgEl.querySelector('.success__button');
  document.body.append(uploadSuccessMsgEl);

  successButton.addEventListener('click', () => {
    uploadSuccessMsgEl.remove();
    document.removeEventListener('keydown', onEscapeKeyDown);
  });
  uploadSuccessMsgEl.addEventListener('click', (evt) => {
    if (!evt.target.closest('.success__inner')) {
      uploadSuccessMsgEl.remove();
      document.removeEventListener('keydown', onEscapeKeyDown);
    }
  });
  document.addEventListener('keydown', onEscapeKeyDown);
};

export { showUploadSuccessMsg };
