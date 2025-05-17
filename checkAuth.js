"use strict";

//* Check if the user is logged in by checking for a JWT token in local storage */
if(!localStorage.getItem("JWT_token")){
    window.location.href = "login.html";
}   