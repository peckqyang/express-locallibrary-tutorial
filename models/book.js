const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const he = require("he");

// Create a schema for the Book model
const BookSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "Author",
    required: true,
  },
  summary: {
    type: String,
    required: true,
    trim: true,
  },
  isbn: {
    type: String,
    required: true,
    trim: true,
  },
  genre: [
    {
      type: Schema.Types.ObjectId,
      ref: "Genre",
    },
  ],
});

BookSchema.virtual("url").get(function () {
  // We don't use an arrow function since we need the this object
  return `/catalog/book/${this._id}`;
});

BookSchema.virtual("decoded_summary").get(function () {
  // We don't use an arrow function since we need the this object
  return he.decode(this.summary);
});

//Export model
module.exports = mongoose.model("Book", BookSchema);
