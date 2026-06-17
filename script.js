const chatIcon = document.getElementById("chatIcon");
const chatBox = document.getElementById("chatBox");
const chatBody = document.getElementById("chatBody");

let step = -1;

let firstName = "";
let lastName = "";
let deliverables = "";

chatIcon.addEventListener("click", () => {

    chatBox.style.display = "block";

    if (chatBody.innerHTML === "") {
        addBotMessage("Welcome to Notes Storage Platform!");
    }
});

function addBotMessage(message){
    chatBody.innerHTML += `<p><b>Bot:</b> ${message}</p>`;
    chatBody.scrollTop = chatBody.scrollHeight;
}

function addUserMessage(message){
    chatBody.innerHTML += `<p><b>You:</b> ${message}</p>`;
    chatBody.scrollTop = chatBody.scrollHeight;
}

function sendMessage(){

    let input = document.getElementById("userInput");
    let text = input.value.trim();

    if(text === ""){
        return;
    }

    addUserMessage(text);

    if(step === -1){

        addBotMessage("Please enter your First Name:");
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
            "Thank you! Your details have been recorded successfully."
        );

        step = 3;
    }

    input.value = "";
}