/// get the html form element where the user will type in to send the message
const chatForm = document.getElementById('chat-form');  
const chatMessages = document.querySelector('.chat-messages');

/// Get username and room from URL
// const { username, room } = qs.parse(location.search, {
//     ignoreQueryPrefix: true
// });
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

// Join room with username and room name
socket.emit('joinRoom', { username, room });

/// Message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // Always Scroll down to the latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

/// Message submit

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    /// Get the user message text.
    const msg = e.target.elements.msg.value;
    
    /// Emit the user message to the server
    socket.emit('chatMessage', msg);

    // Clear input message after the message has been sent
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

});

// Output message to DOM
function outputMessage(message) {
    const div = document.createElement ('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    chatMessages.appendChild(div);
}