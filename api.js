const darkmode = document.querySelector("#darkmode");
const body = document.querySelector("#body");
const h3 = document.getElementById("h3");
let dark = false;

darkmode.addEventListener("click", () => {
  dark = !dark;

  if (dark) {
    body.style.backgroundColor = "black";
    h3.innerText = " ☀️Light Mode";
  } else {
    body.style.backgroundColor = "rgb(211, 235, 243)";
    body.style.color = "black";
    h3.innerText = "🌙Dark Mode";
  }
});

const api = "https://restcountries.com/v3.1/independent?status=true";
const container = document.getElementById("countries-container");

let countriesData = [];
let currentPage = 1;
const perPage = 16;

const getCountries = async () => {
  const response = await fetch(api);
  const result = await response.json();
  countriesData = result;
  showCountries();
};

function showCountries(data = countriesData) {
  container.innerHTML = "";

  let start = (currentPage - 1) * perPage;
  let end = start + perPage;

  const pageCountries = data.slice(start, end);

  pageCountries.forEach(country => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${country.flags.png}">
      <h3>${country.name.common}</h3>
    `;

    card.addEventListener("click", () => openModal(country));

    container.appendChild(card);
  });

  document.getElementById("page-number").textContent = currentPage;
}

document.getElementById("next").addEventListener("click", () => {
  if (currentPage * perPage < countriesData.length) {
    currentPage++;
    showCountries();
  }
});

document.getElementById("prev").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    showCountries();
  }
});

/* ----------------------------- */
/*     POPUP OPEN + ANIMATION    */
/* ----------------------------- */
function openModal(country) {
  const modal = document.getElementById("modal");
  
  modal.style.display = "flex";

  setTimeout(() => modal.classList.add("show"), 10);

  document.getElementById("modalFlag").src = country.flags.png;
  document.getElementById("modalName").textContent = country.name.common;
  document.getElementById("modalCapital").textContent = country.capital;
  document.getElementById("modalPopulation").textContent = country.population.toLocaleString();
  document.getElementById("modalRegion").textContent = country.region;
  document.getElementById("modalSubregion").textContent = country.subregion;
}

/* CLOSE MODAL */
document.getElementById("closeModal").onclick = () => {
  const modal = document.getElementById("modal");

  modal.classList.remove("show");

  setTimeout(() => {
    modal.style.display = "none";
  }, 300);
};

/* CTRL + F */
window.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "f") {
    e.preventDefault();
    document.getElementById("searchBar").style.display = "block";
    document.getElementById("searchInput").focus();
  }
});

/* Search */
document.getElementById("searchInput").addEventListener("input", (e) => {
  const text = e.target.value.toLowerCase();

  const filtered = countriesData.filter(c =>
    c.name.common.toLowerCase().includes(text)
  );

  currentPage = 1;
  showCountries(filtered);

  document.getElementById("prev").style.display="none";
  document.getElementById("next").style.display="none";
  document.getElementById("page-number").style.display="none";
});

getCountries();
