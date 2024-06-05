

// this pool object is provides a connection to MySQL database
const pool = require("./mysql");

// get book review from database
async function getBookReviews(book_id){
    const connection = await pool
    const [results] = await connection.execute(
        'SELECT userName, review_text, rating, review_date FROM review_books WHERE book_id = ?',
        [book_id]
    )
    if(results.length > 0){
        // use map function to iterate over each item (review) in the results array.
        // map function returns an array of these new objects, 
        // which transforming array of database results to array of review objects with desired properties. (userName: review.userName, etc.)
        return results.map(reviewObject => ({
            userName: reviewObject.userName,
            review_date: reviewObject.review_date,
            review_text: reviewObject.review_text,
            rating: reviewObject.rating
        }))
    } else {
        return []
    }
}


// get author review
async function getAuthorReviews(author_id){
    const connection = await pool
    const [results] = await connection.execute(
        'SELECT userName, book_id,  review_text, rating, review_date FROM review_books where author_id = ?',
        [author_id]
    )
    if (results.length > 0){
        // map( review => { } )
        // use map to iterate through each review object in array of results
        // then use create new object with desire properties for each one
        // return new objects with layout properties
        return results.map( reviewObject => ({
            userName: reviewObject.userName,
            book_id: reviewObject.book_id,
            review_date: reviewObject.review_date,
            review_text: reviewObject.review_text,
            rating: reviewObject.rating
        }))
    } else {
        // empty string if not the right id
        return []
    }
}


// get comments for a review
async function getComments(review_id){
    const connection = await pool
    const [results] = await connection.execute(
        'SELECT userName, comment_text, comment_date FROM comments_review WHERE review_id = ?',
        [review_id]
    )
    if (results.length > 0){
        return results.map( reviewObject => ({
            userName: reviewObject.userName,
            comment_date: reviewObject.comment_date,
            comment_text: reviewObject.comment_text
        }))
    } else {
        return []
    }
}


module.exports = {
    getBookReviews,
    getAuthorReviews,
    getComments
}