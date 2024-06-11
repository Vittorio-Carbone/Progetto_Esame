"use strict"

$(document).ready(function(){
    
    let divLogin = $("#divLogin");
    // divLogin.hide();
    let divRegistrazione = $("#divRegistrazione");
    divRegistrazione.hide();
    let pRegistrati = $("#pRegistrati");
    let pAccedi = $("#giaAccount");
    let btnRegistrati = $("#btnRegistrati");
    let btnAccedi = $("#btnAccedi");
    let usernameLogin;
    let passwordLogin;
    let errore = $(".txtErrore");
    errore.hide();

    let username = $("#txtNome");

    pRegistrati.on("click", function(){
        divLogin.fadeOut(450);
        setTimeout(() => {
            divRegistrazione.fadeIn(450);
        }, 450);
    })

    pAccedi.on("click", function(){
        divRegistrazione.fadeOut(450);
        setTimeout(() => {
            divLogin.fadeIn(450);
        }, 450);
    })

    $("#spanEyeAccedi").on("click", function(){
        let eye= $("#eyeAccedi");
        if(eye.hasClass("fa-eye")){
            eye.removeClass("fa-eye");
            eye.addClass("fa-eye-slash");
            $("#txtPassword").attr("type", "text");
        }
        else{
            eye.removeClass("fa-eye-slash");
            eye.addClass("fa-eye");
            $("#txtPassword").attr("type", "password");
        }
    })
    $("#spanEyeReg").on("click", function(){
        let eye= $("#eyeReg");
        if(eye.hasClass("fa-eye")){
            eye.removeClass("fa-eye");
            eye.addClass("fa-eye-slash");
            $("#txtPasswordRegistrato").attr("type", "text");
        }
        else{
            eye.removeClass("fa-eye-slash");
            eye.addClass("fa-eye");
            $("#txtPasswordRegistrato").attr("type", "password");
        }
    })

    // btnAccedi.on("click", function(){
    //     usernameLogin = $("#txtUsername").val();
    //     passwordLogin = $("#txtPassword").val();

    //     if(usernameLogin == "" && passwordLogin == ""){
    //         errore.show();
    //         errore.text("Compila tutti i campi");
    //     }
    //     else if(usernameLogin == ""){
    //         errore.show();
    //         errore.text("Inserisci l'username");
    //     }
    //     else if(passwordLogin == ""){
    //         errore.show();
    //         errore.text("Inserisci la password");
    //     }
    //     else{
    //         console.log(usernameLogin + " " + passwordLogin);
    //     }

    //     setTimeout(() => {
    //         errore.hide();
    //     }, 5000);

        
    // })

    // btnRegistrati.on("click", function(){
    //     let nome = $("#txtNome").val();
    //     let cognome = $("#txtCognome").val();
    //     let passwordRegistrato = $("#txtPasswordRegistrato").val();
    //     let usernameRegistrato = $("#txtUsernameRegistrato").val();

    //     if(nome == "" || cognome == "" || passwordRegistrato == "" || usernameRegistrato == ""){
    //         errore.show();
    //         errore.text("Compila tutti i campi");
    //     }
    //     else{
    //         let nuovoUtente = {
    //             "nome": nome,
    //             "cognome": cognome,
    //             "username": usernameRegistrato,
    //             "password": passwordRegistrato
    //         }
    //         console.log(nuovoUtente);
    //     }

    //     setTimeout(() => {
    //         errore.hide();
    //     }, 5000);
    // })
})