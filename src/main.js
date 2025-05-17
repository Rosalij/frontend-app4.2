"use strict";

const menuEl = document.getElementById("menu")
const postListEl = document.getElementById("guestbook")
const loginformEl = document.getElementById("loginform")
const registerformEl = document.getElementById("registerform")
const postformEl = document.getElementById("postform")
window.onload = init

function init() {
    changeMenu()
    if (postListEl) {
        getGuestbook()
    }

    if (loginformEl) {
        loginformEl.addEventListener("submit", loginUser)
    }

    if (postformEl) {
        postformEl.addEventListener("submit", newPost)
    }

    if (registerformEl) {
        registerformEl.addEventListener("submit", registerUser)
    }
}

async function getGuestbook() {
    try {
        const response = await fetch("https://m4-jwlg.onrender.com/api", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        if (response.ok) {
            const data = await response.json()
            loadGuestbook(data)
        }
    }
    catch (error) {
        console.error("Error fetching guestbook:", error)
    }
}

function loadGuestbook(posts) {
    postListEl.innerHTML = ""
    posts.forEach(post => {
        const postEl = document.createElement("li")
        postEl.className = "post_li"
        postEl.innerHTML = `
         <p id="from">från ${post.author}, ${new Date(post.created).toLocaleDateString("sv-SE")}</p>
            <p id=textinput>${post.textinput}</p>
        `
        postListEl.appendChild(postEl)
    })
};

function changeMenu() {

    if (localStorage.getItem("JWT_token")) {
        menuEl.innerHTML = `<ul>
    <li><a href="index.html">Gästbok</a></li>
    <li><a href="newpost.html">Nytt inlägg</a></li>
    <li><a id="logout" href="#">Logga ut</a></li>
    <ul>`}
    else {
        menuEl.innerHTML = `
    <ul><li><a href="index.html">Gästbok</a></li>
    <li><a href="login.html">Logga in</a></li>
    <li><a href="register.html">Registrera dig</a></li><ul>
    `
    }

    const logoutEl = document.getElementById("logout")
    if (logoutEl) {
        logoutEl.addEventListener("click", function () {
            localStorage.removeItem("JWT_token");
            window.location.href = "index.html";

        })
    }
}

async function loginUser(e) {
    e.preventDefault()
    let nameinput = document.getElementById("name").value;
    let passwordinput = document.getElementById("password").value;

    if (!nameinput || !passwordinput) {
        alert("Vänligen fyll i alla fält")
        return;
    }

    let user = {
        username: nameinput,
        password: passwordinput
    }
    try {
        const resp = await fetch("https://m4-jwlg.onrender.com/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",

            },
            body: JSON.stringify(user)
        })
        if (resp.ok) {
            const data = await resp.json()
           
    localStorage.setItem("JWT_token", data.token)
            window.location.href = "newpost.html";

        } else {
            alert("Felaktigt användarnamn eller lösenord")
        }
    } catch (error) {
        console.error("Error logging in:", error)
        alert("Ett fel inträffade vid inloggning. Försök igen.")
    }
}


async function newPost(e) {
    e.preventDefault()
    let textinput = document.getElementById("textinput").value;

    if (!textinput) {
        alert("Vänligen skriv ett inlägg")
        return;
    }

    let post = {
        textinput: textinput
    }

    try {
        const resp = await fetch("https://m4-jwlg.onrender.com/api/newpost", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${localStorage.getItem("JWT_token")}`
            },
            body: JSON.stringify(post)
        })
        if (resp.ok) {
            const data = await resp.json()
            console.log(data)
            alert("Inlägget har skapats")
            window.location.href = "index.html";

        } else {
           throw error
        }
    } catch (error) {
        console.log("Ett fel inträffade")
    }
}

async function registerUser(e) {
    e.preventDefault()
    let nameinput = document.getElementById("name").value;
    let passwordinput = document.getElementById("password").value;

    if (!nameinput || !passwordinput) {
        alert("Vänligen fyll i alla fält")
        return;
    }

    let user = {
        username: nameinput,
        password: passwordinput
    }
    try {
        const resp = await fetch("https://m4-jwlg.onrender.com/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user)
        })
        if (resp.ok) {
            const data = await resp.json();
            console.log(data)
            alert("Användaren har skapats, du kan nu logga in för att skriva ett inlägg")
           window.location.href = "login.html";
        
        } else {
            alert("Användaren finns redan")
        }
    } catch (error) {
        console.error("Error creating user:", error)
    }

   }

