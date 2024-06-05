var express = require('express');
var router = express.Router();
const logged_inDao = require('../logged_in_sql')

// get userToken from getUserId function from another path
const { getUserId } = require('../models/auth_token_cache.js')

// function to check the token for logged in users
async function checkUserToken(req, res, next){
  // check if there is a token
  if (!req.cookies || !req.cookies.AuthToken){
    res.status(401).send("No Cookie: go to /login to login")
    // res.redirect('/login')
    return 
  }
  // check userName is a valid user name
  const userName = getUserId(req.cookies.AuthToken)
  if (!userName){
    res.status(401).send("No match user name: go to /login to login") 
    return
  }  
  // update time for token in cookies for everytime clicking on routes
  res.cookie("AuthToken", req.cookies.AuthToken, { maxAge: 1000 * 60 * 60 * 24 })

  // go to the next handlers or middleware
  next()
}

// example
// {
//   "review_text": "This book is great",
//   "rating": "9"
// }
// {
//   "userName": "Bill",
//   "userPassword": "Bpham"
// }


// post review for a book
// can only post a review if the book exists in the service from homework 1
// the user is logged in, and the user has not already written a review for the book.
router.post('/review_book/:book_id', checkUserToken, async (req, res) => {
  // // Set cache-control headers to prevent caching
  // res.setHeader('Cache-Control', 'no-store');

  const userName = getUserId(req.cookies.AuthToken)
  const { book_id } = req.params
  const { review_text, rating} = req.body // rating is int
  
  try {
    // check if user already did review for this book
    let user_reviewed = await logged_inDao.userReviewed(userName, book_id)
    if (user_reviewed == true) {
      return res.status(200).send("User already reviewed this book")
    }
    
    // create method get for fetching api
    const options = {
      method: "GET"
    }
    // get book detail from API
    const response = await fetch('http://localhost:8080/books/book_details/' + encodeURIComponent(book_id), options)
    var data = await response.json()
    console.log(data)
    
    // handle book details response
    if (data && data.length >= 0) {
      // need [0] because json array
      const author_id = data[0].Primary_author_id
      const book_id = data[0].id
            
      // add review to database
      const add_review = await logged_inDao.addReview({userName, author_id, book_id, review_text, rating})
            
      // send response if succeeded
      res.status(200).send(add_review)
    } else {
      res.sendStatus(404, 'Can not add review for this book')
    }
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).send("Internal Server Error");
  }

})


// Edit the rating and/or text of an existing review. 
// A user can only edit a review that they posted.
router.patch('/edit_review/:book_id', checkUserToken, async (req, res) => {
  const userName = await getUserId(req.cookies.AuthToken)
  const { book_id } = req.params
  const { review_text, rating } = req.body
  
  // check if the user not reviewed the book yet
  // redirect to review book
  let user_reviewed = await logged_inDao.userReviewed(userName, book_id)
  if (!user_reviewed){
    res.status(200).send("User had not review for this book")
    // redirect('')
    return
  }

  const update_review = await logged_inDao.updateReview({review_text, rating, userName, book_id})
  if (!update_review){
    res.status(404).send("Can not update review")
    return
  } else {
    res.status(200).send("Review has been updated")
    return
  }

})


// post a comment about review
router.post('/review_comment/:review_id', checkUserToken, async (req, res) => {
  const { review_id } = req.params
  const userName = await getUserId(req.cookies.AuthToken)
  const { comment_text } = req.body
  // check if review_id is valid, return review_id
  const check_id = await logged_inDao.checkReview_id(review_id)
  if (!check_id){
    res.status(404).send("Invalid review_id")
    return
  }
  // call function in logged_in_sql.js to post comment to database
  const post_comment = await logged_inDao.postComment({userName, review_id, comment_text})
  if (!post_comment){
    res.status(404).send("Can not post comment")
    return
  }
  res.status(200).send("Comment posted!!!")
})


// delete a comment. A user can only delete a comment they made.
router.delete('/comments/:comment_id', checkUserToken, async (req, res) => {
  const userName = await getUserId(req.cookies.AuthToken)
  // or const comment_id = req.params.comment_id
  const { comment_id } = req.params

  // check if the comment_id is valid and from the current user
  const check_comment_userName = await logged_inDao.checkComment_id(comment_id)
  console.log(check_comment_userName)
  if(!check_comment_userName) { // invalid comment_id
    res.status(403).send("Invalid comment_id")
    return
  }
  if(check_comment_userName != userName) { // check if current user is comments user
    res.status(403).send("This comment is from another user")
    return
  }

  const delete_comment = await logged_inDao.deleteComment({comment_id, userName})
  if (delete_comment == 0) {
    res.status(403).send("Comment not delete!")
    return 
  }
  res.status(204).send("Comment deleted!!!")

})


module.exports = router;
