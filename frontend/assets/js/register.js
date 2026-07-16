const API_URL = "http://localhost:3000/api";

const registerForm = document.getElementById("registerForm");
const errorMessage = document.getElementById("errorMessage");

registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {

        const response = await fetch(`${API_URL}/auth/register`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                name,
                email,
                password,
            }),

        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        alert("Register berhasil, silakan login.");

        window.location.href = "login.html";

    } catch (err) {

        errorMessage.classList.remove("d-none");
        errorMessage.textContent = err.message;

    }

});