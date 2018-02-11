src="//cdnjs.cloudflare.com/ajax/libs/annyang/2.6.0/annyang.min.js"
window.onload = homeload();

function homeload(){
    if (annyang) {
        // Let's define our first command. First the text we expect, and then the function it should call
        var commands = {
          'Hey micro notes': function() {
            if (!(window.location.href="chat.html")){
                window.location.href="chat.html";
            }
          }
        };
      
        // Add our commands to annyang
        annyang.addCommands(commands);
      
        // Start listening. You can call this here, or attach this call to an event, button, etc.
        annyang.start();
    }
}