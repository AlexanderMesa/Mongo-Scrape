$("#home").on("click", function() {
  $.get("/");
});

$("#scrape").on("click", function() {
  $.get("/scrape", function() {
    window.location.href = "/";
    //event.preventDefault();
  });
});
