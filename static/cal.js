var openform="";
async function speakText(text) {
  console.log(text);
  var synth = window.speechSynthesis;
  var utterance = new SpeechSynthesisUtterance(text);
  synth.speak(utterance);
  return true;
  }
$(document).ready(function () {
var transcript="";
  

var new_app=document.querySelector(".add-event");
  new_app.addEventListener("click",new_app_form)
    function new_app_form(){
    var new_app_html = {
        html: `<form   id="new-app">
            <div class="add-event-container">
              <div class="close-btn" onclick="close_handler()">
                <i class="fa-solid fa-xmark fa-2xl" style="color: #f7f7f7;"></i>
              </div>
              <div class="event-info">
                <div class="event-info-1">

              <!-- Name -->
              <div class="add-event-row add-event-name">
              <label for="name">Name:</label>
              <input type="text" id="name" name="name" class="add-con" placeholder="Name" required>
              </div>
              <!-- Email -->
              <div class="add-event-row">
              <label for="email">Email ID:</label>
              <input type="email" id="email" class="add-con" name="email" placeholder="abcd@gmail.com"required>
              </div>
              <!-- Mobile Number -->
              <div class="add-event-row">
              <label for="mobile">Mobile Number:</label>
              <input type="tel" id="mobile" name="mobile" class="add-con"placeholder="Phone Number" required>
              </div>


              <!-- MB Dropdown -->
              <div class="add-event-row">
              <label for="mb">MB:</label>
              <select id="mb" name="mb" class="add-con">
                <option value="" disabled selected>Select an option</option>
                <option value="AMG">AMG</option>
                <option value="EQ">EQ</option>


              </select>
              </div>
                </div>
                <div class="event-info-2">
                  <div class="add-event-row ">
                <label for="mb">Date and Time</label>
                  <div class="date-time-row">
                <input type="date" id="date-picker" name="datepicker" class="add-con date-pic " placeholder="Date" required >
                <input type="time"  id="time-picker" name="timepicker" class="add-con time-pic" placeholder="Time" required >
                  </div>
                </div>
              <!-- Select Model Dropdown -->
              <div class="add-event-row">
              <label for="model">Model:</label>
              <select id="model" name="model" class="add-con">
                <option value="" disabled selected>Select an option</option>
                  <option value="A-class">A Class</option>
                  <option value="C-class">C Class</option>
                  <option value="EQ1">EQ1</option>
                <option value="EQ2">EQ2</option>

                </select>
              </div>
              <!-- Product Expert Dropdown -->
              <div class="add-event-row">
              <label for="expert">Product Expert:</label>
              <select id="expert" name="expert" class="add-con">
                <option value="" disabled selected>Select an option</option>
                  <option value="Product Expert 1">Product Expert 1</option>
                  <option value="Product Expert 2">Product Expert 2</option>
                  <option value="Product Expert 3">Product Expert 3</option>
                </select>

              </div>
              <!-- Select Room Dropdown -->
              <div class="add-event-row">
              <label for="room">Delivery Area:</label>
              <select id="room" name="room" class="add-con">
                <option value="" disabled selected>Select an option</option>
                  <option value="Area 1">Area 1</option>
                  <option value="Area 2">Area 2</option>
                  <option value="Area 3">Area 3</option>
                </select>

              </div>
              </div>
              </div>
              <!-- Save Button -->
              <div class="add-event-row button-div">
              <div class="message-div"> 
                <label for="room">Message:</label>
                <input type="text" id="message" class="add-con" name="message"   value="">
              </div>
              <button class="save-btn" id="app-save" type="submit">Save</button>
                </div>
            </div>
          </form>`
    };
   openform="app-save";
    console.log(openform);

    document.querySelector(".add-event-form").style.display ="flex";
    document.querySelector("body").style.overflow="hidden";
    document.querySelector('.add-event-form').innerHTML =new_app_html.html;
    
    document.getElementById('app-save').addEventListener('click', save_appointment);
  };
var currentDate = new Date();
   cDate=currentDate.getDate();
window.SpeechRecognition = window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = true;
val=1;
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
console.log(sessionStorage.getItem('aiEnabled'));
  recognition.addEventListener('result', resultEventListener);
  recognition.addEventListener('end', endEventListener);
  
  if(val==1 && sessionStorage.getItem('visited') === null){
    val=2;
  connect_todialogflow("knowaboutpage");
  }
  else{
    recognition.start();
    playNotificationSound();
  }

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
      else if (transcript.includes("spot") || transcript.includes("sport") ||transcript.includes("scott") || transcript.includes("what")) {
        transcript=transcript.replace("spot","");
        transcript=transcript.replace("sport","");
        transcript=transcript.replace("scott","");
        transcript=transcript.replace("what","");

        if(transcript==""){
        connect_todialogflow("hey spot");
        }
        else{
          connect_todialogflow(transcript);
        }
    }
  else{
    recognition.start();
    playNotificationSound();
  }
}
else{
  recognition.start();
  playNotificationSound();
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
           recognition.start
             playNotificationSound();
        }
          return response.json()
              .then(data => {
                  console.log(data);
                   if(data.intent_name=="Default Fallback Intent" || data.intent_name=="Default Welcome Intent" || data.intent_name=="knowaboutpage" || data.intent_name=="hey-spot" ){
                     speakText(data.fullfilment_text);
                   }
                  else if(data.intent_name=="date-picker"){
                    cDate=data.cdate;
                    $('#monthSelector').val(data.cmonth-1);
                    $('#yearSelector').val(data.cyear);
                    buildCalendar(parseInt($('#monthSelector').val()), $('#yearSelector').val());
                  }
                else if (data.intent_name=="new-app"){
                  speakText(data.fullfilment_text);
                  new_app.click();
                  openform="app-save";
                }
                else if(data.intent_name=="exit-app"){
                  document.querySelector(".add-event-form").style.display ="none";
                  document.querySelector("body").style.overflow="auto";
                  openform=""
                }
                else if(data.intent_name=="app-save"){
                  console.log("Before condition:", openform);
                    if(openform==="app-save"){
                        document.getElementById('app-save').click();
                    }
                  else if(openform==="app-edit"){
                    let app_update=document.getElementById("app-update");
                        app_update.click();
                  }
                  else{
                    console.log(openform);
                      speakText("Sorry, form need to be opened");
                  }
                }
                else if(data.intent_name=="select-app"){
                  if(data.rec_num!==""){
                    console.log(data.rec_num);
                    var content_obj = document.querySelector(".ev-container .content:nth-child(" + parseInt(data.rec_num )+ ")");
                    if(content_obj){
                    content_obj.click();
                    }
                    else{
                      speakText("Sorry, no appointment found");
                    }
                  }
                  else{
                    speakText("Sorry, no appointment found");
                  }
                }
                else if(data.intent_name=="edit-app"){
                  if(data.rec_num!==""){
                    console.log(data.rec_num);
                    var content_obj = document.querySelector(".ev-container .content:nth-child(" + parseInt(data.rec_num )+ ")");
                    if(content_obj){
                      var app_id = content_obj.querySelector('.init-content').id;
                      edit_handler(app_id,event);
                    }
                    else{
                      speakText("Sorry, no appointment found");
                    }
                  }
                  else{
                    speakText("Sorry, no appointment found");
                  }
                }
                else if(data.intent_name=="month-selector"){
                  $('#monthSelector').val(data.month_num);
                  $('#yearSelector').val(data.year);
                }
                else if(data.intent_name=="delete-app"){
                  if(data.rec_num!==""){
                    console.log(data.rec_num);
                    var content_obj = document.querySelector(".ev-container .content:nth-child(" + parseInt(data.rec_num )+ ")");
                    if(content_obj){
                      var app_id = content_obj.querySelector('.init-content').id;
                      delete_handler(app_id,event);
                    }
                    else{
                      speakText("Sorry, no appointment found");
                    }
                  }
                  else{
                    speakText("Sorry, no appointment found");
                  }
                }
                else if(data.intent_name=="dis-ai"){
                     micoff.click();
                    speakText("A I is disabled");
                }
                else if(data.intent_name=="show-det"){
                  if(data.app_num!==""){
                    console.log(data.app_num);
                    var content_obj = document.querySelector(".ev-container .content:nth-child(" + parseInt(data.app_num )+ ")");
                    if(content_obj){
                      var arrowIcon = content_obj.querySelector(".arrow");
                      if (arrowIcon) {
                      arrowIcon.click();
                    }
                    }
                    else{
                      speakText("Sorry, no appointment found");
                    }
                  }
                  else{
                    speakText("Sorry, no appointment found");
                  }
                }
                setTimeout(ai_recognition, 3000);
                
              });
    })
    .catch(error => {
        console.error('Error:', error);
        throw error; // Propagate the error
    });

}
  function ai_recognition() {
    recognition.start();
    playNotificationSound();
  }
