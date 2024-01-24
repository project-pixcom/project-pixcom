var keyupended=false;
var startshowended=false;
var transcript="";
var enablechecklist=false;
var lightbox=document.getElementById("lightcheck");
var contentbox=document.getElementById("contentcheck");
var motorbox=document.getElementById("motorcheck");
var messagebox=document.getElementById("messagecheck");
var iskeyup=false;
var lights=false;
var content=false;
var motorup=false;
var motordown=false;
var message=false;
async function speakText(text) {
  console.log(text);
  var synth = window.speechSynthesis;
  var utterance = new SpeechSynthesisUtterance(text);
  synth.speak(utterance);
  return true;
}

window.SpeechRecognition = window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = true;

micon=document.getElementById("yesButton");
micoff=document.getElementById("noButton");
micoff.addEventListener("click", () => {
  micoff.style.display="none";
  micon.style.display="block";
 
 
  recognition.removeEventListener('result', resultEventListener);
  recognition.removeEventListener('end', endEventListener);
});

micon.addEventListener("click", () => {
  micon.style.display="none";
  micoff.style.display="block";
  recognition.addEventListener('result', resultEventListener);
  recognition.addEventListener('end', endEventListener);
  recognition.start();
  playNotificationSound();  
});
window.addEventListener('load', function() {
    micon.click();
  sessionStorage.setItem('visited', 'true');
console.log(sessionStorage.getItem('aiEnabled'));
});

function playNotificationSound() {
    var audio = new Audio('static/notify.wav');
    audio.play();
}
const resultEventListener = e => {
  transcript = Array.from(e.results)
     .map(result => result[0])
     .map(result => result.transcript)
     .join('')

 console.log(transcript);
};

const endEventListener = async e => {

if(!transcript==""){
  transcript=transcript.toLowerCase();
  if (transcript.includes("hey spot")) {
    transcript=transcript.replace("hey spot","");
    if(transcript==""){
    connect_todialogflow("hey");
    }
    else{
      connect_todialogflow(transcript);
    }
  }
    else if (transcript.includes("spot") || transcript.includes("sport") ||transcript.includes("scott")) {
        transcript=transcript.replace("spot","");
        transcript=transcript.replace("sport","");
        transcript=transcript.replace("scott","");
        if(transcript==""){
        connect_todialogflow("hey");
        }
        else{
          connect_todialogflow(transcript);
        }
    }
  else{
    playNotificationSound();
    recognition.start();
  }
}
else{
  playNotificationSound();
  recognition.start();
}
};


async function connect_todialogflow(request) {
    console.log(request);
    transcript="";
    var url = '/dialog';
    var data = {
        text: request
    };
    var headers = {
        'Content-Type': 'application/json'
    };

    return fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
          var error="Something went  wrong say that again";
          speakText(error);
          playNotificationSound();
          recognition.start();
        }
          return response.json()
              .then(data => {
                  console.log(data);
                   if(data.intent_name=="Default Fallback Intent" || data.intent_name=="Default Welcome Intent" || data.intent_name=="knowaboutpage" || data.intent_name=="hey-spot" ){
                     speakText(data.fullfilment_text);
                   }
                else if(data.intent_name=="enable-checklist"){
                  enable_checklist()
                  
                }
                else if(data.intent_name=="disable-checklist"){
                  disable_checklist()
                  
                }
                else if(data.intent_name=="light-check"){
                  
                    lightcheck();
                }
                else if(data.intent_name=="content-check"){
                  
                  displayContent();
                }
                else if(data.intent_name=="motor-up-check"){
                  
                    motorupcheck();
                }
                  else if(data.intent_name=="motor-down-check"){

                      motordowncheck();
                  }
                else if(data.intent_name=="message-check"){
                  
                  messagecheck();
                }
                else if(data.intent_name=="Start-show"){
                  playPauseshow();
                }
                else if(data.intent_name=="key-up"){
                  keyup();
                }
                else if(data.intent_name=="key-down"){
                    keydown_obj();
                }
                else if(data.intent_name=="start-show"){
                  startshow();
                }
                else if(data.intent_name=="end-show"){
                  endshow();
                }
                else if(data.intent_name=="exit-app"){
                  var url="/"
                  window.location.href = url;
                }
                else if(data.intent_name=="dis-ai"){
                     micoff.click();
                    speakText("A I is disabled");
                }
                else{
                  speakText("Invalid request");
                }
                playNotificationSound();
                recognition.start();
              });
    })
    .catch(error => {
        console.error('Error:', error);
        throw error; // Propagate the error
    });
}

