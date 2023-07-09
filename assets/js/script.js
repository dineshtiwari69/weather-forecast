const appId = "b8471db96386d69f830154b522912014"


function loadData(data) {
    const cityName = data.name;
    const weather = data.weather[0];

    const cloudUrl = `http://openweathermap.org/img/wn/${weather.icon}@4x.png`;



    document.getElementById("temperature").innerHTML = data.main.temp;
    document.getElementById("weatherIcon").src = cloudUrl;
    document.getElementById("cityName").innerHTML = cityName;

    const latLong = data.coord;
    const lat = latLong.lat;
    const long = latLong.lon;

    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${appId}&units=metric`

    fetch(url).then(response => response.json()).then(data => {
        const forecast = data.list;
        // only pick every 5th 
        const filteredForecast = forecast.filter((value, index) => {
            return index % 8 == 0;
        });
        
        filteredForecast.forEach((value, index) => {
           
            const weather = value.weather[0];
            const cloudUrl = `http://openweathermap.org/img/wn/${weather.icon}@4x.png`;

            let mainElem = document.createElement("div");
            mainElem.classList.add("card");
            mainElem.classList.add("cardMain");

            let dateElem = document.createElement("span");
            //convert timestamp to something like "Monday , Jun 12"
            let date = new Date(value.dt * 1000);
            let day = date.getDay();
            let month = date.getMonth();
            let dayOfMonth = date.getDate();
            let dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

            let dayName = dayNames[day];
            let monthName = monthNames[month];

            let dayString = `${dayName} , ${monthName} ${dayOfMonth}`;

            //inclyude time if index is 0

            if (index == 0) {
                let time = date.toLocaleTimeString();
                dayString = `${dayString} ${time}`;
            }
                


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




function initialLoader() {
    enableLoader();
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Kathmandu&appid=${appId}&units=metric`
    fetch(url).then(response => response.json()).then(data => {
        loadData(data);


    })

}

window.addEventListener("load", initialLoader);



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

}


