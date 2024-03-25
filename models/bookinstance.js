const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create a schema for the BookInstance model
const BookInstanceSchema = new Schema({
  book: {
    type: Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  imprint: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["Available", "Maintenance", "Loaned", "Reserved"],
    default: "Maintenance",
  },
  due_back: {
    type: Date,
    default: Date.now,
  },
});

// Create a virtual for the bookinstance's URL
BookInstanceSchema.virtual("url").get(function () {
  return `/catalog/bookinstance/${this._id}`;
});

// Create a model based on the schema
const BookInstance = mongoose.model("BookInstance", BookInstanceSchema);

module.exports = BookInstance;
