// **DELETE**
function deleteGenre(genre_id) {
    // Put our data we want to send in a javascript object
    let data = {
        genre_id: genre_id
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-genre-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Delete data
            deleteRow(genre_id);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }

    // Force page refresh on Submit
    xhttp.onload = function () {
        location.reload();
    };

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

}


function deleteRow(genre_id) {

    let table = document.getElementById("Genres");
    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == genre_id) {
            table.deleteRow(i);
            break;
        }
    }
}