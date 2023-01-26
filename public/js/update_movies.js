// **UPDATE**

// Get the objects we need to modify
let updateMovieForm = document.getElementById('update-movie-form-ajax');

// Modify the objects we need
updateMovieForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputMovieid = document.getElementById("update_select");
    let inputName = document.getElementById("input_name_update");
    let inputDate = document.getElementById("input_date_released_update");
    let inputGenre = document.getElementById("input_genre_id_update");
    let inputBoxOffice = document.getElementById("input_box_office_update");

    // Get the values from the form fields
    let MovieidValue = inputMovieid.value;
    let nameValue = inputName.value;
    let dateValue = inputDate.value;
    let genreValue = inputGenre.value;
    let boxValue = inputBoxOffice.value;

    // Put our data we want to send in a javascript object
    let data = {
        movie_id: MovieidValue,
        name: nameValue,
        date_released: dateValue,
        genre_id: genreValue,
        box_office: boxValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-movie-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, MovieidValue);

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


function updateRow(data, movie_id) {
    let parsedData = JSON.parse(data);
    console.log(parsedData)

    let table = document.getElementById("Movies");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == movie_id) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[1];

        }
    }
}