var keyupended=false;
var startshowended=false;
var transcript="";
var enablechecklist=false;
var lightbox=document.getElementById("lightcheck");
var contentbox=document.getElementById("contentcheck");
var motorbox=document.getElementById("motorcheck");
var messagebox=document.getElementById("messagecheck");
var iskeyup=false;
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
  micon.classList.remove('active')
  micoff.classList.add('active');
 
  recognition.removeEventListener('result', resultEventListener);
  recognition.removeEventListener('end', endEventListener);
});

micon.addEventListener("click", () => {
  micon.style.display="none";
  micoff.style.display="block";
  micoff.classList.remove('active')
  micon.classList.add('active');
  recognition.addEventListener('result', resultEventListener);
  recognition.addEventListener('end', endEventListener);
  recognition.start();
});

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
    recognition.start();
  }
}
else{
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
                  speakText("checklist enabled");
                }
                else if(data.intent_name=="disable-checklist"){
                  disable_checklist()
                  speakText("checklist disabled");
                }
                else if(data.intent_name=="light-check"){
                  if(lightbox.checked==false){
                    lightbox.checked=true;
                    speakText("light check");
                  }
                  else{
                    lightbox.checked=false;
                  }
                    lightcheck();
                }
                else if(data.intent_name=="content-check"){
                  if(contentbox.checked==false){
                    contentbox.checked=true;
                    speakText("content check");
                  }
                  else{
                    contentbox.checked=false;
                  }
                  displayContent();
                }
                else if(data.intent_name=="motor-check"){
                  if(motorbox.checked==false){
                    motorbox.checked=true;
                    speakText("motor check");
                  }
                  else{
                    motorbox.checked=false;
                  }
                    motorcheck();
                }
                else if(data.intent_name=="message-check"){
                  if(messagebox.checked==false){
                    messagebox.checked=true;
                    speakText("Message check");
                  }
                  else{
                    messagebox.checked=false;
                  }
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
  key_btn.onclick=keydown_obj;
  if (iskeyup===false) {
    speakText("Key up");
    caption.style.display="none";
    video.style.display = "block";
    iskeyup=true;
    video.play();
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
}
function startshow() {
  var video = document.getElementById("show-video");
  var key_btn = document.getElementById("show-btn");
 var caption=document.getElementById("startshow-btn-cap");
  
  if (startshowended===false ) {
    speakText("Start show");
    caption.style.display="none";
    video.style.display = "block";
    video.play();
  } 
  video.addEventListener("ended", function() {
    startshowended=true;
    caption.style.display="block";
    video.currentTime = 0;
  });
}
function displayContent(){
  if(enablechecklist && contentbox.checked){
  document.getElementById("content-text").style.display = "block";
  }
  else{
    document.getElementById("content-text").style.display = "none";
    contentbox.checked=false;
  }
}
// const buttons = document.querySelectorAll('.buttons button');

function enable_checklist(){
  document.getElementById("enable-checklist").style.display="none";
  document.getElementById("disable-checklist").style.display="block";
  enablechecklist=true;
}
function disable_checklist(){
  document.getElementById("disable-checklist").style.display="none";
  document.getElementById("enable-checklist").style.display="block";
  enablechecklist=false;
}
function lightcheck(){
  if(enablechecklist && lightbox.checked){
  }
  else{
      lightbox.checked=false;
  }
}
function motorcheck(){
  if(enablechecklist && motorbox.checked){
  
  }
  else{
      motorbox.checked=false;
  }
}
function messagecheck(){
  if(enablechecklist && messagebox.checked){
  }
  else{
      messagebox.checked=false;
  }
}
function endshow(){
  speakText("End show")
}
