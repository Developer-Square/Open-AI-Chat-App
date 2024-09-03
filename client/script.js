import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

const loader = (element) => {
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '.';

    if (element.textContent === '....') {
      element.textContent = '';
    }
  }, 300);
};

const typeText = (element, text) => {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
};

const generateUniqueID = () => {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);
  return `id-${timestamp}-${hexadecimalString}`;
};

const chatStrpe = (isAi, value, uniqueID) => {
  return `
    <div class="wrapper ${isAi && 'ai'}">
      <div class="chat">
        <div class="profile">
          <img src="${isAi ? bot : user}" alt="profile">
        </div>
        <div class="message" id=${uniqueID}>${value}</div>
      </div>
    </div>
    `;
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  // user's chatstripe
  chatContainer.innerHTML += chatStrpe(false, data.get('prompt'));
  form.reset();

  // bot's chatstripe
  const uniqueID = generateUniqueID();
  chatContainer.innerHTML += chatStrpe(true, ' ', uniqueID);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueID);
  loader(messageDiv);

  // fetch data from server -> bot's response
  const url = 'https://open-ai-chat-app.onrender.com';
  // const url = 'https://chat.techive.co.ke/server';
  // const url = 'http://localhost:8000/';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt: data.get('prompt') }),
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();

    typeText(messageDiv, parsedData);
  } else {
    const err = await response.text();

    messageDiv.innerHTML = 'Something went wrong. Please try again.';
    alert(err);
  }
};

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    handleSubmit(e);
  }
});
