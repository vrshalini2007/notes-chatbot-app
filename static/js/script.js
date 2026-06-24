console.log("script.js loaded");

const chatIcon = document.getElementById("chatIcon");
const chatBox = document.getElementById("chatBox");
const closeBtn = document.getElementById("closeBtn");
const chatBody = document.getElementById("chatBody");
const userInput = document.getElementById("userInput");

let step = -1;

let firstName = "";
let lastName = "";
let email = "";
let userId = null;


// OPEN CHAT
if (chatIcon) {
    chatIcon.addEventListener("click", () => {

        chatBox.style.display = "block";

        if (chatBody.innerHTML === "") {

            checkExistingUser();

            if (!localStorage.getItem("token")) {
                addBotMessage("👋 Welcome to Notes Circle!");
                addBotMessage("Type Hi to get started.");
            }
        }
    });
}


// CLOSE CHAT
if (closeBtn) {
    closeBtn.addEventListener("click", () => {
        chatBox.style.display = "none";
    });
}


// BOT MESSAGE
function addBotMessage(message) {

    chatBody.innerHTML += `
        <div class="bot-message">${message}</div>
    `;

    chatBody.scrollTop =
        chatBody.scrollHeight;
}


// USER MESSAGE
function addUserMessage(message) {

    chatBody.innerHTML += `
        <div class="user-message">${message}</div>
    `;

    chatBody.scrollTop =
        chatBody.scrollHeight;
}


// SEND MESSAGE
function sendMessage() {

    let text = userInput.value.trim();

    if (text === "") return;

    addUserMessage(text);

    if (step === -1) {

        addBotMessage(
            "Please enter your First Name:"
        );

        step = 0;
    }

    else if (step === 0) {

        firstName = text;

        addBotMessage(
            "Please enter your Last Name:"
        );

        step = 1;
    }

    else if (step === 1) {

        lastName = text;

        addBotMessage(
            "Please enter your Email:"
        );

        step = 2;
    }

    else if (step === 2) {

        email = text;

        registerUser();
    }

    else {

        saveNote(text);
    }

    userInput.value = "";
}


// ENTER KEY
if (userInput) {
    userInput.addEventListener(
        "keypress",
        function (event) {

            if (event.key === "Enter") {
                sendMessage();
            }
        }
    );
}


// REGISTER USER
async function registerUser() {

    const response =
        await fetch("/register", {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                email: email
            })
        });

    const data =
        await response.json();

    localStorage.setItem(
        "token",
        data.token
    );

    userId =
        data.user.id;

    addBotMessage(
        `✅ Welcome ${firstName}`
    );

    addBotMessage(
        `${firstName}, let's get started with the chat.`
    );

    step = 3;
}


// CHECK EXISTING USER
async function checkExistingUser() {

    const token =
        localStorage.getItem(
            "token"
        );

    if (!token) {
        return;
    }

    const response =
        await fetch("/check-user", {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({
                token: token
            })
        });

    const data =
        await response.json();

    if (
        data.status ===
        "existing"
    ) {

        userId =
            data.user.id;

        firstName =
            data.user.first_name;

        step = 3;

        addBotMessage(
            `👋 Welcome back ${firstName}`
        );

        addBotMessage(
            `${firstName}, let's get started with the chat.`
        );
    }

    else {

        localStorage.removeItem(
            "token"
        );
    }
}


// SAVE NOTE
async function saveNote(note) {

    if (!userId) {
        addBotMessage(
            "Please register first."
        );
        return;
    }

    await fetch("/save-note", {
        method: "POST",

        headers: {
            "Content-Type":
                "application/json"
        },

        body: JSON.stringify({
            user_id: userId,
            message: note
        })
    });

    addBotMessage(
        "✅ Note Saved Successfully."
    );
}