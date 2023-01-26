// **UPDATE**

// Get the objects we need to modify
let updateMovieReviewsForm = document.getElementById('update-movie-review-form-ajax');

// Modify the objects we need
updateMovieReviewsForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputMovieReviewid = document.getElementById("update_select");
    let inputDate = document.getElementById("input_date_of_review_update");
    let inputRating = document.getElementById("input_rating_update");
    let inputComment = document.getElementById("input_comment_update");

    // Get the values from the form fields
    let movieReviewIDValue = inputMovieReviewid.value;
    let ratingValue = inputRating.value;
    let dateValue = inputDate.value;
    let commentValue = inputComment.value;

    // Put our data we want to send in a javascript object
    let data = {
        movie_review_id: movieReviewIDValue,
        rating: ratingValue,
        date_of_review: dateValue,
        comment: commentValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-movie-review-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, movieReviewIDValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Force page refresh on Submit
    xhttp.onload = function () {
        location.reload();
    };

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, movie_review_id) {
    let parsedData = JSON.parse(data);
    console.log(parsedData)

    let table = document.getElementById("Movie_Reviews");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == movie_review_id) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[1];
        }
    }
}