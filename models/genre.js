const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create a schema for the Genre model
const GenreSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxLength: 100,
    minLength: 3,
  },
});

// Create a virtual for the bookinstance's URL
GenreSchema.virtual("url").get(function () {
  return `/catalog/genre/${this._id}`;
});

// Create a model based on the schema
const Genre = mongoose.model("Genre", GenreSchema);

module.exports = Genre;
