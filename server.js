var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

//Our scraping tools
var cheerio = require("cheerio");
var axios = require("axios");

//Initialize Express
var app = express();

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Parse application body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Models folder
var db = require("./models");

var PORT = 3000;

// Use morgan logger for logging requests
app.use(logger("dev"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/News", {
  useNewUrlParser: true
});

app.get("/", function(req, res) {
  db.Article.find().then(function(dbArticle) {
    res.render("index", { results: dbArticle });
  });
});

//Make axios request to News & Observer
app.get("/scrape", function(req, res) {
  db.Article.deleteMany({}).then(function() {
    axios
      .get("https://www.newsobserver.com/latest-news/")
      .then(function(response) {
        var $ = cheerio.load(response.data);
        var results = [];

        $("h4.title").each(function(i, element) {
          var title = $(element)
            .text()
            .replace(/\n/g, "");
          var link = $(element)
            .children()
            .attr("href");
          var summary = $(element)
            .parent()
            .text()
            .replace(/\n/g, "");
          results.push({
            title: title,
            link: link,
            summary: summary
          });
          db.Article.create(results)
            .then(function(dbArticle) {
              // View the added result in the console
              console.log(dbArticle);
              res.end();
            })
            .catch(function(err) {
              // If an error occurred, log it
              console.log(err);
            });
        });
      });
    //res.send("Scrape Complete");
  });
});

app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(dbArticle);
    });
});

app.post("/articles/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { note: dbNote._id },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
