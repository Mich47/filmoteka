import './sass/main.scss';

import './js/navigation-toggle';
import './js/mylib-btn-toggle';
import './js/pagination';
import { Filmoteka } from './js/Filmoteka';

// import * as throttle from 'lodash.throttle';
// import { Notify } from 'notiflix/build/notiflix-notify-aio';
// const axios = require('axios').default;
// import svg from './img/icons.svg';

const refs = {
  searchForm: document.querySelector('#search-form'),
  filmotekaList: document.querySelector('.filmoteka__list'),
};

const APIKey = 'e0e51fe83e5367383559a53110fae0e8';

const filmoteka = new Filmoteka(refs, APIKey);
filmoteka.init();
// Filmoteka(refs, APIKey).init();
