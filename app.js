//Citation for Node.js starter app
//Date: 11/10/2022
//Taken from:
//Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// App.js

/*
    SETUP
*/
var express = require('express');
var app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//app.use(express.static('public'))
app.use(express.static(__dirname + '/public'));
PORT = 11163;

const {
    engine
} = require('express-handlebars');
var exphbs = require('express-handlebars');
app.engine('.hbs', engine({
    extname: ".hbs"
}));
app.set('view engine', '.hbs');

// Database
var db = require('./database/db-connector')

/*
    ROUTES to GET Pages
*/

// homepage
app.get('/', function (req, res) {
    return res.render('index');
});

// movies
app.get('/movies', function (req, res) {
    let query1;
    // handle search
    if (req.query.genre === '0' || req.query.genre === undefined) {
        query1 = "SELECT Movies.movie_id, Movies.name, Movies.date_released, Genres.genre, Movies.box_office FROM Movies LEFT JOIN Genres ON Movies.genre_id = Genres.genre_id;";
    }
    else {
        query1 = `SELECT Movies.movie_id, Movies.name, Movies.date_released, Genres.genre, Movies.box_office FROM Movies INNER JOIN Genres ON Movies.genre_id = Genres.genre_id WHERE Movies.genre_id LIKE "${req.query.genre}%";`
    }

    let query2 = "SELECT * FROM Genres;";

    db.pool.query(query1, function (error, rows, fields) {    // Execute the query
        let moviesData = rows;
        for (let i = 0; i < moviesData.length; i++) {
            // display 'NULL' if box office not provided
            if (moviesData[i].box_office === null) {
                moviesData[i].box_office = "NULL"
            }
            // format box office number 
            else {
                moviesData[i].box_office = '$' + moviesData[i].box_office.toLocaleString("en-US")
            }
            // display 'NULL' if genre unavailable or genre DELETED (*NULLABLE 1:M relationship*)
            if (moviesData[i].genre === null) {
                moviesData[i].genre = "NULL"
            }
            // format date
            let date = moviesData[i].date_released
            date = date.toLocaleDateString('en-us', { year: "numeric", month: "long", day: "numeric" })
            moviesData[i].date_released = date
        }
        db.pool.query(query2, (error, rows, fields) => {
            let genres = rows;
            return res.render('movies', { data: moviesData, genres: genres });
        })
    })
});

// genres
app.get('/genres', function (req, res) {
    let query1 = "SELECT * FROM Genres;";

    db.pool.query(query1, function (error, rows, fields) {

        return res.render('genres', { data: rows });
    })

});

