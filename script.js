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

///////// my app stuff ///////

var video = document.getElementById("video1");
var commentMaster = [];

var tester = 5;

// Import Admin SDK

const dbRef = firebase.database().ref().child('comments');


//listens time jumper.
document.getElementById("leap").addEventListener("click", goTo);

//--- shuttle buttons ---//

document.getElementById("back").addEventListener("click", shuttleBackFive);
document.getElementById("back1").addEventListener("click", shuttleBackOne);
document.getElementById("forward1").addEventListener("click", shuttleForwardOne);
document.getElementById("forward").addEventListener("click", shuttleForwardFive);

//listen for comments.
document.getElementById("submit").addEventListener("click",addComment)

var test = document.getElementsByClassName("read-out");

//--------------------- functions --------------------------//

/// this function skips to the time entered. 
function goTo(){
	
	var time = document.getElementById("time").value;
	
	//this jumps the videos playhead to time. 
	video.currentTime = time;
	pausePlayer();

	}// end goTO

//-------------- 

//----checks if pause player is checked. if it is it pause the player.
function pausePlayer(){

	var checkBox = document.getElementById("play-back").checked;
	//document.getElementById("test").innerHTML = checkBox;	
	if (checkBox){
			return video.pause();
		}
}//end pausePlayer


//get comments and post them to the DOM.
function addComment(){
	
	var today = new Date();
	var playerTime = video.currentTime;
	var userComment = document.getElementById("add-comment").value;
	
	
	
	var time = "Time: " + today.getHours() + ":" 
	+ today.getMinutes() + ":" 
	+ today.getSeconds() + "<br> Date: " 
	+ today.getFullYear()+'-'
	+(today.getMonth()+1)+'-'
	+today.getDate();;
	
	//writes to dom
	/*document.getElementById("comment-list").innerHTML += 
		"<div class='comment-box'>" 
		+ time + "<p class='comment-time'> Video Time: " 
		+ playerTime + "</p><br> Commnet: " 
		+ userComment + "</div>";
		*/
	
	
	var newSubmit = new commentCreator(today, playerTime, userComment);
	commentMaster.push(newSubmit);
	
	dbRef.push(newSubmit);
	
	printToDom(commentMaster);
	//spitOutTestData();

	
}//end adComment




// -- creates new object with paramiters. 
function commentCreator(name,date, pTime, comment) {
		this.name = document.getElementById("name").value
    this.date = new Date();
    this.markerAt = video.currentTime;
    this.comment =  document.getElementById("add-comment").value;
    
}

// ----- clears the comments then rewrites them from commnetMaster array ----//
function printToDom (element){
	document.getElementById("comment-list").innerHTML = "";
	
	for (var i = 0; i < element.length; i++){
		document.getElementById("comment-list").innerHTML += 
			"<div class='comment-element' onclick='jumper("+element[i].markerAt +")'>" 
			+ '<p> name: '+ element[i].name + ' : ' + element[i].markerAt + '<br/>'
			+ element[i].comment + '</p>';

	}

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

function shuttleForwardOne(){
	video.currentTime = video.currentTime + .1;
	pausePlayer();
}

function shuttleForwardFive(){
	video.currentTime = video.currentTime + .5;
	pausePlayer();
}

//---- allows comments to jump to time in movie---//
function jumper(e){
	video.currentTime = e;
}

//----- vomits out object data ---//
function spitOutTestData(){
		var x = JSON.stringify(commentMaster);
	document.getElementById("test").innerHTML = x;
}

function checkForName (){
	var checkName = document.getElementById("name").value;
	if (checkName === ""){
		alert("Name must be filled out");
    return false;
	}
	
}