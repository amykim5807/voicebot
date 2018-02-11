src="//cdnjs.cloudflare.com/ajax/libs/annyang/2.6.0/annyang.min.js"
src="https://code.jquery.com/jquery-1.10.2.js"

var accessToken = "b9956f6d3ea542fcab817d7211cf52d2";
var baseUrl = "https://api.api.ai/v1/";
var recognition;

$(document).ready(function() {
    var input = document.getElementById("input");
    input.addEventListener("keyup", function(event) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
          // Trigger the button element with a click
          val = document.getElementById("input").value;
          send(val);
          input.value='';
        }
      });
});

window.onload = function(){
    startRecognition();
}

/* function annyang(){
    if (annyang) {
        // Let's define our first command. First the text we expect, and then the function it should call
        var commands = {
            'Hey': function() {
                startRecognition();
            }
        };
    
        // Add our commands to annyang
        annyang.addCommands(commands);
    
        // Start listening. You can call this here, or attach this call to an event, button, etc.
        annyang.start();
    }
} */

function startRecognition(){
    var recognition = new webkitSpeechRecognition();
    //recognition.interimResults = true;
    recognition.onresult = function(event) {
        var text = "";
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            text += event.results[i][0].transcript;
         }
        send(text);
        stopRecognition();
    };
    
    recognition.onend = function() {
        //annyang();
    };
    
    recognition.lang = "en-US";
    recognition.start();
}

function stopRecognition(){
    if (recognition) {
        recognition.stop();
        recognition = null;
    }
}
    
function send(text) {
    addQuery(text);
    scroll();
    $.ajax({
        type: "POST",
        url: baseUrl + "query?v=20150910",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + accessToken
        },
        data: JSON.stringify({ query: text, lang: "en", sessionId: "1" }),
        success: function(data) {
            response = JSON.parse(JSON.stringify(data));
            parseText(response).then((output)=>{
                if (output.substring(0,3)=='INT'){
                    addInterview(output)
                    startRecognition();
                }
                else{
                    addResponse(output);
                    synth = window.speechSynthesis;
                    var utterThis = new SpeechSynthesisUtterance(output);
                    synth.speak(utterThis);
                    if (utterThis){
                        utterThis.onend= function(event){
                            console.log('start');
                            startRecognition();
                        }
                    }
                }
                scroll();
                
            });
        },
        error: function() {
            addResponse("Internal Server Error");
        }
    });
    addResponse("Loading...");
    scroll();
}


function parseText(val){
    return new Promise((resolve,reject)=>{
        if (val.result){
            action = val.result.action;
            output = val.result.fulfillment.speech;
            params = val.result.parameters;
            output = output.replace(/(\r\n|\n|\r)/gm,"");
            output = output.replace(/\s+/g," ");
            if (action=="create_campaign"&&params['campaign']!=""&&params['date-period']!=""){
                campaign = val.result.parameters.campaign.toUpperCase().replace(/ /g,"_");
                getCampaign(output,campaign).then((result)=>{
                    console.log(result);
                    resolve(result);
                });
            }
            else if (action=="campaign_create.seeInterview"){
                campaign = val.result.parameters.campaign;
                getInterview(campaign).then((result)=>{
                    console.log(result);
                    resolve(result);
                })
            }
            else{
                resolve(output);
            }
        }
        else{
            reject();
        }
    });
}

function scroll(){
    chats = document.getElementsByClassName("chat");
    if (chats.length>3){
        window.scrollBy(0,chats.item(chats.length-1).offsetHeight+160);   
    }
}

function getCampaign(output,campaign){
    return new Promise((resolve,reject)=>{
        words = output.split(" ");
        audInd = 0
        result = ""
        for (i = 0; i < words.length; i++) {
            if (words[i] == 'AUD_BLANK.'){
                audInd = i
                $.get('http://localhost:8000/audience?campaign='+campaign).done(function(data){
                    words[audInd] = data['size'].toString();
                    for (i = 0; i < words.length; i++){
                        result = result + words[i] + " ";
                    }
                    resolve(result.trim()+".");
                }).error(function(err){
                    reject(err);
                })
            }
        }
    });
}

function getInterview(campaign){
    return new Promise((resolve,reject)=>{
        result = "INT\n"
        $.get('http://localhost:8000/interviewid?campaign='+campaign).done(function(id){
            intID = id['ID'];
            $.get('http://localhost:8000/interviewQuestions?id='+intID).done(function(q){
                questions = q['questions']
                qids = []
                answers = []
                for (item in questions){
                    result = result + "Q: " + questions[item] + "\n";
                };
                resolve(result);

            }).error(function(err){
                reject(err);
            });
        }).error(function(err){
            reject(err);
        });
    });
}

function getAnswer(id){
    return new Promise((resolve, reject) => {
        $.get('http://localhost:8000/interviewAnswers?id='+item).done(function(ans){
            console.log(ans['answers']);
            resolve(ans['answers']);
        }).error(function(err){
            reject(err)
        });
    })
}