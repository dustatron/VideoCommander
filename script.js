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

const dbRef = firebase.database().ref().child('comments-received');


// Deletes Comments.

document.getElementById("delete-comments").addEventListener("click", killAllComments);

//--- shuttle buttons ---//

document.getElementById("back").addEventListener("click", shuttleBackFive);
document.getElementById("back1").addEventListener("click", shuttleBackOne);
document.getElementById("forward1").addEventListener("click", shuttleForwardOne);
document.getElementById("forward").addEventListener("click", shuttleForwardFive);

// -----comments-----
document.getElementById("submit").addEventListener("click",addComment)

var test = document.getElementsByClassName("read-out");

//--------------------- functions --------------------------//

window.onload = function(){ 
		
	dbRef.on("value", function(snapshot) {
		printToDom(snapshot.val());
  	//console.log(snapshot.val());
			}, function (errorObject) {
 					 console.log("The read failed: " + errorObject.code);
		});
	
	
  //  dbRef.on('value',snap => { 
	//		testReadOut.innerHTML = JSON.stringify(snap.val(), null, 3)});
	}

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
	
	
	
	var time = today.getHours() + ":" 
	+ today.getMinutes() + ":" 
	+ today.getSeconds();
	
	var date = today.getDate()+' / '
	+(today.getMonth()+1)+' / '
	+today.getFullYear();
	
	
	var newSubmit = new commentCreator(date, time);
	commentMaster.push(newSubmit);
	
	// send to database. 
	dbRef.push(newSubmit);
	clearComments();
	
	//printToDom(commentMaster);
	//spitOutTestData();

	
}//end adComment




// -- creates new object with paramiters. 
function commentCreator(date, time) {
		this.date = date;
		this.time = time;
		this.name = document.getElementById("name").value
    this.markerAt = video.currentTime;
    this.comment =  document.getElementById("add-comment").value;
    
}

// ----- clears the comments then rewrites them from commnetMaster array ----//
function printToDom (e){
	document.getElementById("comment-list").innerHTML = "";

	var printMe = Object.values(e);
	
	for (var i = 0; i < printMe.length; i++){
		commentMenu.innerHTML += 
			"<div class='comment-element' onclick='jumper("
			+ printMe[i].markerAt +")'>"
			+ printMe[i].name + ' : ' 
			+ '<span class="marker-time">'+printMe[i].markerAt + '</span> : '
			+ '<span class="date-of-commnet">' + printMe[i].date + '</span> <br/>'
			+ '<span class="text-of-commnet">'+printMe[i].comment + '</span>';

	}
	
	
	//console.log("printer run");
	//console.log(e);
	
	/*for(var key in e){
		var homeRow = e[key];
		for (var prop in homeRow){
			console.log(prop + ' = ' + homeRow[prop])
		}
	}*/
	
	
	
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
	pausePlayer()
}

function clearComments(){
	document.getElementById('add-comment').value = "";
}

function killAllComments (){
	
	console.log("killer button");
	dbRef.set(null);
}

//----- vomits out object data ---//
function spitOutTestData(){
		var x = JSON.stringify(commentMaster);
	document.getElementById("test").innerHTML = x;
}

/*
function checkForName (){
	var checkName = document.getElementById("name").value;
	if (checkName === ""){
		alert("Name must be filled out");
    return false;
	}
	}
*/	

