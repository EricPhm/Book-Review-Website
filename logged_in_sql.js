


const pool = require('./mysql')
// const [results] = await connection.query('SELECT * FROM ____')

// check if user had review for a book yet - return true/false
async function userReviewed(userName, book_id){
    // wait until pool established a connection to MySQL server
    const connection = await pool
    // use array to store data - to get data -> results[0].review_id
    const [results] = await connection.execute(
        'SELECT review_id FROM review_books where userName = ? AND book_id = ?',
        [userName, book_id]
    )
    if(results.length === 0){
        return false
    } else {
        return true
    }
}


// add review from user to database
async function addReview(review) {
    const connection = await pool
    // max rating is 10
    if (review.rating > 10) {
        review.rating = 10
    }
    const [results] = await connection.execute(
        'INSERT INTO review_books (userName, author_id, book_id, review_text, rating) VALUES (?, ?, ?, ?, ?)',
        [review.userName, review.author_id, review.book_id, review.review_text, review.rating]
    )
    return results
}


// update review_text, rating for a book id
async function updateReview(review){
    const connection = await pool
    const [results] = await connection.execute(
        'UPDATE review_books SET review_text = ?, rating = ? WHERE userName = ? AND book_id = ?',
        [review.review_text, review.rating, review.userName, review.book_id]
    )
    // if update succeeds, row affected
    if(results.affectedRows > 0){
        return true
    } else {
        return false
    }
}


// check if review_id is in review_book table
async function checkReview_id(review) {
    const connection = await pool
    const [results] = await connection.execute(
        'SELECT review_id FROM review_books WHERE review_id = ?',
        [review]
    )
     // Check if any rows were returned
     if (results.length > 0) {
        // Extract the review_id from the first row
        return true
    } else {
        // If no rows were returned, return null or throw an error
        return false // or throw new Error('Review not found');
    }
}


// post a comment for a specific review
async function postComment(comment) {
    const connection = await pool
    const [results] = await connection.execute(
        'INSERT INTO comments_review (userName, review_id, comment_text) VALUES (?, ?, ?)',
        [comment.userName, comment.review_id, comment.comment_text]
    )
    // return the newly added comment_id/any new added id
    return results.insertId
}


// check if the comment_id is valid and from the current user
async function checkComment_id(comment_id){
    const connection = await pool
    const [results] = await connection.execute(
        'SELECT userName FROM comments_review WHERE comment_id = ?',
        [comment_id]
    )
    console.log(results)
    if (results.length > 0) {
        // Extract the userName from the first row
        return results[0].userName;
    } else {
        // If no rows were returned, return null or throw an error
        return null; // or throw new Error('Comment not found');
    }
}


// delete a row from the comments where the comment_id and userName match   
async function deleteComment(comment) {
    const connection = await pool
    const [results] = await connection.execute(
        'DELETE FROM comments_review WHERE comment_id = ? AND userName = ?',
        [comment.comment_id, comment.userName]
    )
    return results.affectedRows
}


module.exports = {
    addReview,
    userReviewed,
    updateReview,
    checkReview_id,
    postComment,
    checkComment_id,
    deleteComment
}