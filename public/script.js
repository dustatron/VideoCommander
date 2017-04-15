// video player global
const $video = document.getElementById("video1");
//var commentObject = null;

///// writes out comments and page title
const CommentsView = function(comments) {
  let render = function() {
    let $comments = document.getElementById("comment-list");
    let $count = document.getElementById("comment-count");
    let $title = document.getElementById("video-title");
    let counter = 1;
    let commentAt = comments.second;
    let $videoTitle = document.getElementById("video-title");
    let batch = comments.getCommentOject();


    //---- clear ----//
    $comments.innerHTML = " ";

    for(var key in batch) {
        let commentBox = batch[key];
            $comments.innerHTML +=
              "<div  class='comment-element text-left' onclick ='control.go("+commentBox.second+")'>"
              + '<span class="comment-number">' + counter + '</span> : '
              + '<span class="comment-name">' + commentBox.name + '</span> : '
              + '<span class="marker-time">' + commentBox.markerAt + '</span> : '
              + '<span class="date-of-commnet">' + commentBox.date + '</span>'
              + '<input type="checkbox" class="check-task" name="completed" '+commentBox.task+'> <br />'
              + '<span class="text-of-commnet">' + commentBox.comment + '</span> <br/>'
              + '<span class="delete-commnet-box" id="'+key+'"><i class="fa fa-trash-o" aria-hidden="true"></i></span>';
              $count.innerHTML = counter ++;
              $videoTitle.innerHTML = comments.savedTitle();

              //control.push(key);
              // control.makeButtons();

    } //end of for in loop
    control.cycle();
  };

  comments.onUpdate(function() {
    render();
  });
};

////// pushes comments database
const NewCommentView = function(comments, control) {
  let $submitButton = document.getElementById("submit");
  let $videoTitle = document.getElementById("video-title");

  let $enterKey = document.onkeypress = function(evt){
    if (evt.keyCode == 13  && evt.target.nodeName.toUpperCase() != "BODY") {
      submitComment();
    }
  };

  let $formSelectPause = document.getElementById("add-comment");
  $formSelectPause.addEventListener("focus", function(callback){
      $video.pause();
  }, true);

  $videoTitle.addEventListener("blur", function() {
    let newTitle = $videoTitle.innerHTML
    comments.updateTitle(newTitle);
  });

  $submitButton.addEventListener("click", function() {
      submitComment();
    });

      let submitComment = function() {
        let today = new Date();
        let date = today.getDate() + ' / ' + (today.getMonth()+1) + ' / ' + today.getFullYear();
        let name = document.getElementById("name").value;
        let markerAt = formatSeconds($video.currentTime);
        let second = $video.currentTime;
        let commentText = document.getElementById("add-comment").value;
        let task = "";

        let comment = {
          date: date,
          name: name,
          markerAt: markerAt,
          second: second,
          comment: commentText,
          task: task,
        };
        let $name = document.getElementById("name").value;
        if ($name == ""){
          alert("Please enter your name.");
        }else{
          comments.push(comment);
          control.clear();
        }
    };


  function formatSeconds(seconds) {
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);

    if (min < 10){
      min = "0" + min;
    }
    if (sec < 10) {
      sec = "0" + sec;
    }
    return min + ":" + sec;
  }
}

///// Control
const Control = function(comments) {
  let keyArray = []

  this.clear = function() {
    document.getElementById('add-comment').value = " ";
  };

  this.go = function(time) {
    $video.currentTime = time;
  };

  this.push = function(element){
    keyArray.push(element);
  }

  this.cycle = function() {
    let classGroup = document.querySelectorAll(".delete-commnet-box");
    classGroup.forEach(function (key){
      let keyID = key.id;
      key.addEventListener("click", function (){
        comments.deleteComment(keyID);
      })
    })

  }

  // this.makeButtons = function(){
  //   keyArray.forEach(function(callback){
  //     let key = callback
  //     let commentBox = document.getElementById(callback);
  //     commentBox.addEventListener("click", function() {
  //       console.log("click "+ key);
  //       //comments.deleteComment(key);
  //
  //       //let keyIndex = keyArray.indexOf(key);
  //       //keyArray.splice(keyIndex, 1);
  //
  //     });
  //   });
  // }
};

////// talking to the database
const Comments = function(scope) {
  this.forEach = function(comment) {
    comments.forEach(comment);
  };

  this.onUpdate = function(callback) {
    updateCallbacks.push(callback);
  };

  this.push = function(comment) {
    commentsSubscription.push(comment);
  };

  this.deleteComment = function(key) {
    let string = safeScope +'/'+'comments'+'/'+key;
    commentRef.child(string).remove();
  }

  this.getCommentOject = function() {
    return commentObject;
  };

  //// title
  this.savedTitle = function() {
    return this.returnTitle.title;

  }

  this.updateTitle = function(title) {
    videoTitleObject.title = title;
    this.newTitle.set(videoTitleObject);
  }

  ////Comment variables
  let comments = [];
  let updateCallbacks = [];
  let commentsSubscription = null;
  let commentObject = [];
  let commentRef;
  let safeScope;

  ////page title variables
  let videoTitleObject = {
    title: "Title Not Set Yet"
    };
  let newTitle = null;
  let returnTitle;
  const that = this;

  ///// private
  wireUpFirebase = function() {
    const config = {
      apiKey: "AIzaSyDxdKOEazxOtcyJNqo4T4RpVzRvHEnh62E",
      authDomain: "video-commander.firebaseapp.com",
      databaseURL: "https://video-commander.firebaseio.com",
      projectId: "video-commander",
      storageBucket: "video-commander.appspot.com",
      messagingSenderId: "643393373733"
    };

    firebase.initializeApp(config);
    safeScope = scope.replace(/[\/\.\#\$\[\]]/g, "-");
    commentRef = firebase.database().ref();
    commentsSubscription = commentRef.child(safeScope+'/'+'comments');

      //// Custom Video Title
    const videoTitleRef = firebase.database().ref().child(safeScope+'/'+'video-name');
    that.newTitle = videoTitleRef;
    videoTitleRef.on("value", function(snapshot){
      that.returnTitle = snapshot.val();
    });

    commentsSubscription.on("value", function(snapshot) {
      const snapshotComments = snapshot.val();
      commentObject = snapshotComments;
      if(snapshotComments) {
        comments = Object.values(snapshotComments);
        updateCallbacks.forEach(function(callback) {
          callback();
        });
      };
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  };

  wireUpFirebase();
};

 /////// booting
function boot() {
  const videoUrl = window.location.search.substring(1);
  document.getElementById("video1").src = videoUrl;

  const comments = new Comments(videoUrl);
  control = new Control(comments);
  const commentsView = new CommentsView(comments,control);
  const newCommentView = new NewCommentView(comments, control);
};

boot();