function daysInMonth(month, year) {
  console.log(month,year);
  return new Date(year, month+1, 0).getDate();
}
       
        
        function build_calendar(month,year){
          document.querySelector(".add-event-form").style.display ="none";
          document.querySelector("body").style.overflow="auto";

            var firstDay = new Date(year, month, 1).getDay();
            var days = daysInMonth(month, year);
            console.log(days,cDate);
            var date = 1;

            // Clear the previous content of the tbody
            $('#calendar1 tbody').empty();

            for (var i = 0; i < 6; i++) {
                var row = $('<tr class="rd-days-row"></td>');

                for (var j = 0; j < 7; j++) {
                    if (i === 0 && j < firstDay) {
                        // Add empty cells for days before the first day of the month
                        row.append('<td></td>');
                    } else if (date > days) {
                        // Break the loop if we have reached the end of the month
                        break;
                    } else {
                        // Add a cell with the current date

                        if(cDate==date){
                        row.append('<td class="rd-day-body selected-date">' + date + '</td>');
                            console.log("current");
                    }
                        else{
                            row.append('<td class="rd-day-body ">' + date + '</td>');
                        }
                        date++;
                    }
                }

                $('#calendar1 tbody').append(row);
            }
        }
        // Function to build the calendar grid
        async function buildCalendar(month, year) {
            try {
               
                build_calendar(month, year);
                const dialogflowResponse = await get_appointment();
                // Further processing of the Dialogflow response or calendar if needed
                console.log('Dialogflow response:', dialogflowResponse);
            } catch (error) {
                console.error('Error building calendar with Dialogflow:', error);
            }
        } 
  function get_appointment() {
    const requestData = {
      text: `${$('#yearSelector').val()}-${cDate}-${parseInt($('#monthSelector').val())+1}`
    };

    const url = '/get_records';

    // Make a POST request to Flask
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text(); 
      })
      .then(html => {

        document.getElementById('ev-contents').innerHTML = html;
      })
      .catch(error => {
        console.error('Error fetching records:', error);
      });
  }
  

        // Populate the year selector with a range of years
        var currentYear = new Date().getFullYear();
        var currentMonth=new Date().getMonth();
        
        for (var i = currentYear - 10; i <= currentYear + 1; i++) {
            $('#yearSelector').append('<option value="' + i + '">' + i + '</option>');
        }

        // Set the initial selected year
        $('#yearSelector').val(currentYear);
        $('#monthSelector').val(currentMonth);
        // Initial calendar display

        buildCalendar(parseInt($('#monthSelector').val()), $('#yearSelector').val());

        // Event listener for clicking on a date cell
        $('#calendar1 tbody').on('click', 'td', function () {
            cDate=$(this).text();
            buildCalendar(parseInt($('#monthSelector').val()), $('#yearSelector').val());

        });

        // Event listener for changing the month and year
        $('#prevMonth').on('click', function () {
            console.log("clicked");
            currentDate.setMonth(currentDate.getMonth() - 1);
          if(currentDate.getMonth()==11){
            $('#yearSelector').val(parseInt($('#yearSelector').val())-1);
          }
            $('#monthSelector').val(currentDate.getMonth());
            buildCalendar(parseInt($('#monthSelector').val()), $('#yearSelector').val());
        });

        $('#nextMonth').on('click', function () {
            console.log("clicked");
            currentDate.setMonth(currentDate.getMonth() + 1);
          if(currentDate.getMonth()==0){
            $('#yearSelector').val(parseInt($('#yearSelector').val())+1);
          }
            $('#monthSelector').val(currentDate.getMonth());
            buildCalendar(parseInt($('#monthSelector').val()), $('#yearSelector').val());
        });

        $('#yearSelector').on('change', function () {
            buildCalendar(parseInt($('#monthSelector').val()), $('#yearSelector').val());
        });
        $('#monthSelector').on('change', function () {
          currentDate.setMonth(parseInt($('#monthSelector').val()));
            buildCalendar(parseInt($('#monthSelector').val()), $('#yearSelector').val());
        });
 function save_appointment(event) {   
    // Prevent the default form submission behavior
    event.preventDefault();
   console.log("clicked");  
   let form = document.querySelector('form');
    var selectedModel = document.getElementById('model').value;
    var selectedMB = document.getElementById('mb').value;
    // Check if all required fields are filled
    console.log(selectedModel,selectedMB);  
    if (form.checkValidity() && selectedModel !== ""&& selectedMB !=="" ) { 
      submitForm();
      console.log("Form submitted"); 
    } else {
      console.log("Form not valid");   
      speakText("Enter Valid data");
    }
  };
     
  function auto_on() {
      const hasVisited = sessionStorage.getItem('visited');

      if (hasVisited === null) {
        // If 'visited' is not set, set it to false\
        console.log("null");
        sessionStorage.setItem('aiEnabled', 'false');
      }
    else if(hasVisited === 'true' && sessionStorage.getItem('aiEnabled') === 'true'){
      micon.click();
      sessionStorage.setItem('visited', 'false');
      console.log("ai ",sessionStorage.getItem('aiEnabled'));
    }
    
    console.log("dfgdfg",sessionStorage.getItem('visited'));

  }
  function submitForm(){
    console.log("clicked submit");
    
    var formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      mobile: document.getElementById('mobile').value,
      mb: document.getElementById('mb').value,
      datepicker: document.getElementById('date-picker').value,
      timepicker: document.getElementById('time-picker').value,
      model: document.getElementById('model').value,
      expert: document.getElementById('expert').value,
      room: document.getElementById('room').value,
      message: document.getElementById('message').value,
    };
    console.log(formData);
      fetch('/save_app', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
            speakText("Failed to Save Appointment")
          }
          return response.json(); // Assuming the server responds with JSON
        })
        .then(data => {
            speakText(data.message);
          try {
              // Make an asynchronous call to Dialogflow
              const dialogflowResponse =  get_appointment_for_update();

              console.log(dialogflowResponse);
              // Further processing of the Dialogflow response or calendar if needed
              console.log('response:', data.message);

          } catch (error) {
              console.error('Error building calendar with Dialogflow:', error);

          }
        })
        .catch(error => {
          console.error('Error during fetch operation:', error);
            speakText(error.message);
        });
    document.querySelector(".add-event-form").style.display ="none";
    document.querySelector("body").style.overflow="auto";
      console.log("Form submitted"); 
  } 
  auto_on();
    });
