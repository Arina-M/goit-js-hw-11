import refs from './refs';
import { createMarkup } from './markup';
import Notiflix from 'notiflix';

Notiflix.Notify.init({
  width: '280px',
  position: 'right-top',
  opacity: 1,
  timeout: 2000,
  distance: '40px',
});

const axios = require('axios').default;

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '35659797-8cc42750c81fcd96097728ed9';

export async function getImages(name, page = 1) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: name,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
  });

  const response = await axios.get(`${BASE_URL}?${params}&page=${page}`);
  const datas = response.data;
  refs.loadmore.hidden = false;

 
  if (page === 1 && datas.totalHits !== 0) {
    Notiflix.Notify.info(`Hooray! We found ${datas.totalHits} images.`);
  }

  refs.card.insertAdjacentHTML('beforeend', createMarkup(datas.hits));


  if (refs.card.childNodes.length + 1 > datas.totalHits && datas.totalHits !== 0) {
    refs.loadmore.hidden = true;
    Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
  }

  if (!datas.hits.length) {
    refs.loadmore.hidden = true;
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    return;
  }
}