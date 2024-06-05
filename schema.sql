CREATE SCHEMA book_manager;

USE book_manager;

CREATE TABLE users (
    userName VARCHAR(255) PRIMARY KEY,
    userPassword VARCHAR(255) NOT NULL
);

CREATE TABLE review_books (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(255) NOT NULL,
    author_id INT NOT NULL,
    book_id INT NOT NULL,
    review_text VARCHAR(255) NOT NULL,
    rating INT NOT NULL,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userName) REFERENCES users(userName)
);

CREATE TABLE comments_review (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(255) NOT NULL,
    review_id INT NOT NULL,
    comment_text VARCHAR(255) NOT NULL,
    comment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (review_id) REFERENCES review_books(review_id)
);


-- insert table with no dependencies first then table that dependent on other tables
-- CREATE TABLE authors (
--     id int primary key auto_increment,
--     name varchar(255) not null,
--     bio text,
--     birthDate date,
--     primaryGenre varchar(255)

-- );

-- CREATE TABLE books (
--     id INT primary key auto_increment,
--     title varchar(255) not null,
--     subtitle varchar(255),
--     publicationDate timestamp,
--     tagsText varchar(255),
--     primaryAuthorId int,
--     -- foreign key
--     foreign key (primaryAuthorId) references authors(id) 
-- );
-- -- many to many relationship ?
-- CREATE TABLE book_tags (
--     book_id int,
--     tagText varchar(255),
--     primary key (book_id, tagText),
--     foreign key (book_id) references books(id)
-- );

-- CREATE TABLE book_editions (
--     book_id int,
--     editionsNum int auto_increment,
--     publicationDate timestamp,
--     primary key (book_id, editionsNum),
--     foreign key (book_id) references books(id)
-- );


-- insert into authors (name, bio, birthDate, primaryGenre) values 