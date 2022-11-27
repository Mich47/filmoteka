const watchedBtn = document.querySelector('#watched-btn');
const queueBtn = document.querySelector('#queue-btn');

watchedBtn.addEventListener('click', () => {
  if (!watchedBtn.classList.contains('button--active')) {
    watchedBtn.classList.toggle('button--active');
    queueBtn.classList.toggle('button--active');
  }
});

queueBtn.addEventListener('click', () => {
  if (!queueBtn.classList.contains('button--active')) {
    queueBtn.classList.toggle('button--active');
    watchedBtn.classList.toggle('button--active');
  }
});