// movie reviews
app.get('/movie-reviews', function (req, res) {
    let query1;
    // handle searches
    if (req.query.movie != '0' && req.query.movie != undefined) {
        query1 = `SELECT Movie_Reviews.movie_review_id as id, Movies.name as movieName, CONCAT(Reviewers.reviewer_fname, ' ' , Reviewers.reviewer_lname) as reviewerName, Movie_Reviews.date_of_review as reviewDate, Movie_Reviews.rating, Movie_Reviews.comment FROM Movie_Reviews INNER JOIN Movies ON Movie_Reviews.movie_id = Movies.movie_id INNER JOIN Reviewers ON Movie_Reviews.reviewer_id = Reviewers.reviewer_id WHERE Movies.movie_id LIKE "${req.query.movie}%" ORDER BY Movie_Reviews.movie_review_id ASC;`;
    } else if (req.query.reviewer != '0' && req.query.reviewer != undefined) {
        query1 = `SELECT Movie_Reviews.movie_review_id as id, Movies.name as movieName, CONCAT(Reviewers.reviewer_fname, ' ' , Reviewers.reviewer_lname) as reviewerName, Movie_Reviews.date_of_review as reviewDate, Movie_Reviews.rating, Movie_Reviews.comment FROM Movie_Reviews INNER JOIN Movies ON Movie_Reviews.movie_id = Movies.movie_id INNER JOIN Reviewers ON Movie_Reviews.reviewer_id = Reviewers.reviewer_id WHERE Reviewers.reviewer_id LIKE "${req.query.reviewer}%" ORDER BY Movie_Reviews.movie_review_id ASC;`;
    } else if (req.query.rating != '' && req.query.rating != undefined) {
        query1 = `SELECT Movie_Reviews.movie_review_id as id, Movies.name as movieName, CONCAT(Reviewers.reviewer_fname, ' ' , Reviewers.reviewer_lname) as reviewerName, Movie_Reviews.date_of_review as reviewDate, Movie_Reviews.rating, Movie_Reviews.comment FROM Movie_Reviews INNER JOIN Movies ON Movie_Reviews.movie_id = Movies.movie_id INNER JOIN Reviewers ON Movie_Reviews.reviewer_id = Reviewers.reviewer_id WHERE Movie_Reviews.rating = ${req.query.rating} ORDER BY Movie_Reviews.movie_review_id ASC;`;
    } else {
        query1 = "SELECT Movie_Reviews.movie_review_id as id, Movies.name as movieName, CONCAT(Reviewers.reviewer_fname, ' ' , Reviewers.reviewer_lname) as reviewerName, Movie_Reviews.date_of_review as reviewDate, Movie_Reviews.rating, Movie_Reviews.comment FROM Movie_Reviews INNER JOIN Movies ON Movie_Reviews.movie_id = Movies.movie_id INNER JOIN Reviewers ON Movie_Reviews.reviewer_id = Reviewers.reviewer_id ORDER BY Movie_Reviews.movie_review_id ASC;";
    }

    let query2 = "SELECT * FROM Movies;";
    let query3 = "SELECT * FROM Reviewers;";


    db.pool.query(query1, function (error, rows, fields) {    // Execute the query
        let reviewData = rows;
        for (let i = 0; i < reviewData.length; i++) {
            // format date
            let date = reviewData[i].reviewDate
            date = date.toLocaleDateString('en-us', { year: "numeric", month: "long", day: "numeric" })
            reviewData[i].reviewDate = date
        }
        db.pool.query(query2, (error, rows, fields) => {
            let movieData = rows;
            db.pool.query(query3, (error, rows, fields) => {
                let reviewerData = rows;
                return res.render('movie-reviews', { data: reviewData, movie: movieData, reviewer: reviewerData });
            })
        })
    })

});

// movie directors
app.get('/movie-directors', function (req, res) {
    let query1;
    // handle searches
    if (req.query.movie != '0' && req.query.movie != undefined) {
        query1 = `SELECT Movie_Directors.movie_director_id as id, Movies.name, CONCAT(Directors.director_fname, ' ', Directors.director_lname) as fullName FROM Movie_Directors INNER JOIN Movies ON Movie_Directors.movie_id = Movies.movie_id INNER JOIN Directors ON Movie_Directors.director_id = Directors.director_id WHERE Movies.movie_id LIKE "${req.query.movie}%" ORDER BY fullName ASC;`;
    } else if (req.query.director != '0' && req.query.director != undefined) {
        query1 = `SELECT Movie_Directors.movie_director_id as id, Movies.name, CONCAT(Directors.director_fname, ' ', Directors.director_lname) as fullName FROM Movie_Directors INNER JOIN Movies ON Movie_Directors.movie_id = Movies.movie_id INNER JOIN Directors ON Movie_Directors.director_id = Directors.director_id WHERE Directors.director_id LIKE "${req.query.director}%" ORDER BY fullName ASC;`;
    } else {
        query1 = "SELECT Movie_Directors.movie_director_id as id, Movies.name, CONCAT(Directors.director_fname, ' ', Directors.director_lname) as fullName FROM Movie_Directors INNER JOIN Movies ON Movie_Directors.movie_id = Movies.movie_id INNER JOIN Directors ON Movie_Directors.director_id = Directors.director_id ORDER BY fullName ASC;";
    }

    let query2 = "SELECT * FROM Movies;";
    let query3 = "SELECT * FROM Directors;";


    db.pool.query(query1, function (error, rows, fields) {    // Execute the query
        let Data = rows;
        db.pool.query(query2, (error, rows, fields) => {
            let movieData = rows;
            db.pool.query(query3, (error, rows, fields) => {
                let directorData = rows;
                return res.render('movie-directors', { data: Data, movie: movieData, director: directorData });
            })
        })
    })
});

// reviewers
app.get('/reviewers', function (req, res) {
    let query1 = "SELECT * FROM Reviewers;";

    db.pool.query(query1, function (error, rows, fields) {    // Execute the query
        return res.render('reviewers', { data: rows });
    })

});

