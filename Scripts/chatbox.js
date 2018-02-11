function addQuery(text){
    var newQuery = document.createElement('div');
    var p = document.createElement('P');
    var t = document.createTextNode(text);
    p.appendChild(t);
    p.className = 'query';
    newQuery.appendChild(p);
    newQuery.className = 'chat';

    mainDiv = document.getElementById('main');
    if (mainDiv){
        mainDiv.appendChild(newQuery);
    }
}

function addResponse(text){
    if ($("p:last").attr('class')=='response'){
        $("p:last").text(text);
    }
    else{
        var newQuery = document.createElement('div');
        var p = document.createElement('P');
        var t = document.createTextNode(text);
        p.appendChild(t);
        p.className = 'response';
        newQuery.appendChild(p);
        newQuery.className = 'chat';

        mainDiv = document.getElementById('main');
        if (mainDiv){
            mainDiv.appendChild(newQuery);
        }
    }
}

function addInterview(text){
    $("div:last").remove;
    words = text.split('\n');
    words.shift();
    var newQuery = document.createElement('div');
    var p = document.createElement('P');
    var t = document.createTextNode(words[0]);
    
    p.appendChild(t);
    words.shift();
    for (i in words){
        br = document.createElement("br");
        p.appendChild(br);
        br = document.createElement("br");
        p.appendChild(br);
        t = document.createTextNode(words[i]);
        if (words[i].substring(0,1)=="Q"){
            t.className = 'question'
        }
        else{
            t.className = 'answer'
        }
        p.appendChild(t);
    }
    p.className = 'interview';
    newQuery.appendChild(p);

    mainDiv = document.getElementById('main');
    if (mainDiv){
        mainDiv.appendChild(newQuery);
    }
}