//function section in Javascript and Jquery...
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
  document.querySelector(".add-event-form").style.display ="flex";
  document.querySelector("body").style.overflow="hidden";
});

function close_handler(){
  document.querySelector(".add-event-form").style.display ="none";
  document.querySelector("body").style.overflow="auto";
}

// Update time initially
updateTime();

// Update time every second
setInterval(updateTime, 1000);
function  edit_handler(id,event){
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
