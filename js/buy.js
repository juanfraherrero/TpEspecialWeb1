"use strict";

document.addEventListener("DOMContentLoaded", () => {
    let btnVerify = document.querySelector(".verifyCaptcha");
    btnVerify.addEventListener("click", verificar);
    let btnBuy = document.querySelector("#btnBuy");
    let areaCaptcha = document.getElementsByClassName("captcha");
    let inpCaptcha = document.querySelector(".inputCaptcha");
    let captcha = {
        "valido" : 0,
    };
    //we set a random number between 1 and 10000 to create a captcha
    function setearCaptcha(){
        let RandomNumber = Math.floor(Math.random()*10000) + 1;
        areaCaptcha[0].innerHTML = RandomNumber;
    }
    //verify the captcha with the user answer, if not valid create a new captcha
    function verificar(){
        let userNumber = parseInt(inpCaptcha.value);
        let correctNumber = parseInt(areaCaptcha[0].innerHTML);
        let answerFinal = document.querySelector(".answerVerifyCaptcha");
        if (userNumber == correctNumber) {
            answerFinal.innerHTML = "the captcha is valid, you can keep buying";
            captcha.valido = 1;
        }
        else {
            answerFinal.innerHTML = "the captcha is invalid";
            setearCaptcha();
            }
    }
    
    //set the captcha when the page start
    setearCaptcha();
    
    btnBuy.addEventListener("click", (event) => {
        event.preventDefault();
        let answerFinal = document.querySelector(".answerVerifyCaptcha");
        if (captcha.valido == 1)  {
            answerFinal.innerHTML = "Thanks for get the Cloud Hosting service";
        }
        else{
            answerFinal.innerHTML = "please verify the captcha";
        }
    })

    console.log(window.location)

})