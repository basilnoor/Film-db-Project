// **UPDATE**

// Get the objects we need to modify
let updateReviewerForm = document.getElementById('update-reviewer-form-ajax');

// Modify the objects we need
updateReviewerForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputReviewerID = document.getElementById("update_select");
    let inputFName = document.getElementById("input_reviewer_fname_update");
    let inputLName = document.getElementById("input_reviewer_lname_update");
    let inputEmail = document.getElementById("input_reviewer_email_update");

    // Get the values from the form fields
    let reviewerIDValue = inputReviewerID.value;
    let fnameValue = inputFName.value;
    let lnameValue = inputLName.value;
    let emailValue = inputEmail.value;

    // Put our data we want to send in a javascript object
    let data = {
        reviewer_id: reviewerIDValue,
        reviewer_fname: fnameValue,
        reviewer_lname: lnameValue,
        reviewer_email: emailValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-reviewer-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, reviewerIDValue);

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


function updateRow(data, reviewer_id) {
    let parsedData = JSON.parse(data);
    console.log(parsedData)

    let table = document.getElementById("Reviewers");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == reviewer_id) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[1];
        }
    }
}