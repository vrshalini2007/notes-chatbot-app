// ===============================
// STATE
// ===============================
let currentUserId = null;
let currentUserName = "";

// ===============================
// ON PAGE LOAD — check saved token
// ===============================
window.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("notes_token");
    if (!token) return;

    try {
        const res = await fetch("/check-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token })
        });
        const data = await res.json();

        if (data.status === "existing") {
            currentUserId = data.user.id;
            currentUserName = data.user.first_name;
            showNotesPanel(data.user.first_name);
            loadNotes();
        }
    } catch (e) {
        console.error("Token check failed", e);
    }
});

// ===============================
// SCREEN NAVIGATION
// ===============================
function showScreen(id) {
    const screens = [
        "screenAuth",
        "screenLogin",
        "screenSignup",
        "screenNotes"
    ];
    screens.forEach(s => {
        document.getElementById(s).style.display = "none";
    });
    document.getElementById(id).style.display = "flex";
}

function showAuth()   { showScreen("screenAuth"); }
function showLogin()  {
    document.getElementById("loginEmail").value = "";
    document.getElementById("loginError").textContent = "";
    showScreen("screenLogin");
}
function showSignup() {
    document.getElementById("signupFirst").value = "";
    document.getElementById("signupLast").value = "";
    document.getElementById("signupEmail").value = "";
    document.getElementById("signupError").textContent = "";
    showScreen("screenSignup");
}

function showNotesPanel(name) {
    document.getElementById("welcomeName").textContent = `Hi, ${name} 👋`;
    document.getElementById("navLogout").style.display = "inline";
    showScreen("screenNotes");
}

// ===============================
// CHATBOT
// ===============================

const chatIcon = document.getElementById("chatIcon");
const chatBox  = document.getElementById("chatBox");
const closeBtn = document.getElementById("closeBtn");
const chatBody = document.getElementById("chatBody");
const chatInput = document.getElementById("chatInput");
const sendBtn  = document.getElementById("sendBtn");

let chatStep = -1;
let chatFirstName = "";
let chatLastName  = "";
let chatEmail     = "";
let chatUserId    = null;

// Open chat
chatIcon.addEventListener("click", async () => {
    chatBox.style.display = "block";

    if (chatBody.innerHTML !== "") return;

    const token = localStorage.getItem("notes_token");

    if (token) {
        const res = await fetch("/check-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token })
        });
        const data = await res.json();

        if (data.status === "existing") {
            chatUserId = data.user.id;
            addBotMsg(`👋 Welcome back ${data.user.first_name}`);
            addBotMsg("Type your note and I'll save it.");
            chatStep = 3;
            return;
        }
    }

    addBotMsg("👋 Welcome to Notes Circle!");
    addBotMsg("Type <b>Register</b> or <b>Login</b>");
    chatStep = -1;
});

// Close chat
closeBtn.addEventListener("click", () => {
    chatBox.style.display = "none";
});

function addBotMsg(msg) {
    chatBody.innerHTML += `<div class="bot-message">${msg}</div>`;
    chatBody.scrollTop = chatBody.scrollHeight;
}

function addUserMsg(msg) {
    chatBody.innerHTML += `<div class="user-message">${msg}</div>`;
    chatBody.scrollTop = chatBody.scrollHeight;
}

async function sendChatMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    addUserMsg(text);
    chatInput.value = "";

    if (chatStep === -1) {
        if (text.toLowerCase() === "register") {
            addBotMsg("Enter your First Name");
            chatStep = 0;
        } else if (text.toLowerCase() === "login") {
            addBotMsg("Enter your Email");
            chatStep = 10;
        } else {
            addBotMsg("Please type <b>Register</b> or <b>Login</b>");
        }
    }
    else if (chatStep === 0) { chatFirstName = text; addBotMsg("Enter your Last Name");  chatStep = 1; }
    else if (chatStep === 1) { chatLastName  = text; addBotMsg("Enter your Email");       chatStep = 2; }
    else if (chatStep === 2) { chatEmail     = text; await chatRegister(); }
    else if (chatStep === 10){ chatEmail     = text; await chatLogin(); }
    else if (chatStep === 3) { await chatSaveNote(text); }
}

sendBtn.addEventListener("click", sendChatMessage);
chatInput.addEventListener("keypress", e => { if (e.key === "Enter") sendChatMessage(); });

async function chatRegister() {
    const res  = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name: chatFirstName, last_name: chatLastName, email: chatEmail })
    });
    const data = await res.json();
    chatUserId = data.user.id;
    localStorage.setItem("notes_token", data.token);
    addBotMsg(data.status === "existing"
        ? `Already registered. Welcome back ${data.user.first_name}!`
        : `Welcome ${data.user.first_name}! 🎉`
    );
    addBotMsg("You can now type a note to save it.");
    chatStep = 3;
}

async function chatLogin() {
    const res  = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: chatEmail })
    });
    const data = await res.json();
    if (data.status === "success") {
        chatUserId = data.user.id;
        localStorage.setItem("notes_token", data.user.token);
        addBotMsg(`Welcome back ${data.user.first_name}! 👋`);
        addBotMsg("You can now type a note to save it.");
        chatStep = 3;
    } else {
        addBotMsg("Email not found. Please type <b>Register</b> to create an account.");
        chatStep = -1;
    }
}

