const form = document.querySelector("#form");
const registerAccountButton = document.querySelector("#registerAccountButton");
const newUserAlert = document.querySelector("#newUserAlert");
const inputEmail = document.querySelector("#inputEmail");
const emailAlert = document.querySelector("#emailAlert");
const inputPassword = document.querySelector("#inputPassword");
const passwordAlert = document.querySelector("#passwordAlert");
const prefix = document.querySelector("#prefix");
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

document.addEventListener("DOMContentLoaded", () => {
    registerAccountButton.addEventListener("click", e => sendFormData(e));
    inputEmail.addEventListener("input", e => checkEmail(e));
    inputPassword.addEventListener("input", e => checkPassword(e));
    prefix.addEventListener("input", e => checkPrefix(e));
    prefix.addEventListener("click", e => editPrefix(e));
});

const sendFormData = async (e) => {
    e.preventDefault();

    let userObject = {};

    const formData = new FormData(form);
    formData.forEach((value, key) => userObject[key] = value);

    try {
        const response = await fetch("/api/users/createUser", {
            method: "POST",
            body: JSON.stringify(userObject),
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        if (response.status === 201) {
            newUserAlert.innerHTML = "User created!";
            setTimeout(() => {
                location.replace("/home");
            }, 1000);
        } else {
            location.replace("/api/users/registerError")
        }
    } catch (error) {
        console.error(error);
    }
}

// TODO: Valida email
const checkEmail = (e) => {
    const inputData = e.target.value;

    if (emailRegex.test(inputData)) {
        registerAccountButton.disabled = false;
        registerAccountButton.classList.remove("bg-slate-500")
        registerAccountButton.classList.add("hover:bg-indigo-700", "bg-indigo-500");
        emailAlert.innerHTML = ""
    } else {
        emailAlert.innerHTML = `<span class="text-red-500 font-bold absolute">Email is not valid.</span>`
        registerAccountButton.disabled = true;
        registerAccountButton.classList.add("hover:bg-indigo-700", "bg-slate-500");
    }

    if (inputData.length <= 0) {
        registerAccountButton.disabled = true;
        emailAlert.innerHTML = `<span class="text-red-500 font-bold absolute">Email cannot be empty.</span>`
    }
}

// TODO: Valida password
const checkPassword = (e) => {
    const inputData = e.target.value;

    if (inputData.length <= 4) {
        registerAccountButton.disabled = true;
        passwordAlert.innerHTML = `<span class="text-red-500 font-bold absolute">Password must to be at least 4 chars.</span>`
    } else {
        registerAccountButton.disabled = false;
        passwordAlert.innerHTML = "";
    }

    if (inputData.length <= 0 || inputData === undefined) {
        registerAccountButton.disabled = true;
        registerAccountButton.classList.remove("hover:bg-indigo-700")
        registerAccountButton.classList.add("bg-slate-500", "cursor-not-allowed");
        passwordAlert.innerHTML = `<span class="text-red-500 font-bold absolute">Password cannot be empty.</span>`
    } else {
        registerAccountButton.disabled = false;
        registerAccountButton.classList.remove("bg-slate-500", "cursor-not-allowed")
        registerAccountButton.classList.add("hover:bg-indigo-700", "bg-indigo-500");
    }
}

// TODO: Valida que el prefijo no sea mayor a 4 caracteres
const checkPrefix = (e) => {
    const inputData = e.target.value;  

    if (inputData.length <= 2) {
        prefix.disabled = false;
    } else {
        prefix.disabled = true;
    }
    prefix.disabled = false;
}

// TODO: Editar prefijo
const editPrefix = (e) => {
    let inputData = e.target.value;

    if (e.type === "click" && inputData.length <= 2) {
        prefix.disabled = false;
    } else {
        prefix.disabled = true;
    }
}