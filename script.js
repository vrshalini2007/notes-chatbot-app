const chatIcon = document.getElementById("chatIcon");
const chatBox = document.getElementById("chatBox");
const closeBtn = document.getElementById("closeBtn");
const chatBody = document.getElementById("chatBody");

let step = -1;

let firstName = "";
let lastName = "";
let deliverables = "";

chatIcon.addEventListener("click", () => {

    chatBox.style.display = "block";

    if(chatBody.innerHTML === ""){
        addBotMessage("👋 Welcome to Notes Circle!");
    }

});

closeBtn.addEventListener("click", () => {
    chatBox.style.display = "none";
});

function addBotMessage(message){

    chatBody.innerHTML +=
    `<div class="bot-message">${message}</div>`;

    chatBody.scrollTop = chatBody.scrollHeight;
}

function addUserMessage(message){

    chatBody.innerHTML +=
    `<div class="user-message">${message}</div>`;

    chatBody.scrollTop = chatBody.scrollHeight;
}

function sendMessage(){

    const input = document.getElementById("userInput");

    let text = input.value.trim();

    if(text === ""){
        return;
    }

    addUserMessage(text);

    if(step === -1){

        addBotMessage(
            "Let's get you added to the Notes Circle.<br><br>Please enter your First Name:"
        );

        step = 0;
    }

    else if(step === 0){

        firstName = text;

        addBotMessage("Please enter your Last Name:");

        step = 1;
    }

    else if(step === 1){

        lastName = text;

        addBotMessage("Please enter your Deliverables:");

        step = 2;
    }

    else if(step === 2){

        deliverables = text;

        addBotMessage(
            `Thank you ${firstName}! Your details have been recorded successfully.`
        );

        step = 3;
    }

    input.value = "";
}