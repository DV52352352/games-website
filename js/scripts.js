"use strict";

let pageSize = 12;
let currentPage;
let games;
let apiKey = '877a9f1fba75487095118a5fb2777bd8';

menuToggler.addEventListener('click', ev => {
  menu.classList.toggle('open');
  menuToggler.textContent = menuToggler.textContent === "×" ? "≡" : "×";
});

async function loadGames(query) {
  let baseURL = `https://api.rawg.io/api/games`;
  const response = await fetch(`${baseURL}?key=${apiKey}&search=${query}`);
  const data = await response.json();
  return data.results;
}

function buildArticleFromData(game) {
  //Filters out games that have no metacritic rating
  if (game.metacritic == null) {
    return null;
  }

  const elementResults = document.getElementById("results");
  elementResults.style.setProperty('--background-color', 'rgb(176, 217, 250)');

  const article = document.createElement("article");
  article.classList.add('resultGrid');

  const gameDetails = document.createElement("div");
  gameDetails.classList.add('resultGridText');

  const rating = document.createElement("h4");
  rating.textContent = "metacritic: " + game.metacritic;

  const title = document.createElement("h3");
  title.textContent = game.name;

  gameDetails.appendChild(title);
  gameDetails.appendChild(rating);

  const image = document.createElement("img");
  image.src = game.background_image;
  image.classList.add('resultGridImage');
  image.alt = game.name;

  article.appendChild(image);
  article.appendChild(gameDetails);

  return article;
}

async function insertGames(games) {
  const articles = games.map(buildArticleFromData);
  articles.forEach(a => results.appendChild(a));
}

async function doSearch() {
  clearResults();
  loader.classList.add("waiting");
  games = await loadGames(query.value);
  nPages.textContent = Math.ceil(games.length / pageSize);
  currentPage = 1;
  loadPage();
}

async function insertArticles(games) {
  const articles = games.map(buildArticleFromData).filter(game => game != null);
  articles.forEach(a => results.appendChild(a));
}

function clearResults() {
  while (results.firstChild) {
    results.firstChild.remove();
  }
}

async function loadPage() {
  clearResults();
  const myGames = games.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  loader.classList.add("waiting");
  await insertArticles(myGames);
  loader.classList.remove("waiting");
  pageIndicator.textContent = currentPage;
}

function nextPage() {
  currentPage += 1;
  const nPages = Math.ceil(games.length / pageSize);
  if (currentPage > nPages) { currentPage = 1; }
  loadPage();
}

function prevPage() {
  currentPage -= 1;
  const nPages = Math.ceil(games.length / pageSize);
  if (currentPage < 1) { currentPage = nPages; }
  loadPage();
}

try {
  prev.addEventListener('click', prevPage);
  next.addEventListener('click', nextPage);
  query.addEventListener('change', doSearch);
} catch (error) {
  console.error("prev, next and query not found. If this is not the search games page then you can ignore this message");
}