function get_appointment_for_update() {
  date = $('.selected-date').text();
  const requestData = {
    text: `${$('#yearSelector').val()}-${date}-${parseInt($('#monthSelector').val())+1}`
  };

  const url = '/get_records';

  // Make a POST request to Flask
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text(); 
    })
    .then(html => {

      document.getElementById('ev-contents').innerHTML = html;
    })
    .catch(error => {
      console.error('Error fetching records:', error);
    });
}

const ev_container=document.getElementById('ev-contents');


  function show() {
    document.getElementById('anotherFunction').style.visibility='visible';
    document.getElementById('anotherFunction').classList.toggle('Active');

  }
  function toggleSection(sectionId,event) {
    document.querySelector(".option").style.visibility= "hidden";
    event.stopPropagation();
    console.log(sectionId);
    var section = document.getElementById(sectionId);
    section.classList.toggle("collapsed");
    section.classList.toggle("expanded");
  }

function onContextMenu(e,id,oId){
  const contentMenu=document.querySelector(".option");
  e.preventDefault();
  contentMenu.id=oId;
  let x=parseInt(e.clientX),y=parseInt(e.clientY);
  console.log(x,y);
  contentMenu.style.left=x-70+"px";
  contentMenu.style.top =y+20+"px";
  console.log(contentMenu.style.left,contentMenu.style.top);
  contentMenu.style.visibility="visible";
  contentMenu.style.fontSize = "24px";
  contentMenu.style.width = "fit-content";
  contentMenu.style.position="fixed";
}
document.addEventListener("click", hideContextMenu);
function hideContextMenu(){
  document.querySelector(".option").style.visibility= "hidden";

}

