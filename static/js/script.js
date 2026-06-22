// ==========================
// CHATBOT CODE
// ==========================

const chatIcon =
document.getElementById("chatIcon");

const chatBox =
document.getElementById("chatBox");

const closeBtn =
document.getElementById("closeBtn");

const chatBody =
document.getElementById("chatBody");

let step = -1;

let firstName = "";
let lastName = "";
let deliverables = "";

if(chatIcon){

    chatIcon.addEventListener(
        "click",
        () => {

            chatBox.style.display =
            "block";

            if(chatBody.innerHTML === ""){

                addBotMessage(
                    "👋 Welcome to Notes Circle!"
                );

                addBotMessage(
                    "Click Send to start registration."
                );
            }
        }
    );
}

if(closeBtn){

    closeBtn.addEventListener(
        "click",
        () => {
            chatBox.style.display =
            "none";
        }
    );
}

function addBotMessage(message){

    if(!chatBody) return;

    chatBody.innerHTML +=
    `
    <div class="bot-message">
        ${message}
    </div>
    `;

    chatBody.scrollTop =
    chatBody.scrollHeight;
}

function addUserMessage(message){

    if(!chatBody) return;

    chatBody.innerHTML +=
    `
    <div class="user-message">
        ${message}
    </div>
    `;

    chatBody.scrollTop =
    chatBody.scrollHeight;
}

function sendMessage(){

    const input =
    document.getElementById(
        "userInput"
    );

    if(!input) return;

    let text =
    input.value.trim();

    if(text === ""){
        return;
    }

    addUserMessage(text);

    if(step === -1){

        addBotMessage(
            "Let's get you added to the Notes Circle."
        );

        addBotMessage(
            "Please enter your First Name:"
        );

        step = 0;
    }

    else if(step === 0){

        firstName = text;

        addBotMessage(
            "Please enter your Last Name:"
        );

        step = 1;
    }

    else if(step === 1){

        lastName = text;

        addBotMessage(
            "Please enter your Deliverables:"
        );

        step = 2;
    }

    else if(step === 2){

        deliverables = text;

        addBotMessage(
            `✅ Thank you ${firstName}!`
        );

        addBotMessage(
            `Your details have been recorded successfully.`
        );

        addBotMessage(
            `First Name : ${firstName}<br>
             Last Name : ${lastName}<br>
             Deliverables : ${deliverables}`
        );

        step = 3;
    }

    else{

        addBotMessage(
            "Registration already completed."
        );
    }

    input.value = "";
}

const userInput =
document.getElementById(
    "userInput"
);

if(userInput){

    userInput.addEventListener(
        "keypress",
        function(event){

            if(event.key === "Enter"){
                sendMessage();
            }
        }
    );
}

// ==========================
// CONTACT FORM CODE
// ==========================

const form =
document.getElementById(
    "contactForm"
);

if(form){

    const tbody =
    document.querySelector(
        "#dataTable tbody"
    );

    let editIndex = -1;

    window.addEventListener(
        "load",
        loadData
    );

    form.addEventListener(
        "submit",
        function(event){

            event.preventDefault();

            let firstName =
            document.getElementById(
                "firstName"
            ).value.trim();

            let lastName =
            document.getElementById(
                "lastName"
            ).value.trim();

            let gender =
            document.getElementById(
                "gender"
            ).value;

            let age =
            document.getElementById(
                "age"
            ).value.trim();

            let address =
            document.getElementById(
                "address"
            ).value.trim();

            let phone =
            document.getElementById(
                "phone"
            ).value.trim();

            let email =
            document.getElementById(
                "email"
            ).value.trim();

            let description =
            document.getElementById(
                "description"
            ).value.trim();

            if(firstName === ""){
                alert(
                    "First Name is required"
                );
                return;
            }

            if(lastName === ""){
                alert(
                    "Last Name is required"
                );
                return;
            }

            if(gender === ""){
                alert(
                    "Please select Gender"
                );
                return;
            }

            if(!/^\d{10}$/.test(phone)){
                alert(
                    "Phone number must contain exactly 10 digits"
                );
                return;
            }

            if(
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                .test(email)
            ){
                alert(
                    "Enter a valid Email Address"
                );
                return;
            }

            let users =
            JSON.parse(
                localStorage.getItem(
                    "users"
                )
            ) || [];

            if(editIndex === -1){

                let submittedTime =
                new Date()
                .toLocaleString();

                users.push({
                    firstName,
                    lastName,
                    gender,
                    age,
                    address,
                    phone,
                    email,
                    description,
                    submittedTime
                });

                alert(
                    "Record Added Successfully"
                );
            }
            else{

                users[editIndex]
                .firstName =
                firstName;

                users[editIndex]
                .lastName =
                lastName;

                users[editIndex]
                .gender =
                gender;

                users[editIndex]
                .age =
                age;

                users[editIndex]
                .address =
                address;

                users[editIndex]
                .phone =
                phone;

                users[editIndex]
                .email =
                email;

                users[editIndex]
                .description =
                description;

                editIndex = -1;

                alert(
                    "Record Updated Successfully"
                );
            }

            localStorage.setItem(
                "users",
                JSON.stringify(users)
            );

            form.reset();

            loadData();
        }
    );

    function loadData(){

        tbody.innerHTML = "";

        let users =
        JSON.parse(
            localStorage.getItem(
                "users"
            )
        ) || [];

        const table =
        document.getElementById(
            "dataTable"
        );

        const heading =
        document.getElementById(
            "tableHeading"
        );

        if(users.length === 0){

            table.style.display =
            "none";

            heading.style.display =
            "none";

            return;
        }

        table.style.display =
        "table";

        heading.style.display =
        "block";

        users.forEach(
            function(user,index){

                let row =
                tbody.insertRow();

                row.innerHTML = `
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.gender}</td>
                    <td>${user.age}</td>
                    <td>${user.address}</td>
                    <td>${user.phone}</td>
                    <td>${user.email}</td>
                    <td>${user.description}</td>
                    <td>${user.submittedTime}</td>

                    <td>
                        <button
                        class="edit-btn"
                        onclick="editUser(${index})">
                        Edit
                        </button>

                        <button
                        class="delete-btn"
                        onclick="deleteUser(${index})">
                        Delete
                        </button>
                    </td>
                `;
            }
        );
    }

    window.editUser =
    function(index){

        let users =
        JSON.parse(
            localStorage.getItem(
                "users"
            )
        ) || [];

        let user =
        users[index];

        document.getElementById(
            "firstName"
        ).value =
        user.firstName;

        document.getElementById(
            "lastName"
        ).value =
        user.lastName;

        document.getElementById(
            "gender"
        ).value =
        user.gender;

        document.getElementById(
            "age"
        ).value =
        user.age;

        document.getElementById(
            "address"
        ).value =
        user.address;

        document.getElementById(
            "phone"
        ).value =
        user.phone;

        document.getElementById(
            "email"
        ).value =
        user.email;

        document.getElementById(
            "description"
        ).value =
        user.description;

        editIndex = index;
    };

    window.deleteUser =
    function(index){

        let users =
        JSON.parse(
            localStorage.getItem(
                "users"
            )
        ) || [];

        users.splice(index,1);

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

        loadData();
    };
}