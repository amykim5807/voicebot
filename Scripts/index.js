
const http = require('http');
const weatherHost = 'api.worldweatheronline.com';
const wwoApiKey = '56a45765c75742f485f175257181801';

exports.voicebot4 = (req, res) => {
  switch (req.body.result.action) {
    case "get_weather":
      let city = req.body.result.parameters['geo-city']; // city is a required param
      // Get the date for the weather forecast (if present)
      let date = '';
      if (req.body.result.parameters['date']) {
        date = req.body.result.parameters['date'];
        console.log('Date: ' + date);
      }
      // Call the weather API
      callWeatherApi(city, date).then((output) => {
        // Return the results of the weather API to Dialogflow
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ 'speech': output, 'displayText': output }));
      }).catch((error) => {
        // If there is an error let the user know
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ 'speech': error, 'displayText': error }));
      });
      break; 
      
    case "create_campaign":
      let campaign = capitalize(req.body.result.parameters['campaign']);
      let date_period = req.body.result.parameters['date-period'];
      createCampaign(campaign, date_period).then((output)=>{
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({'speech': output, 'displayText': output}))
      }).catch((error) =>{
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({'speech':error, 'displayText':error}))
      })
      break;
    
    case "campaign_create.seeInterview":
      res.setHeader('Content-Type', 'application/json');
      output = 'GET_INTERVIEW'
      res.send(JSON.stringify({'speech':output, 'displayText':output}));
    
    default:
      let output_def = 'other';
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ 'speech': output_def, 'displayText': output_def}));
 
  }; 
};


function createCampaign (campaign, date_period) {
  return new Promise((resolve, reject) => {
    let name = campaign + " " + getDate(date_period);
    let filter = campaign.toUpperCase().replace(/ /g,"_");
    let audience = 'AUD_BLANK';
    
    let output = `I\'ve built you a campaign called ${name} 
        with a target audience of size ${audience}.`
    resolve(output);

    if (false){
      reject();
    }
  
  });
}

function callWeatherApi (city, date) {
  return new Promise((resolve, reject) => {
    // Create the path for the HTTP request to get the weather
    let path = '/premium/v1/weather.ashx?format=json&num_of_days=1' +
      '&q=' + encodeURIComponent(city) + '&key=' + wwoApiKey + '&date=' + date;
    console.log('API Request: ' + weatherHost + path);
    // Make the HTTP request to get the weather
    http.get({host: weatherHost, path: path}, (res) => {
      let body = ''; // var to store the response chunks
      res.on('data', (d) => { body += d; }); // store each response chunk
      res.on('end', () => {
        // After all the data has been received parse the JSON for desired data
        let response = JSON.parse(body);
        console.log(response);
        let forecast = response['data']['weather'][0];
        let location = response['data']['request'][0];
        let conditions = response['data']['current_condition'][0];
        let currentConditions = conditions['weatherDesc'][0]['value'];
        // Create response
        let output = `Current conditions in the ${location['type']} 
        ${location['query']} are ${currentConditions} with a projected high of
        ${forecast['maxtempF']}°F and a low of 
        ${forecast['mintempF']}°F on 
        ${forecast['date']}.`;
        // Resolve the promise with the output text
        console.log(output);
        resolve(output);
      });
      res.on('error', (error) => {
        reject(error);
      });
    });
  });
}

function getDate(date_period){
  var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  var year = date_period.slice(0,4);
  var month = monthNames[Number(date_period.slice(5,7))-1];
  return month + " " + year
}

function capitalize(name){
  var words = name.split(' ');
  var newWords = [];
  for(var x = 0; x < words.length; x++){
    newWords.push(words[x].charAt(0).toUpperCase()+words[x].slice(1));
  }
  return newWords.join(' ');
}