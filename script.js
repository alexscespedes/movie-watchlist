const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const resultsContainer = document.getElementById("results-container");
const watchlistContainer = document.getElementById("watchlist-container");

document.addEventListener("DOMContentLoaded", loadWatchlist);

searchButton.addEventListener("click", async () => {
  const query = searchInput.value.trim();
  if (!query) return;
  const movies = await fetchMovies(query);
  displaySearchResults(movies);
});

async function fetchMovies(query) {
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
  );
  const data = await response.json();
  return data.Search || [];
}

function displaySearchResults(movies) {
  resultsContainer.innerHTML = "";

  movies.forEach((movie) => {
    const card = document.createElement("div");
    card.classList.add("movie-card");

    card.innerHTML = `
        <img src="${
          movie.Poster !== "N/A"
            ? movie.Poster
            : "https://dummyimage.com/150x240/cccccc/000000&text=No+Poster"
        }" alt="${movie.Title}">
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
        <button onclick="addToWatchlist('${
          movie.imdbID
        }')">Add to Watchlist</button>
        `;

    resultsContainer.appendChild(card);
  });
}

function addToWatchlist(imdbID) {
  fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`)
    .then((res) => res.json())
    .then((movie) => {
      let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
      if (watchlist.some((item) => item.imdbID === movie.imdbID)) return;

      watchlist.push(movie);
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
      loadWatchlist();
    });
}

function loadWatchlist() {
  watchlistContainer.innerHTML = "";
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

  watchlist.forEach((movie) => {
    const card = document.createElement("div");
    card.classList.add("movie-card");

    card.innerHTML = `
        <img src="${
          movie.Poster !== "N/A"
            ? movie.Poster
            : "https://dummyimage.com/150x240/cccccc/000000&text=No+Poster"
        }" alt="${movie.Title}">
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
        <button onclick="removeFromWatchlist('${movie.imdbID}')">Remove</button>
        `;

    watchlistContainer.appendChild(card);
  });
}

function removeFromWatchlist(imdbID) {
  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  watchlist = watchlist.filter((movie) => movie.imdbID !== imdbID);
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
  loadWatchlist();
}
