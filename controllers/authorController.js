const Author = require("../models/author");
const Book = require("../models/book");
const author = require("../models/author");
const asyncHandler = require("express-async-handler");
const { Mongoose } = require("mongoose");
const { body, validationResult } = require("express-validator");
const { DateTime } = require("luxon");

// Display list of all Authors
exports.author_list = asyncHandler(async (req, res, next) => {
  const allAuthors = await Author.find().sort({ family_name: 1 }).exec();

  // Get just deleted author if there is one
  const justDeletedAuthorName = req.flash("justDeletedAuthorName");
  console.log("Retrieved justDeletedAuthor flash:", justDeletedAuthorName);
  console.log(justDeletedAuthorName.prototype);
  console.log(typeof justDeletedAuthorName);

  console.log(`justDeletedAuthor from author_list ${justDeletedAuthorName}`);

  res.render("author_list", {
    title: "Author List",
    author_list: allAuthors,
    just_deleted_author_name: justDeletedAuthorName,
  });
});

// Display detail page for a specific Author
exports.author_detail = asyncHandler(async (req, res, next) => {
  // Check if the provided ID is a valid ObjectId
  if (!Mongoose.prototype.isValidObjectId(req.params.id)) {
    const err = new Error("Invalid author ID");
    err.status = 400; // Bad Request
    return next(err);
  }

  // Get details of author and all associated books (in parallel)
  const [author, author_books] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (author === null) {
    // No results.
    const err = new Error("Author not found");
    err.status = 404;
    return next(err);
  }

  res.render("author_detail", {
    title: "Author Detail",
    author: author,
    author_books: author_books,
  });
});

// Display Author create form on GET.
exports.author_create_get = asyncHandler(async (req, res, next) => {
  res.render("author_form", { title: "Create Author" });
});

// Handle Author create on POST.
exports.author_create_post = [
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("family_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  body("date_of_birth")
    .optional({ values: "falsy" })
    .isISO8601()
    .customSanitizer((value) => {
      return DateTime.fromISO(value).toJSDate();
    }),
  body("date_of_death")
    .optional({ values: "falsy" })
    .isISO8601()
    .customSanitizer((value) => {
      return DateTime.fromISO(value).toJSDate();
    }),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create Author object with escaped and trimmed data
    const author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("author_form", {
        title: "Create Author",
        author: author,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.

      // Save author.
      await author.save();
      // Redirect to new author record.
      res.redirect(author.url);
    }
  }),
];

// Display Author delete form on GET.
exports.author_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of authors and all their books (in parallel)
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (author === null) {
    // No results.
    res.redirect("/catalog/authors");
  }

  res.render("author_delete", {
    title: "Delete Author",
    author: author,
    author_books: allBooksByAuthor,
  });
});

// Handle Author delete on POST.
exports.author_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of authors and all their books (in parallel)
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (allBooksByAuthor.length > 0) {
    // Author has books. Render in same way as for GET route
    res.render("author_delete", {
      title: "Delete Author",
      author: author,
      author_books: allBooksByAuthor,
    });
    return;
  } else {
    console.log(author);
    // Author has no books. Delete object and redirect to the list of authors.
    await Author.findByIdAndDelete(req.body.authorid);
    console.log("Setting justDeletedAuthor flash:", author.name);
    console.log(author.prototype);
    console.log(typeof author);
    req.flash("justDeletedAuthorName", author.name);

    console.log(author);

    res.redirect("/catalog/authors");
  }
});

// Display Author update form on GET.
exports.author_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author update GET");
});

// Handle Author update on POST.
exports.author_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author update POST");
});
