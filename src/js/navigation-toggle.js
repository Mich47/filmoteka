const header = document.querySelector('#header');
const homeLink = document.querySelector('#home-link');
const myLibLink = document.querySelector('#mylib-link');
const form = document.querySelector('#search-form');
const myLibBtns = document.querySelector('#mylib-btns');

homeLink.addEventListener('click', () => {
  if (!header.classList.contains('js-header-home')) {
    header.classList.toggle('js-header-home');
    header.classList.toggle('js-header-mylib');
    homeLink.classList.toggle('navigation__link--current');
    myLibLink.classList.toggle('navigation__link--current');
    form.style.display = 'block';
    myLibBtns.style.display = 'none';
  }
});

myLibLink.addEventListener('click', () => {
  if (!header.classList.contains('js-header-mylib')) {
    header.classList.toggle('js-header-mylib');
    header.classList.toggle('js-header-home');
    homeLink.classList.toggle('navigation__link--current');
    myLibLink.classList.toggle('navigation__link--current');
    form.style.display = 'none';
    myLibBtns.style.display = 'flex';
  }
});
