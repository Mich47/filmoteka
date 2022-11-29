import './js/navigation-toggle';
import './js/mylib-btn-toggle';

import * as throttle from 'lodash.throttle';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './sass/main.scss';
// import svg from './img/icons.svg';
const axios = require('axios').default;

class Filmoteka {
  THROTTLE_DELAY = 200;
  PER_PAGE_COUNT = 40;
  ORIENTATION = '&orientation=horizontal';
  SAFE_SEARCH = '&safesearch=true';
  IMAGE_TYPE = '&image_type=photo';
  GENRES = [0];

  constructor({ searchForm, filmotekaList }, APIKey) {
    this.searchForm = searchForm;
    this.filmotekaList = filmotekaList;
    this.APIKey = APIKey;
    this.QUERY - null;
    this.totalHits = 1;
    this.page = 1;
    this.clickHandler = null;

    // Если отправили запрос, но ещё не получили ответ,
    // не нужно отправлять ещё один запрос:
    this.isLoading = false;

    // Если контент закончился, вообще больше не нужно
    // отправлять никаких запросов:
    this.shouldLoad = true;
  }

  async init() {
    // Promise.all([this.getGenres(), this.getMovies()]);
    await this.getGenres();
    const URI = `https://api.themoviedb.org/3/trending/movie/day?api_key=${APIKey}`;

    await this.getMovies(URI);
    this.addListeners();
  }

  addListeners() {
    this.searchForm.addEventListener('submit', this.onSearchForm.bind(this));
    // this.gallery.addEventListener('click', this.onGalleryImageClick.bind(this));
  }

  addScrollListeners() {
    this.clickHandler = throttle(
      this.checkScrollPosition.bind(this),
      this.THROTTLE_DELAY
    );

    window.addEventListener('scroll', this.clickHandler);
  }

  removeScrollListeners() {
    window.removeEventListener('scroll', this.clickHandler);
  }

  onGalleryImageClick(event) {
    event.preventDefault();
  }

  async onSearchForm(event) {
    event.preventDefault();
    // this.QUERY = `&q=${event.target.elements.searchQuery.value}`;
    const URI = `https://api.themoviedb.org/3/search/movie?api_key=${this.APIKey}&query=${event.target.elements.searchQuery.value}`;
    // this.removeScrollListeners();

    this.shouldLoad = true;

    await this.clearFilmoteka();
    // await this.setStartValue(event);
    await this.getMovies(URI);
    // await this.addScrollListeners();
  }

  async getMovies(URI) {
    if (this.isLoading || !this.shouldLoad) return;

    this.isLoading = true;

    try {
      const moviesArr = await this.fetchMovies(URI);
      console.log('moviesArr ', moviesArr);

      this.isLoading = false;

      if (moviesArr.length === 0) {
        throw new Error(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }

      // this.page += 1;
      this.markupFilmoteka(moviesArr);

      // this.checkMaxPageLoad();
    } catch (error) {
      Notify.failure(error.message);
    }
  }

  async fetchMovies(URI) {
    const PER_PAGE = `&per_page=${this.PER_PAGE_COUNT}`;
    const PAGE = `&page=${this.page}`;
    // const URI = this.URI;
    // this.ORIENTATION +
    // this.SAFE_SEARCH +
    // this.IMAGE_TYPE +
    // this.QUERY +
    // PER_PAGE +
    // PAGE;

    try {
      const response = await axios.get(URI);
      console.log('response ', response);

      // this.totalHits = Math.ceil(response.data.totalHits / this.PER_PAGE_COUNT);

      // if (this.page === 1 && this.totalHits) {
      //   Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
      // }

      return response.data.results;
    } catch (error) {
      console.error(error);
    }
  }

  markupGenres(genre_ids) {
    let genres = [];

    for (let i = 0; i < genre_ids.length; i++) {
      for (let j = 0; j < this.GENRES.length; j++) {
        const genre = this.GENRES[j];
        if (genre.id === genre_ids[i]) {
          genres.push(genre.name);
          continue;
        }
      }
    }

    return genres.join(', ');
  }

  async getGenres() {
    try {
      this.GENRES = await this.fetchGenres();
    } catch (error) {
      Notify.failure(error.message);
    }
  }

  async fetchGenres() {
    const URI = `https://api.themoviedb.org/3/genre/movie/list?api_key=${this.APIKey}`;

    const response = await axios.get(URI);
    console.log('response ', response.data.genres);

    return response.data.genres;

    // try {
    //   const response = await axios.get(URl);
    //   console.log('response ', response.data.genres);

    //   return response.data.genres;
    // } catch (error) {
    //   console.error(error);
    // }
  }

  checkMaxPageLoad() {
    if (this.totalHits === 1) {
      this.removeScrollListeners();
      this.shouldLoad = false;
      return;
    }

    if (this.page > this.totalHits) {
      this.removeScrollListeners();
      this.shouldLoad = false;

      throw new Error(
        "We're sorry, but you've reached the end of search results."
      );
    }
  }

  setStartValue(event) {
    this.totalHits = 1;
    this.page = 1;
  }

  checkScrollPosition() {
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
    // console.log(scrollHeight); // Висота всього документа в пікселях
    // console.log(scrollTop); // Скрол від верху в пікселях
    // console.log(clientHeight); // Висота вьюпорта

    // Обозначим порог, по приближении к которому
    // будем вызывать какое-то действие.
    // В нашем случае — половина экрана до конца страницы:
    const threshold = scrollHeight - clientHeight / 2;
    // Отслеживаем, где находится низ экрана относительно страницы:
    const position = scrollTop + clientHeight;

    if (position >= threshold) {
      this.getImages();
    }
  }

  clearFilmoteka() {
    this.filmotekaList.innerHTML = '';
  }

  markupFilmoteka(dataArr) {
    this.filmotekaList.insertAdjacentHTML(
      'beforeend',
      dataArr.map(this.markupCard.bind(this)).join('')
    );
  }

  markupCard(imgObj) {
    const base_url = 'https://image.tmdb.org/t/p/';
    // const file_size = 'original';
    const file_size = 'w500';
    const URI = `${base_url}${file_size}${imgObj.poster_path}`;
    const date = new Date(imgObj.release_date);

    const genres = this.markupGenres(imgObj.genre_ids);

    return `<li class="grid__item filmoteka__item">
				<div class="filmoteka__thumb">
					<div class="card">
						<img class="card__img" src="${URI}" alt="">
						<div class="card__wrapper">
							<h3 class="card__title title">${imgObj.original_title}</h3>
							<p class="card__desc">${genres} | ${date.getFullYear()}
							</p>
						</div>
					</div>
				</div>
			</li>
    `;
  }
}

const refs = {
  searchForm: document.querySelector('#search-form'),
  filmotekaList: document.querySelector('.filmoteka__list'),
};

const APIKey = 'e0e51fe83e5367383559a53110fae0e8';

new Filmoteka(refs, APIKey).init();
