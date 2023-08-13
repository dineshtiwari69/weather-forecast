const appId = "b8471db96386d69f830154b522912014"

function getDateTimeString(timestamp){
    //datetime in this format 2023 Jun 12 12:00:00 from timestamp 1689498000
    let date = new Date(timestamp * 1000);
    
    let day = date.getDay();
    let month = date.getMonth();
    let dayOfMonth = date.getDate();
    let dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

    let dayName = dayNames[day];
    let monthName = monthNames[month];

    let dayString = `${dayName} , ${monthName} ${dayOfMonth}`;

    let time = date.toLocaleTimeString();

    let dateTimeString = `As of ${dayString} ${time}`;

    return dateTimeString;
}
function toSentenceCase(str){
    return str.toLowerCase().charAt(0).toUpperCase() + str.slice(1);;
}

function loadData(data) {
    const cityName = data.name;
    const weather = data.weather[0];
    const timestamp = data.dt;
    const cloudStatus = weather.description;

    const cloudUrl = `http://openweathermap.org/img/wn/${weather.icon}@4x.png`;


    document.getElementById("cloudStatus").innerHTML = `Cloud Status : ${toSentenceCase(cloudStatus)}`;
    document.getElementById("temperature").innerHTML = data.main.temp;
    document.getElementById("weatherIcon").src = cloudUrl;
    document.getElementById("cityName").innerHTML = cityName;
    document.getElementById("humidity").innerHTML = data.main.humidity;
    document.getElementById("pressure").innerHTML = data.main.pressure;
    document.getElementById("datetime").innerHTML = getDateTimeString(timestamp);
    const minMax = data.wind.speed;
    document.getElementById("windSpeed").innerHTML = minMax;



    const latLong = data.coord;
    const lat = latLong.lat;
    const long = latLong.lon;

    const url = `history.php?city=${cityName}`;

    fetch(url).then(response => response.json()).then(data => {
        document.getElementById("5dayForecast").innerHTML = "";
        const forecast = data;
       
        
        forecast.forEach((value, index) => {
           
            const weather = value.weather[0];
            const cloudUrl = `http://openweathermap.org/img/wn/${weather.icon}@4x.png`;

            let mainElem = document.createElement("div");
            mainElem.classList.add("card");
            mainElem.classList.add("cardMain");

            let dateElem = document.createElement("span");

            

            let date = new Date(value.last_updated);
            let day = date.getDay();
            let month = date.getMonth();
            let dayOfMonth = date.getDate();
            let dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

            let dayName = dayNames[day];
            let monthName = monthNames[month];

            let dayString = `${dayName} , ${monthName} ${dayOfMonth}`;

            dateElem.innerHTML = dayString;

            
            
            mainElem.appendChild(dateElem);

            let cardInfoElem = document.createElement("div");
            cardInfoElem.classList.add("cardInfo");
            let imgElem = document.createElement("img");
            imgElem.src = cloudUrl;
            imgElem.setAttribute("width", "70px");
            imgElem.setAttribute("height", "70px");

            cardInfoElem.appendChild(imgElem);
            let tempElem = document.createElement("h2");
            tempElem.classList.add("weeklyTemp");
            tempElem.classList.add("convertable");
            tempElem.innerHTML = value.main.temp;
            cardInfoElem.appendChild(tempElem);
            mainElem.appendChild(cardInfoElem);

       

            let subDataElem = document.createElement("div");

            subDataElem.classList.add("subData");
            let subDataItem1 = document.createElement("div");
            subDataItem1.classList.add("subDataItem");
            let subDataItem1Icon = document.createElement("i");
            subDataItem1Icon.classList.add("fa-solid");
            subDataItem1Icon.classList.add("fa-droplet");
            subDataItem1Icon.classList.add("fa-lg");
            subDataItem1Icon.style.color = "#ffffff";
            subDataItem1.appendChild(subDataItem1Icon);
            let subDataItem1Temp = document.createElement("h3");
            subDataItem1Temp.classList.add("convertable");
            subDataItem1Temp.innerHTML = value.main.humidity;
            subDataItem1.appendChild(subDataItem1Temp);
            let subDataItem1P = document.createElement("p");
            subDataItem1P.innerHTML = "Humidity";
            subDataItem1.appendChild(subDataItem1P);
            subDataElem.appendChild(subDataItem1);
            
            let subDataItem2 = document.createElement("div");
            subDataItem2.classList.add("subDataItem");
            let subDataItem2Icon = document.createElement("i");
            subDataItem2Icon.classList.add("fa-solid");
            subDataItem2Icon.classList.add("fa-jedi");
            subDataItem2Icon.classList.add("fa-lg");
            subDataItem2Icon.style.color = "#ffffff";
            subDataItem2.appendChild(subDataItem2Icon);
            let subDataItem2Temp = document.createElement("h3");
            subDataItem2Temp.classList.add("convertable");
            subDataItem2Temp.innerHTML = value.main.pressure;
            subDataItem2.appendChild(subDataItem2Temp);
            let subDataItem2P = document.createElement("p");
            subDataItem2P.innerHTML = "Pressure";
            subDataItem2.appendChild(subDataItem2P);
            subDataElem.appendChild(subDataItem2);
            
            let subDataItem3 = document.createElement("div");
            subDataItem3.classList.add("subDataItem");
            
            let subDataItem3Icon2 = document.createElement("i");
            subDataItem3Icon2.classList.add("fa-solid");
            subDataItem3Icon2.classList.add("fa-wind");
            subDataItem3Icon2.classList.add("fa-lg");
            subDataItem3Icon2.style.color = "#ffffff";
            subDataItem3.appendChild(subDataItem3Icon2);
            let subDataItem3Temp = document.createElement("h3");
            subDataItem3Temp.classList.add("wind");
            subDataItem3Temp.innerHTML = value.wind.speed;
            subDataItem3.appendChild(subDataItem3Temp);
            let subDataItem3P = document.createElement("p");
            subDataItem3P.innerHTML = "Wind";
            subDataItem3.appendChild(subDataItem3P);
            subDataElem.appendChild(subDataItem3);

            mainElem.appendChild(subDataElem);

            let main = document.getElementById("5dayForecast");
            main.appendChild(mainElem);


        })
        disableLoader();
    })


}

