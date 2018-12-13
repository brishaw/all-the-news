// Dependencies
const express = require("express");
const logger = require("morgan"); 
const mongoose = require("mongoose"); 
const axios = require("axios"); 
const cheerio = require("cheerio"); 
var moment = require("moment");

// Require all models
const db = require("./models");

// Port configuration for local/Heroku
var PORT = process.env.PORT || 3000;

// Initialize Express
const app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));

// Use body-parser for handling form submissions
app.use(express.urlencoded({ extended: true }));
mongoose.set('useCreateIndex', true);
app.use(express.json());

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// connect to the mongo DB

var databaseUri = "mongodb://localhost/allTheNewsdb";

if (process.env.MONGODB_URI) {

  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect(databaseUri);
}

var dbs = mongoose.connection;

dbs.on("error", function (err) {
  console.log("Mongoose Error: ", err);
});

dbs.once("open", function () {
  console.log("Mongoose connection successful...");
})

// routes

// default route
app.get("/", (req, res) => res.render("index"));

// GET route for scraping the onion
app.get("/scrape", function (req, res) {

  axios.get("https://www.theonion.com/").then(function (response) {

    var $ = cheerio.load(response.data);

    $("article").each(function (i, element) {

      // save an empty result object
      var result = {};

      // add text, links and images and save them as properties of the empty result object
      result.title = $(this)
        .children("header")
        .children("h1")
        .children("a")
        .text();
      result.link = $(this)
        .children("header")
        .children("h1")
        .children("a")
        .attr("href"),
        result.image = $(this)
          .children(".item__content")
          .children(".asset")
          .children("a")
          .children(".img-wrapper")
          .children("picture")
          .children("source")
          .attr("data-srcset");
      result.excerpt = $(this)
        .children(".item__content")
        .children(".excerpt")
        .children("p");
      result.time = $(this)
        .children("header")
        .children(".meta--pe")
        .children(".meta__container")
        .children("time")
        .attr("datetime")

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
          res.redirect("/");
        })
        .catch(function (err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // keep the user on the page after scraping
    console.log(result);
    // res.redirect("index");
  });
});

// app.get("/", (req, res) => {
//   db.Article.find({})
//     .then(function (dbArticle) {
//       // If we were able to successfully find Articles, send them back to the client
//       const retrievedArticles = dbArticle;
//       let hbsObject;
//       hbsObject = {
//         articles: dbArticle
//       };
//       res.render("index", hbsObject);
//     })
//     .catch(function (err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });



// *******

app.get("/saved", (req, res) => {
  db.Article.find({ isSaved: true })
    .then(function (retrievedArticles) {
      // If we were able to successfully find Articles, send them back to the client
      let hbsObject;
      hbsObject = {
        articles: retrievedArticles
      };
      res.render("saved", hbsObject);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.put("/save/:id", function (req, res) {
  db.Article.findOneAndUpdate({ _id: req.params.id }, { isSaved: true })
    .then(function (data) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(data);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });;
});

app.put("/remove/:id", function (req, res) {
  db.Article.findOneAndUpdate({ _id: req.params.id }, { isSaved: false })
    .then(function (data) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(data)
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.find({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate({
      path: 'note',
      model: 'Note'
    })
    .then(function (dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/note/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function (dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true });
    })
    .then(function (dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.delete("/note/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.findByIdAndRemove({ _id: req.params.id })
    .then(function (dbNote) {

      return db.Article.findOneAndUpdate({ note: req.params.id }, { $pullAll: [{ note: req.params.id }] });
    })
    .then(function (dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});



// Start the server
app.listen(PORT, function () {
  console.log(`This application is running on port: ${PORT}`);
});