// directors
app.get('/directors', function (req, res) {
    let query1;

    if (req.query.Lname === '' || req.query.Lname === undefined) {
        query1 = "SELECT * FROM Directors;";
    }
    else {
        query1 = `SELECT * FROM Directors WHERE director_lname = "${req.query.Lname}";`
    }
    db.pool.query(query1, function (error, rows, fields) {    // Execute the query
        return res.render('directors', { data: rows });
    })

});

/*
    ROUTES to INSERT
*/

// insert movie
app.post('/add-movie-form', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    // handle null box_office
    if (data.input_box_office === '') {
        data.input_box_office = 'null'
    }
    let query1;
    if (data.input_genre_id === '0') {
        query1 = `INSERT INTO Movies (name, date_released, genre_id, box_office) VALUES ('${data['input_name']}', '${data['input_date_released']}', NULL, ${data['input_box_office']})`;
    } else {
        query1 = `INSERT INTO Movies (name, date_released, genre_id, box_office) VALUES ('${data['input_name']}', '${data['input_date_released']}', '${data['input_genre_id']}', ${data['input_box_office']})`;
    }

    // Create the query and run it on the database
    db.pool.query(query1, function (error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM movies and
        // presents it on the screen
        else {
            return res.redirect('/movies');
        }
    })
});

// insert genre
app.post('/add-genre-form', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Genres (genre) VALUES ('${data['input_genre']}')`;
    db.pool.query(query1, function (error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            return res.redirect('/genres');
        }
    })
});

// insert movie review
app.post('/add-movie-review-form', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Movie_Reviews (movie_id, reviewer_id, date_of_review, rating, comment) VALUES ('${data['input_movie_id']}', '${data['input_reviewer_id']}', '${data['input_date_of_review']}', '${data['input_rating']}', '${data['input_comment']}')`;
    db.pool.query(query1, function (error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            return res.redirect('/movie-reviews');
        }
    })
});

// insert movie director
app.post('/add-movie-director-form', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Movie_Directors (movie_id, director_id) VALUES ('${data['input_movie_id']}', '${data['input_director_id']}')`;
    db.pool.query(query1, function (error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            return res.redirect('/movie-directors');
        }
    })
});

// insert reviewer
app.post('/add-reviewer-form', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Reviewers (reviewer_fname, reviewer_lname, reviewer_email) VALUES ('${data['input_reviewer_fname']}', '${data['input_reviewer_lname']}', '${data['input_reviewer_email']}')`;
    db.pool.query(query1, function (error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            return res.redirect('/reviewers');
        }
    })
});

