// **UPDATE**

// Get the objects we need to modify
let updateDirectorForm = document.getElementById('update-director-form-ajax');

// Modify the objects we need
updateDirectorForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputDirectorID = document.getElementById("update_select");
    let inputFName = document.getElementById("input_director_fname_update");
    let inputLName = document.getElementById("input_director_lname_update");

    // Get the values from the form fields
    let directorIDValue = inputDirectorID.value;
    let fnameValue = inputFName.value;
    let lnameValue = inputLName.value;

    // Put our data we want to send in a javascript object
    let data = {
        director_id: directorIDValue,
        director_fname: fnameValue,
        director_lname: lnameValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-director-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, directorIDValue);

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


function updateRow(data, director_id) {
    let parsedData = JSON.parse(data);
    console.log(parsedData)

    let table = document.getElementById("Directors");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == director_id) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[1];
        }
    }
}