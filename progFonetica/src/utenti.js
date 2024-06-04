$(document).ready(function () {
    
    let divUtenti = $("#utenti");
    let divAddPaz = $("#formPaz").hide();
    let divUtente = $("#utente").hide();
    let divSchedaUtente = $("#schedaUtente").hide();

    $(".noInfo").hide();
    
    $(".inputPaz").on("keyup", function () {
        if ($(this).val() !== "") {
            $(this).removeClass("gray").addClass("black");
        }
        else {
            $(this).removeClass("black").addClass("gray");
        }
    });

    $("#btnAggiungiPaz").click(function () {
        divUtenti.fadeOut(600);
        setTimeout(function () {
            $(".inputPaz").val("");
            divAddPaz.fadeIn(600);
        }, 600);
    });

    $("#closePaz").click(function () {
        divAddPaz.fadeOut(600);
        setTimeout(function () {
            divUtenti.fadeIn(600);
        }, 600);
    });
    $("#xDivUtente").click(function () {
        divUtente.slideUp(1000);
        divUtenti.slideDown(1000);
    });


    $(document).on("click", ".paziente", function () {
        $("#tracciaAudio").hide()
        divUtenti.slideUp(1000);
        setTimeout(function () {
            divUtente.slideDown(600);
        }, 600);
    });


    $("#iconUser").click(function () {
        divUtente.slideToggle(600);
        divSchedaUtente.slideToggle(600);
    });

    $("#btnEsciScheda").click(function () {
        divUtente.slideToggle(600);
        divSchedaUtente.slideToggle(600);
    });

    $("#eliminaPaziente").click(function () {
        $("#popUpDel").fadeIn(600);
    });

    $("#annullaOptDel").click(function () {
        $("#popUpDel").fadeOut(600);
    });

    $("#confermaOptDel").click(function () {
        $("#popUpDel").fadeOut(600);
        divSchedaUtente.slideToggle(600);
        divUtenti.slideToggle(600);
    });
    
    
});
