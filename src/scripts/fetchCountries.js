export function fetchCountries(name) {
  const URL = `https://restcountries.com/v3.1/name/${name}?fields=name,capital,flags,languages,population`;

  return fetch(URL);
}
