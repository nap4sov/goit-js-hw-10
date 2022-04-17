import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;
const refs = {
    inputField: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

refs.inputField.addEventListener('input', debounce(onSearchFieldInput, DEBOUNCE_DELAY));

function onSearchFieldInput(e) {
    resetMarkup();

    const inputStr = e.target.value.trim();

    if (!inputStr) {
        resetMarkup();
        return;
    }

    fetchCountries(inputStr)
        .then(countries => {
            if (countries.length > 10) {
                Notify.info('Too many matches found. Please enter a more specific name.');
                return;
            }

            if (countries.length >= 2 && countries.length <= 10) {
                countries.map(createListMarkup);
                return;
            }

            createCountryInfoMarkup(countries[0]);
            return;
        })
        .catch(error => {
            Notify.failure('Oops, there is no country with that name');
        });
}

function createListMarkup(country) {
    const markup = `<li class="country-list-item"><img src="${country.flags.svg}" alt="${country.name.official}" height="25px"><span>${country.name.official}</span></li>`;
    refs.countryList.insertAdjacentHTML('beforeend', markup);
}

function createCountryInfoMarkup(country) {
    const markup = `<p class="country-info-title"><img src="${country.flags.svg}" alt="${
        country.name.official
    }" height="30px">${country.name.official}</p>
<p><span class="country-info-subtitle">Capital: </span>${country.capital}</p>
<p><span class="country-info-subtitle">Population: </span>${country.population}</p>
<p><span class="country-info-subtitle">Languages: </span>${Object.values(country.languages)}</p>`;
    refs.countryInfo.insertAdjacentHTML('beforeend', markup);
}

function resetMarkup() {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
}