function keyup() {
  var video = document.getElementById("key-video");
  var key_btn = document.getElementById("key-btn");
  var caption=document.getElementById("keyreveal-btn-cap");
  if (iskeyup===false && startshowended) {
    key_btn.onclick=keydown_obj;
    speakText("Key up");
    caption.style.display="none";
    video.style.display = "block";
    iskeyup=true;
    video.play();
  }
  else{
    speakText("Start Show first");
  }
  
  video.addEventListener("ended", function() {
    keyupended=true;
  });
}
var keydown_obj=function keydown(){
  var video = document.getElementById("key-video");
  
  var caption=document.getElementById("keyreveal-btn-cap");
  if(keyupended){
    speakText("Key Down");
    caption.style.display="block";
    video.currentTime = 0;
    keyupended=false;
  }
  else{
    speakText("key reveal first");
  }
}
function startshow() {
  document.getElementById("message-div").style.display = "none";

  var video = document.getElementById("show-video");
  var key_btn = document.getElementById("show-btn");
 var caption=document.getElementById("startshow-btn-cap");
  
  if (startshowended===false && lights && content && motorup && motordown && message && !enablechecklist ) {
    speakText("Start show");
    caption.style.display="none";
    video.style.display = "block";
    video.play();
  } 
  else{
    speakText("check the list items and disable checklist");
  }
  video.addEventListener("ended", function() {
    startshowended=true;
    caption.style.display="block";
    video.currentTime = 0;
  });
}
function displayContent(){
  document.getElementById("message-div").style.display = "none";
  if(enablechecklist){
  speakText("content check");
    content=true;
    document.getElementById("content-check").style.display="block";
  document.getElementById("content-text").style.display = "block";
  }
  else{
    speakText("enable checklist first");
    document.getElementById("content-text").style.display = "none"; 
  }
}
// const buttons = document.querySelectorAll('.buttons button');

function enable_checklist(){
  speakText("checklist enabled");
  document.getElementById("enable-checklist").style.display="none";
  document.getElementById("disable-checklist").style.display="block";
  enablechecklist=true;
}
function disable_checklist(){
  document.getElementById("message-div").style.display = "none";
  speakText("checklist disabled");
  document.getElementById("content-text").style.display = "none"; 
  document.getElementById("disable-checklist").style.display="none";
  document.getElementById("enable-checklist").style.display="block";
  enablechecklist=false;
}
function lightcheck(){
  document.getElementById("message-div").style.display = "none";
  document.getElementById("content-text").style.display = "none"; 
  if(enablechecklist){
    speakText("Light check");
    document.getElementById("ligth-check").style.display = "block";
    lights=true;
  }
  else{
    speakText("enable checklist first");
  }
  
}
function motorupcheck(){
  document.getElementById("message-div").style.display = "none";
  document.getElementById("content-text").style.display = "none"; 
  if(enablechecklist ){
    speakText("motor up");
    document.getElementById("motor-up").style.display = "block";
    motorup=true;
  }
  else{
    speakText("enable checklist first");
  }
}
function motordowncheck(){
  document.getElementById("message-div").style.display = "none";
  document.getElementById("content-text").style.display = "none"; 
  if(enablechecklist ){
    speakText("motor down");
    document.getElementById("motor-down").style.display = "block";
    motordown=true;
  }
  else{
    speakText("enable checklist first");
  }
}
function messagecheck(){
  document.getElementById("content-text").style.display = "none"; 
  if(enablechecklist){
    speakText("message check");
    document.getElementById("message-check").style.display = "block";
    message=true;
    document.getElementById("message-div").style.display = "block";
  }
  else{
    speakText("enable checklist first");
    document.getElementById("message-div").style.display = "none";
  }
}
function endshow(){
  speakText("End show");
   lights=false;
   content=false;
   motorup=false;
   motordown=false;
   message=false;
  startshowended=false;
}
document.addEventListener("visibilitychange", function() {
    if (document.visibilityState === "hidden") {
      if(micoff.style.display=="block"){
        micoff.click();
      console.log("Page is hidden");
      }
    }
  else{
    if(micoff.style.display=="none"){
        micon.click();
      
      console.log("page got focus");
    }  
  }

});