function spotreveal(id) {
  console.log(id);
  if(micoff.style.diplay==="none"){
    sessionStorage.setItem('aiEnabled', 'false');
    console.log("enabled");
  }
  else{
    sessionStorage.setItem('aiEnabled', 'true');
  }
  const url = '/spotreveal?id=' + encodeURIComponent(id);

  // Redirect to the new URL
  window.location.href = url;
}
function updateTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  const timeString = `${hours}:${minutes}:${seconds}`;

  document.getElementById('time').innerText = timeString;
}



function close_handler(){
  openform="";
  console.log(openform);
  document.querySelector(".add-event-form").style.display ="none";
  document.querySelector("body").style.overflow="auto";
}

// Update time initially
updateTime();

// Update time every second
setInterval(updateTime, 1000);
function  edit_handler(id,event){
  openform="app-edit";
  
  console.log(openform);

  const requestData = {
    text: id
  };
 console.log(id);
  const url = '/edit';

    // Make a POST request to Flask
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text(); 
      })
      .then(html => {
          document.querySelector(".add-event-form").style.display ="flex";
        document.querySelector('.add-event-form').innerHTML =html;
        var  app_update=document.getElementById("app-update");
         app_update.addEventListener('click', update_appointment);
      })
      .catch(error => {
        console.error('Error fetching records:', error);
      });
  }

  function  delete_handler(id,event){
    const requestData = {
      text: id
    };
   console.log(id);
    const url = '/delete';

      // Make a POST request to Flask
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json(); 
        })
        .then(data => {
          speakText(data.message);
          try {
              // Make an asynchronous call to Dialogflow
              const dialogflowResponse =  get_appointment_for_update();

              console.log(dialogflowResponse);
              // Further processing of the Dialogflow response or calendar if needed
              console.log('response:', data.message);
              
          } catch (error) {
              console.error('Error building calendar with Dialogflow:', error);
            
          }
        })
        .catch(error => {
          console.error('Error fetching records:', error);
          speakText(data.message);
        });
    }
  
