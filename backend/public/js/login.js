const form = document.querySelector("#form");
const sendButton = document.querySelector("#sendButton");
const inputEmail = document.querySelector("#inputEmail");
const inputPassword = document.querySelector("#inputPassword");
const divAlert = document.querySelector("#alert");
const passwordAlert = document.querySelector("#passwordAlert");
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

document.addEventListener("DOMContentLoaded", () => {
  sendButton.disabled = true;

  sendButton.addEventListener("click", (e) => sendForm(e));
  inputEmail.addEventListener("input", (e) => checkEmail(e));

  inputPassword.addEventListener("input", (e) => checkPassword(e));
});

const sendForm = async (e) => {
  e.preventDefault();

  let userObject = {};

  const formData = new FormData(form);
  formData.forEach((value, key) => (userObject[key] = value));

  try {
    const response = await fetch("/api/users/loginUser", {
      method: "POST",
      body: JSON.stringify(userObject),
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (response.status === 300) {
        location.replace("/home");
    } else {
        location.replace("/api/users/loginError");
    }
  } catch (error) {
    console.error(error);
  }
};

const checkPassword = (e) => {
  const inputData = e.target.value;

  if (inputData.length <= 4) {
    passwordAlert.innerHTML = `<span class="text-red-500 font-bold">Password must to be at least 4 characters.</span>`;
    sendButton.disabled = true;
  } else {
    passwordAlert.innerHTML = "";
    sendButton.disabled = false;
  }
};

const checkEmail = (e) => {
  const inputData = e.target.value;

  if (emailRegex.test(inputData)) {
    sendButton.disabled = false;
    divAlert.innerHTML = "";
  } else {
    sendButton.disabled = true;
    divAlert.innerHTML = `<span class="text-red-500 font-bold">Email is not valid.</span>`;
  }
};
