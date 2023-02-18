import '../css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const searchInput = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;
let inputQuery = '';

searchInput.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(evt) {
  inputQuery = evt.target.value.trim();
  if (inputQuery === '') {
    countryListReset();
    countryInfoReset();
    return;
  }
  fetchCountries(inputQuery)
    .then(r => {
      if (!r.ok) {
        countryListReset();
        countryInfoReset();
        Notiflix.Notify.failure('Oops, there is no country with that name');
      }
      return r.json();
    })
    .then(countries => {
      if (countries.length > 10) {
        countryListReset();
        countryInfoReset();
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countries.length >= 2 && countries.length < 10) {
        countryInfoReset();
        createMarkupCoutryList(countries);
      } else if (countries.length === 1) {
        createMarkupCoutryInfo(countries);
        countryListReset();
      }
    })
    .catch(error => console.log(error));
}

function countryListReset() {
  countryList.innerHTML = '';
}

function countryInfoReset() {
  countryInfo.innerHTML = '';
}

function createMarkupCoutryList(countries) {
  const markupCoutryList = countries
    .map(country => {
      return `<div><img src="${country.flags.svg}" width="40px" height="30px ">
         <span class ="country-name">${country.name.official}</span></div> `;
    })
    .join('');
  countryList.innerHTML = markupCoutryList;
}

function createMarkupCoutryInfo(countries) {
  const markupCoutryInfo = countries
    .map(country => {
      return `<div><img src="${country.flags.svg}" width="60px" height="45px">
    <span class="country-info-name">${country.name.official}</span>
    <ul >
    <li><b>Capital: </b>${country.capital}
    </li>
    <li><b>Population: </b>${country.population}
    </li>
    <li><b>Languages: </b>${Object.values(country.languages)}
    </li>
    </ul>
    </div>`;
    })
    .join('');
  countryInfo.innerHTML = markupCoutryInfo;
}
