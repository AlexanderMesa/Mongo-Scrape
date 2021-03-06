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

var PORT = process.env.PORT || 3000;

// Use morgan logger for logging requests
app.use(logger("dev"));

// Connect to the Mongo DB
var MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://localhost/News" ||
  "mongolab-trapezoidal-11407";
mongoose.connect(MONGODB_URI); /*, {
  useNewUrlParser: true
});*/

app.get("/", function(req, res) {
  db.Article.find().then(function(dbArticle) {
    res.render("index", { results: dbArticle });
  });
});

//Make axios request to New York Times
app.get("/scrape", function(req, res) {
  db.Article.deleteMany({}).then(function() {
    axios.get("https://www.nytimes.com/").then(function(response) {
      // console.log(response);

      var $ = cheerio.load(response.data);
      var results = [];

      $("div.css-6p6lnl").each(function(i, element) {
        var title =
          $(element)
            .find("span")
            .text()
            .replace(/\n/g, "") ||
          $(element)
            .find("h2")
            .text()
            .replace(/\n/g, "");
        var link = $(element)
          .find("a")
          .attr("href");
        var summary =
          $(element)
            .find("li")
            .text()
            .replace(/\n/g, "")
            .replace(".", ". ") ||
          $(element)
            .find("p")
            .text()
            .replace(/\n/g, "");

        var object = {
          title: title,
          link: "https://www.nytimes.com" + link,
          summary: summary,
          saved: false,
          notes: notes,
          viewComments: false
        };
        //console.log(summary);
        var notes = [];
        if (!results.includes(object.title)) {
          results.push(object);
        }
      });

      console.log("Here are the results: ");
      console.log(results);
      db.Article.create(results)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle.saved);
          console.log(dbArticle);
          res.end();
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
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

//Save the article
app.put("/articles/saved/:id", function(req, res) {
  db.Article.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(req.params.id) },
    { $set: { saved: true } }
  ).then(function(err) {
    console.log(err);
  });
});

//Delete the article from your saved articles
app.put("/articles/delete/:id", function(req, res) {
  db.Article.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(req.params.id) },
    { $set: { saved: false } }
  ).then(function(err) {
    console.log(err);
  });
});

//Shows article notes based on "Add Note" button
app.put("/articles/notes/:id", function(req, res) {
  db.Article.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(req.params.id) },
    { $set: { viewComments: true } }
  ).then(function(err) {
    // If we were able to successfully update an Article, send it back to the client
    console.log(err);
  });
});

//Hides article notes based on the "Hide" button
app.put("/articles/hidenotes/:id", function(req, res) {
  db.Article.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(req.params.id) },
    { $set: { viewComments: false } }
  ).then(function(err) {
    // If we were able to successfully update an Article, send it back to the client
    console.log(err);
  });
});

//Creates a new note
app.get("/articles/notes/:id/:note", function(req, res) {
  db.Article.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(req.params.id) },
    { $push: { notes: req.params.note } }
  ).then(function(err) {
    // If we were able to successfully update an Article, send it back to the client
    console.log(err);
  });
});

//deletes the notes
app.get("/articles/deletenotes/:id", function(req, res) {
  db.Article.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(req.params.id) },
    { $set: { notes: [] } }
  ).then(function(err) {
    console.log(err);
  });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
