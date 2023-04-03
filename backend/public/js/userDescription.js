const userContainer = document.querySelector("#userContainer");
const logoutButton = document.querySelector("#logoutButton");

document.addEventListener("DOMContentLoaded", () => {
    getUserDetails();
    logoutButton.addEventListener("click", e => logoutUser(e));
});

const getUserDetails = async () => {
    try {
        const response = await fetch("/api/users/userDescription");
        const userData = await response.json();

        const { username, email, address, age, phone, avatar } = userData;

        userContainer.innerHTML = `
            <div class="flex justify-center">
                <img src=${avatar} alt=${avatar.replace(/\s+/g, '')} class="rounded-full w-[200px] text-white">
            </div>
            <div class="mt-8">
                <p class="text-center text-indigo-500 font-bold mt-5 text-2xl">${username}</p>
                <p class="font-bold text-white">Your email: <span class="text-indigo-500">${email}</span></p>
                <p class="font-bold text-white">Your address: <span class="text-indigo-500">${address}.</span></p>
                <p class="font-bold text-white">Your age: <span class="text-indigo-500">${age}</span></p>
                <p class="font-bold text-white">Your phone number: <span class="text-indigo-500">+${phone}</span></p>
            </div>
        `
    } catch (error) {
        console.error(error);
    }
}

const logoutUser = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch("/api/users/logout");
        
        if (response.status === 200) {
            location.replace("/api/users/login");
        }
    } catch (error) {
        console.error(error);
    }
}