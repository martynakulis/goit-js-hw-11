import axios from 'axios';
import Notiflix from 'notiflix';

const apiKey = '23624617-2acc542121790b9c586bd1c21';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
const input = document.querySelector('input');

let page = 1;

loadMore.addEventListener('click', () => {
  fetchImages();
});

async function fetchImages() {
  try {
    const searchParams = new URLSearchParams({
      key: apiKey,
      q: input.value,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: page,
      per_page: 40,
    });
    const response = await axios.get(
      `https://pixabay.com/api/?${searchParams}`
    );
    const images = response.data;
    if (images.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMore.computedStyleMap.display = 'none';
      return;
    }

    page += 1;
    renderGallery(images.hits);
    loadMore.style.display = 'block';
    if (page > Math.ceil(images.totalHits / 40)) {
      loadMore.style.display = 'none';
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    Notiflix.Notify.failure(
      'There was an error fetching images. Please try again later.'
    );
    console.error(error);
  }
}

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  gallery.innerHTML = '';
  page = 1;
  fetchImages();
});

function renderGallery(images) {
  const markup = images
    .map(image => {
      return ` 
    <div class="photo-card">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes: ${image.likes}</b>
        </p>
        <p class="info-item">
          <b>Views: ${image.views}</b>
        </p>
        <p class="info-item">
          <b>Comments: ${image.comments}</b>
        </p>
        <p class="info-item">
          <b>Downloads: ${image.downloads}</b>
        </p>
      </div>
    </div>`;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}
