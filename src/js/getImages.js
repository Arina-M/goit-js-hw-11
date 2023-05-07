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
const API_KEY = '36132963-ae980ea5b1e92ccaac12cb36f';

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
  refs.loadmore.style.display = "block";

 
  if (page === 1 && datas.totalHits !== 0) {
    Notiflix.Notify.info(`Hooray! We found ${datas.totalHits} images.`);
  }

  refs.card.insertAdjacentHTML('beforeend', createMarkup(datas.hits));


  if (refs.card.childNodes.length + 1 > datas.totalHits && datas.totalHits !== 0) {
    refs.loadmore.style.display = "none";
    Notiflix.Notify.warning("Sorry, but you've reached the end of search results.");
  }

  if (!datas.hits.length) {
    refs.loadmore.style.display = "none";
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    return;
  }
}