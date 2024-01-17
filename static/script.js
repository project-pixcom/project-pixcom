//function section in Javascript and Jquery...
var new_app = {
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
          <button class="save-btn" id="app-save" type="submit">Save</button>
            </div>
        </div>
      </form>`
};
const ev_container=document.getElementById('ev-contents');
function myData() {
    retrun;
  }

  function show() {
    document.getElementById('anotherFunction').style.visibility='visible';
    document.getElementById('anotherFunction').classList.toggle('Active');

  }
  function toggleSection(sectionId,event) {
    document.querySelector(".option").style.visibility= "hidden";
    event.stopPropagation();
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

document.querySelector(".add-event").addEventListener("click",function(){
 openform="app-save";
  console.log(openform);

  document.querySelector(".add-event-form").style.display ="flex";
  document.querySelector("body").style.overflow="hidden";
  document.querySelector('.add-event-form').innerHTML =new_app.html;
});

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
      })
      .catch(error => {
        console.error('Error fetching records:', error);
      });
  }
