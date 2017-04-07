////// google Firebase Initialize /////
var config = {
  apiKey: "AIzaSyDxdKOEazxOtcyJNqo4T4RpVzRvHEnh62E",
  authDomain: "video-commander.firebaseapp.com",
  databaseURL: "https://video-commander.firebaseio.com",
  projectId: "video-commander",
  storageBucket: "video-commander.appspot.com",
  messagingSenderId: "643393373733"
};
firebase.initializeApp(config);

///////// Global Variables  ///////

var video = document.getElementById("video1");
var commentMaster = [];
const commentMenu = document.getElementById("comment-list");
const testReadOut = document.getElementById("test");

var tester = 5;

///// Reference to Firebase Database

const dbRef = firebase.database().ref().child('comments');


//----Delete All Comments
document.getElementById("delete-comments").addEventListener("click", killAllComments);

//--------------- VIDEO CONTROS ---------------------////

//------- SHUTTLE VARIABLES  ----//
var muteButton = document.getElementById("muteButton");
var scrubSlider = document.getElementById("scrubSlider");
var volumeSlider = document.getElementById("volumeSlider");
var fullScreenButton = document.getElementById("fullScreen");
var speedSelecter = document.getElementById("speedSelecter");
var currentTimeDisplay = document.getElementById("currentTimeField");
var speedDisplay = document.getElementById("speedDisplayBox");

// --- on click fucntions ---//
document.getElementById("back1").addEventListener("click", shuttleBackOne);
document.getElementById("play").addEventListener("click", shuttlPlay);
document.getElementById("forward1").addEventListener("click", shuttleForwardOne);

//---- Mouse Events ---///
video.addEventListener("timeupdate", movePlaySlider);
video.addEventListener("timeupdate", getCurrentTime);
scrubSlider.addEventListener("mousedown", pauseSlider); // drag slider
scrubSlider.addEventListener("mouseup", resumeSlider); // resume slider
scrubSlider.addEventListener("change", scrubVideo); // check for video scrub value changes

// ----- submit button listenr -----//
document.getElementById("submit").addEventListener("click",addComment)

/*
////////// functions /////////////
*/

window.onload = function(){
  //// passing dbRef as object to printToDoM() ///
  dbRef.on("value", function(snapshot) {
    printToDom(snapshot.val());
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
}


//----checks if pause player is checked. if it is it pause the player.
function pausePlayer(){
  var checkBox = document.getElementById("play-back").checked;
  if (checkBox){
    return video.pause();
  }
}//end pausePlayer


function scrubVideo() {
  var scrubTime = video.duration * (scrubSlider.value / 100);
  video.currentTime = scrubTime; // sets the current play time to the value of the slide bar
}

function movePlaySlider() {
  var playBackPoint = (100 / video.duration) * video.currentTime;
  scrubSlider.value = playBackPoint; //sets the paybar value to the current palyback time value
}

function pauseSlider() {
  video.pause(); // pauses the video when the slider his pressed
}

function resumeSlider() //
{
  video.play(); // resumes the slider when the video is pressed
  pausePlayer();
}


// gets playback time
function getCurrentTime(){
  var currentTime = video.currentTime;
  var minutes = Math.floor(currentTime / 60);
  var seconds = Math.floor(currentTime % 60);

  if (minutes < 10){
    minutes = "0" + minutes;
  } else if (seconds < 10){
    seconds = "0" + seconds;
  }
  currentTimeDisplay.setAttribute("value", (minutes + ":" + seconds));
}


///// ads user comment to db ////
function addComment(){
  ///// human readable time ///
  var today = new Date();

  var time = today.getHours() + ":"
    + today.getMinutes() + ":"
    + today.getSeconds();

  var date = today.getDate()+' / '
    +(today.getMonth()+1)+' / '
    +today.getFullYear();

  //// create new object from comment ////
  var newSubmit = new commentCreator(date, time);
  commentMaster.push(newSubmit);

  /// push comment to db ////
  dbRef.push(newSubmit);
  clearComments();
}//end adComment

function videoTimeReadOut (){
  var currentFrame = video.currentTime;
  var min = Math.floor(currentFrame / 60);
  var sec = Math.floor(currentFrame % 60);

  if (min < 10){
    min = "0" + min;
  }
  if (sec < 10) {
    sec = "0" + sec;
  }
  var readOut = min + ":" + sec;

  console.log(min);
  console.log(sec);
  console.log(currentFrame);
  console.log(readOut);
  return readOut; //display the video durration
}


// -- creates new object with parameters.
function commentCreator(date, time) {
  this.date = date;
  this.time = time;
  this.name = document.getElementById("name").value;
  this.markerAt = videoTimeReadOut();
  this.second = video.currentTime;
  this.comment =  document.getElementById("add-comment").value;
}

/// clears list then re-writes comment list ///
function printToDom (e){
  var printMe = Object.values(e);

  //---- clear ----//
  document.getElementById("comment-list").innerHTML = "";

  //----- write ----//
  for (var i = 0; i < printMe.length; i++){
    commentMenu.innerHTML +=
      "<div class='comment-element text-left' onclick='goTo("
      + printMe[i].second +")'>"
      + printMe[i].name + ' : '
      + '<span class="marker-time">'+printMe[i].markerAt + '</span> : '
      + '<span class="date-of-commnet">' + printMe[i].date + '</span> <br/>'
      + '<span class="text-of-commnet">'+printMe[i].comment + '</span>';
  }// End For Loop
}// End print to DOM

// ---- shuttle functions --- //
function shuttleBackOne(){
  video.currentTime = video.currentTime - .1;
  pausePlayer();
}

function shuttleBackFive(){
  video.currentTime = video.currentTime - .5;
  pausePlayer();
}

function shuttlPlay(){
  if(video.paused){
    video.play();
  } else {
    video.pause();
  }
}

// playing video with spacebar
document.onkeypress = function(e){
  if(e.keyCode == 32 && e.target.nodeName.toUpperCase() === "BODY"){
    e.preventDefault();
    video.paused ? video.play() : video.pause();
  }
};

function shuttlPause(){
  video.pause();
}

function shuttleForwardOne(){
  video.currentTime = video.currentTime + .1;
  pausePlayer();
}

function shuttleForwardFive(){
  video.currentTime = video.currentTime + .5;
  pausePlayer();
}

//---- allows comments to jump to time in movie---//
function goTo(e){
  video.currentTime = e;
  pausePlayer()
}

/// clears the users comment box ///
function clearComments(){
  document.getElementById('add-comment').value = "";
}

/// deletes  all childern of dbRef node //
function killAllComments (){
  console.log("killed comments");
  dbRef.set(null);
}

