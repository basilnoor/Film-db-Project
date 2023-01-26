-- Film DB Project
-- Basil Noor

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- --------------------------------------------------------
-- Create Genres Table

CREATE OR REPLACE TABLE Genres(
	genre_id INT(11) AUTO_INCREMENT,
	genre VARCHAR(25) DEFAULT NULL,
	Primary KEY (genre_id)
);


-- --------------------------------------------------------
-- Create Movies Table

CREATE OR REPLACE TABLE Movies (
	movie_id INT(11) NOT NULL AUTO_INCREMENT,
	name VARCHAR(250) NOT NULL,
	date_released DATE DEFAULT NULL,
    genre_id INT(11),
	box_office BIGINT DEFAULT NULL,
	PRIMARY KEY (movie_id),
    FOREIGN KEY (genre_id) REFERENCES Genres(genre_id) ON DELETE SET NULL
);

-- --------------------------------------------------------
-- Create Reviewers Table

CREATE OR REPLACE TABLE Reviewers(
	reviewer_id INT(11) NOT NULL AUTO_INCREMENT,
	reviewer_fname VARCHAR(25) NOT NULL,
	reviewer_lname VARCHAR(25) NOT NULL,
	reviewer_email VARCHAR(250) NOT NULL,
	PRIMARY KEY(reviewer_id)
);

-- --------------------------------------------------------
-- Create Movie_Reviews Table

CREATE OR REPLACE TABLE Movie_Reviews (
	movie_review_id INT(11) NOT NULL AUTO_INCREMENT,
	movie_id INT(11) NOT NULL,
	reviewer_id INT(11) NOT NULL,
	date_of_review DATE NOT NULL,
	rating INT(11) NOT NULL,
	comment VARCHAR(2500) DEFAULT NULL,
	PRIMARY KEY (movie_review_id),
	FOREIGN KEY (movie_id) REFERENCES Movies(movie_id) ON DELETE CASCADE,
	FOREIGN KEY (reviewer_id) REFERENCES Reviewers(reviewer_id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- Create Directors Table

CREATE OR REPLACE TABLE Directors(
	director_id INT(11) NOT NULL AUTO_INCREMENT,
	director_fname VARCHAR(25) NOT NULL,
	director_lname VARCHAR(25) NOT NULL,
	PRIMARY KEY(director_id)
);

-- --------------------------------------------------------
-- Create Movie_Directors Table

CREATE OR REPLACE TABLE Movie_Directors(
	movie_director_id INT(11) NOT NULL AUTO_INCREMENT,
	movie_id INT(11) NOT NULL,
	director_id INT(11) NOT NULL,
    PRIMARY KEY (movie_director_id),
	FOREIGN KEY (movie_id) REFERENCES Movies(movie_id) ON DELETE CASCADE,
	FOREIGN KEY (director_id) REFERENCES Directors(director_id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- INSERTING data into Genres

INSERT INTO Genres(genre)
VALUES
(
	"Action"
),
(
	"Adventure"
),
(
	"Thriller"
),
(
	"Drama"
),
(
	"Sci-fi"
);

-- --------------------------------------------------------
-- INSERTING data into Movies

INSERT INTO Movies(name, date_released, genre_id, box_office)
VALUES
(
	"The Dark Knight",
	"2008-07-18",
    NULL,
	1006000000
),
(
	"Inception",
	"2010-07-13",
    1,
	836800000
),
(
	"Parasite",
	"2019-10-5",
    2,
	263100000
),
(
	"The Shawshank Redemption",
	"1994-09-22",
    NULL,
	NULL
),
(
	"The Matrix",
	"1993-03-24",
    3,
	46720000
);


-- --------------------------------------------------------
-- INSERTING data into Directors

INSERT INTO Directors (director_fname, director_lname)
VALUES
(
	"Christopher",
	"Nolan"
),
(
	"Bong",
	"Joon-Ho"
),
(
	"Frank",
	"Darabont"
),
(
	"Lana",
	"Wachowski"
),
(
	"Lilly",
	"Wachowski"
);

-- --------------------------------------------------------
-- INSERTING data into Reviewers

INSERT INTO Reviewers (reviewer_fname, reviewer_lname, reviewer_email)
VALUES
(
	"John",
	"Blank",
	"jblank@gmail.com"
),
(
	"Eren",
	"Blank",
	"eyeger@gmail.com"
),
(
	"Ben",
	"Dover",
	"bdover@gmail.com"
),
(
	"Lily",
	"Smith",
	"lsmith@gmail.com"
);

-- --------------------------------------------------------
-- INSERTING data into Movie_Reviews

INSERT INTO Movie_Reviews (
    movie_id, 
    reviewer_id, 
    date_of_review, 
    rating, 
    comment
    )
VALUES
(
	1,
	1,
	"2020-10-10",
	5,
	"Absolutely loved this movie, 5/5 must watch"
),
(
	1,
	4,
	"2021-05-05",
	4,
	"Great film, but where is superman?"
),
(
	4,
	2,
	"2022-12-12",
	5,
	"A Classic movie that never dissapoints"
),
(
	3,
	2,
	"2022-12-13",
	3,
	"Great film, but pacing could be improved"
);

-- --------------------------------------------------------
-- INSERTING data into Movie_Directors

INSERT INTO Movie_Directors (movie_id, director_id)
VALUES
(
	1,
	1
),
(
	2,
	1
),
(
	3,
	2
),
(
	4,
	3
),
(
	5,
	4
),
(
	5,
	5
);

SET FOREIGN_KEY_CHECKS=1;
COMMIT;

