$(document).ready(function () {

    let divUtenti = $("#utenti");
    let divAddPaz = $("#formPaz").hide();
    let divUtente = $("#utente").hide();
    let divSchedaUtente = $("#schedaUtente").hide();
    let chartJS = false;
    let myChart
    let chartJS2 = false;
    let myChart2
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
            divUtente.slideDown(670);
        }, 600);
    });




    $("#iconUser").click(function () {
        divUtente.slideToggle(600);
        divSchedaUtente.slideToggle(600);
    });
    $("#btnScheda").click(function () {
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


    $(".mese").click(function () {

        setTimeout(() => {
            let jsonChar = JSON.parse($("#spanJson").text());
            let maxMed = Math.max(...jsonChar.fonMed);
            let maxIniz = Math.max(...jsonChar.fonIniz);
            let max = Math.max(maxMed, maxIniz);

            if (chartJS) {
                myChart.data.datasets[0].data = jsonChar.fonMed;
                myChart.data.datasets[1].data = jsonChar.fonIniz;
                myChart.options.scales.yAxes[0].ticks.max = max + 2;

                myChart.update();
            } else {
                chartJS = true;
                const data = {
                    labels: jsonChar.testo,
                    datasets: [{
                        label: "Fonemi in posizione mediana",
                        data: jsonChar.fonMed,
                        backgroundColor: 'rgba(255, 0, 0, 0.3)',
                        borderColor: "red",
                        borderWidth: 1
                    }, {
                        label: "Fonemi in posizione iniziale",
                        data: jsonChar.fonIniz,
                        backgroundColor: 'rgba(0, 0, 255, 0.3)',
                        borderColor: "blue",
                        borderWidth: 1
                    }]
                };



                const options = {
                    responsive: true,
                    scales: {
                        xAxes: [{
                            barThickness: 10
                        }],
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                max: max + 2
                            }
                        }]
                    }
                };

                myChart = new Chart(document.getElementById("myChart"), {
                    type: "bar",
                    data: data,
                    options: options
                });
            }

        }, 500);
    });
    $("#mese2").change(function () {
        setTimeout(() => {
            let jsonChar = JSON.parse($("#spanJsonMesi").text());
            let maxMed = Math.max(...jsonChar.fonMed);
            let maxIniz = Math.max(...jsonChar.fonIniz);
            let max = Math.max(maxMed, maxIniz);

            if (chartJS2) {

                myChart2.data.datasets[0].data = jsonChar.fonMed;
                myChart2.data.datasets[1].data = jsonChar.fonIniz;
                myChart2.options.scales.yAxes[0].ticks.max = max + 2;

                myChart2.update();
            } else {
                chartJS2 = true;
                const data = {
                    labels: jsonChar.testo,
                    datasets: [{
                        label: "Fonemi in posizione mediana",
                        data: jsonChar.fonMed,
                        backgroundColor: 'rgba(255, 0, 0, 0.3)',
                        borderColor: "red",
                        borderWidth: 1
                    }, {
                        label: "Fonemi in posizione iniziale",
                        data: jsonChar.fonIniz,
                        backgroundColor: 'rgba(0, 0, 255, 0.3)',
                        borderColor: "blue",
                        borderWidth: 1
                    }]
                };



                const options = {
                    responsive: true,
                    scales: {
                        xAxes: [{
                            barThickness: 10
                        }],
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                max: max + 2
                            }
                        }]
                    }
                };

                myChart2 = new Chart(document.getElementById("chart"), {
                    type: "bar",
                    data: data,
                    options: options
                });
            }

        }, 500);
    });
    $("#mese1").change(function () {
        if (chartJS2) {
            chartJS2 = false;
            myChart2.destroy();
        }
        document.getElementById("divFonMes").innerHTML = "";
    });

    $("#btnEsciScheda").click(function () {
        document.getElementById("containerForm").style.display = "none";
        if (chartJS2) {
            chartJS2 = false;
            myChart2.destroy();
        }
        document.getElementById("divFonMes").innerHTML = "";
        document.getElementById("mese1").selectedIndex = -1;
        document.getElementById('mese2').innerHTML = '';
        document.getElementById("divMese2").style.display = "none";
    });
});