function update_submitForm(){
  console.log("update");
  var formData = {
    id:document.querySelector('form').id,
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    mobile: document.getElementById('mobile').value,
    mb: document.getElementById('mb').value,
    datepicker: document.getElementById('date-picker').value,
    timepicker: document.getElementById('time-picker').value,
    model: document.getElementById('model').value,
    expert: document.getElementById('expert').value,
    room: document.getElementById('room').value,
    message: document.getElementById('message').value,

  };
    fetch('/update_app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
          speakText("Failed to Save Appointment")
        }
        return response.json(); // Assuming the server responds with JSON
      })
      .then(data => {
          speakText(data.message);
          try {
              // Make an asynchronous call to Dialogflow
              const dialogflowResponse =  get_appointment_for_update();
              // Further processing of the Dialogflow response or calendar if needed
              console.log('Dialogflow response:', dialogflowResponse);
          } catch (error) {
              console.error('Error building calendar with Dialogflow:', error);
          }
      })
      .catch(error => {
        console.error('Error during fetch operation:', error);
          speakText(error.message);
      });
  document.querySelector(".add-event-form").style.display ="none";
  document.querySelector("body").style.overflow="auto";
} 
function update_appointment() {
  // Prevent the default form submission behavior
  event.preventDefault();
  let form = document.querySelector('form');
  var selectedModel = document.getElementById('model').value;
  var selectedMB = document.getElementById('mb').value;
  // Check if all required fields are filled
  if (form.checkValidity() && selectedModel !== ""&& selectedMB !=="" ) { 
    update_submitForm();
    console.log("Form submitted"); 
  } else {
    console.log("Form not valid");   
    speakText("Enter Valid data");
  }
};
document.addEventListener("visibilitychange", function() {
    if (document.visibilityState === "hidden") {
      console.log("hidden");
      if(micoff.style.display=="block"){
        sessionStorage.setItem('aiEnabled', 'true');
        micoff.click();
      console.log("Page is hidden");
      }
      else {
        sessionStorage.setItem('aiEnabled', 'false');
      }
    }
  else{
    console.log("visible");
    if( sessionStorage.getItem('aiEnabled')==="true"){
        micon.click();
      console.log("page got focus");
    }  
  }
  
});
function playNotificationSound() {
    var audio = new Audio('static/notify.wav');
  audio.volume = 0.5;
    audio.play();
}
