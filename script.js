document.getElementById("get-directions").addEventListener("click", () => {
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const directions = document.getElementById('directions');
    const map = document.getElementById('map');

    if (from && to) {
        map.src = `https://maps.google.com/maps?q=${encodeURIComponent(from)}%20to%20${encodeURIComponent(to)}&output=embed`;
        directions.innerHTML = `Click <a href="https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}" target="_blank">here</a> for directions from ${from} to ${to}.`;
    } else {
        directions.innerText = 'Please enter a valid starting location and destination.';
    }
});

document.getElementById("get-weather").addEventListener("click", function () {
    const city = document.getElementById("weather-city").value.trim();
    
    if (city === "") {
        alert("Please enter a city name!");
        return;
    }

    const apiKey = "60ea3475e5af535751856336f89da250";
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

    fetch(geoUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                alert("City not found! Please enter a valid city.");
                return;
            }

            const lat = data[0].lat;
            const lon = data[0].lon;
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

            return fetch(weatherUrl);
        })
        .then(response => response.json())
        .then(weatherData => {
            if (!weatherData || !weatherData.main) {
                alert("Weather data not available.");
                return;
            }

            document.getElementById("temperature").textContent = `${weatherData.main.temp} °C`;
            document.getElementById("weather-condition").textContent = weatherData.weather[0].description;
            document.getElementById("humidity").textContent = `${weatherData.main.humidity} %`;
            document.getElementById("wind-speed").textContent = `${weatherData.wind.speed} m/s`;
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            alert("An error occurred while fetching weather details.");
        });
});
const amadeusAPI = {
    clientId: "NNAQn67exXyuUTmrsuf2hquqVJDVIX70",
    clientSecret: "Xln2Nr1UNHnA0QHA",
};

async function getAccessToken() {
    const url = "https://test.api.amadeus.com/v1/security/oauth2/token";

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type: "client_credentials",
            client_id: amadeusAPI.clientId,
            client_secret: amadeusAPI.clientSecret,
        }),
    });

    const data = await response.json();
    return data.access_token;
}

async function fetchHotels(cityCode) {
    const token = await getAccessToken();

    const url = `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=${cityCode}`;

    const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    displayHotels(data);
}

function displayHotels(data) {
    const hotelSection = document.getElementById("hotel-list");
    hotelSection.innerHTML = ""; 

    if (!data.data || data.data.length === 0) {
        hotelSection.innerHTML = "<p>No hotels found for this city.</p>";
        return;
    }

    data.data.forEach(hotel => {
        const hotelCard = document.createElement("div");
        hotelCard.classList.add("hotel-card");
        hotelCard.innerHTML = `
            <h3>${hotel.name}</h3>
            <p><strong>Hotel ID:</strong> ${hotel.hotelId}</p>
            <p><strong>Latitude:</strong> ${hotel.geoCode.latitude}, <strong>Longitude:</strong> ${hotel.geoCode.longitude}</p>
        `;
        hotelSection.appendChild(hotelCard);
    });
}

document.getElementById("get-hotels").addEventListener("click", () => {
    const cityCode = document.getElementById("hotel-city").value.toUpperCase();
    if (cityCode) {
        fetchHotels(cityCode);
    } else {
        alert("Please enter a valid city code (e.g., NYC, LON, DEL).");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll("nav ul li a");

    navLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            
            const targetId = this.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 60, 
                    behavior: "smooth"
                });
            }
        });
    });
});
