"use strict";
const btnMenu = document.querySelector(".bars");
const containerOptions = document.querySelector(".options");

btnMenu.addEventListener("click", () => {
    containerOptions.classList.toggle("options_visible")
})