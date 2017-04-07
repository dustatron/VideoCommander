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

///// Reference to Firebase Database

const dbRef = firebase.database().ref().child('comments');


//--------------- VIDEO CONTROS ---------------------////

//------- SHUTTLE VARIABLES  ----//
var scrubSlider = document.getElementById("scrubSlider");
var currentTimeDisplay = document.getElementById("currentTimeField");

// --- on click fucntions ---//
document.getElementById("play").addEventListener("click", shuttlPlay);

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

//// passing dbRef as object to printToDoM() ///
dbRef.on("value", function(snapshot) {
  printToDom(snapshot.val());
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});


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

  var date = today.getDate()+' / '
    +(today.getMonth()+1)+' / '
    +today.getFullYear();

  //// create new object from comment ////
  var newSubmit = new commentCreator(date);

  /// push comment to db ////
  dbRef.push(newSubmit);
  document.getElementById('add-comment').value = "";
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

  return readOut; //display the video durration
}


// -- creates new object with parameters.
function commentCreator(date) {
  this.date = date;
  this.name = document.getElementById("name").value;
  this.markerAt = videoTimeReadOut();
  this.second = video.currentTime;
  this.comment =  document.getElementById("add-comment").value;
}

/// clears list then re-writes comment list ///
function printToDom (e){
  var printMe = Object.values(e);
  let commentMenu = document.getElementById("comment-list");

  //---- clear ----//
  commentMenu.innerHTML = "";

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
function shuttlPlay(){
  if(video.paused){
    video.play();
  } else {
    video.pause();
  }
}

function shuttlPause(){
  video.pause();
}

//---- allows comments to jump to time in movie---//
function goTo(e){
  video.currentTime = e;
  pausePlayer()
}

