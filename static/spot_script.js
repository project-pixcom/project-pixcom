function playPause() {
  var video = document.getElementById("key-video");
  var key_btn = document.getElementById("key-btn");
  document.getElementById("key-img").style.display = "none";
  video.style.display = "block";
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  video.addEventListener("ended", function() {
    document.getElementById("key-img").style.display = "block";
    video.style.display = "none";
  });
}
function playPauseshow() {
  var video = document.getElementById("show-video");
  var key_btn = document.getElementById("show-btn");
  document.getElementById("show-img").style.display = "none";
  video.style.display = "block";
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  video.addEventListener("ended", function() {
    document.getElementById("show-img").style.display = "block";
    video.style.display = "none";
  });
}
function displayContent(){
  document.getElementById("content-text").style.display = "block";
}