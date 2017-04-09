// VIEW
const $video = document.getElementById("video1");

const CommentsView = function(comments) {
  let render = function() {
    let $comments = document.getElementById("comment-list");
    let $count = document.getElementById("comment-count");
    let counter = 1;
    let commentAt = comments.second;


    //---- clear ----//
    $comments.innerHTML = "";

      //----- write ----//
    comments.forEach(function(comment) {
      $comments.innerHTML +=
        "<div class='comment-element text-left' onclick ='goTo("+comment.second+")'>"
        + '<span class="comment-name">' + comment.name + '</span> : '
        + '<span class="marker-time">' + comment.markerAt + '</span> : '
        + '<span class="date-of-commnet">' + comment.date + '</span> <br/>'
        + '<span class="text-of-commnet">' + comment.comment + '</span> <br/>'
        + '<span class="delete-commnet-box"><i class="fa fa-trash-o" aria-hidden="true"></i></span>';
        $count.innerHTML = counter ++;
    });
  };

  comments.onUpdate(function() {
    render();
  });

};


const NewCommentView = function(comments) {
  let $submitButton = document.getElementById("submit");


  $submitButton.addEventListener("click", function() {
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

  let comments = [];
  let updateCallbacks = [];
  let commentsSubscription = null;
  const that = this;

    // private

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

    const safeScope = scope.replace(/[\/\.\#\$\[\]]/g, "-");
    commentsSubscription = firebase.database().ref().child(safeScope);
    commentsSubscription.on("value", function(snapshot) {
      const snapshotComments = snapshot.val();
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

function boot() {
  const videoUrl = window.location.search.substring(1);
  document.getElementById("video1").src = videoUrl;

  const comments = new Comments(videoUrl);
  const commentsView = new CommentsView(comments);
  const newCommentView = new NewCommentView(comments);
}

boot();

function goTo(seconds) {
  $video.currentTime = seconds;
}
