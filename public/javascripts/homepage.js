// COVID live data
// https://api.covid19api.com/live/country/australia/status/confirmed/date/2021-05-11T00:00:00Z

var covidData = new Vue({
    el: "#covid-data",
    data: {
        // 0: ACT, 1: NSW, 2: NT, 3: QLD, 4: SA, 5: TAS, 6: VIC, 7: WA
        // { stateCode, confirmed, deaths, recovered, active }
        data: []
    }
});

function getCovidData() {
    let http = new XMLHttpRequest();
    http.responseType = "json";

    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // console.log(this.response);

            this.response.forEach(element => {
                covidData.data.push({
                    stateCode: getCountryCode(element.Province),
                    confirmed: element.Confirmed,
                    deaths: element.Deaths,
                    recovered: element.Recovered,
                    active: element.Active,
                    lastUpdated: getLastUpdated()
                });
            });
            // console.log(covidData.data);
        }
    };

    // http.open("GET", "https://api.covid19api.com/live/country/australia/status/confirmed/date/2021-05-11T00:00:00Z");
    http.open("GET", "https://api.covid19api.com/live/country/australia/status/confirmed/date/" + getDateString() + "T23:59:59Z");
    http.send();
}

function getCountryCode(string) {
    if (string == "South Australia") {
        return "SA";
    }
    else if (string == "Australian Capital Territory") {
        return "ACT";
    }
    else if (string == "New South Wales") {
        return "NSW";
    }
    else if (string == "Northern Territory") {
        return "NT";
    }
    else if (string == "Queensland") {
        return "QLD";
    }
    else if (string == "Tasmania") {
        return "TAS";
    }
    else if (string == "Victoria") {
        return "VIC";
    }
    else if (string == "Western Australia") {
        return "WA";
    }
    else {
        return "N/A";
    }
}

function getDateString() {
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate()-1);
    let dd = String(yesterday.getDate()).padStart(2, '0');
    let mm = String(yesterday.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = yesterday.getFullYear();
    
    return yyyy + '-' + mm + '-' + dd;
}

function getLastUpdated() {
    let d1 = new Date();
    d1.setHours(0);
    d1.setMinutes(0);
    d1.setSeconds(0);
    let milliseconds = Math.abs(new Date() - d1);
    let hours = milliseconds / 1000 / 3600;

    return Math.floor(hours);
}