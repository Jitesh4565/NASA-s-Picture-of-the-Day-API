document.addEventListener('DOMContentLoaded', () => {
    localStorage.clear();
    getCurrentImageOfTheDay(); 

    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const currentImageContainer = document.getElementById('current-image-container');
    const searchHistory = document.getElementById('search-history');

    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const selectedDate = searchInput.value;
        getImageOfTheDay(selectedDate);
    });

});

function getCurrentImageOfTheDay() {
    const currentDate = new Date().toISOString().split("T")[0];
    getImageOfTheDay(currentDate);
}

function getImageOfTheDay(date) {
    const apiKey = 'HqMZSZZbxjkV66OJUGq7Lp6dGc13xvuezVj2MLWf';
    const apiUrl = `https://api.nasa.gov/planetary/apod?date=${date}&api_key=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayImage(data);
            saveSearch(date);
            addSearchToHistory();
            scrollToImageContainer(); 
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displayImage(data) {
    const currentImageContainer = document.getElementById('current-image-container');
    const formattedDate = data.date; 

    currentImageContainer.innerHTML = `
        <h2>Picture On ${formattedDate}</h2>
        <img src="${data.url}" alt="${data.title}">
        <h3>${data.title}</h3>
        <p>${data.explanation}</p>
    `;
}
function scrollToImageContainer() {
    const currentImageContainer = document.getElementById('current-image-container');
    currentImageContainer.scrollIntoView({ behavior: 'smooth' });
}

function saveSearch(date) {
    let searches = JSON.parse(localStorage.getItem('searches')) || [];
    if (!searches.includes(date)) {
        searches.push(date);
        localStorage.setItem('searches', JSON.stringify(searches));
    }
}

function addSearchToHistory() {
    const searchHistory = document.getElementById('search-history');
    const searches = JSON.parse(localStorage.getItem('searches')) || [];

    searchHistory.innerHTML = searches.map(search => `<li>${search}</li>`).join('');

   
    searchHistory.querySelectorAll('li').forEach(item => {
        item.addEventListener('click', function () {
            const selectedDate = item.textContent;

           
            searchHistory.querySelectorAll('li').forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            
            item.classList.add('active');

            getImageOfTheDay(selectedDate);
        });
    });
}