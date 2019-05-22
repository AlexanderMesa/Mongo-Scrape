$("#myModal").css("display", "none");

$("#home").on("click", function() {
  $.get("/");
});

//Scrapes the articles from News & Observer
$("#scrape").on("click", function() {
  $.get("/scrape", function() {
    window.location.href = "/";
  });
});

//Saves the article
$(".save").on("click", function(event) {
  event.preventDefault();
  var id = $(this).attr("data-id");
  $.ajax("/articles/saved/" + id, {
    type: "PUT",
    data: { saved: true }
  });
  window.location.href = "/";
});

//Deletes article from saved articles
$(".delete").on("click", function(event) {
  event.preventDefault();
  var id = $(this).attr("data-id");
  $.ajax("/articles/delete/" + id, {
    type: "PUT",
    data: { saved: false }
  });
  window.location.href = "/";
});

//Gets notes from selected article
$(".notes").on("click", function(event) {
  event.preventDefault();
  var id = $(this).attr("data-id");
  $.ajax("/articles/notes/" + id, {
    type: "PUT",
    data: { viewComments: true }
  });
  window.location.href = "/";
});

//Hides notes from selected article
$(".hide-notes").on("click", function(event) {
  event.preventDefault();
  var id = $(this).attr("data-id");
  $.ajax("/articles/hidenotes/" + id, {
    type: "PUT",
    data: { viewComments: false }
  });
  window.location.href = "/";
});

//Adds a note for the selected article
$(".submit-note").on("click", function(event) {
  //event.preventDefault();
  var id = $(this).attr("data-id");
  var note = document.getElementById("comment_" + id.toString() + "").value;
  console.log(note);
  $.get("/articles/notes/" + id + "/" + note, function() {
    //event.preventDefault();
    window.location.href = "/";
  });
});

//Deletes notes for selected article
$(".delete-notes").on("click", function(event) {
  //event.preventDefault();
  var id = $(this).attr("data-id");
  $.get("/articles/deletenotes/" + id, function() {
    //event.preventDefault();
    window.location.href = "/";
  });
});
