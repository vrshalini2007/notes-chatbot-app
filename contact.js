const form = document.getElementById("contactForm");
const tbody = document.querySelector("#dataTable tbody");

let editRow = null;

form.addEventListener("submit", function(event){

    event.preventDefault();

    let firstName =
    document.getElementById("firstName").value.trim();

    let lastName =
    document.getElementById("lastName").value.trim();

    let gender =
    document.getElementById("gender").value;

    let age =
    document.getElementById("age").value.trim();

    let address =
    document.getElementById("address").value.trim();

    let phone =
    document.getElementById("phone").value.trim();

    let email =
    document.getElementById("email").value.trim();

    let description =
    document.getElementById("description").value.trim();

    /* Validation */

    if(firstName === ""){

        alert("First Name is required");
        return;
    }

    if(lastName === ""){

        alert("Last Name is required");
        return;
    }

    if(gender === ""){

        alert("Please select Gender");
        return;
    }

    if(age === ""){

        alert("Age is required");
        return;
    }

    if(age.length > 3){

        alert("Age must be maximum 3 digits");
        return;
    }

    if(address === ""){

        alert("Address is required");
        return;
    }

    if(!/^\d{10}$/.test(phone)){

        alert("Phone number must contain exactly 10 digits");
        return;
    }

    if(
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email)
    ){

        alert("Enter a valid Email Address");
        return;
    }

    /* Edit Existing Row */

    if(editRow){

        editRow.cells[0].innerText = firstName;
        editRow.cells[1].innerText = lastName;
        editRow.cells[2].innerText = gender;
        editRow.cells[3].innerText = age;
        editRow.cells[4].innerText = address;
        editRow.cells[5].innerText = phone;
        editRow.cells[6].innerText = email;
        editRow.cells[7].innerText = description;

        editRow = null;

        alert("Record Updated Successfully");
    }

    /* Add New Row */

    else{

        let row = tbody.insertRow();

        row.innerHTML = `
            <td>${firstName}</td>
            <td>${lastName}</td>
            <td>${gender}</td>
            <td>${age}</td>
            <td>${address}</td>
            <td>${phone}</td>
            <td>${email}</td>
            <td>${description}</td>

            <td>
                <button class="edit-btn">
                    Edit
                </button>
            </td>
        `;

        const editButton =
        row.querySelector(".edit-btn");

        editButton.addEventListener(
            "click",
            function(){

                editRow = row;

                document.getElementById(
                    "firstName"
                ).value =
                row.cells[0].innerText;

                document.getElementById(
                    "lastName"
                ).value =
                row.cells[1].innerText;

                document.getElementById(
                    "gender"
                ).value =
                row.cells[2].innerText;

                document.getElementById(
                    "age"
                ).value =
                row.cells[3].innerText;

                document.getElementById(
                    "address"
                ).value =
                row.cells[4].innerText;

                document.getElementById(
                    "phone"
                ).value =
                row.cells[5].innerText;

                document.getElementById(
                    "email"
                ).value =
                row.cells[6].innerText;

                document.getElementById(
                    "description"
                ).value =
                row.cells[7].innerText;

                window.scrollTo({
                    top:0,
                    behavior:"smooth"
                });

            }
        );

        alert("Record Added Successfully");
    }

    form.reset();

});