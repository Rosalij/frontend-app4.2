"use strict";
//get elements from the DOM
const menuEl = document.getElementById("menu")
const postListEl = document.getElementById("guestbook")
const loginformEl = document.getElementById("loginform")
const registerformEl = document.getElementById("registerform")
const postformEl = document.getElementById("postform")

//on load event
window.onload = init

function init() {
//run changeMenu to check if the user is logged in, if so show the menu with the logout button
    changeMenu()

//if the user is on the guestbook page, get the guestbook posts
    if (postListEl) {
        getGuestbook()
    }

//if the user is on the login page, add event listener to the login form
    if (loginformEl) {
        loginformEl.addEventListener("submit", loginUser)
    }

//if the user is on the new post page, add event listener to the post form
    if (postformEl) {
        postformEl.addEventListener("submit", newPost)
    }
//if the user is on the register page, add event listener to the register form
    if (registerformEl) {
        registerformEl.addEventListener("submit", registerUser)
    }
}


//function to get the guestbook posts from the server
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
            //load the guestbook posts into the guestbook element
            loadGuestbook(data)
        }
    }
    catch (error) {
        console.error("Error fetching guestbook:", error)
    }
}

//function to load the guestbook posts into the guestbook element
function loadGuestbook(posts) {
    //clear the guestbook element
    postListEl.innerHTML = "";
    //loop through the posts and create a new list item for each post
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


//function to change the menu depending on if the user is logged in or not
function changeMenu() {
    //if logged in, show logout button and new post button
    if (localStorage.getItem("JWT_token")) {
        menuEl.innerHTML = `<ul>
    <li><a href="index.html">Gästbok</a></li>
    <li><a href="newpost.html">Nytt inlägg</a></li>
    <li><a id="logout" href="#">Logga ut</a></li>
    <ul>`}
    else {
        //if not logged in, show login and register buttons
        menuEl.innerHTML = `
    <ul><li><a href="index.html">Gästbok</a></li>
    <li><a href="login.html">Logga in</a></li>
    <li><a href="register.html">Registrera dig</a></li><ul>
    `
    }

    //add event listener to the logout button
    const logoutEl = document.getElementById("logout")
    if (logoutEl) {
        logoutEl.addEventListener("click", function () {
                //remove the JWT token from local storage
            localStorage.removeItem("JWT_token");
            window.location.href = "index.html";

        })
    }
}

//function to login the user
//this function is called when the user submits the login form
async function loginUser(e) {
    e.preventDefault()
    let nameinput = document.getElementById("name").value;
    let passwordinput = document.getElementById("password").value;

    //check if the user has filled in all the fields
    if (!nameinput || !passwordinput) {
        alert("Vänligen fyll i alla fält")
        return;
    }

    //create a user object with the username and password
    let user = {
        username: nameinput,
        password: passwordinput
    }
    try {
        //send a POST request to the server with the user object
        const resp = await fetch("https://m4-jwlg.onrender.com/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",

            },
            body: JSON.stringify(user)
        })
        if (resp.ok) {
            const data = await resp.json()
           
    //set the JWT token in local storage
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

//function to create a new post
//this function is called when the user submits the new post form
async function newPost(e) {

    e.preventDefault()
    //get the text input from the form
    let textinput = document.getElementById("textinput").value;

    if (!textinput) {
        alert("Vänligen skriv ett inlägg")
        return;
    }
    //create a post object with the text input
    //the author is set to the username of the logged in user
    let post = {
        textinput: textinput
    }

    try {
        const resp = await fetch("https://m4-jwlg.onrender.com/api/newpost", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                //JWT token authorization of user
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

//function to register a new user
async function registerUser(e) {
    e.preventDefault()
    //get the username and password input from the form
    let nameinput = document.getElementById("name").value;
    let passwordinput = document.getElementById("password").value;

    //check if the user has filled in all the fields
    if (!nameinput || !passwordinput) {
        alert("Vänligen fyll i alla fält")
        return;
    }

    //user object with the username and password
    let user = {
        username: nameinput,
        password: passwordinput
    }
    try { 
         //send a POST request to the server with the user object
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

