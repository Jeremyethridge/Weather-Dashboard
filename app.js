const getElement = (selector) => document.querySelector(selector);

const elements = {
    input: getElement('#cityInput'),
    btn: getElement('#searchButton'),
    clear: getElement('#clear'),
    cityName: getElement('#cityName'),
    cityTemp: getElement('#cityTemp'),
    cityWind: getElement('#cityWind'),
    cityHumidity: getElement('#cityHumidity'),
    firstPic: getElement('#firstPic'),
    section3: getElement('.each-day-temp'),
    cityDate: [],
    forcastPic: [],
    temp: [],
    wind: [],
    humidity: [],
  };
  
  for (let i = 1; i <= 5; i++) {
    elements.cityDate[i] = getElement(`#cityDate${i}`);
    elements.forcastPic[i] = getElement(`#forcastPic${i}`);
    elements.temp[i] = getElement(`#temp${i}`);
    elements.wind[i] = getElement(`#wind${i}`);
    elements.humidity[i] = getElement(`#humidity${i}`);
  }

let lon = 0;
let lat = 0;
const apiKey = '4a3f06e44e07325769ff32c89c5eaa3d';

function kelvinToFahrenheit(kel) {
  return (kel - 273.15) * (9 / 5) + 32;
}

function clear() {
    const clearDiv = (div) => {
      const childDivs = div.querySelectorAll('.day-temp');
      for (let i = 0; i < childDivs.length; i++) {
        const children = childDivs[i].children;
        for (let j = 0; j < children.length; j++) {
          children[j].innerHTML = '';
        }
      }
    };
  
    clearDiv(elements.section3);
    elements.firstPic.src = '';
    elements.cityName.innerHTML = '';
    elements.cityTemp.innerHTML = '';
    elements.cityWind.innerHTML = '';
    elements.cityHumidity.innerHTML = '';
    
    for (let i = 1; i <= 5; i++) {
      elements.cityDate[i].innerHTML = '';
      elements.forcastPic[i].src = '';
      elements.temp[i].innerHTML = '';
      elements.wind[i].innerHTML = '';
      elements.humidity[i].innerHTML = '';
    }
  }

function getApi() {
  clear();

  const currentWeatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${elements.input.value}&appid=${apiKey}`;
  fetch(currentWeatherApi)
    .then((response) => response.json())
    .then((data) => {
      elements.firstPic.classList.remove('nodisplay');
      const cityT = kelvinToFahrenheit(data.main.temp);
      const firstIconforApi = data.weather[0].icon;
      const firstIconUrl = `https://openweathermap.org/img/wn/${firstIconforApi}.png`;
      let formDate = dayjs().format('MM-DD-YYYY')
      elements.firstPic.src = firstIconUrl;
      elements.cityName.prepend(`${data.name} (${formDate})`);
      elements.cityTemp.prepend(`Temp: ${cityT.toFixed(2)} F`);
      elements.cityWind.prepend(`Wind: ${data.wind.speed} mph`);
      elements.cityHumidity.prepend(`Humidity: ${data.main.humidity} %`);
    });

  const lonLatApi = `https://api.openweathermap.org/geo/1.0/direct?q=${elements.input.value}&limit=5&appid=${apiKey}`;
  fetch(lonLatApi)
    .then((response) => response.json())
    .then((longLatData) => {
      lon = longLatData[0].lat;
      lat = longLatData[0].lat;

      const fiveDayApi = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
      fetch(fiveDayApi)
        .then((response) => response.json())
        .then((daysForcast) => {
          const updateDay = (dayIndex, dataIndex) => {
            const dayTemp = daysForcast.list[dataIndex].main.temp;
            const currentDate3 = dayjs();
            const dayDate = currentDate3.add(dayIndex, 'days').format('MM-DD-YYYY');
            const weatherIcon = daysForcast.list[dataIndex].weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${weatherIcon}.png`;

            elements.forcastPic[dayIndex].src = iconUrl;
            elements.cityDate[dayIndex].prepend(dayDate);
            elements.temp[dayIndex].prepend(`Temp: ${kelvinToFahrenheit(dayTemp).toFixed(2)} F`);
            elements.wind[dayIndex].prepend(`Wind: ${daysForcast.list[dataIndex].wind.speed} mph`);
            elements.humidity[dayIndex].prepend(`Humidity: ${daysForcast.list[dataIndex].main.humidity} %`);
          };

          updateDay(1, 2);
          updateDay(2, 10);
          updateDay(3, 18);
          updateDay(4, 26);
          updateDay(5, 34);
        });
    });
}

elements.btn.addEventListener('click', getApi);
elements.clear.addEventListener('click', clear);