async function chatSaveNote(note) {
    await fetch("/save-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: chatUserId, note })
    });
    addBotMsg("✅ Note saved! Keep typing to add more.");
    // Refresh the side panel notes list if user is logged in there too
    if (currentUserId) loadNotes();
}

// ===============================
// LOGIN
// ===============================
async function doLogin() {
    const email = document.getElementById("loginEmail").value.trim();
    const errorEl = document.getElementById("loginError");
    errorEl.textContent = "";

    if (!email) {
        errorEl.textContent = "Please enter your email.";
        return;
    }

    try {
        const res = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });
        const data = await res.json();

        if (data.status === "success") {
            currentUserId = data.user.id;
            currentUserName = data.user.first_name;
            localStorage.setItem("notes_token", data.user.token);
            showNotesPanel(data.user.first_name);
            loadNotes();
        } else {
            errorEl.textContent = "Email not found. Please sign up first.";
        }
    } catch (e) {
        errorEl.textContent = "Something went wrong. Try again.";
    }
}

// ===============================
// SIGN UP
// ===============================
async function doSignup() {
    const firstName = document.getElementById("signupFirst").value.trim();
    const lastName  = document.getElementById("signupLast").value.trim();
    const email     = document.getElementById("signupEmail").value.trim();
    const errorEl   = document.getElementById("signupError");
    errorEl.textContent = "";

    if (!firstName || !lastName || !email) {
        errorEl.textContent = "Please fill in all fields.";
        return;
    }

    try {
        const res = await fetch("/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                email
            })
        });
        const data = await res.json();

        currentUserId = data.user.id;
        currentUserName = data.user.first_name;
        localStorage.setItem("notes_token", data.token);
        showNotesPanel(data.user.first_name);
        loadNotes();
    } catch (e) {
        errorEl.textContent = "Something went wrong. Try again.";
    }
}

// ===============================
// LOGOUT
// ===============================
function logoutUser() {
    localStorage.removeItem("notes_token");
    currentUserId = null;
    currentUserName = "";
    document.getElementById("navLogout").style.display = "none";
    document.getElementById("newNoteText").value = "";
    document.getElementById("notesList").innerHTML = "";
    showAuth();
}

// ===============================
// LOAD NOTES
// ===============================
async function loadNotes() {
    const listEl = document.getElementById("notesList");
    listEl.innerHTML = '<div class="notes-loading">Loading your notes...</div>';

    try {
        const res = await fetch("/get-notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: currentUserId })
        });
        const data = await res.json();
        renderNotes(data.notes);
    } catch (e) {
        listEl.innerHTML = '<div class="notes-empty">Failed to load notes.</div>';
    }
}

function renderNotes(notes) {
    const listEl   = document.getElementById("notesList");
    const countEl  = document.getElementById("notesCount");
    countEl.textContent = `${notes.length} note${notes.length !== 1 ? "s" : ""} saved`;

    if (notes.length === 0) {
        listEl.innerHTML = '<div class="notes-empty">No notes yet. Add your first one above!</div>';
        return;
    }

    listEl.innerHTML = notes.map(note => `
        <div class="note-item" id="note-${note.id}">
            <div class="note-item-text" id="text-${note.id}">${escapeHtml(note.note)}</div>
            <div class="note-item-edit-area" id="edit-${note.id}">
                <textarea id="editInput-${note.id}">${escapeHtml(note.note)}</textarea>
                <div style="display:flex;gap:8px;">
                    <button class="btn-save-edit" onclick="saveEdit('${note.id}')">Save</button>
                    <button class="btn-cancel-edit" onclick="cancelEdit('${note.id}')">Cancel</button>
                </div>
            </div>
            <div class="note-item-footer">
                <span class="note-item-date">${formatDate(note.created_at)}</span>
                <div class="note-item-actions">
                    <button class="btn-edit" onclick="startEdit('${note.id}')">Edit</button>
                    <button class="btn-delete" onclick="deleteNote('${note.id}')">Delete</button>
                </div>
            </div>
        </div>
    `).join("");
}

// ===============================
// ADD NOTE
// ===============================
async function addNote() {
    const textarea = document.getElementById("newNoteText");
    const noteText = textarea.value.trim();
    if (!noteText) return;

    try {
        const res = await fetch("/save-note", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: currentUserId, note: noteText })
        });
        await res.json();
        textarea.value = "";
        loadNotes();
    } catch (e) {
        alert("Failed to save note. Try again.");
    }
}

// ===============================
// EDIT NOTE
// ===============================
function startEdit(id) {
    document.getElementById(`text-${id}`).style.display = "none";
    document.getElementById(`edit-${id}`).style.display = "flex";
}

function cancelEdit(id) {
    document.getElementById(`text-${id}`).style.display = "block";
    document.getElementById(`edit-${id}`).style.display = "none";
}

async function saveEdit(id) {
    const newText = document.getElementById(`editInput-${id}`).value.trim();
    if (!newText) return;

    try {
        await fetch("/update-note", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, note: newText })
        });
        loadNotes();
    } catch (e) {
        alert("Failed to update note.");
    }
}

// ===============================
// DELETE NOTE
// ===============================
async function deleteNote(id) {
    if (!confirm("Delete this note?")) return;

    try {
        await fetch("/delete-note", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });
        loadNotes();
    } catch (e) {
        alert("Failed to delete note.");
    }
}

// ===============================
// HELPERS
// ===============================
function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatDate(isoString) {
    if (!isoString) return "";
    const d = new Date(isoString);
    return d.toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric"
    });
}