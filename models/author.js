const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create a schema for the Author model
const AuthorSchema = new Schema({
  first_name: {
    type: String,
    required: true,
    maxLength: 100,
  },
  family_name: {
    type: String,
    required: true,
    maxLength: 100,
  },
  date_of_birth: {
    type: Date,
    validate: {
      validator: function (value) {
        return value instanceof Date && !isNaN(value);
      },
      message: "Invalid date of birth",
    },
  },
  date_of_death: {
    type: Date,
    validate: {
      validator: function (value) {
        return !value || (value instanceof Date && !isNaN(value));
      },
      message: "Invalid date of death",
    },
  },
});

// Create a virtual for the author's full name
AuthorSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.familyName}`;
});

// Create a virtual for the author's URL
AuthorSchema.virtual("url").get(function () {
  return `/catalog/authors/${this._id}`;
});

// Create a virtual property for the author's age
AuthorSchema.virtual("age").get(function () {
  if (this.dateOfDeath) {
    return this.dateOfDeath.getFullYear() - this.dateOfBirth.getFullYear();
  }
  const currentDate = new Date();
  return currentDate.getFullYear() - this.dateOfBirth.getFullYear();
});

// Create a model based on the schema
const Author = mongoose.model("Author", AuthorSchema);

module.exports = Author;