// insert director
app.post('/add-director-form', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Directors (director_fname, director_lname) VALUES ('${data['input_director_fname']}', '${data['input_director_lname']}')`;
    db.pool.query(query1, function (error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            return res.redirect('/directors');
        }
    })
});

/*
    ROUTES to UPDATE
*/

// update a movie
app.put('/put-movie-ajax', function (req, res, next) {
    let data = req.body;

    let name = data.name;
    let date = data.date_released;
    let genre = data.genre_id;
    let box = data.box_office;
    let movie_id = parseInt(data.movie_id);

    let queryUpdateMovie;
    if (genre === '0' || genre === undefined) {
        queryUpdateMovie = `UPDATE Movies SET name = ?, date_released = ?, genre_id = NULL, box_office = ? WHERE movie_id = ?`;
        db.pool.query(queryUpdateMovie, [name, date, box, movie_id], function (error, rows, fields) {
            if (error) {
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
            } else {
                res.redirect('/movies');
            }
        });
    }
    else {
        queryUpdateMovie = `UPDATE Movies SET name = ?, date_released = ?, genre_id = ?, box_office = ? WHERE movie_id = ?`;
        db.pool.query(queryUpdateMovie, [name, date, genre, box, movie_id], function (error, rows, fields) {
            if (error) {
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
            } else {
                res.redirect('/movies');
            }
        });
    }
    // handle null box_office
    if (box === '') {
        box = "null"
    }
});

// update a movie review
app.put('/put-movie-review-ajax', function (req, res, next) {
    let data = req.body;

    let date = data.date_of_review;
    let rating = data.rating;
    let comment = data.comment;
    let movie_review_id = parseInt(data.movie_review_id);


    let queryUpdateMovieReview = `UPDATE Movie_Reviews SET date_of_review = ?, rating = ?, comment = ? WHERE movie_review_id = ?`;
    let selectMovieReviews = `SELECT * FROM Movie_Reviews`;

    // Run the 1st query
    db.pool.query(queryUpdateMovieReview, [date, rating, comment, movie_review_id], function (error, rows, fields) {
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            // Run query to get rows
            db.pool.query(selectMovieReviews, function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            });
        }
    });
});

// update a reviewer
app.put('/put-reviewer-ajax', function (req, res, next) {
    let data = req.body;

    let first_name = data.reviewer_fname;
    let last_name = data.reviewer_lname;
    let email = data.reviewer_email;
    let reviewer_id = parseInt(data.reviewer_id);


    let queryUpdateReviewer = `UPDATE Reviewers SET reviewer_fname = ?, reviewer_lname = ?, reviewer_email = ? WHERE reviewer_id = ?`;
    let selectReviewers = `SELECT * FROM Reviewers`;

    // Run the 1st query
    db.pool.query(queryUpdateReviewer, [first_name, last_name, email, reviewer_id], function (error, rows, fields) {
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            // Run query to get rows
            db.pool.query(selectReviewers, function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            });
        }
    });
});

// update a director
app.put('/put-director-ajax', function (req, res, next) {
    let data = req.body;

    let first_name = data.director_fname;
    let last_name = data.director_lname;
    let director_id = parseInt(data.director_id);

    let queryUpdateDirector = `UPDATE Directors SET director_fname = ?, director_lname = ? WHERE director_id = ?`;
    let selectDirectors = `SELECT * FROM Directors`;

    // Run the 1st query
    db.pool.query(queryUpdateDirector, [first_name, last_name, director_id], function (error, rows, fields) {
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            // Run query to get rows
            db.pool.query(selectDirectors, function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            });
        }
    });
});

/*
    ROUTES to DELETE
*/

// delete movie from Movies
app.delete('/delete-movie-ajax/', function (req, res, next) {
    let data = req.body;
    let movie_id = parseInt(data.movie_id);
    let deleteMovie = `DELETE FROM Movies WHERE movie_id = ?`;

    db.pool.query(deleteMovie, [movie_id], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/movies');
        }
    })
});

// delete genre
app.delete('/delete-genre-ajax/', function (req, res, next) {
    let data = req.body;
    let genre_id = parseInt(data.genre_id);
    let deleteGenre = `DELETE FROM Genres WHERE genre_id = ?`;

    db.pool.query(deleteGenre, [genre_id], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/genres');
        }
    })
});

// delete movie review
app.delete('/delete-movie-review-ajax/', function (req, res, next) {
    let data = req.body;
    let movie_review_id = parseInt(data.movie_review_id);
    let deleteMovieReview = `DELETE FROM Movie_Reviews WHERE movie_review_id = ?`;

    db.pool.query(deleteMovieReview, [movie_review_id], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/movie-reviews');
        }
    })
});

// delete movie director
app.delete('/delete-movie-director-ajax/', function (req, res, next) {
    let data = req.body;
    let movie_director_id = parseInt(data.movie_director_id);
    let deleteMovieDirector = `DELETE FROM Movie_Directors WHERE movie_director_id = ?`;

    db.pool.query(deleteMovieDirector, [movie_director_id], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/movie-directors');
        }
    })
});

// delete reviewer
app.delete('/delete-reviewer-ajax/', function (req, res, next) {
    let data = req.body;
    let reviewer_id = parseInt(data.reviewer_id);
    let deleteReviewer = `DELETE FROM Reviewers WHERE reviewer_id = ?`;

    db.pool.query(deleteReviewer, [reviewer_id], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/reviewers');
        }
    })
});

// delete director
app.delete('/delete-director-ajax/', function (req, res, next) {
    let data = req.body;
    let director_id = parseInt(data.director_id);
    let deleteDirector = `DELETE FROM Directors WHERE director_id = ?`;

    db.pool.query(deleteDirector, [director_id], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/directors');
        }
    })
});

/*
    LISTENER
*/
app.listen(PORT, function () {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});