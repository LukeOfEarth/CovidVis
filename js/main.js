let global = {};
let saData = {};

const totalBtn = document.getElementById('total');
const dailyBtn = document.getElementById('daily');
const localGraphs = document.getElementsByClassName('container');

totalBtn.addEventListener('click',()=>{
    if(localGraphs[0].id === 'inactive'){
        localGraphs[0].id='';
        localGraphs[1].id = 'inactive';
    }
});

dailyBtn.addEventListener('click',()=>{
    if(localGraphs[1].id==='inactive'){
        localGraphs[1].id ='';
        localGraphs[0].id = 'inactive';
    }
});

async function getGlobalData(dataURL){
    const response = await fetch(dataURL);
    const data = await response.json();
    global = data.Global;
};

async function getCountryData(dataURL){
    const response = await fetch(dataURL);
    const data = await response.json();
    saData = data;
};

async function graphGlobal(){
    await getGlobalData('https://api.covid19api.com/summary')
    .catch(error => console.log(error));

    const sumGraph = document.getElementById('summary').getContext('2d');
    const myChart = new Chart(sumGraph, {
        type: 'bar',
        data: {
            labels: ['Confirmed', 'Recovered', 'Deaths','Active'],
            datasets: [{
                label: 'Global COVID-19 Case Statistics',
                data: [global.TotalConfirmed, global.TotalRecovered, global.TotalDeaths,(global.TotalConfirmed-(global.TotalRecovered+global.TotalDeaths))],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(0, 0, 0, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(0, 0, 0, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            legend: {
                display: false
             },
             tooltips: {
                callbacks: {
                  title: function(tooltipItem, data) {
                    return data['labels'][tooltipItem[0]['index']];
                  },
                  label: function(tooltipItem, data) {
                    return data['datasets'][0]['data'][tooltipItem['index']];
                  }
                },
                backgroundColor: '#FFF',
                titleFontSize: 16,
                titleFontColor: '#0066ff',
                bodyFontColor: '#000',
                bodyFontSize: 14,
                displayColors: true
              }
        }
    });
}

async function graphSA(){
    await getCountryData('https://api.covid19api.com/dayone/country/south-africa')
    .catch(error => console.log(error));
    graphPrediction();
    /*Fun with dates --> Extracting Dates as strings from JSON data, converting them to Dates and then back to strings (just for learning purposes - obviously it's dumb)
                     --> Commenting it out for the more efficient method


    let dateLabels = [];
    for(let i=0;i<saData.length;i++){
        let currentDate = saData[i].Date.split('T')[0].split('-');
        let d = new Date(currentDate[0] +','+ currentDate[1] +',' +currentDate[2]);
        let year = d.getFullYear();
        let month = d.getMonth()+1;
        let date = d.getDate();
        let dateString = date+"/"+month+"/"+year;
        dateLabels.push(dateString);
    }*/
    
    let dateLabels = [];
    let confirmedData = [];
    let recoveredData = [];
    let deathData = [];
    let activeData = [];

    let confirmedDaily = [];
    let recoveredDaily = [];
    let deathDaily = [];
    let activeDaily = [];

    let redBorder = [];
    let blueBorder = [];
    let greyBorder = [];
    let goldBorder = [];

    let prevConfirmed = 0;
    let prevRecovered = 0;
    let prevDeath = 0;

    for(let i=0;i<saData.length;i++){
        if(i === 0 || i%3 === 0){
            //Populating Total Graph Data Array
            let currentDate = saData[i].Date.split('T')[0].replace(/-/g,'/');
            dateLabels.push(currentDate);

            confirmedData.push(saData[i].Confirmed);
            recoveredData.push(saData[i].Recovered);
            deathData.push(saData[i].Deaths);
            activeData.push(saData[i].Active);

            //Populating Daily Count Graph Data Array
            confirmedDaily.push(saData[i].Confirmed-prevConfirmed);
            prevConfirmed = saData[i].Confirmed;

            recoveredDaily.push(saData[i].Recovered-prevRecovered);
            prevRecovered = saData[i].Recovered;

            deathDaily.push(saData[i].Deaths-prevDeath);
            prevDeath = saData[i].Deaths;

            activeDaily.push(saData[i].Active);
            prevActive = saData[i].Confirmed-(saData[i].Recovered+saData[i].Deaths);
        }

        //Setting Up Coloured Dots
        if(i%10===0) {
            redBorder.push('rgba(255, 99, 132, 1)');
            blueBorder.push('rgba(54, 162, 235, 1)');
            greyBorder.push('rgba(35, 35, 35, 1)');
            goldBorder.push('rgba(255, 206, 86, 1)');
        }
        else{ 
            redBorder.push('rgba(0,0,0,0)');
            blueBorder.push('rgba(0,0,0,0)');
            greyBorder.push('rgba(0,0,0,0)');
            goldBorder.push('rgba(0,0,0,0)');
        }
    }

    let confirmedObj = {
        label: 'Confirmed COVID-19 Cases',
        data: confirmedData,
        backgroundColor: ['rgba(0,0,0,0)'],
        borderColor: redBorder,
        borderWidth: 2
    }

    let recoveredObj = {
        label: 'Recovered Covid-19 Cases',
        data: recoveredData,
        backgroundColor: ['rgba(0,0,0,0)'],
        borderColor: blueBorder,
        borderWidth: 2
    }

    let deathObj = {
        label: 'COVID-19 Deaths',
        data: deathData,
        backgroundColor: ['rgba(0,0,0,0)'],
        borderColor: greyBorder,
        borderWidth: 2
    }

    let activeObj = {
        label: 'Active COVID-19 Cases',
        data: activeData,
        backgroundColor: ['rgba(0,0,0,0)'],
        borderColor: goldBorder,
        borderWidth: 2
    }

    let confirmedDailyObj = {
        label: 'Confirmed COVID-19 Cases',
        data: confirmedDaily,
        backgroundColor: ['rgba(0,0,0,0)'],
        borderColor: redBorder,
        borderWidth: 2
    }

    let recoveredDailyObj = {
        label: 'Recovered Covid-19 Cases',
        data: recoveredDaily,
        backgroundColor: ['rgba(0,0,0,0)'],
        borderColor: blueBorder,
        borderWidth: 2
    }

    let deathDailyObj = {
        label: 'COVID-19 Deaths',
        data: deathDaily,
        backgroundColor: ['rgba(0,0,0,0)'],
        borderColor: greyBorder,
        borderWidth: 2
    }

    let activeDailyObj = {
        label: 'Active COVID-19 Cases',
        data: activeDaily,
        backgroundColor: ['rgba(0,0,0,0)'],
        borderColor: goldBorder,
        borderWidth: 2
    }
    
    let dataArray = [confirmedObj,recoveredObj,deathObj,activeObj];
    let dailyArray = [confirmedDailyObj,recoveredDailyObj,deathDailyObj,activeDailyObj];

    const saGraph = document.getElementById('SAStats').getContext('2d');
    let myLocalChart = new Chart(saGraph, {
        type: 'line',
        data: {
            labels: dateLabels,
            datasets: dataArray
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    const saGraphCount = document.getElementById('SAStatsCount').getContext('2d');
    let myLocalChartDaily = new Chart(saGraphCount, {
        type: 'line',
        data: {
            labels: dateLabels,
            datasets: dailyArray
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    async function graphPrediction(){
        let confirmedArray = [];
        let recoveredArray = [];
        let deathsArray = [];
        let recoveredPerc = [];
        let deathPerc = [];
    
        for(let i=(saData.length-61);i<saData.length;i++){
            confirmedArray.push(saData[i].Confirmed-saData[i-1].Confirmed);
            recoveredArray.push(saData[i].Recovered-saData[i-1].Recovered);
            deathsArray.push(saData[i].Deaths-saData[i-1].Deaths);

            recoveredPerc.push(((saData[i].Recovered-saData[i-1].Recovered)/saData[i].Active)*100);
            deathPerc.push(((saData[i].Deaths-saData[i-1].Deaths)/saData[i].Active)*100);
        }

        let avgRecPerc = average(recoveredPerc);
        let avgDeathPerc = average(deathPerc);
        let avgRecDev = standardDeviation(recoveredPerc);
        let avgDeathDev = standardDeviation(deathPerc);
    
        //Get Averages
        let confirmedAverage = Math.floor(average(confirmedArray));
        let recoveredAverage = Math.floor(average(recoveredArray));
        let deathAverage = Math.floor(average(deathsArray));
        //Get Standard Deviations
        let confirmedDev = Math.floor(standardDeviation(confirmedArray));
        let recoveredDev = Math.floor(standardDeviation(recoveredArray));
        let deathDev = Math.floor(standardDeviation(deathsArray));   
        //Get Number of days for graphing
        let today = new Date();
        let endDate = new Date('12/31/2021');
        let days = Math.ceil((endDate.getTime()-today.getTime())/(1000*3600*24));
    
        //Build Graph Datasets
        let confirmedData = [];
        let recoveredData = [];
        let deathData = [];
        let activeData = [];
        let dates = [];
        let nextDay = new Date();

        let curConfirmed = saData[saData.length-1].Confirmed;
        let curRecovered = saData[saData.length-1].Recovered;
        let curDeaths = saData[saData.length-1].Deaths;
        let curActive = saData[saData.length-1].Active;
    
        let redBorder = [];
        let blueBorder = [];
        let greyBorder = [];
        let goldBorder = [];
    
        for(let i=0;i<days;i++){
            //Calculates and sets dates for 2021
            nextDay.setDate(nextDay.getDate()+1);
            let d = nextDay.getDate();
            let m = nextDay.getMonth()+1;
            let y = nextDay.getFullYear();
            let dateString = y+'/'+m+'/'+d;

            if(i%3===0)
            {
                dates.push(dateString);
    
                //Populates data with "entropy" factored in to represent the unpredictable spread
                let confirmedVal = confirmedAverage+getRndInteger(-confirmedDev,confirmedDev);
                if(confirmedVal > 0){
                    confirmedData.push(confirmedVal);
                    curConfirmed+=confirmedVal;
                    curActive+=confirmedVal;
                }
                else{
                    confirmedData.push(0);
                }

                let recoveredVal = Math.ceil(curActive*(avgRecPerc/100+getRndInteger(0,avgRecDev)/100));
                if(recoveredVal > 0){
                    recoveredData.push(recoveredVal);
                    curRecovered+=recoveredVal;
                }
                else{
                    recoveredData.push(0);
                }
                
                let deathVal = Math.ceil(curActive*(avgDeathPerc/100+getRndInteger(0,avgDeathDev)/100));
                if(deathVal > 0){
                    deathData.push(deathVal);
                    curDeaths+=deathVal;
                }
                else{
                    deathData.push(0);
                }
    
                curActive = curConfirmed - (curRecovered+curDeaths);
                if(curActive > 0){
                    activeData.push(curActive);
                }
                else{
                    activeData.push(0);
                }
                console.log(curActive);
            }
    
            //Setting Up Coloured Dots
            if(i%10===0) {
                redBorder.push('rgba(255, 99, 132, 1)');
                blueBorder.push('rgba(54, 162, 235, 1)');
                greyBorder.push('rgba(35, 35, 35, 1)');
                goldBorder.push('rgba(255, 206, 86, 1)');
            }
            else{ 
                redBorder.push('rgba(0,0,0,0)');
                blueBorder.push('rgba(0,0,0,0)');
                greyBorder.push('rgba(0,0,0,0)');
                goldBorder.push('rgba(0,0,0,0)');
            }
        }
    
        let confirmedObj = {
            label: 'Confirmed COVID-19 Cases',
            data: confirmedData,
            backgroundColor: ['rgba(0,0,0,0)'],
            borderColor: redBorder,
            borderWidth: 2
        }
    
        let recoveredObj = {
            label: 'Recovered COVID-19 Cases',
            data: recoveredData,
            backgroundColor: ['rgba(0,0,0,0)'],
            borderColor: blueBorder,
            borderWidth: 2
        }
    
        let deathObj = {
            label: 'COVID-19 Deaths',
            data: deathData,
            backgroundColor: ['rgba(0,0,0,0)'],
            borderColor: greyBorder,
            borderWidth: 2
        }
    
        let activeObj = {
            label: 'Active COVID-19 Cases',
            data: activeData,
            backgroundColor: ['rgba(0,0,0,0)'],
            borderColor: goldBorder,
            borderWidth: 2
        }
    
        let dataArray = [confirmedObj,recoveredObj,deathObj,activeObj];
    
        const predGraph = document.getElementById('SAPrediction').getContext('2d');
        const myPredChart = new Chart(predGraph, {
            type: 'line',
            data: {
                labels: dates,
                datasets: dataArray
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    } 
}

graphGlobal();
graphSA();

function standardDeviation(values){
    let avg = average(values);
    
    let squareDiffs = values.map(function(value){
      let diff = value - avg;
      let sqrDiff = diff * diff;
      return sqrDiff;
    });
    
    let avgSquareDiff = average(squareDiffs);
  
    let stdDev = Math.sqrt(avgSquareDiff);
    return stdDev;
}
  
function average(data){
    let sum = data.reduce(function(sum, value){
      return sum + value;
    }, 0);
  
    let avg = sum / data.length;
    return avg;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}