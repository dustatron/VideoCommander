const CommentsView = function(comments) {
  let render = function() {
    let $comments = document.getElementById("comment-list");

    //---- clear ----//
    $comments.innerHTML = "";

    //----- write ----//
    comments.forEach(function(comment) {
      $comments.innerHTML +=
        "<div class='comment-element text-left'>"
        + '<span class="comment-name">' + comment.name + '</span> : '
        + '<span class="marker-time">' + comment.markerAt + '</span> : '
        + '<span class="date-of-commnet">' + comment.date + '</span> <br/>'
        + '<span class="text-of-commnet">' + comment.comment + '</span>';
    });
  };

  comments.onUpdate(function() {
    render();
  });
};

const NewCommentView = function(comments) {
  let $submitButton = document.getElementById("submit");

  $submitButton.addEventListener("click", function() {
    let $video = document.getElementById("video1");
    let today = new Date();
    let date = today.getDate() + ' / ' + (today.getMonth()+1) + ' / ' + today.getFullYear();
    let name = document.getElementById("name").value;
    let markerAt = formatSeconds($video.currentTime);
    let second = $video.currentTime;
    let commentText = document.getElementById("add-comment").value;

    let comment = {
      date: date,
      name: name,
      markerAt: markerAt,
      second: second,
      comment: commentText,
    };

    comments.push(comment);
  });

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

const Comments = function() {
  this.forEach = function(callback) {
    comments.forEach(callback);
  };

  this.onUpdate = function(callback) {
    updateCallbacks.push(callback);
  }

  this.push = function(comment) {
    commentsSubscription.push(comment);
  }

  // private

  let comments = [];
  let updateCallbacks = [];
  let commentsSubscription = null;
  const that = this;

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

    commentsSubscription = firebase.database().ref().child('comments');
    commentsSubscription.on("value", function(snapshot) {
      comments = Object.values(snapshot.val());
      updateCallbacks.forEach(function(callback) {
        callback();
      });
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  }

  wireUpFirebase();
};

function boot() {
  const comments = new Comments();
  const commentsView = new CommentsView(comments);
  const newCommentView = new NewCommentView(comments);
}

boot();

