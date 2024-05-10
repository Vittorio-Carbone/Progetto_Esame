$(document).ready(function () {
    
    let divUtenti = $("#utenti");
    let divAddPaz = $("#formPaz").hide();
    let divUtente = $("#utente").hide();

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
        divUtenti.slideUp(1000);
        setTimeout(function () {
            divUtente.slideDown(600);
        }, 600);
    });
    
    
});
