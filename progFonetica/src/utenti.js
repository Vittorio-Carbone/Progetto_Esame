

$(document).ready(function () {

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
            jsonChar.testo = jsonChar.testo.map(elemento => {
                return elemento.replace("r", "r o R");
            });
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


            let data = 0;
            let nMese = document.getElementById('numMese').value;
            let jsonGruppi = JSON.parse($("#jsonGruppi").text());
            let gruppiCons = ["m", "n", "s", "z", "r", "l"]
            let gruppiConsWr = ["/m/", "/n/", "/s/", "/z/", "/r/ o /R/", "/l/"]
            let nCons = [0, 0, 0, 0, 0, 0];
            for (let tras of jsonGruppi) {
                data = tras.data.split("/");
                if (data[1] === nMese) {
                    for (let [i, gruppo] of gruppiCons.entries()) {
                        // console.log(gruppo);
                        let nlett = contaLettere(tras.trascritto, gruppo);
                        nCons[i] += nlett;
                    }
                }
            }
            let maxCons = Math.max(...nCons);
            if (chartJS4) {
                myChart4.data.datasets[0].data = nCons;
                myChart4.options.scales.yAxes[0].ticks.max = maxCons + 2;

                myChart4.update();
            } else {
                chartJS4 = true;
                const data = {
                    labels: gruppiConsWr,
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
                        if(gruppo===frase[i]&&consonanti.includes(frase[i+1])){
                            count++;
                        }
                    }
                } else {
                    if(frase.startsWith("r")&&consonanti.includes(frase[1])){
                        count++;
                    }
                    for (let i = 1; i < frase.length - 1; i++) {
                        if((frase[i]===gruppo&&consonanti.includes(frase[i+1])) ||(frase[i]===gruppo&&consonanti.includes(frase[i-1]))){
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
            let jsonChar = JSON.parse($("#spanJsonMesi").text());
            console.log(jsonChar);
            // let maxMed = Math.max(...jsonChar.fonMed);
            // let maxIniz = Math.max(...jsonChar.fonIniz);
            // let max = Math.max(maxMed, maxIniz);

            let mesi = document.getElementById("divFonMes").innerHTML.split(" - ");
            let n1 = numMese(mesi[0]);
            let n2 = numMese(mesi[1]);
            let n = n2 - n1 + 1;
            console.log("Numero mesi: "+n);
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
            let letters = ["j", "w", "p", "b", "m", "t", "d", "n", "k", "g", "f", "v", "l", "r", "s", "z", "ʃ", "dʒ", "ts", "dz", "ɲ", "ʎ", "ʃ", "ʒ"]
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
                                    let nLettere = countLetters(parola, lettera);
                                    // posizioniIniziali[i]++;
                                    posIn[i] += nLettere;
                                }
                            }
                        }



                    }
                }
                let maxBet
                if (Math.max(...posIn) > Math.max(...posMed)) {
                    maxBet = Math.max(...posIn);
                } else {
                    maxBet = Math.max(...posMed);
                }
                if (maxBet > maxAssoluto) {
                    maxAssoluto = maxBet;
                }
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

    $("#mese22").change(function () {
        let mesiS = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
        let maxAssoluto = 0;
        setTimeout(() => {
            let jsonChar = JSON.parse($("#spanJsonMesi").text());
            let mesi = document.getElementById("mesiGruppi").innerHTML.split(" - ");
            let n1 = numMese(mesi[0]);
            let n2 = numMese(mesi[1]);
            let n = n2 - n1 + 1;
            console.log("Numero mesi: "+n);
            barLarge = 10;
            if (n > 6) {
                barLarge = 8;
            }
            else
            {
                barLarge = 13;
            }

            let dataset = [];
            let letters = ["m", "n", "s", "z", "r", "l"]
            let gruppiConsWr = ["/m/", "/n/", "/s/", "/z/", "/r/ o /R/", "/l/"]
            let tras;
            for(let i=n1;i<=n2;i++){
                let posizioni = [0, 0, 0, 0, 0, 0];
                for(let frasi of jsonChar){
                    let nMese = frasi.data.split("/");
                    if(parseInt(nMese[1])===i){
                        tras = frasi.trascritto;
                        for(let [i,lettera] of letters.entries()){
                            let nLettere = contaLettere(tras, lettera);
                            posizioni[i] += nLettere;
                        }
                    }
                }
                let maxBet = Math.max(...posizioni);
                if(maxBet>maxAssoluto){
                    maxAssoluto = maxBet;
                }
                let color = getRandomColor();
                let datasett = {
                    label: mesiS[i-1],
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
                    labels: gruppiConsWr,
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
                        if(gruppo===frase[i]&&consonanti.includes(frase[i+1])){
                            count++;
                        }
                    }
                } else {
                    if(frase.startsWith("r")&&consonanti.includes(frase[1])){
                        count++;
                    }
                    for (let i = 1; i < frase.length - 1; i++) {
                        if((frase[i]===gruppo&&consonanti.includes(frase[i+1])) ||(frase[i]===gruppo&&consonanti.includes(frase[i-1]))){
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
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
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
        document.getElementById("divFonMes").innerHTML = "";
        document.getElementById("mese1").selectedIndex = -1;
        document.getElementById('mese2').innerHTML = '';
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
});