"use strict";

document.addEventListener("DOMContentLoaded", () => {

    let btnVerify = document.getElementsByClassName("verifyCaptcha");
    btnVerify[0].addEventListener("click", verificar);
    let areaCaptcha = document.getElementsByClassName("captcha");
    let inpCaptcha = document.querySelector(".inputCaptcha");
    let captcha = {
        "valido" : 0,
    };


    function setearCaptcha(){
        let RandomNumber = Math.floor(Math.random()*10000) + 1; //obtenemos un número del 1 al 10000
        areaCaptcha[0].innerHTML = RandomNumber;
    }

    function verificar(){
        let userNumber = parseInt(inpCaptcha.value);
        let correctNumber = parseInt(areaCaptcha[0].innerHTML);
        let answerFinal = document.querySelector(".answerVerifyCaptcha");
        if (userNumber == correctNumber) {
            answerFinal.innerHTML = "el captcha ingresado es correcto, puede proseguir con la compra";
            captcha.valido = 1;
        }
        else {
            answerFinal.innerHTML = "el captcha ingresado es invalido";
            setearCaptcha();
            console.log(answerFinal)
            }
    }
    
    // seteamos el captcha al iniciar la página y esperamos el momento de verificación
    setearCaptcha();
    
    //al darle a comprar salta que la compra fue exitosa y a los 3 segundos es redirigida a home.html
    
    function redirigirHome(){
        window.location.href = "../index.html"
    }

    let btnBuy = document.querySelector(".sendForm");
    
    btnBuy.addEventListener("click", () => {
        event.preventDefault();
        let answerFinal = document.querySelector(".answerVerifyCaptcha");
        if (captcha.valido == 1)  {
            answerFinal.innerHTML = "Gracias por adquirir el servicio de Cloud Hosting, en 5 segundos será redirigido al home";
            setTimeout(redirigirHome, 5000)
        }
        else{
            answerFinal.innerHTML = "Debe verificar el captcha";

        }
    })

})