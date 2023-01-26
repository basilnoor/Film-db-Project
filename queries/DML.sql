-- Film DB Project
-- Basil Noor

-- --------------------------------------------------------
-- INSERT STATEMENTS

-- Creating new Movies
INSERT INTO Movies (name, date_released, genre_id, box_office)
VALUES (:name_input, :date_released_input, :genre_id_input, :box_office_input);

-- Create new Genres
INSERT INTO Genres (genre) VALUES (:genre_input);

-- Create new Movie_Reviews
INSERT INTO Movie_Reviews (movie_id, reviewer_id, date_of_review, rating, comment)
VALUES (:movie_id_input, :reviewer_id_input, :date_of_review_input, :rating_input, :comment_input);

-- Create a new Reviewers
INSERT INTO Reviewers (reviewer_fname, reviewer_lname, reviewer_email)
VALUES (:fn_reviewer_input, :ln_reviewer_input, :reviewer_email_input);

-- Create new Directors
INSERT INTO Directors (director_fname, director_lname) VALUES (:fn_director_input, :ln_director_input);

-- Create a Director Movie Relationship (M:M Intersection Table)
INSERT INTO Movie_Directors (movie_id, director_id) VALUES (:movie_id_input, :director_id_input);

-- --------------------------------------------------------
-- SELECT STATEMENTS

-- Display all Movies in the database
SELECT Movies.movie_id, Movies.name, Movies.date_released, Genres.genre, Movies.box_office FROM Movies
LEFT JOIN Genres ON Movies.genre_id = Genres.genre_id;;
-- Display Movies based on Genre
SELECT Movies.movie_id, Movies.name, Movies.date_released, Genres.genre, Movies.box_office FROM Movies
INNER JOIN Genres ON Movies.genre_id = Genres.genre_id WHERE Movies.genre_id = :genre_input;

-- Display all Directors in the database
SELECT * FROM Directors;

-- Display all Genres in the database
SELECT * FROM Genres;

-- Display all Reviewers in the database
SELECT * FROM Reviewers;

-- Display all Movie Reviews
SELECT Movie_Reviews.movie_review_id as id, Movies.name as movieName, CONCAT(Reviewers.reviewer_fname, ' ' , Reviewers.reviewer_lname) as reviewerName, Movie_Reviews.date_of_review as reviewDate, Movie_Reviews.rating, Movie_Reviews.comment FROM Movie_Reviews
INNER JOIN Movies ON Movie_Reviews.movie_id = Movies.movie_id
INNER JOIN Reviewers ON Movie_Reviews.reviewer_id = Reviewers.reviewer_id
ORDER BY Movie_Reviews.movie_review_id ASC;
-- Display all Movie Reviews based on rating
SELECT Movie_Reviews.movie_review_id as id, Movies.name as movieName, CONCAT(Reviewers.reviewer_fname, ' ' , Reviewers.reviewer_lname) as reviewerName, Movie_Reviews.date_of_review as reviewDate, Movie_Reviews.rating, Movie_Reviews.comment FROM Movie_Reviews
INNER JOIN Movies ON Movie_Reviews.movie_id = Movies.movie_id
INNER JOIN Reviewers ON Movie_Reviews.reviewer_id = Reviewers.reviewer_id
WHERE Movie_Reviews.rating = :rating_input
ORDER BY Movie_Reviews.movie_review_id ASC;

-- Display all movies created by a certain director
SELECT Movies.name, Movies.date_released, Directors.director_fname, Directors.director_lname
FROM Movie_Directors
INNER JOIN Movies ON Movie_Directors.movie_id = Movies.movie_id
INNER JOIN Directors ON Movie_Directors.reviewer_id = Directors.reviewer_id;

-- --------------------------------------------------------
-- UPDATE STATEMENTS

-- Update a Reviewers information
UPDATE Reviewers SET reviewer_fname = :fn_reviewer_input, reviewer_lname = :ln_reviewer_input, reviewer_email = :reviewer_email_input
WHERE reviewer_id = :reviewer_id_input;

-- update a movie review
UPDATE Movie_Reviews SET date_of_review = :review_date_input, rating = :rating_input, comment = :comment_input
WHERE movie_review_id = :movie_review_id_input;

-- update genres for a movie
UPDATE Genres SET genre = :genre_input
WHERE genre_id = :genre_id_input;

-- update movie information
UPDATE Movies SET name = :name_input, date_released = :date_released_input, genre_id = :genre_id_input, box_office = :box_office_input
WHERE movie_id = :movie_id_input;

-- UPDATE Directors
UPDATE Directors SET director_fname = :fn_director_input, director_lname = :ln_director_input
WHERE director_id = :director_id_input;

-- --------------------------------------------------------
-- DELETE STATEMENTS

-- Delete from Movies
DELETE FROM Movies WHERE movie_id = :movie_selected_deletion;

-- Delete from Movie_Reviews
DELETE FROM Movie_Reviews WHERE movie_review_id = :movie_review_selected_deletion;

-- Delete from Reviewers
DELETE FROM Reviewers WHERE reviewer_id = :reviewer_selected_deletion;

-- Delete a genre for a movie
DELETE FROM Genres WHERE genre_id = :genre_id_selected;

-- Delete a director from Directors
DELETE FROM Directors WHERE director_id = :director_id_selected;

-- Delete a movie_id or director_id from Movie_Dirctors
DELETE FROM Movie_Directors WHERE movie_id = :movie_id_selected;
DELETE FROM Movie_Directors WHERE director_id = :director_id_selected;