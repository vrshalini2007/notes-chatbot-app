const chatIcon = document.getElementById("chatIcon");
const chatBox = document.getElementById("chatBox");
const closeBtn = document.getElementById("closeBtn");
const chatBody = document.getElementById("chatBody");

let step = -1;

let firstName = "";
let lastName = "";
let deliverables = "";

/* Open Chat */

chatIcon.addEventListener("click", () => {

    chatBox.style.display = "block";

    if(chatBody.innerHTML === ""){

        addBotMessage(
            "👋 Welcome to Notes Circle!"
        );

        addBotMessage(
            "Click Send to start registration."
        );
    }

});

/* Close Chat */

closeBtn.addEventListener("click", () => {

    chatBox.style.display = "none";

});

/* Bot Message */

function addBotMessage(message){

    chatBody.innerHTML +=
    `
    <div class="bot-message">
        ${message}
    </div>
    `;

    chatBody.scrollTop =
    chatBody.scrollHeight;
}

/* User Message */

function addUserMessage(message){

    chatBody.innerHTML +=
    `
    <div class="user-message">
        ${message}
    </div>
    `;

    chatBody.scrollTop =
    chatBody.scrollHeight;
}

/* Send Message */

function sendMessage(){

    const input =
    document.getElementById("userInput");

    let text =
    input.value.trim();

    if(text === ""){
        return;
    }

    addUserMessage(text);

    /* Step 1 */

    if(step === -1){

        addBotMessage(
            "Let's get you added to the Notes Circle."
        );

        addBotMessage(
            "Please enter your First Name:"
        );

        step = 0;
    }

    /* Step 2 */

    else if(step === 0){

        firstName = text;

        addBotMessage(
            "Please enter your Last Name:"
        );

        step = 1;
    }

    /* Step 3 */

    else if(step === 1){

        lastName = text;

        addBotMessage(
            "Please enter your Deliverables:"
        );

        step = 2;
    }

    /* Step 4 */

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

    /* Restart */

    else if(step === 3){

        addBotMessage(
            "Registration already completed."
        );

        addBotMessage(
            "Refresh the page if you want to register again."
        );
    }

    input.value = "";

}

/* Enter Key Support */

document
.getElementById("userInput")
.addEventListener("keypress", function(event){

    if(event.key === "Enter"){

        sendMessage();
    }

});