const flexContainer = document.querySelector("#flexContainer");
const searcInp = document.querySelector(".searc-inp");
const searchBtn = document.querySelector(".btnoz");
const dropdownItems = document.querySelectorAll(".dropdown-item");
const dropdownMenuButton = document.querySelector("#dropdownMenuButton");

let allCountries = []; // API-dən gələn ölkələri saxlayacağıq

// API-dən ölkələri gətirən funksiya
async function getCountries() {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,flags,region,population,capital",
    );
    const countries = await response.json();
    allCountries = countries; 
    showCountries(allCountries); // ilk dəfə bütün ölkələri göstər
  } catch (err) {
    flexContainer.innerHTML = "<h2 style='color:white;'>Məlumat yüklənərkən xəta baş verdi.</h2>";
    console.error(err);
  }
}

// Ölkələri ekrana çıxaran funksiya
function showCountries(countries) {
  flexContainer.innerHTML = ""; // div temizlenir

  // --- YENİ: Ölkə tapılmadısa mesaj çıxar ---
  if (countries.length === 0) {
    const noResult = document.createElement("h2");
    noResult.innerText = "Axtarışınıza uyğun ölkə tapılmadı";
    noResult.style.color = "white";
    noResult.style.padding = "20px";
    noResult.style.textAlign = "center";
    // noResult.style.width = "100%";
    flexContainer.appendChild(noResult);
    return; 
  }

  for (let i = 0; i < countries.length; i++) {
    const country = countries[i];

    const card = document.createElement("div");
    card.className = "country-card";

    // Bayraq hissəsi
    const flag = document.createElement("img");
    flag.className = "flag";

    if (country.flags && country.flags.png) {
      flag.src = country.flags.png;
      flag.alt = country.name.common;
      card.appendChild(flag);
    } else {
      const noFlag = document.createElement("p");
      noFlag.innerText = "Bayraq yoxdur";
      noFlag.style.color = "white";
      noFlag.style.padding = "10px";
      card.appendChild(noFlag);
    }

    // Ölkə adı
    const title = document.createElement("h3");
    title.innerText = country.name.common;
    title.style.color = "white";
    title.style.padding = "10px";

    // Region
    const region = document.createElement("p");
    region.innerHTML = "<span class='spaninfo'>Region:</span> " + country.region;
    region.style.color = "white";
    region.style.paddingLeft = "10px";

    // Population
    const population = document.createElement("p");
    population.innerHTML =
      "<span class='spaninfo'>Population:</span> " +
      ((country.population / 1000000).toFixed(1) + "M");
    population.style.color = "white";
    population.style.paddingLeft = "10px";

    // Capital
    const capital = document.createElement("p");
    capital.innerHTML =
      "<span class='spaninfo'>Capital:</span> " +
      (country.capital && country.capital.length > 0 ? country.capital[0] : "Paytaxt yoxdur");
    capital.style.color = "white";
    capital.style.paddingLeft = "10px";

    // Karta əlavə et
    card.appendChild(title);
    card.appendChild(region);
    card.appendChild(population);
    card.appendChild(capital);

    // Ekrana əlavə et
    flexContainer.appendChild(card);
  }
}

// Search funksionallığı
searchBtn.addEventListener("click", () => {
  const value = searcInp.value.toLowerCase().trim();
  
  if (value === "") {
    showCountries(allCountries);
    return;
  }

  const filtered = allCountries.filter((c) =>
    c.name.common.toLowerCase().includes(value),
  );
  
  showCountries(filtered);
  
  // Axtarışdan sonra inputu təmizləyirik
  searcInp.value = "";
});

// Enter düyməsi ilə axtarış
searcInp.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

// Region filter
dropdownItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    const region = e.target.innerText;
    dropdownMenuButton.innerText = region;

    const filtered =
      region === "All Regions"
        ? allCountries
        : allCountries.filter((c) => c.region === region);
    showCountries(filtered);
  });
});

getCountries();