var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var ArticleSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    required: true
  },
  // `link` is required and of type String
  link: {
    type: String,
    required: true
  },
  // 'summary' is required and of type String
  summary: {
    type: String,
    required: false
  },
  // 'saved' is required and of type Boolean
  saved: {
    type: Boolean,
    required: true
  },
  // `notes` is an array that stores the notes
  // The ref property links the ObjectId to the Note model
  notes: {
    type: Array,
    ref: "Note"
  },
  //'viewComments' is required and of type Boolean
  //It allows the user to view comments for each article
  viewComments: {
    type: Boolean,
    required: true
  }
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
