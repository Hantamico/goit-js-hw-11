import axios from "axios";
import Notiflix from 'notiflix';

import SimpleLightbox from "simplelightbox";

import "simplelightbox/dist/simple-lightbox.min.css";

const BASE_URl = 'https://pixabay.com/api/';
const API_KEY = "35448334-21883769263356d661c71e8ae";

const refs = {
    formEl: document.querySelector('form'),
    galleryEl: document.querySelector('.gallery'),
    loadMoreBtnEl: document.querySelector('.load-more-button'),
}

let page = 1;


refs.formEl.addEventListener('submit', (evt) => {
    evt.preventDefault();
    refs.galleryEl.innerHTML = "";
    refs.loadMoreBtnEl.classList.add('is-hidden');
    page = 1;
    const name = refs.formEl[0].value.trim().replaceAll(" ", "+");
    console.log(name);

    getImagesByName(name, page)
        .then(galleryRenderMarcup)
        .catch (error => { console.log(error) });
    
})

refs.loadMoreBtnEl.addEventListener('click', loadMore);

async function getImagesByName(name, page) {
    try {
        const responce = await axios.get(`${BASE_URl}?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`);
        return responce.data;
    } catch (error) {
        console.log(error)
    }
}

function galleryRenderMarcup(data) {
    const imagesObj = data.hits;
    const totalPages = Math.ceil(data.totalHits / 40);

    if (imagesObj.length === 0) {
        refs.galleryEl.innerHTML = ""
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        refs.loadMoreBtnEl.classList.add('is-hidden');
        page = 0;
        return;
    }

    if (page < totalPages ) {
        const galleryMarcup = imagesObj.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `
            <div class="photo-card">
                <a href="${largeImageURL}"><img class="photo-card-image" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
                    <div class="info">
                            <p class="info-item">
                            <b>Likes: ${likes}</b>
                            </p>
                            <p class="info-item">
                            <b>Views: ${views}</b>
                            </p>
                            <p class="info-item">
                            <b>Comments: ${comments}</b>
                            </p>
                            <p class="info-item">
                            <b>Downloads: ${downloads}</b>
                            </p>
                    </div>
        </div>
        `
        
    }).join("");

        refs.galleryEl.insertAdjacentHTML("beforeend", galleryMarcup);
        refs.loadMoreBtnEl.classList.remove('is-hidden');
        let galery = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
    });

    }

    if (page === totalPages) {
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        refs.loadMoreBtnEl.classList.add('is-hidden');
    }

    if (page > 1) {
        const { height: cardHeight } = document
            .querySelector(".gallery")
            .firstElementChild.getBoundingClientRect();

        window.scrollBy({
            top: cardHeight * 2,
            behavior: "smooth",
        });
    };
    };

function loadMore() {
    const name = refs.formEl[0].value.trim().replaceAll(" ", "+");

    page += 1;

    getImagesByName(name, page)
        .then(galleryRenderMarcup)
        .catch(error => { console.log(error) });
}

refs.galleryEl.addEventListener('click', onImageClick);



function onImageClick(event) {
  event.preventDefault();
  if (event.target === event.currentTarget) {
    return;
  }

}