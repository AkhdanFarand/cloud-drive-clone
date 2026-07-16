const API_URL = "http://localhost:3000/api";

const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        const response = await fetch(`${API_URL}/auth/login`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                email,
                password,
            }),

        });

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message);

        }

        localStorage.setItem("token", data.token);

        alert("Login berhasil");

        window.location.href = "index.html";

    } catch (err) {

        errorMessage.classList.remove("d-none");

        errorMessage.textContent = err.message;

    }

});