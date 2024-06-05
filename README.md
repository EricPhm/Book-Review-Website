# Book Review Website
This service will manage user reviews of the books contained in the other service.

## Database
Persist data related to book reviews and comments on the book reviews in a MySQL database.

## Authentication
- All users must be authenticated before making or changing their reviews or comments.
- **Username + Password**
  - Create three endpoints:
    - `/signup`, which accepts a username and password and tries to create a new user in your database using the two. It should only do so if there isn't already a user with that username.
    - `/login`, which accepts a username and password and checks whether they match the entry in your database. If so, issue a cookie containing an auth token.
    - `/logout`, which deletes the user's auth token both from the server and from their cookies.
  - Do not store passwords in plain text! Use a library such as [bcrypt](https://www.npmjs.com/package/bcrypt) to perform a one-way hash of your passwords.

## User Actions
- Write REST Endpoints that allow users to do the following:
  - Post a review for a book, consisting of a rating and some text commenting on the book. A user can only post a review if the book exists in the service from BookAPI, the user is logged in, and the user has not already written a review for the book.
  - Edit the rating and/or text of an existing review. A user can only edit a review that they posted.
  - Post a plain text comment about a review. A user can only post a comment if the user is logged in.
  - Delete a comment. A user can only delete a comment they made.
  - List all of the reviews for a specific book. Each entry in the list should contain the rating and text of the review as well as the username of the user who posted the review. The user does not need to be logged in to do this.
  - List all of the comments for a specific review. The user does not need to be logged in to do this.
