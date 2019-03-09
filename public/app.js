$("#home").on("click", function() {
  $.get("/");
});

$("#scrape").on("click", function() {
  $.get("/scrape", function() {
    event.preventDefault();
    window.location.href = "/";
  });
});

$(".save").on("click", function(event) {
  event.preventDefault();
  var id = $(this).attr("data-id");
  $.ajax("/articles/saved/" + id, {
    type: "PUT",
    data: { saved: true }
  });
  window.location.href = "/";
});
