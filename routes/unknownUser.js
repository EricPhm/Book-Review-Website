

var express = require('express');
var router = express.Router();
// imports a module named unknown_userDao from a file named unknown_user_sql.js
// unknown_userDao contains functions to handle database operations
const unknown_userDao = require('../unknown_user_sql')



// list all of the reviews for a specific book.
router.get('/book_reviews/:book_id', async (req, res) => {
  const { book_id } = req.params

  // get book reviews
  const review_data = await unknown_userDao.getBookReviews(book_id)
  // check if getBookReviews returns []
  if(review_data == 0){
    res.status(404).send("No reviews found for book_id: " + book_id + " or check if there is a book with the id " + book_id)
    return
  }
  res.send(review_data)

})


// list all reviews for a specific author
router.get('/author_reviews/:author_id', async (req, res) => {
  const { author_id } = req.params

  // get author reviews
  const review_data = await unknown_userDao.getAuthorReviews(author_id)
  if (review_data == 0){
    res.status(404).send("No reviews found for author_id: " + author_id + " or check if there is a author with the id " + author_id)
    return
  }
  res.send(review_data)

})


// list all comments for a specific review
router.get('/review_comments/:review_id', async (req, res) => {
  const { review_id } = req.params

  // get review comments
  const comment_data = await unknown_userDao.getComments(review_id)
  if (comment_data == 0){
    res.status(404).send("No comments found for review_id: " + review_id + " or check if there is a review with the id " + review_id)
    return
  }
  res.send(comment_data)

})



module.exports = router;
