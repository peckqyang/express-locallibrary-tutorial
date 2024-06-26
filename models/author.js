const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

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
    required: false,
    validate: {
      validator: function (value) {
        return !value || (value instanceof Date && !isNaN(value));
      },
      message: "Invalid date of birth",
    },
  },
  date_of_death: {
    type: Date,
    required: false,
    validate: {
      validator: function (value) {
        return !value || (value instanceof Date && !isNaN(value));
      },
      message: "Invalid date of death",
    },
  },
});

// Virtual for author's full name
AuthorSchema.virtual("name").get(function () {
  // To avoid errors in cases where an author does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }

  return fullname;
});

// Virtual for author's URL
AuthorSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/author/${this._id}`;
});

// Virtual for author's date of birth formatted yyyy_mm_dd"
AuthorSchema.virtual("date_of_birth_yyyy_mm_dd").get(function () {
  return this.date_of_birth
    ? DateTime.fromJSDate(this.date_of_birth).toFormat("yyyy-MM-dd")
    : "";
});

// Virtual for author's date of death formatted yyyy_mm_dd"
AuthorSchema.virtual("date_of_death_yyyy_mm_dd").get(function () {
  return this.date_of_death
    ? DateTime.fromJSDate(this.date_of_death).toFormat("yyyy-MM-dd")
    : "";
});

// Virtual for author's lifespan
AuthorSchema.virtual("formatted_lifespan").get(function () {
  let formatted_date_of_birth = this.date_of_birth
    ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)
    : "";

  let formatted_date_of_death = this.date_of_death
    ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)
    : "";

  return this.formatted_date_of_birth
    ? `${this.formatted_date_of_birth} - ${this.formatted_date_of_death}`
    : "";
});

// Create a model based on the schema
module.exports = mongoose.model("Author", AuthorSchema);
