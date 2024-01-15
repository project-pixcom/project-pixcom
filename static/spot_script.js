function playPause() {
  var video = document.getElementById("key-video");
  var key_btn = document.getElementById("key-btn");
  var caption=document.getElementById("keyreveal-btn-cap");
  caption.style.display="none";
  video.style.display = "block";
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  video.addEventListener("ended", function() {
    caption.style.display="block";
    video.currentTime = 0;
  });
}
function playPauseshow() {
  var video = document.getElementById("show-video");
  var key_btn = document.getElementById("show-btn");
 var caption=document.getElementById("startshow-btn-cap");
  caption.style.display="none";
  video.style.display = "block";
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  video.addEventListener("ended", function() {
    caption.style.display="block";
    video.currentTime = 0;
  });
}
function displayContent(){
  document.getElementById("content-text").style.display = "block";
}
// const buttons = document.querySelectorAll('.buttons button');