function enableLoader() {
    document.getElementById("loader").style.display = "";
}
function disableLoader() {
    document.getElementById("loader").style.display = "none";
}

function fetchWeatherDataByCityName(city) {
    enableLoader();
    //const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${appId}&units=metric`
    const url = `api.php?city=${city}`
    fetch(url).then(response => response.json()).then(data => {
        loadData(data);
        
    })
    .catch(error => {
        alert("City not found");
        disableLoader();
    })
}



function initialLoader() {
    fetchWeatherDataByCityName("Neath Port Talbot");
    document.getElementById("searchForm").addEventListener("submit", handleSearch);

    
}





function activeMode() {
    let calciusSwitch = document.getElementById("celciusSwitch");
    if (calciusSwitch.classList.contains("active")) {
        return "C";
    }
    else {
        return "F";
    }
}

function toggleSwitch() {
    let calciusSwitch = document.getElementById("celciusSwitch");
    let fahrenheitSwitch = document.getElementById("fahrenheitSwitch");
    if (calciusSwitch.classList.contains("active")) {
        calciusSwitch.classList.remove("active");
        fahrenheitSwitch.classList.add("active");

    }
    else {
        calciusSwitch.classList.add("active");
        fahrenheitSwitch.classList.remove("active");
    }
    convertTemp();
}


function convertTemp() {
    let allElems = document.getElementsByClassName("convertable");

    let mode = activeMode();

    for (let i = 0; i < allElems.length; i++) {
        let elm = allElems[i];
        let temp = parseFloat(elm.innerText);
        if (mode == "C") {
            temp = (temp - 32) * (5 / 9);
        }
        else {
            temp = (temp * (9 / 5)) + 32;
        }
        //check if temp is a number with decimals 
        if (temp % 1 != 0) {
            temp = temp.toFixed(2);
        }




        elm.innerHTML = (temp);
    }

    const minMaxElems = document.getElementsByClassName("convertableMinMax");
    for (let i = 0; i < minMaxElems.length; i++) {
        let elm = minMaxElems[i];
        let temps = elm.innerText.split("-");
        let min = parseFloat(temps[0]);
        let max = parseFloat(temps[1]);
        if (mode == "C") {
            min = (min - 32) * (5 / 9);
            max = (max - 32) * (5 / 9);
        }
        else {
            min = (min * (9 / 5)) + 32;
            max = (max * (9 / 5)) + 32;
        }
        //check if temp is a number with decimals
        if (min % 1 != 0) {
            min = min.toFixed(2);
        }
        if (max % 1 != 0) {
            max = max.toFixed(2);
        }

        elm.innerHTML = `${min} - ${max}`;
    }


    // const minMaxElem = document.getElementById("minMaxTemp");
    // const temps = minMaxElem.innerText.split("-");
    // let min = parseFloat(temps[0]);
    // let max = parseFloat(temps[1]);
    // if (mode == "C") {
    //     min = (min - 32) * (5 / 9);
    //     max = (max - 32) * (5 / 9);
    // }
    // else {
    //     min = (min * (9 / 5)) + 32;
    //     max = (max * (9 / 5)) + 32;
    // }

    // minMaxElem.innerHTML = `${min.toFixed(2)} - ${max.toFixed(2)}`;

}


function handleSearch(e){
    e.preventDefault();
    let input = document.getElementById("cityInput");
    let city = input.value;
    fetchWeatherDataByCityName(city);
}



window.addEventListener("load", initialLoader);