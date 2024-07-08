


$(document).ready(function () {
    let mesiScritti = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
    let colori = "";
    let divUtenti = $("#utenti");
    let divAddPaz = $("#formPaz").hide();
    let divUtente = $("#utente").hide();
    let divSchedaUtente = $("#schedaUtente").hide();
    let chartJS = false;
    let myChart
    let chartJS2 = false;
    let myChart2
    let chartJS3 = false;
    let myChart3

    let chartJS4 = false;
    let myChart4
    let chartJS5 = false;
    let myChart5
    let chartJS6 = false;
    let myChart6
    let chartJS7 = false;
    let myChart7
    

    let occhioAperto = document.getElementById("occhioAperto");
    let occhioChiuso = document.getElementById("occhioChiuso");
    occhioChiuso.style.display = "none";

    occhioAperto.addEventListener("click", function () {
        occhioAperto.style.display = "none";
        occhioChiuso.style.display = "contents";
        for(let paziente of document.getElementsByClassName("nomePaz")){
            paziente.style.display = "none";
        }
        for(let paziente of document.getElementsByClassName("nomePazN")){
            paziente.style.display = "block";
        }
    });

    occhioChiuso.addEventListener("click", function () {
        occhioAperto.style.display = "contents";
        occhioChiuso.style.display = "none";
        for(let paziente of document.getElementsByClassName("nomePaz")){
            paziente.style.display = "block";
        }
        for(let paziente of document.getElementsByClassName("nomePazN")){
            paziente.style.display = "none";
        }
    });

    let occhioAperto2 = document.getElementById("occhioAperto2");
    let occhioChiuso2 = document.getElementById("occhioChiuso2");
    $("#schedaNomeN").hide();
    occhioChiuso2.style.display = "none";

    occhioAperto2.addEventListener("click", function () {
        occhioAperto2.style.display = "none";
        occhioChiuso2.style.display = "contents";
        $("#schedaNome").hide();
        $("#schedaNomeN").show();
    });

    occhioChiuso2.addEventListener("click", function () {
        occhioAperto2.style.display = "contents";
        occhioChiuso2.style.display = "none";
        $("#schedaNome").show();
        $("#schedaNomeN").hide();
    });

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
            // m 4
            // n 7
            // s 14
            // z 15
            // r 13
            // l 12
            let nConsonanti = calcolaNCons();
            jsonChar.fonMed[4] = jsonChar.fonMed[4] - nConsonanti.nConsMed[0];
            jsonChar.fonMed[7] = jsonChar.fonMed[7] - nConsonanti.nConsMed[1];
            jsonChar.fonMed[14] = jsonChar.fonMed[14] - nConsonanti.nConsMed[2];
            jsonChar.fonMed[15] = jsonChar.fonMed[15] - nConsonanti.nConsMed[3];
            jsonChar.fonMed[13] = jsonChar.fonMed[13] - nConsonanti.nConsMed[4];
            jsonChar.fonMed[12] = jsonChar.fonMed[12] - nConsonanti.nConsMed[5];
            jsonChar.fonIniz[14] = jsonChar.fonIniz[14] - nConsonanti.nConsIni[2];

            let max = Math.max(maxMed, maxIniz);
            jsonChar.testo = jsonChar.testo.map(elemento => {
                return elemento.replace("r", "r o R");
            });
            if (chartJS) {
                myChart.data.datasets[1].data = jsonChar.fonMed;
                myChart.data.datasets[0].data = jsonChar.fonIniz;
                myChart.options.scales.yAxes[0].ticks.max = max + 2;

                myChart.update();
            } else {
                chartJS = true;
                const data = {
                    labels: jsonChar.testo,
                    datasets: [{
                        label: "Fonemi in posizione iniziale",
                        data: jsonChar.fonIniz,
                        backgroundColor: 'rgba(0, 0, 255, 0.3)',
                        borderColor: "blue",
                        borderWidth: 1
                    }, {
                        label: "Fonemi in posizione mediana",
                        data: jsonChar.fonMed,
                        backgroundColor: 'rgba(255, 0, 0, 0.3)',
                        borderColor: "red",
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
                        }],
                        y: [{
                            ticks: {
                                callback: function (value) {
                                    if (Number.isInteger(value)) {
                                        return value;
                                    }
                                },
                                stepSize: 1
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


            let nConsMedIni = calcolaNCons();
            //sommo i valori dei due vettori paralleli
            let nCons = nConsMedIni.nConsIni.map((elemento, indice) => {
                return elemento + nConsMedIni.nConsMed[indice];
            });



            let maxCons = Math.max(...nCons);
            if (chartJS4) {
                myChart4.data.datasets[0].data = nCons;
                myChart4.options.scales.yAxes[0].ticks.max = maxCons + 2;

                myChart4.update();
            } else {
                chartJS4 = true;
                const data = {
                    labels: ["/m/", "/n/", "/s/", "/z/", "/r/ o /R/", "/l/"],
                    datasets: [{
                        label: "Gruppi consonantici presenti",
                        data: nCons,
                        backgroundColor: 'rgba(255, 0, 255, 0.3)',
                        borderColor: "rgba(255, 0, 255)",
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
                                max: maxCons + 2
                            }
                        }],
                        y: [{
                            ticks: {
                                callback: function (value) {
                                    if (Number.isInteger(value)) {
                                        return value;
                                    }
                                },
                                stepSize: 1
                            }
                        }]
                    }
                };

                myChart4 = new Chart(document.getElementById("chartGruppi1"), {
                    type: "bar",
                    data: data,
                    options: options
                });
            }


            function contaLettere(frase, gruppo) {
                let count = 0;
                const consonanti = "bcdfghjklmnpqrstvwxyz";
                const vocali = "aeiou";
                if (gruppo !== "r") {
                    for (let i = 0; i < frase.length - 1; i++) {
                        if (gruppo === frase[i] && consonanti.includes(frase[i + 1])) {
                            count++;
                        }
                    }
                } else {
                    if (frase.startsWith("r") && consonanti.includes(frase[1])) {
                        count++;
                    }
                    for (let i = 1; i < frase.length - 1; i++) {
                        if ((frase[i] === gruppo && consonanti.includes(frase[i + 1])) || (frase[i] === gruppo && consonanti.includes(frase[i - 1]))) {
                            count++;
                        }
                    }
                }
                return count;
            }




        }, 500);
    });
    $("#mese2").change(function () {
        let mesiS = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
        let maxAssoluto = 0;
        setTimeout(() => {
            console.log("MESE")
            let jsonChar = JSON.parse($("#spanJsonMesi").text());
            console.log(jsonChar);
            // let maxMed = Math.max(...jsonChar.fonMed);
            // let maxIniz = Math.max(...jsonChar.fonIniz);
            // let max = Math.max(maxMed, maxIniz);

            let mesi = document.getElementById("divFonMes").innerHTML.split(" - ");
            let n1 = numMese(mesi[0]);
            let n2 = numMese(mesi[1]);
            let n = n2 - n1 + 1;
            barLarge = 10;
            if (n === 2) {
                barLarge = 13;
            }
            if (n === 3) {
                barLarge = 10;
            }
            if (n === 4) {
                barLarge = 8;
            }
            if (n === 5) {
                barLarge = 6;
            }
            if (n === 6) {
                barLarge = 5;
            }
            if (n === 7) {
                barLarge = 4;
            }
            if (n >= 8) {
                barLarge = 3;
            }

            let dataset1 = [];
            let dataset2 = [];
            let letters = ["j", "w", "p", "b", "m", "t", "d", "n", "k", "g", "f", "v", "l", "r", "s", "z", "ʃ", "dʒ", "ts", "dz", "ɲ", "ʎ", "tʃ", "ʒ"]
            let posizioniIniziali = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            let posizioniMedie = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            let tras;
            for (let i = n1; i <= n2; i++) {
                let posIn = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                let posMed = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                for (let frasi of jsonChar) {
                    let nMese = frasi.data.split("/");
                    if (parseInt(nMese[1]) === i) {
                        tras = frasi.trascritto;
                        let parole = tras.split(" ");
                        for (let parola of parole) {
                            for (let [i, lettera] of letters.entries()) {
                                if (lettera != "d" && lettera != "t" && lettera != "s" && lettera != "z" && lettera != "ʃ" && lettera != "ʒ") {
                                    if (parola.includes(lettera) && !parola.startsWith(lettera)) {
                                        let nLettere = countLetters(parola, lettera);
                                        // posizioniMedie[i]++;
                                        posMed[i] += nLettere;
                                    }
                                    if (parola.startsWith(lettera) && parola.substring(1, parola.length).includes(lettera)) {
                                        let count = countLetters(parola.substring(1, parola.length), lettera);
                                        posMed[i] += count;
                                    }
                                    if (parola.startsWith(lettera)) {
                                        posIn[i]++;
                                    }
                                }
                                if (lettera == "ʃ") {
                                    let nS;
                                    let regex = /(?<!t)ʃ/g;
                                    let corrispondenze = parola.match(regex);
                                    nS = corrispondenze ? corrispondenze.length : 0;
                                    posMed[i] += nS;
                                }
                                if (lettera == "ʒ") {
                                    let nS;
                                    let regex = /(?<!d)ʒ/g;
                                    let corrispondenze = parola.match(regex);
                                    nS = corrispondenze ? corrispondenze.length : 0;
                                    posMed[i] += nS;
                                }
                                if (lettera == "d") {
                                    let nD;
                                    if (parola.startsWith("d") && !parola.startsWith("dz") && !parola.startsWith("dʒ")) {
                                        posIn[i]++;
                                    }
                                    let regex = /d(?![zʒ])/gi;
                                    let corrispondenze = parola.substring(1, parola.length).match(regex);
                                    nD = corrispondenze ? corrispondenze.length : 0;
                                    posMed[i] += nD;
                                }
                                if (lettera == "t") {
                                    let nT;
                                    if (parola.startsWith("t") && !parola.startsWith("ts") && !parola.startsWith("tʃ")) {
                                        posIn[i]++;
                                    }
                                    let regex = /t(?![sʃ])/gi;
                                    let corrispondenze = parola.substring(1, parola.length).match(regex);
                                    nT = corrispondenze ? corrispondenze.length : 0;
                                    posMed[i] += nT;
                                }
                                if (lettera == "s") {
                                    let nS;
                                    if (parola.startsWith("s")) {
                                        posIn[i]++;
                                    }
                                    let regex = /(?<!t)s/g;
                                    let corrispondenze = parola.substring(1, parola.length).match(regex);
                                    nS = corrispondenze ? corrispondenze.length : 0;
                                    posMed[i] += nS;
                                }
                                if (lettera == "z") {
                                    let nZ;
                                    if (parola.startsWith("z")) {
                                        posIn[i]++;
                                    }
                                    let regex = /(?<!d)z/g;
                                    let corrispondenze = parola.substring(1, parola.length).match(regex);
                                    nZ = corrispondenze ? corrispondenze.length : 0;
                                    posMed[i] += nZ;
                                }
                            }
                        }



                    }
                }

                const prefissi = ["il ", "nel ", "sul ", "dal ", "kol ", "al ", "del "];
                let index = -1;
                let countL = 0;
                const consonanti = "bcdfghjklmnpqrstvwxyz";
                for (let tras of jsonChar) {
                    let frase = tras.trascritto;
                    let data = tras.data.split("/");
                    if (parseInt(data[1]) === parseInt(i)) {
                        for (let prefisso of prefissi) {
                            if (prefisso != "al ") {
                                do {
                                    index = frase.indexOf(prefisso, index + 1);
                                    if (index != -1) {
                                        if (consonanti.includes(frase[index + prefisso.length])) {
                                            countL++;
                                        }
                                    }
                                } while (index != -1);
                            }
                            if (prefisso == "al ") {
                                do {
                                    index = frase.indexOf(prefisso, index + 1);
                                    if (index != -1 && frase[index - 1] != "d") {
                                        if (consonanti.includes(frase[index + prefisso.length])) {
                                            countL++;
                                        }
                                    }
                                } while (index != -1);
                            }
                        }
                    }
                }

                posMed[12] -= countL;


                let countS = 0;
                for (let tras of jsonChar) {
                    let frase = tras.trascritto;
                    data = tras.data.split("/");
                    if (parseInt(data[1]) === parseInt(i)) {
                        let regex = /ls|rs|ps|ns/g;
                        let matches = frase.match(regex);
                        if (matches) {
                            countS += matches.length;
                        }
                    }
                }
                posMed[14] -= countS;

                const prefissiN = ["un ", "in ", "bwon ", "zan ", "don ", "dan ", "kon ", "non "];
                let indexN = -1;
                let countN = 0;
                for (let tras of jsonChar) {
                    let frase = tras.trascritto;
                    let data = tras.data.split("/");
                    if (parseInt(data[1]) === parseInt(i)) {
                        for (let prefisso of prefissiN) {
                            do {
                                indexN = frase.indexOf(prefisso, indexN + 1);
                                if (indexN != -1) {
                                    if (consonanti.includes(frase[indexN + prefisso.length])) {
                                        countN++;
                                    }
                                }
                            } while (indexN != -1);

                        }
                    }
                }
                posMed[7] -= countN;

                let maxBet
                if (Math.max(...posIn) > Math.max(...posMed)) {
                    maxBet = Math.max(...posIn);
                } else {
                    maxBet = Math.max(...posMed);
                }
                if (maxBet > maxAssoluto) {
                    maxAssoluto = maxBet;
                }
                // m 4
                // n 7
                // s 14
                // z 15
                // r 13
                // l 12
                let jsonG = calcolaGruppiConsMesi(i, jsonChar);
                posIn[4] = posIn[4] - jsonG.gruppiIni[0];
                posIn[7] = posIn[7] - jsonG.gruppiIni[1];
                posIn[14] = posIn[14] - jsonG.gruppiIni[2];
                posIn[15] = posIn[15] - jsonG.gruppiIni[3];
                posIn[13] = posIn[13] - jsonG.gruppiIni[4];
                posIn[12] = posIn[12] - jsonG.gruppiIni[5];
                posMed[4] = posMed[4] - jsonG.gruppiMed[0];
                posMed[7] = posMed[7] - jsonG.gruppiMed[1];
                posMed[14] = posMed[14] - jsonG.gruppiMed[2];
                posMed[15] = posMed[15] - jsonG.gruppiMed[3];
                posMed[13] = posMed[13] - jsonG.gruppiMed[4];
                posMed[12] = posMed[12] - jsonG.gruppiMed[5];



                //dividi i vettori
                let midIndex = Math.ceil(posIn.length / 2);
                let firstIn = posIn.slice(0, midIndex);
                let secondIn = posIn.slice(midIndex);
                let firstMed = posMed.slice(0, midIndex);
                let secondMed = posMed.slice(midIndex);
                let color1 = getRandomColor();
                let color2 = getRandomColor();
                let datasett = {
                    label: "Pos. Iniziale " + mesiS[i - 1],
                    data: firstIn,
                    backgroundColor: color1,
                    borderColor: color1,
                    borderWidth: 1
                }
                dataset1.push(datasett);
                datasett = {
                    label: "Pos. Mediana " + mesiS[i - 1],
                    data: firstMed,
                    backgroundColor: color2,
                    borderColor: color2,
                    borderWidth: 1
                }
                dataset1.push(datasett);
                datasett = {
                    label: "Pos. Iniziale " + mesiS[i - 1],
                    data: secondIn,
                    backgroundColor: color1,
                    borderColor: color1,
                    borderWidth: 1
                }
                dataset2.push(datasett);
                datasett = {
                    label: "Pos. Mediana " + mesiS[i - 1],
                    data: secondMed,
                    backgroundColor: color2,
                    borderColor: color2,
                    borderWidth: 1
                }
                dataset2.push(datasett);

            }

            function countLetters(str, letters) {
                let count = 0;
                if (letters.length === 1) {
                    for (let i = 0; i < str.length; i++) {
                        if (str[i] === letters) {
                            count++;
                        }
                    }
                } else if (letters.length === 2) {
                    for (let i = 0; i < str.length - 1; i++) {
                        if (str.substring(i, i + 2) === letters) {
                            count++;
                        }
                    }
                }
                return count;
            }


            // // DIVIDI I VETTORI
            let minInd = Math.ceil(letters.length / 2);
            let firstLet = letters.slice(0, minInd);
            let secondLet = letters.slice(minInd);

            // midIndex = Math.ceil(jsonChar.fonMed.length / 2);
            // let firstMed = jsonChar.fonMed.slice(0, midIndex);
            // let secondMed = jsonChar.fonMed.slice(midIndex);

            // midIndex = Math.ceil(jsonChar.fonIniz.length / 2);
            // let firstIniz = jsonChar.fonIniz.slice(0, midIndex);
            // let secondIniz = jsonChar.fonIniz.slice(midIndex);


            if (chartJS2) {

                myChart2.data.datasets = dataset1
                myChart2.options.scales.yAxes[0].ticks.max = maxAssoluto + 2;
                myChart2.options.scales.xAxes[0].barThickness = Math.round(barLarge);

                myChart2.update();
            } else {
                chartJS2 = true;
                const data = {
                    labels: firstLet,
                    datasets: dataset1
                };



                const options = {
                    responsive: true,
                    scales: {
                        xAxes: [{
                            barThickness: Math.round(barLarge)
                        }],
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                max: maxAssoluto + 2
                            }
                        }],
                        y: [{
                            ticks: {
                                callback: function (value) {
                                    if (Number.isInteger(value)) {
                                        return value;
                                    }
                                },
                                stepSize: 1
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

            secondLet = secondLet.map(elemento => {
                return elemento.replace("r", "r o R");
            });
            if (chartJS3) {

                myChart3.data.datasets = dataset2
                myChart3.options.scales.yAxes[0].ticks.max = maxAssoluto + 2;
                myChart3.options.scales.xAxes[0].barThickness = Math.round(barLarge);
                myChart3.update();
            } else {
                chartJS3 = true;
                const data = {
                    labels: secondLet,
                    datasets: dataset2
                };



                const options = {
                    responsive: true,
                    scales: {
                        xAxes: [{
                            barThickness: Math.round(barLarge)
                        }],
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                max: maxAssoluto + 2
                            }
                        }],
                        y: [{
                            ticks: {
                                callback: function (value) {
                                    if (Number.isInteger(value)) {
                                        return value;
                                    }
                                },
                                stepSize: 1
                            }
                        }]
                    }
                };

                myChart3 = new Chart(document.getElementById("chart2"), {
                    type: "bar",
                    data: data,
                    options: options
                });
            }

        }, 500);
    });

    $("#btnConfermaMesiSel").on("click", function () {
        setTimeout(() => {
            let jsonChar = JSON.parse($("#lblMesiSel").text());
            let pazienti=jsonChar.paziente;
            let mesi = jsonChar.mesi;
            let n=mesi.length;
            barLarge = 10;
            if (n === 2) {
                barLarge = 13;
            }
            if (n === 3) {
                barLarge = 10;
            }
            if (n === 4) {
                barLarge = 8;
            }
            if (n === 5) {
                barLarge = 6;
            }
            if (n === 6) {
                barLarge = 5;
            }
            if (n === 7) {
                barLarge = 4;
            }
            if (n >= 8) {
                barLarge = 3;
            }
            let maxAssoluto = 0;
            let dataset1 = [];
            let dataset2 = [];
            let letters = ["j", "w", "p", "b", "m", "t", "d", "n", "k", "g", "f", "v", "l", "r", "s", "z", "ʃ", "dʒ", "ts", "dz", "ɲ", "ʎ", "tʃ", "ʒ"]
            let tras;
            document.getElementById("titoloMesiSelezionabili").innerHTML="";
            for(let mese of mesi){
                document.getElementById("titoloMesiSelezionabili").innerHTML+=mesiScritti[mese-1]+" - ";
                let posIn = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                let posMed = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                for(let reg of pazienti.reg){
                    let data=reg.data.split("/");
                    if(parseInt(data[1])===mese){
                        tras=reg.trascritto;
                        let parole = tras.split(" ");
                        for(let parola of parole){
                            for (let [i, lettera] of letters.entries()) {
                                if (lettera != "d" && lettera != "t" && lettera != "s" && lettera != "z" && lettera != "ʃ" && lettera != "ʒ") {
                                    if (parola.includes(lettera) && !parola.startsWith(lettera)) {
                                        let nLettere = countLetters(parola, lettera);
                                        // posizioniMedie[i]++;
                                        posMed[i] += nLettere;
                                    }
                                    if (parola.startsWith(lettera) && parola.substring(1, parola.length).includes(lettera)) {
                                        let count = countLetters(parola.substring(1, parola.length), lettera);
                                        posMed[i] += count;
                                    }
                                    if (parola.startsWith(lettera)) {
                                        posIn[i]++;
                                    }
                                }
                                if (lettera == "ʃ") {
                                    let nS;
                                    let regex = /(?<!t)ʃ/g;
                                    let corrispondenze = parola.match(regex);
                                    nS = corrispondenze ? corrispondenze.length : 0;
                                    posMed[i] += nS;
                                }
                                if (lettera == "ʒ") {
                                    let nS;
                                    let regex = /(?<!d)ʒ/g;
                                    let corrispondenze = parola.match(regex);
                                    nS = corrispondenze ? corrispondenze.length : 0;
                                    posMed[i] += nS;
                                }
                                if (lettera == "d") {
                                    let nD;
                                    if (parola.startsWith("d") && !parola.startsWith("dz") && !parola.startsWith("dʒ")) {
                                        posIn[i]++;
                                    }
                                    let regex = /d(?![zʒ])/gi;
                                    let corrispondenze = parola.substring(1, parola.length).match(regex);
                                    nD = corrispondenze ? corrispondenze.length : 0;
                                    posMed[i] += nD;
                                }
                                if (lettera == "t") {
                                    let nT;
                                    if (parola.startsWith("t") && !parola.startsWith("ts") && !parola.startsWith("tʃ")) {
                                        posIn[i]++;
                                    }
                                    let regex = /t(?![sʃ])/gi;
                                    let corrispondenze = parola.substring(1, parola.length).match(regex);
                                    nT = corrispondenze ? corrispondenze.length : 0;
                                    posMed[i] += nT;
                                }
                                if (lettera == "s") {
                                    let nS;
                                    if (parola.startsWith("s")) {
                                        posIn[i]++;
                                    }
                                    let regex = /(?<!t)s/g;
                                    let corrispondenze = parola.substring(1, parola.length).match(regex);
                                    nS = corrispondenze ? corrispondenze.length : 0;
                                    posMed[i] += nS;
                                }
                                if (lettera == "z") {
                                    let nZ;
                                    if (parola.startsWith("z")) {
                                        posIn[i]++;
                                    }
                                    let regex = /(?<!d)z/g;
                                    let corrispondenze = parola.substring(1, parola.length).match(regex);
                                    nZ = corrispondenze ? corrispondenze.length : 0;
                                    posMed[i] += nZ;
                                }
                            }
                        }
                    }
                }

                const prefissi = ["il ", "nel ", "sul ", "dal ", "kol ", "al ", "del "];
                let index = -1;
                let countL = 0;
                const consonanti = "bcdfghjklmnpqrstvwxyz";
                for (let tras of pazienti.reg) {
                    let frase = tras.trascritto;
                    let data = tras.data.split("/");
                    if (parseInt(data[1]) === parseInt(mese)) {
                        for (let prefisso of prefissi) {
                            if (prefisso != "al ") {
                                do {
                                    index = frase.indexOf(prefisso, index + 1);
                                    if (index != -1) {
                                        if (consonanti.includes(frase[index + prefisso.length])) {
                                            countL++;
                                        }
                                    }
                                } while (index != -1);
                            }
                            if (prefisso == "al ") {
                                do {
                                    index = frase.indexOf(prefisso, index + 1);
                                    if (index != -1 && frase[index - 1] != "d") {
                                        if (consonanti.includes(frase[index + prefisso.length])) {
                                            countL++;
                                        }
                                    }
                                } while (index != -1);
                            }
                        }
                    }
                }

                posMed[12] -= countL;


                let countS = 0;
                for (let tras of pazienti.reg) {
                    let frase = tras.trascritto;
                    data = tras.data.split("/");
                    if (parseInt(data[1]) === parseInt(mese)) {
                        let regex = /ls|rs|ps|ns/g;
                        let matches = frase.match(regex);
                        if (matches) {
                            countS += matches.length;
                        }
                    }
                }
                posMed[14] -= countS;

                const prefissiN = ["un ", "in ", "bwon ", "zan ", "don ", "dan ", "kon ", "non "];
                let indexN = -1;
                let countN = 0;
                for (let tras of pazienti.reg) {
                    let frase = tras.trascritto;
                    let data = tras.data.split("/");
                    if (parseInt(data[1]) === parseInt(mese)) {
                        for (let prefisso of prefissiN) {
                            do {
                                indexN = frase.indexOf(prefisso, indexN + 1);
                                if (indexN != -1) {
                                    if (consonanti.includes(frase[indexN + prefisso.length])) {
                                        countN++;
                                    }
                                }
                            } while (indexN != -1);

                        }
                    }
                }
                posMed[7] -= countN;

                
                let maxBet
                if (Math.max(...posIn) > Math.max(...posMed)) {
                    maxBet = Math.max(...posIn);
                } else {
                    maxBet = Math.max(...posMed);
                }
                if (maxBet > maxAssoluto) {
                    maxAssoluto = maxBet;
                }

                let jsonG = calcolaGruppiConsMesi(mese, pazienti.reg);
                posIn[4] = posIn[4] - jsonG.gruppiIni[0];
                posIn[7] = posIn[7] - jsonG.gruppiIni[1];
                posIn[14] = posIn[14] - jsonG.gruppiIni[2];
                posIn[15] = posIn[15] - jsonG.gruppiIni[3];
                posIn[13] = posIn[13] - jsonG.gruppiIni[4];
                posIn[12] = posIn[12] - jsonG.gruppiIni[5];
                posMed[4] = posMed[4] - jsonG.gruppiMed[0];
                posMed[7] = posMed[7] - jsonG.gruppiMed[1];
                posMed[14] = posMed[14] - jsonG.gruppiMed[2];
                posMed[15] = posMed[15] - jsonG.gruppiMed[3];
                posMed[13] = posMed[13] - jsonG.gruppiMed[4];
                posMed[12] = posMed[12] - jsonG.gruppiMed[5];



                // console.log("Posizioni iniziali: "+posIn);
                // console.log("Posizioni medie: "+posMed);




                let midIndex = Math.ceil(posIn.length / 2);
                let firstIn = posIn.slice(0, midIndex);
                let secondIn = posIn.slice(midIndex);
                let firstMed = posMed.slice(0, midIndex);
                let secondMed = posMed.slice(midIndex);
                let color1 = getRandomColor();
                let color2 = getRandomColor();
                let datasett = {
                    label: "Pos. Iniziale " + mesiScritti[mese - 1],
                    data: firstIn,
                    backgroundColor: color1,
                    borderColor: color1,
                    borderWidth: 1
                }
                dataset1.push(datasett);
                datasett = {
                    label: "Pos. Mediana " + mesiScritti[mese - 1],
                    data: firstMed,
                    backgroundColor: color2,
                    borderColor: color2,
                    borderWidth: 1
                }
                dataset1.push(datasett);
                datasett = {
                    label: "Pos. Iniziale " + mesiScritti[mese - 1],
                    data: secondIn,
                    backgroundColor: color1,
                    borderColor: color1,
                    borderWidth: 1
                }
                dataset2.push(datasett);
                datasett = {
                    label: "Pos. Mediana " + mesiScritti[mese - 1],
                    data: secondMed,
                    backgroundColor: color2,
                    borderColor: color2,
                    borderWidth: 1
                }
                dataset2.push(datasett);
            }
            document.getElementById("titoloMesiSelezionabili").innerHTML=document.getElementById("titoloMesiSelezionabili").innerHTML.substring(0,document.getElementById("titoloMesiSelezionabili").innerHTML.length-3);
            
            function countLetters(str, letters) {
                let count = 0;
                if (letters.length === 1) {
                    for (let i = 0; i < str.length; i++) {
                        if (str[i] === letters) {
                            count++;
                        }
                    }
                } else if (letters.length === 2) {
                    for (let i = 0; i < str.length - 1; i++) {
                        if (str.substring(i, i + 2) === letters) {
                            count++;
                        }
                    }
                }
                return count;
            }

            
            let minInd = Math.ceil(letters.length / 2);
            let firstLet = letters.slice(0, minInd);
            let secondLet = letters.slice(minInd);

            if (chartJS6) {

                myChart6.data.datasets = dataset1
                myChart6.options.scales.yAxes[0].ticks.max = maxAssoluto + 2;
                myChart6.options.scales.xAxes[0].barThickness = Math.round(barLarge);

                myChart6.update();
            } else {
                chartJS6 = true;
                const data = {
                    labels: firstLet,
                    datasets: dataset1
                };



                const options = {
                    responsive: true,
                    scales: {
                        xAxes: [{
                            barThickness: Math.round(barLarge)
                        }],
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                max: maxAssoluto + 2
                            }
                        }],
                        y: [{
                            ticks: {
                                callback: function (value) {
                                    if (Number.isInteger(value)) {
                                        return value;
                                    }
                                },
                                stepSize: 1
                            }
                        }]
                    }
                };

                myChart6 = new Chart(document.getElementById("chartMesiSel1"), {
                    type: "bar",
                    data: data,
                    options: options
                });
            }

            secondLet = secondLet.map(elemento => {
                return elemento.replace("r", "r o R");
            });
            if (chartJS7) {

                myChart7.data.datasets = dataset2
                myChart7.options.scales.yAxes[0].ticks.max = maxAssoluto + 2;
                myChart7.options.scales.xAxes[0].barThickness = Math.round(barLarge);
                myChart7.update();
            } else {
                chartJS7 = true;
                const data = {
                    labels: secondLet,
                    datasets: dataset2
                };



                const options = {
                    responsive: true,
                    scales: {
                        xAxes: [{
                            barThickness: Math.round(barLarge)
                        }],
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                max: maxAssoluto + 2
                            }
                        }],
                        y: [{
                            ticks: {
                                callback: function (value) {
                                    if (Number.isInteger(value)) {
                                        return value;
                                    }
                                },
                                stepSize: 1
                            }
                        }]
                    }
                };

                myChart7 = new Chart(document.getElementById("chartMesiSel2"), {
                    type: "bar",
                    data: data,
                    options: options
                });
            }
        }, 500);
    });

    $("#mese22").change(function () {
        let mesiS = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
        let maxAssoluto = 0;
        const consonanti = "bcdfghjklmnpqrstvwxyz";
        setTimeout(() => {
            let jsonChar = JSON.parse($("#spanJsonMesi").text());
            let mesi = document.getElementById("mesiGruppi").innerHTML.split(" - ");
            let n1 = numMese(mesi[0]);
            let n2 = numMese(mesi[1]);
            let n = n2 - n1 + 1;
            console.log("Numero mesi: " + n);
            barLarge = 10;
            if (n > 6) {
                barLarge = 8;
            }
            else {
                barLarge = 13;
            }

            let dataset = [];
            let letters = ["m", "n", "s", "z", "r", "l"]
            let tras;
            for (let i = n1; i <= n2; i++) {
                let posizioni = [0, 0, 0, 0, 0, 0];
                for (let frasi of jsonChar) {
                    let nMese = frasi.data.split("/");
                    if (parseInt(nMese[1]) === i) {
                        tras = frasi.trascritto;
                        for (let [i, lettera] of letters.entries()) {
                            let nLettere = contaLettere(tras, lettera);
                            posizioni[i] += nLettere;
                        }
                    }
                }
                const prefissi = ["il ", "nel ", "sul ", "dal ", "kol ", "al ", "del "];
                let index = -1;
                let countL = 0;
                for (let tras of jsonChar) {
                    let frase = tras.trascritto;
                    data = tras.data.split("/");
                    if (parseInt(data[1]) === i) {
                        for (let prefisso of prefissi) {
                            if (prefisso != "al ") {
                                do {
                                    index = frase.indexOf(prefisso, index + 1);
                                    if (index != -1) {
                                        if (consonanti.includes(frase[index + prefisso.length])) {
                                            countL++;
                                        }
                                    }
                                } while (index != -1);
                            }
                            if (prefisso == "al ") {
                                do {
                                    index = frase.indexOf(prefisso, index + 1);
                                    if (index != -1 && frase[index - 1] != "d") {
                                        if (consonanti.includes(frase[index + prefisso.length])) {
                                            countL++;
                                        }
                                    }
                                } while (index != -1);
                            }
                        }
                    }
                }
                posizioni[5] += countL;

                let countS = 0;
                for (let tras of jsonChar) {
                    let frase = tras.trascritto;
                    data = tras.data.split("/");
                    if (parseInt(data[1]) === i) {
                        let regex = /ls|rs|ps|ns/g;
                        let matches = frase.match(regex);
                        if (matches) {
                            countS += matches.length;
                        }
                    }
                }
                posizioni[2] += countS;

                const prefissiN = ["un ", "in ", "bwon ", "zan ", "don ", "dan ", "kon ", "non "];
                let indexN = -1;
                let countN = 0;
                for (let tras of jsonChar) {
                    let frase = tras.trascritto;
                    data = tras.data.split("/");
                    if (parseInt(data[1]) === i) {
                        for (let prefisso of prefissiN) {
                            do {
                                indexN = frase.indexOf(prefisso, indexN + 1);
                                if (indexN != -1) {
                                    if (consonanti.includes(frase[indexN + prefisso.length])) {
                                        countN++;
                                    }
                                }
                            } while (indexN != -1);

                        }
                    }
                }
                posizioni[1] += countN;


                let maxBet = Math.max(...posizioni);
                if (maxBet > maxAssoluto) {
                    maxAssoluto = maxBet;
                }
                let color = getRandomColor();
                let datasett = {
                    label: mesiS[i - 1],
                    data: posizioni,
                    backgroundColor: color,
                    borderColor: color,
                    borderWidth: 1
                }
                dataset.push(datasett);

            }


            if (chartJS5) {

                myChart5.data.datasets = dataset
                myChart5.options.scales.yAxes[0].ticks.max = maxAssoluto + 2;
                myChart5.options.scales.xAxes[0].barThickness = Math.round(barLarge);

                myChart5.update();
            } else {
                chartJS5 = true;
                const data = {
                    labels: ["/m/", "/n/", "/s/", "/z/", "/r/ o /R/", "/l/"],
                    datasets: dataset
                };



                const options = {
                    responsive: true,
                    scales: {
                        xAxes: [{
                            barThickness: barLarge
                        }],
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                max: maxAssoluto + 2
                            }
                        }],
                        y: [{
                            ticks: {
                                callback: function (value) {
                                    if (Number.isInteger(value)) {
                                        return value;
                                    }
                                },
                                stepSize: 1
                            }
                        }]
                    }
                };

                myChart5 = new Chart(document.getElementById("chartGruppi2"), {
                    type: "bar",
                    data: data,
                    options: options
                });
            }

            function contaLettere(frase, gruppo) {
                let count = 0;
                const consonanti = "bcdfghjklmnpqrstvwxyz";
                const vocali = "aeiou";
                if (gruppo !== "r") {
                    for (let i = 0; i < frase.length - 1; i++) {
                        if (gruppo === frase[i] && consonanti.includes(frase[i + 1])) {
                            count++;
                        }
                    }
                } else {
                    if (frase.startsWith("r") && consonanti.includes(frase[1])) {
                        count++;
                    }
                    for (let i = 1; i < frase.length - 1; i++) {
                        if ((frase[i] === gruppo && consonanti.includes(frase[i + 1])) || (frase[i] === gruppo && consonanti.includes(frase[i - 1]))) {
                            count++;
                        }
                    }
                }
                return count;
            }



        }, 500);
    });

    function getRandomColor() {
        let letters = '0123456789ABCDEF';
        let color;
        do {
            color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }

        } while (colori.includes(color))
        colori += color;
        return color;
    }

    $("#mese1").change(function () {
        if (chartJS2) {
            chartJS2 = false;
            myChart2.destroy();
        }
        if (chartJS3) {
            chartJS3 = false;
            myChart3.destroy();
        }
        document.getElementById("divFonMes").innerHTML = "";
    });

    $("#btnEsciScheda").click(function () {
        document.getElementById("containerForm").style.display = "none";
        document.getElementById("meseTrasc").style.display = "none";
        document.getElementById("trascrizioniMesi").style.display = "none";
        if (chartJS2) {
            chartJS2 = false;
            myChart2.destroy();
        }
        if (chartJS3) {
            chartJS3 = false;
            myChart3.destroy();
        }
        if (chartJS4) {
            chartJS4 = false;
            myChart4.destroy();
        }
        if (chartJS5) {
            chartJS5 = false;
            myChart5.destroy();
        }
        if (chartJS6) {
            chartJS6 = false;
            myChart6.destroy();
        }
        if (chartJS7) {
            chartJS7 = false;
            myChart7.destroy();
        }
        document.getElementById("divFonMes").innerHTML = "";
        document.getElementById("mese1").selectedIndex = -1;
        document.getElementById('mese2').innerHTML = '';
        document.getElementById("mese12").selectedIndex = -1;
        document.getElementById('mese22').innerHTML = '';
        document.getElementById("divMese22").style.display = "none";
        document.getElementById("divMese2").style.display = "none";
    });
    function numMese(mese) {
        mese = mese.toLowerCase();
        if (mese === "gennaio") return 1;
        if (mese === "febbraio") return 2;
        if (mese === "marzo") return 3;
        if (mese === "aprile") return 4;
        if (mese === "maggio") return 5;
        if (mese === "giugno") return 6;
        if (mese === "luglio") return 7;
        if (mese === "agosto") return 8;
        if (mese === "settembre") return 9;
        if (mese === "ottobre") return 10;
        if (mese === "novembre") return 11;
        if (mese === "dicembre") return 12;
        return -1;
    }





    $(".tasto").on("click", function () {
        let fonema = $(this).text();
        let frase = $("#outputTrascritto").val();
        frase += fonema;
        $("#outputTrascritto").val(frase);
    });



    function calcolaNCons() {
        let data = 0;
        let nMese = document.getElementById('numMese').value;
        let jsonGruppi = JSON.parse($("#jsonGruppi").text());
        let gruppiCons = ["m", "n", "s", "z", "r", "l"]
        let nConsIni = [0, 0, 0, 0, 0, 0];
        let nConsMed = [0, 0, 0, 0, 0, 0];
        let consonanti = "bcdfghjklmnpqrstvwxyz";
        for (let tras of jsonGruppi) {
            data = tras.data.split("/");
            if (data[1] === nMese) {
                for (let [i, gruppo] of gruppiCons.entries()) {
                    if (gruppo == "s") {
                        let parole = tras.trascritto.split(" ");
                        for (let parola of parole) {
                            if (parola.startsWith("s") && consonanti.includes(parola[1])) {
                                nConsIni[i]++;
                            }
                            let nlett = contaLettere(parola.substring(1, parola.length), gruppo);
                            nConsMed[i] += nlett;
                        }
                    } else if (gruppo == "l") {
                        let parole = tras.trascritto.split(" ");
                        for (let parola of parole) {
                            if (parola.startsWith("l") && consonanti.includes(parola[1])) {
                                nConsIni[i]++;
                            }
                            let nlett = contaLettere(parola.substring(1, parola.length), gruppo);
                            nConsMed[i] += nlett;
                        }
                    } else {
                        let nlett = contaLettere(tras.trascritto, gruppo);
                        nConsMed[i] += nlett;
                    }
                }
            }
        }

        const prefissi = ["il ", "nel ", "sul ", "dal ", "kol ", "al ", "del "];
        let index = -1;
        let countL = 0;
        for (let tras of jsonGruppi) {
            let frase = tras.trascritto;
            data = tras.data.split("/");
            if (data[1] === nMese) {
                for (let prefisso of prefissi) {
                    if (prefisso != "al ") {
                        do {
                            index = frase.indexOf(prefisso, index + 1);
                            if (index != -1) {
                                if (consonanti.includes(frase[index + prefisso.length])) {
                                    countL++;
                                }
                            }
                        } while (index != -1);
                    }
                    if (prefisso == "al ") {
                        do {
                            index = frase.indexOf(prefisso, index + 1);
                            if (index != -1 && frase[index - 1] != "d") {
                                if (consonanti.includes(frase[index + prefisso.length])) {
                                    countL++;
                                }
                            }
                        } while (index != -1);
                    }
                }
            }
        }
        nConsMed[5] += countL;


        const prefissiN = ["un ", "in ", "bwon ", "zan ", "don ", "dan ", "kon ", "non "];
        let indexN = -1;
        let countN = 0;
        for (let tras of jsonGruppi) {
            let frase = tras.trascritto;
            data = tras.data.split("/");
            if (data[1] === nMese) {
                for (let prefisso of prefissiN) {
                    do {
                        indexN = frase.indexOf(prefisso, indexN + 1);
                        if (indexN != -1) {
                            if (consonanti.includes(frase[indexN + prefisso.length])) {
                                countN++;
                            }
                        }
                    } while (indexN != -1);

                }
            }
        }
        nConsMed[1] += countN;



        let countS = 0;
        for (let tras of jsonGruppi) {
            let frase = tras.trascritto;
            data = tras.data.split("/");
            if (data[1] === nMese) {
                let regex = /ls|rs|ps|ns/g;
                let matches = frase.match(regex);
                if (matches) {
                    countS += matches.length;
                }

                // let parole = frase.split(" ");
                // let lettere = "nlr";
                // for (let [i, parola] of parole.entries()) {
                //     if (i < parole.length - 1) {
                //         let par = parole[i + 1]
                //         console.log(par)
                //         if (par[0] === "s" && lettere.includes(parola[parola.length - 1])) {
                //             countS++;
                //         }
                //     }
                // }
            }
        }
        nConsMed[2] += countS;


        let nCons = {
            nConsIni,
            nConsMed
        }


        function contaLettere(frase, gruppo) {
            let count = 0;
            const consonanti = "bcdfghjklmnpqrstvwxyz";
            const vocali = "aeiou";
            if (gruppo !== "r" && gruppo !== "l") {
                for (let i = 0; i < frase.length - 1; i++) {
                    if (gruppo === frase[i] && consonanti.includes(frase[i + 1])) {
                        count++;
                    }
                }
            }
            if (gruppo == "r") {
                if (frase.startsWith("r") && consonanti.includes(frase[1])) {
                    count++;
                }
                for (let i = 1; i < frase.length - 1; i++) {
                    if ((frase[i] === gruppo && consonanti.includes(frase[i + 1])) || (frase[i] === gruppo && consonanti.includes(frase[i - 1]))) {
                        count++;
                    }
                }
            }
            if (gruppo == "l") {
                if (frase.startsWith("l") && consonanti.includes(frase[1])) {
                    count++;
                }
                for (let i = 1; i < frase.length - 1; i++) {
                    if ((frase[i] === gruppo && consonanti.includes(frase[i + 1]))) {
                        count++;
                    }
                }
            }
            return count;
        }

        return nCons;
    }




    function calcolaGruppiConsMesi(i, json) {
        let gruppiCons = ["m", "n", "s", "z", "r", "l"]
        let gruppiIni = [0, 0, 0, 0, 0, 0];
        let gruppiMed = [0, 0, 0, 0, 0, 0];
        let consonanti = "bcdfghjklmnpqrstvwxyz";
        for (let frase of json) {
            let data = frase.data.split("/");
            if (data[1] == i) {
                for (let [j, gruppo] of gruppiCons.entries()) {
                    if (gruppo == "s") {
                        let parole = frase.trascritto.split(" ");
                        for (let parola of parole) {
                            if (parola.startsWith("s") && consonanti.includes(parola[1])) {
                                gruppiIni[j]++;
                            }
                            let nlett = contaLettere(parola.substring(1, parola.length), gruppo);
                            gruppiMed[j] += nlett;
                        }
                    } else {
                        let nlett = contaLettere(frase.trascritto, gruppo);
                        gruppiMed[j] += nlett;
                    }
                }
            }
        }



        function contaLettere(frase, gruppo) {
            let count = 0;
            const consonanti = "bcdfghjklmnpqrstvwxyz";
            const vocali = "aeiou";
            if (gruppo !== "r") {
                for (let i = 0; i < frase.length - 1; i++) {
                    if (gruppo === frase[i] && consonanti.includes(frase[i + 1])) {
                        count++;
                    }
                }
            } else {
                if (frase.startsWith("r") && consonanti.includes(frase[1])) {
                    count++;
                }
                for (let i = 1; i < frase.length - 1; i++) {
                    if ((frase[i] === gruppo && consonanti.includes(frase[i + 1])) || (frase[i] === gruppo && consonanti.includes(frase[i - 1]))) {
                        count++;
                    }
                }
            }
            return count;
        }

        let jsonGruppi = {
            gruppiIni,
            gruppiMed
        }
        return jsonGruppi
    }
});