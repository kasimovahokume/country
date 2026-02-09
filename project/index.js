
const flexContainer = document.getElementById('flexContainer');
const searchInput = document.querySelector('.searc-inp');
const searchBtn = document.querySelector('.btnoz');
const dropdownItems = document.querySelectorAll('.dropdown-item');

let allCountries = []; 


async function getCountries() {
    try {
        const apiUrl = 'https://restcountries.com/v3.1/all?fields=name,flags,region,population,capital,currencies';
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`API xətası: ${response.status}`);
        }

        const countries = await response.json();

        if (Array.isArray(countries)) {
            allCountries = countries;
            renderCountries(allCountries);
        }
    } catch (error) {
        flexContainer.innerHTML = `<h2 style="color:white; padding: 20px;">Xəta: ${error.message}</h2>`;
        console.error("Xəta baş verdi:", error);
    }
}


function renderCountries(data) {
    if (!data || data.length === 0) {
        flexContainer.innerHTML = `<h2 style="color:white; padding: 20px;">Country not found...</h2>`;
        return;
    }

    flexContainer.innerHTML = data.map(country => {
        const currencyKey = country.currencies ? Object.keys(country.currencies)[0] : null;
        const currencyName = currencyKey ? country.currencies[currencyKey].name : 'N/A';
        const currencySymbol = currencyKey ? country.currencies[currencyKey].symbol : '';

         let borderColor = '#58a6ff'; // Default mavi
        if (country.region === 'Africa') borderColor = '#2ecc71'; // Yaşıl
        if (country.region === 'Americas') borderColor = '#f1c40f'; // Sarı
        if (country.region === 'Asia') borderColor = '#e74c3c'; // Qırmızı
        if (country.region === 'Europe') borderColor = '#e13ce7'; // pembe
        if (country.region === 'Europe') borderColor = '#3f3ce7'; // goy
        if (country.region === 'Oceania') borderColor = '#d6e73c'; // sari
        if (country.region === 'Antarctic') borderColor = '#e78f3c'; // narinci
        return `
            <div class="country-card" style="border: 2px solid ${borderColor}; box-shadow: 0 0 10px ${borderColor}44;">
                <img class="flag" src="${country.flags.png}" alt="${country.name.common}">
                <div class="info">
                    <h3>${country.name.common}</h3>
                    <p><span class="spaninfo">Region:</span> ${country.region}</p>
                    <p><span class="spaninfo">Population:</span> ${(country.population / 1000000).toFixed(1)}M</p>
                    
                    <div class="currency-box" style="background: rgba(255,255,255,0.05); padding: 8px; border-radius: 8px; margin: 10px 0; border: 1px solid #444;">
                        <small style="color: #888; font-size: 10px; display: block;">CURRENCY</small>
                        <div style="color: ${borderColor}; font-weight: bold;">${currencyKey ? currencyKey : 'N/A'} (${currencySymbol})</div>
                        <div style="font-size: 11px; color: #666;">${currencyName}</div>
                    </div>

                    <p><span class="spaninfo">Capital:</span> ${country.capital ? country.capital[0] : 'N/A'}</p>
                </div>
            </div>
        `;
    }).join('');
}


searchBtn.addEventListener('click', () => {
    const value = searchInput.value.toLowerCase().trim();
    const filtered = allCountries.filter(c => 
        c.name.common.toLowerCase().includes(value)
    );
    renderCountries(filtered);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});


dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const region = e.target.innerText;
        
        const filtered = region === 'All Regions' 
            ? allCountries 
            : allCountries.filter(c => c.region === region);
            
        renderCountries(filtered);
    });
});

getCountries();