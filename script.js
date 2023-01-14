const wrapper = document.querySelector('.wrapper');
const currentTime = document.querySelector('header .current-time');
const cityInput = document.querySelector('.input-section input');
const checkWeatherButton = document.querySelector('.input-section .check-weather');
const infoText = document.querySelector('.info-text');
const locationButton = document.querySelector('.input-section .get-location');
const weatherImage = document.querySelector('.weather-section img');
const backButton = document.querySelector('.header-icon');

const openWeatherBaseUrl = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = '1dcc1573b617058a1585a497751eef2b';

const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const date = new Date();
const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
currentTime.innerText = `${weekday[date.getDay()]} ${date.getDate()}, ${hours}:${minutes}`;

const requestWeatherData = async (apiUrl) => {
    return await fetch(apiUrl).then(response => response.json());
};

const setWeatherDetails = (details) => {
    if (details.message === 'city not found') {
        infoText.classList.contains('pending') && infoText.classList.replace('pending', 'error');
        infoText.innerText = `${cityInput.value} isn't a valid city`;
        return;
    }

    infoText.classList.contains('error') && infoText.classList.replace('error', 'pending');

    // Extract the data from the API response object.
    const city = details.name;
    const { country } = details.sys;
    const { temp, humidity, feels_like } = details.main;
    const { description, icon } = details.weather[0];
    const weatherSection = wrapper.querySelector('.weather-section');

    // Set the data in places it needs to be displayed.
    weatherImage.src = `icons/${icon}.svg`;
    weatherSection.querySelector('.weather').innerText = description.replace(description[0], description[0].toUpperCase());
    weatherSection.querySelector('.temperature .degree-number').innerText = Math.round(temp);
    weatherSection.querySelector('.location span:last-child').innerText = `${city}, ${country}`;
    weatherSection.querySelector('.bottom-details .degree-number').innerText = Math.round(feels_like);
    weatherSection.querySelector('.bottom-details .humidity-number').innerText = humidity;

    wrapper.classList.remove('location-input');
};

const setPendingState = () => {
    infoText.innerText = 'Getting weather details...';
    infoText.classList.add('pending');
};

const setErrorState = (error) => {
    infoText.innerText = error.message;
    infoText.classList.add('error');
};

const resetFlow = () => {
    cityInput.value = '';
    wrapper.classList.add('location-input');
    infoText.classList.remove('pending');
    infoText.classList.remove('error');
};

locationButton.addEventListener('click', () => {
    navigator.geolocation
        ? navigator.geolocation.getCurrentPosition(onSuccess, onError)
        : alert('Your Browser Does Not Support Geolocation API');
});

const onError = (error) => {
    setErrorState(error.message);
};

const onSuccess = (position) => {
    const { latitude, longitude } = position.coords;
    const apiUrl = `${openWeatherBaseUrl}?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    infoText.innerText = 'Getting weather details...';
    infoText.classList.add('pending');
    requestWeatherData(apiUrl).then(setWeatherDetails);
};

cityInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter' && cityInput.value) {
        const apiUrl = `${openWeatherBaseUrl}?q=${cityInput.value}&units=metric&appid=${apiKey}`;
        setPendingState();
        requestWeatherData(apiUrl).then(setWeatherDetails);
    }
});

checkWeatherButton.addEventListener('click', () => {
    if (!cityInput.value) return;

    setPendingState();
    const apiUrl = `${openWeatherBaseUrl}?q=${cityInput.value}&units=metric&appid=${apiKey}`;
    requestWeatherData(apiUrl).then(setWeatherDetails);
});

backButton.addEventListener('click', () => {
    resetFlow();
});