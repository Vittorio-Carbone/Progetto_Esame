const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');
const filePath = path.join(__dirname, 'utenti.json');
const fs = require('fs');
const Chart = require('chart.js');
let mesiSelezionati = [];
let boolAcc = true;
let users = [];
let vettoreStampa1 = [];
let vettoreStampa2 = [];
let vettoreStampaData = [];
let idUser;
let month;
let mesiScritti = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('containerForm').style.display = 'none';
    // users = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    users = JSON.parse(window.localStorage.getItem('users'));
    users = users;
    if (users == null) {
        users = [];
    }

    let elements = document.getElementsByClassName('mese');

    for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', function () {
            mese(this.id)
        });
    }

    document.getElementById('btnSalvaTrascrizione').addEventListener('click', function () {
        salvaTrascrizione();
    });

    document.getElementById('btnSalvaPaz').addEventListener('click', function () {
        salvaPaziente();
    });
    document.getElementById('cancel').addEventListener('click', function () {
        hidePopup();
    });



    document.getElementById("boolAcc").value = "acc";
    document.addEventListener("keyup", function (event) {
        let controllo = document.getElementById('boolAcc').value
        if (event.key === "Enter" || event.keyCode === 13) {
            if (boolAcc) {
                if (controllo === "acc") {
                    accedi();
                }
                else if (controllo === "reg") {
                    registrati();
                }
            }
        }
    });


    document.getElementById('btnAccedi').addEventListener('click', function () {
        accedi();
    });

    document.getElementById('btnRegistrati').addEventListener('click', function () {
        registrati();
    });


    document.getElementById('logOutClick').addEventListener('click', function () {
        document.getElementById('logged').style.display = 'none';
        document.getElementById('loginHome').style.display = 'block';
        //elimino tutti gli elementi con la classe paziente
        let pazienti = document.getElementsByClassName('paziente');
        while (pazienti[0]) {
            pazienti[0].parentNode.removeChild(pazienti[0]);
        }
        boolAcc = true;
    });

    document.getElementById("iconUser").addEventListener('click', () => {
        caricaSchedaUser();
    });

    document.getElementById("btnScheda").addEventListener('click', () => {
        caricaSchedaUser();
    });



    document.getElementById('confermaOptDel').addEventListener('click', () => {
        eliminaPaziente();
    });
    let radioButtons = document.querySelectorAll('input[type=radio]');

    for (let i = 0; i < radioButtons.length; i++) {
        radioButtons[i].addEventListener('click', function () {
            // console.log('Radio button clicked: ' + this.value+ ' '+this.name);
            buttonClicked(this.value, this.name);
        });
    }

    let chkButton = document.querySelectorAll('input[type=checkbox]');

    for (let i = 0; i < chkButton.length; i++) {
        chkButton[i].addEventListener('click', function () {
            buttonChkClicked(this.id, this.checked);
        });
    }


    document.getElementById('xDivUtente').addEventListener('click', () => {
        document.getElementById('containerForm').style.display = 'none';
    });

    document.getElementById("generate-pdf").addEventListener('click', () => {
        let _id = document.getElementById('idPaziente').value;
        let paziente = users[idUser]['pazienti'][_id];
        let info = paziente.nome + "_" + paziente.cognome + "_" + month;
        ipcRenderer.send('print-to-pdf', info);
    });
    document.getElementById('divMese2').style.display = 'none';
    document.getElementById('divMese22').style.display = 'none';
    document.getElementById('mese1').selectedIndex = -1;
    document.getElementById('mese12').selectedIndex = -1;
    document.getElementById('mese1').addEventListener('change', () => {
        document.getElementById('divMese2').style.display = 'block';
        document.getElementById('mese2').innerHTML = '';
        let nMese = parseInt(document.getElementById('mese1').value) + 1;
        for (let i = nMese; i < 12; i++) {
            let option = document.createElement('option');
            option.value = i;
            option.textContent = mesiScritti[i];
            document.getElementById('mese2').appendChild(option);
        }
        document.getElementById('mese2').selectedIndex = -1;

    });
    document.getElementById('mese12').addEventListener('change', () => {
        document.getElementById('divMese22').style.display = 'block';
        document.getElementById('mese22').innerHTML = '';
        let nMese = parseInt(document.getElementById('mese12').value) + 1;
        for (let i = nMese; i < 12; i++) {
            let option = document.createElement('option');
            option.value = i;
            option.textContent = mesiScritti[i];
            document.getElementById('mese22').appendChild(option);
        }
        document.getElementById('mese22').selectedIndex = -1;

    });
    document.getElementById('mese2').addEventListener('change', () => {
        let mese1 = parseInt(document.getElementById('mese1').value);
        let mese2 = parseInt(document.getElementById('mese2').value);
        document.getElementById("divFonMes").innerHTML = mesiScritti[mese1] + " - " + mesiScritti[mese2];
        caricaFormMesi(mese1, mese2);
    });
    document.getElementById('mese22').addEventListener('change', () => {
        let mese1 = parseInt(document.getElementById('mese12').value);
        let mese2 = parseInt(document.getElementById('mese22').value);
        document.getElementById("mesiGruppi").innerHTML = mesiScritti[mese1] + " - " + mesiScritti[mese2];
        caricaFormMesi(mese1, mese2);
    });


    document.getElementById("cercaPazienti").addEventListener("input", function () {
        let value = document.getElementById("cercaPazienti").value;
        cercaPaziente(value);
    });


    const elementi = document.querySelectorAll(".mesiSelezionabili");
    elementi.forEach(function (elemento) {
        elemento.addEventListener("click", function (event) {
            if (event.target.classList.contains("meseSelezionato")) {
                event.target.classList.remove("meseSelezionato");
                mesiSelezionati = mesiSelezionati.filter((mese) => parseInt(mese) !== parseInt(event.target.id));
            }
            else {
                event.target.classList.add("meseSelezionato");
                mesiSelezionati.push(parseInt(event.target.id));
            }
            mesiSelezionati.sort(function (a, b) {
                return a - b;
            });
        });
    });

    document.getElementById("btnConfermaMesiSel").addEventListener("click", function () {
        caricaChartMesiSel();
    });
});
function caricaChartMesiSel() {
    let _id = document.getElementById('idPaziente').value;
    let paziente = users[idUser]['pazienti'][_id];
    let json = {
        "paziente": paziente,
        "mesi": mesiSelezionati
    }
    document.getElementById('lblMesiSel').innerHTML = JSON.stringify(json);
}


function caricaFormMesi(mese1, mese2) {
    let letters = ["j", "w", "p", "b", "m", "t", "d", "n", "k", "g", "f", "v", "l", "r", "s", "z", "ʃ", "dʒ", "ts", "dz", "ɲ", "ʎ", "tʃ", "ʒ"]
    let write = ["/j/", "/w/", "/p/", "/b/", "/m/", "/t/", "/d/", "/n/", "/k/", "/g/", "/f/", "/v/", "/l/", "/r/ o /ʀ/", "/s/", "/z/", "/ʃ/", "/dʒ/", "/ts/", "/dz/", "/ɲ/ o /ŋ/", "/ʎ/", "/tʃ/", "/ʒ/"]
    let posizioniIniziali = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let posizioniMedie = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let _id = document.getElementById('idPaziente').value;
    let tras;
    for (let trascritto of users[idUser]["pazienti"][_id]["reg"]) {
        let mese = trascritto.data.split('/')[1];
        if (mese >= mese1 + 1 && mese <= mese2 + 1) {
            tras = trascritto.trascritto;
            let parole = tras.split(" ");
            for (let parola of parole) {
                for (let [i, lettera] of letters.entries()) {
                    if (parola.includes(lettera) && !parola.startsWith(lettera)) {
                        let nLettere = countLetters(parola, lettera);
                        // posizioniMedie[i]++;
                        posizioniMedie[i] += nLettere;
                    }
                    if (parola.startsWith(lettera) && parola.substring(1, parola.length).includes(lettera)) {
                        let count = countLetters(parola.substring(1, parola.length), lettera);
                        posizioniMedie[i] += count;
                    }
                    if (parola.startsWith(lettera)) {
                        posizioniIniziali[i]++;
                    }
                }
            }
        }
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

    let jsonChar = {
        "testo": letters,
        "fonMed": posizioniMedie,
        "fonIniz": posizioniIniziali
    }
    document.getElementById('spanJsonMesi').textContent = JSON.stringify(users[idUser]["pazienti"][_id]["reg"], null, 2);
    console.log("cambiatoJSON")
}

function mese(nMese) {
    document.getElementById('containerForm').style.display = 'block';
    document.getElementById('numMese').value = nMese;
    month;

    switch (nMese) {
        case '1':
            month = 'Gennaio';
            break;
        case '2':
            month = 'Febbraio';
            break;
        case '3':
            month = 'Marzo';
            break;
        case '4':
            month = 'Aprile';
            break;
        case '5':
            month = 'Maggio';
            break;
        case '6':
            month = 'Giugno';
            break;
        case '7':
            month = 'Luglio';
            break;
        case '8':
            month = 'Agosto';
            break;
        case '9':
            month = 'Settembre';
            break;
        case '10':
            month = 'Ottobre';
            break;
        case '11':
            month = 'Novembre';
            break;
        case '12':
            month = 'Dicembre';
            break;
        default:
            month = '';
    }
    document.getElementById('meseTrasc').innerHTML = month;
    document.getElementById('trascrizioniMesi').innerHTML = '';
    let _id = document.getElementById('idPaziente').value;
    let data
    let i = 0
    for (let reg of users[idUser].pazienti[_id].reg) {
        data = reg["data"].split("/")
        if (parseInt(nMese) == parseInt(data[1])) {
            i++
            let frasiMese = document.createElement('div');
            frasiMese.className = 'frasiMese';

            let frase1 = document.createElement('div');
            frase1.className = 'frase1';
            frase1.textContent = reg['testo'];

            let frase2 = document.createElement('div');
            frase2.className = 'frase2';
            frase2.textContent = reg['trascritto'];

            frasiMese.appendChild(frase1);
            frasiMese.appendChild(frase2);

            let trascrizioniMesi = document.getElementById('trascrizioniMesi');
            trascrizioniMesi.appendChild(frasiMese);

        }
    }
    document.getElementById('containerForm').style.display = 'block';
    document.getElementById("meseTrasc").style.display = "block";
    document.getElementById("trascrizioniMesi").style.display = "block";

    if (i == 0) {
        document.getElementById('trascrizioniMesi').innerHTML = 'NON CI SONO TRASCRIZIONI PER QUESTO MESE';
        document.getElementById('containerForm').style.display = 'none';
    }


    caricaForm();
    caricaPosizioni(nMese);
}

function salvaTrascrizione() {
    document.getElementById('tableTrascrizioni').style.display = 'table';
    let testo = document.getElementById('inputTrascrivere').value;
    let trascritto = document.getElementById('outputTrascritto').value;
    let data = new Date().toLocaleDateString();
    let _id = document.getElementById('idPaziente').value;
    let id = users[idUser]['pazienti'][_id]['reg'].length;
    let registrazione = {
        'id': id,
        'testo': testo,
        'trascritto': trascritto,
        'data': data
    };
    users[idUser]['pazienti'][_id]['reg'].push(registrazione);
    users[idUser]['pazienti'][_id]['reg'].forEach((item, index) => {
        item.id = index;
    });
    // fs.writeFileSync(filePath, JSON.stringify(users));
    // ipcRenderer.send('salvaJson', users);
    window.localStorage.setItem('users', JSON.stringify(users));
    caricaTabella(users[idUser]['pazienti'][_id]);
}

function caricaTabella(paziente) {
    if (paziente['reg'].length < 1) {
        document.getElementById('tableTrascrizioni').style.display = 'none';
    }
    else {
        document.getElementById('tableTrascrizioni').style.display = 'table';
    }
    document.getElementById('tobdyPaz').innerHTML = '';
    document.getElementById('idPaziente').value = paziente['id'];
    let _id = paziente['id'];
    for (let i = 0; i <= paziente['reg'].length - 1; i++) {
        let registrazione = paziente['reg'][i];
        //console.log(registrazione);
        let tr = document.createElement('tr');



        let tdId = document.createElement('td');
        tdId.className = 'colored';
        tdId.style.fontWeight = '700';
        tdId.textContent = registrazione['id'];

        let tdFraseOriginale = document.createElement('td');
        tdFraseOriginale.textContent = registrazione['testo'];

        let tdFraseTrascritta = document.createElement('td');
        tdFraseTrascritta.className = 'colored';
        tdFraseTrascritta.textContent = registrazione['trascritto'];

        let tdData = document.createElement('td');
        tdData.textContent = registrazione['data'];


        let tdElimina = document.createElement('td');
        tdElimina.className = 'colored';
        tdElimina.addEventListener('click', () => {
            showPopup();

            let clone = document.getElementById('confirm').cloneNode(true);
            document.getElementById('confirm').replaceWith(clone);

            document.getElementById('confirm').addEventListener('click', function () {
                users[idUser]["pazienti"][_id]["reg"] = users[idUser]["pazienti"][_id]["reg"].filter((item) => item.id !== registrazione['id']);
                users[idUser]["pazienti"][_id]["reg"].forEach((item, index) => {
                    item.id = index;
                });
                caricaTabella(paziente);
                // fs.writeFileSync(filePath, JSON.stringify(users));
                // ipcRenderer.send('salvaJson', users);
                window.localStorage.setItem('users', JSON.stringify(users));

                hidePopup();
            });
        });
        let iElimina = document.createElement('i');
        iElimina.className = 'fa-solid fa-trash';
        tdElimina.append(iElimina);

        tr.append(tdId, tdFraseOriginale, tdFraseTrascritta, tdData, tdElimina);
        document.getElementById('tobdyPaz').append(tr);
    }
}


function salvaPaziente() {
    let inputNomePaz = document.getElementById('inputNomePaz').value;
    let inputCognomePaz = document.getElementById('inputCognomePaz').value;
    let inputDataPaz = document.getElementById('inputDataPaz').value;
    let inputDiagnosiPaz = document.getElementById('inputDiagnosiPaz').value;
    let infoPaz = document.getElementById('infoPaz');
    let divAddPaz = document.getElementById('formPaz');
    let divUtenti = document.getElementById('utenti');

    if (inputNomePaz === "" || inputCognomePaz === "" || inputDataPaz === "" || inputDiagnosiPaz === "") {
        infoPaz.style.display = 'block';
        setTimeout(function () {
            infoPaz.style.display = 'none';
        }, 5000);
    } else {
        infoPaz.style.display = 'none';

        let paziente = {
            "id": 0,
            "nome": inputNomePaz,
            "cognome": inputCognomePaz,
            "dataNascita": inputDataPaz.split('-').reverse().join('/'),
            "diagnosi": inputDiagnosiPaz,
            "mesi": [
                {
                    "mese": 1,
                    "componenti": [
                        {
                            "nome": 1,
                            "valutazione": 0
                        },
                        {
                            "nome": 2,
                            "valutazione": 0
                        },
                        {
                            "nome": 3,
                            "valutazione": 0
                        },
                        {
                            "nome": 4,
                            "valutazione": 0
                        },
                        {
                            "nome": 5,
                            "valutazione": 0
                        },
                        {
                            "nome": 6,
                            "valutazione": 0
                        },
                        {
                            "nome": 7,
                            "valutazione": 0
                        },
                        {
                            "nome": 8,
                            "valutazione": 0
                        },
                        {
                            "nome": 9,
                            "valutazione": 0
                        },
                        {
                            "nome": 10,
                            "valutazione": 0
                        },
                        {
                            "nome": 11,
                            "valutazione": 0
                        },
                        {
                            "nome": 12,
                            "valutazione": 0
                        },
                        {
                            "nome": 13,
                            "valutazione": 0
                        },
                        {
                            "nome": 14,
                            "valutazione": 0
                        },
                        {
                            "nome": 15,
                            "valutazione": 0
                        },
                        {
                            "nome": 16,
                            "valutazione": 0
                        },
                        {
                            "nome": 17,
                            "valutazione": 0
                        },
                        {
                            "nome": 18,
                            "valutazione": 0
                        },
                        {
                            "nome": 19,
                            "valutazione": 0
                        },
                        {
                            "nome": 20,
                            "valutazione": 0
                        },
                        {
                            "nome": 21,
                            "valutazione": 0
                        },
                        {
                            "nome": 22,
                            "valutazione": 0
                        },
                        {
                            "nome": 23,
                            "valutazione": 0
                        },
                        {
                            "nome": 24,
                            "valutazione": 0
                        },
                        {
                            "nome": 25,
                            "valutazione": 0
                        },
                        {
                            "nome": 26,
                            "valutazione": 0
                        },
                        {
                            "nome": 27,
                            "valutazione": 0
                        },
                        {
                            "nome": 28,
                            "valutazione": 0
                        },
                        {
                            "nome": 29,
                            "valutazione": 0
                        },
                        {
                            "nome": 30,
                            "valutazione": 0
                        },
                        {
                            "nome": 31,
                            "valutazione": 0
                        },
                        {
                            "nome": 32,
                            "valutazione": 0
                        },
                        {
                            "nome": 33,
                            "valutazione": 0
                        },
                        {
                            "nome": 34,
                            "valutazione": 0
                        },
                        {
                            "nome": 35,
                            "valutazione": 0
                        },
                        {
                            "nome": 36,
                            "valutazione": 0
                        },
                        {
                            "nome": 37,
                            "valutazione": 0
                        },
                        {
                            "nome": 38,
                            "valutazione": 0
                        },
                        {
                            "nome": 39,
                            "valutazione": 0
                        },
                        {
                            "nome": 40,
                            "valutazione": 0
                        }
                    ]
                },
                {
                    "mese": 2,
                    "componenti": [
                        {
                            "nome": 1,
                            "valutazione": 0
                        },
                        {
                            "nome": 2,
                            "valutazione": 0
                        },
                        {
                            "nome": 3,
                            "valutazione": 0
                        },
                        {
                            "nome": 4,
                            "valutazione": 0
                        },
                        {
                            "nome": 5,
                            "valutazione": 0
                        },
                        {
                            "nome": 6,
                            "valutazione": 0
                        },
                        {
                            "nome": 7,
                            "valutazione": 0
                        },
                        {
                            "nome": 8,
                            "valutazione": 0
                        },
                        {
                            "nome": 9,
                            "valutazione": 0
                        },
                        {
                            "nome": 10,
                            "valutazione": 0
                        },
                        {
                            "nome": 11,
                            "valutazione": 0
                        },
                        {
                            "nome": 12,
                            "valutazione": 0
                        },
                        {
                            "nome": 13,
                            "valutazione": 0
                        },
                        {
                            "nome": 14,
                            "valutazione": 0
                        },
                        {
                            "nome": 15,
                            "valutazione": 0
                        },
                        {
                            "nome": 16,
                            "valutazione": 0
                        },
                        {
                            "nome": 17,
                            "valutazione": 0
                        },
                        {
                            "nome": 18,
                            "valutazione": 0
                        },
                        {
                            "nome": 19,
                            "valutazione": 0
                        },
                        {
                            "nome": 20,
                            "valutazione": 0
                        },
                        {
                            "nome": 21,
                            "valutazione": 0
                        },
                        {
                            "nome": 22,
                            "valutazione": 0
                        },
                        {
                            "nome": 23,
                            "valutazione": 0
                        },
                        {
                            "nome": 24,
                            "valutazione": 0
                        },
                        {
                            "nome": 25,
                            "valutazione": 0
                        },
                        {
                            "nome": 26,
                            "valutazione": 0
                        },
                        {
                            "nome": 27,
                            "valutazione": 0
                        },
                        {
                            "nome": 28,
                            "valutazione": 0
                        },
                        {
                            "nome": 29,
                            "valutazione": 0
                        },
                        {
                            "nome": 30,
                            "valutazione": 0
                        },
                        {
                            "nome": 31,
                            "valutazione": 0
                        },
                        {
                            "nome": 32,
                            "valutazione": 0
                        },
                        {
                            "nome": 33,
                            "valutazione": 0
                        },
                        {
                            "nome": 34,
                            "valutazione": 0
                        },
                        {
                            "nome": 35,
                            "valutazione": 0
                        },
                        {
                            "nome": 36,
                            "valutazione": 0
                        },
                        {
                            "nome": 37,
                            "valutazione": 0
                        },
                        {
                            "nome": 38,
                            "valutazione": 0
                        },
                        {
                            "nome": 39,
                            "valutazione": 0
                        },
                        {
                            "nome": 40,
                            "valutazione": 0
                        }
                    ]
                },
                {
                    "mese": 3,
                    "componenti": [
                        {
                            "nome": 1,
                            "valutazione": 0
                        },
                        {
                            "nome": 2,
                            "valutazione": 0
                        },
                        {
                            "nome": 3,
                            "valutazione": 0
                        },
                        {
                            "nome": 4,
                            "valutazione": 0
                        },
                        {
                            "nome": 5,
                            "valutazione": 0
                        },
                        {
                            "nome": 6,
                            "valutazione": 0
                        },
                        {
                            "nome": 7,
                            "valutazione": 0
                        },
                        {
                            "nome": 8,
                            "valutazione": 0
                        },
                        {
                            "nome": 9,
                            "valutazione": 0
                        },
                        {
                            "nome": 10,
                            "valutazione": 0
                        },
                        {
                            "nome": 11,
                            "valutazione": 0
                        },
                        {
                            "nome": 12,
                            "valutazione": 0
                        },
                        {
                            "nome": 13,
                            "valutazione": 0
                        },
                        {
                            "nome": 14,
                            "valutazione": 0
                        },
                        {
                            "nome": 15,
                            "valutazione": 0
                        },
                        {
                            "nome": 16,
                            "valutazione": 0
                        },
                        {
                            "nome": 17,
                            "valutazione": 0
                        },
                        {
                            "nome": 18,
                            "valutazione": 0
                        },
                        {
                            "nome": 19,
                            "valutazione": 0
                        },
                        {
                            "nome": 20,
                            "valutazione": 0
                        },
                        {
                            "nome": 21,
                            "valutazione": 0
                        },
                        {
                            "nome": 22,
                            "valutazione": 0
                        },
                        {
                            "nome": 23,
                            "valutazione": 0
                        },
                        {
                            "nome": 24,
                            "valutazione": 0
                        },
                        {
                            "nome": 25,
                            "valutazione": 0
                        },
                        {
                            "nome": 26,
                            "valutazione": 0
                        },
                        {
                            "nome": 27,
                            "valutazione": 0
                        },
                        {
                            "nome": 28,
                            "valutazione": 0
                        },
                        {
                            "nome": 29,
                            "valutazione": 0
                        },
                        {
                            "nome": 30,
                            "valutazione": 0
                        },
                        {
                            "nome": 31,
                            "valutazione": 0
                        },
                        {
                            "nome": 32,
                            "valutazione": 0
                        },
                        {
                            "nome": 33,
                            "valutazione": 0
                        },
                        {
                            "nome": 34,
                            "valutazione": 0
                        },
                        {
                            "nome": 35,
                            "valutazione": 0
                        },
                        {
                            "nome": 36,
                            "valutazione": 0
                        },
                        {
                            "nome": 37,
                            "valutazione": 0
                        },
                        {
                            "nome": 38,
                            "valutazione": 0
                        },
                        {
                            "nome": 39,
                            "valutazione": 0
                        },
                        {
                            "nome": 40,
                            "valutazione": 0
                        }
                    ]
                },
                {
                    "mese": 4,
                    "componenti": [
                        {
                            "nome": 1,
                            "valutazione": 0
                        },
                        {
                            "nome": 2,
                            "valutazione": 0
                        },
                        {
                            "nome": 3,
                            "valutazione": 0
                        },
                        {
                            "nome": 4,
                            "valutazione": 0
                        },
                        {
                            "nome": 5,
                            "valutazione": 0
                        },
                        {
                            "nome": 6,
                            "valutazione": 0
                        },
                        {
                            "nome": 7,
                            "valutazione": 0
                        },
                        {
                            "nome": 8,
                            "valutazione": 0
                        },
                        {
                            "nome": 9,
                            "valutazione": 0
                        },
                        {
                            "nome": 10,
                            "valutazione": 0
                        },
                        {
                            "nome": 11,
                            "valutazione": 0
                        },
                        {
                            "nome": 12,
                            "valutazione": 0
                        },
                        {
                            "nome": 13,
                            "valutazione": 0
                        },
                        {
                            "nome": 14,
                            "valutazione": 0
                        },
                        {
                            "nome": 15,
                            "valutazione": 0
                        },
                        {
                            "nome": 16,
                            "valutazione": 0
                        },
                        {
                            "nome": 17,
                            "valutazione": 0
                        },
                        {
                            "nome": 18,
                            "valutazione": 0
                        },
                        {
                            "nome": 19,
                            "valutazione": 0
                        },
                        {
                            "nome": 20,
                            "valutazione": 0
                        },
                        {
                            "nome": 21,
                            "valutazione": 0
                        },
                        {
                            "nome": 22,
                            "valutazione": 0
                        },
                        {
                            "nome": 23,
                            "valutazione": 0
                        },
                        {
                            "nome": 24,
                            "valutazione": 0
                        },
                        {
                            "nome": 25,
                            "valutazione": 0
                        },
                        {
                            "nome": 26,
                            "valutazione": 0
                        },
                        {
                            "nome": 27,
                            "valutazione": 0
                        },
                        {
                            "nome": 28,
                            "valutazione": 0
                        },
                        {
                            "nome": 29,
                            "valutazione": 0
                        },
                        {
                            "nome": 30,
                            "valutazione": 0
                        },
                        {
                            "nome": 31,
                            "valutazione": 0
                        },
                        {
                            "nome": 32,
                            "valutazione": 0
                        },
                        {
                            "nome": 33,
                            "valutazione": 0
                        },
                        {
                            "nome": 34,
                            "valutazione": 0
                        },
                        {
                            "nome": 35,
                            "valutazione": 0
                        },
                        {
                            "nome": 36,
                            "valutazione": 0
                        },
                        {
                            "nome": 37,
                            "valutazione": 0
                        },
                        {
                            "nome": 38,
                            "valutazione": 0
                        },
                        {
                            "nome": 39,
                            "valutazione": 0
                        },
                        {
                            "nome": 40,
                            "valutazione": 0
                        }
                    ]
                },
                {
                    "mese": 5,
                    "componenti": [
                        {
                            "nome": 1,
                            "valutazione": 0
                        },
                        {
                            "nome": 2,
                            "valutazione": 0
                        },
                        {
                            "nome": 3,
                            "valutazione": 0
                        },
                        {
                            "nome": 4,
                            "valutazione": 0
                        },
                        {
                            "nome": 5,
                            "valutazione": 0
                        },
                        {
                            "nome": 6,
                            "valutazione": 0
                        },
                        {
                            "nome": 7,
                            "valutazione": 0
                        },
                        {
                            "nome": 8,
                            "valutazione": 0
                        },
                        {
                            "nome": 9,
                            "valutazione": 0
                        },
                        {
                            "nome": 10,
                            "valutazione": 0
                        },
                        {
                            "nome": 11,
                            "valutazione": 0
                        },
                        {
                            "nome": 12,
                            "valutazione": 0
                        },
                        {
                            "nome": 13,
                            "valutazione": 0
                        },
                        {
                            "nome": 14,
                            "valutazione": 0
                        },
                        {
                            "nome": 15,
                            "valutazione": 0
                        },
                        {
                            "nome": 16,
                            "valutazione": 0
                        },
                        {
                            "nome": 17,
                            "valutazione": 0
                        },
                        {
                            "nome": 18,
                            "valutazione": 0
                        },
                        {
                            "nome": 19,
                            "valutazione": 0
                        },
                        {
                            "nome": 20,
                            "valutazione": 0
                        },
                        {
                            "nome": 21,
                            "valutazione": 0
                        },
                        {
                            "nome": 22,
                            "valutazione": 0
                        },
                        {
                            "nome": 23,
                            "valutazione": 0
                        },
                        {
                            "nome": 24,
                            "valutazione": 0
                        },
                        {
                            "nome": 25,
                            "valutazione": 0
                        },
                        {
                            "nome": 26,
                            "valutazione": 0
                        },
                        {
                            "nome": 27,
                            "valutazione": 0
                        },
                        {
                            "nome": 28,
                            "valutazione": 0
                        },
                        {
                            "nome": 29,
                            "valutazione": 0
                        },
                        {
                            "nome": 30,
                            "valutazione": 0
                        },
                        {
                            "nome": 31,
                            "valutazione": 0
                        },
                        {
                            "nome": 32,
                            "valutazione": 0
                        },
                        {
                            "nome": 33,
                            "valutazione": 0
                        },
                        {
                            "nome": 34,
                            "valutazione": 0
                        },
                        {
                            "nome": 35,
                            "valutazione": 0
                        },
                        {
                            "nome": 36,
                            "valutazione": 0
                        },
                        {
                            "nome": 37,
                            "valutazione": 0
                        },
                        {
                            "nome": 38,
                            "valutazione": 0
                        },
                        {
                            "nome": 39,
                            "valutazione": 0
                        },
                        {
                            "nome": 40,
                            "valutazione": 0
                        }
                    ]
                },
                {
                    "mese": 6,
                    "componenti": [
                        {
                            "nome": 1,
                            "valutazione": 0
                        },
                        {
                            "nome": 2,
                            "valutazione": 0
                        },
                        {
                            "nome": 3,
                            "valutazione": 0
                        },
                        {
                            "nome": 4,
                            "valutazione": 0
                        },
                        {
                            "nome": 5,
                            "valutazione": 0
                        },
                        {
                            "nome": 6,
                            "valutazione": 0
                        },
                        {
                            "nome": 7,
                            "valutazione": 0
                        },
                        {
                            "nome": 8,
                            "valutazione": 0
                        },
                        {
                            "nome": 9,
                            "valutazione": 0
                        },
                        {
                            "nome": 10,
                            "valutazione": 0
                        },
                        {
                            "nome": 11,
                            "valutazione": 0
                        },
                        {
                            "nome": 12,
                            "valutazione": 0
                        },
                        {
                            "nome": 13,
                            "valutazione": 0
                        },
                        {
                            "nome": 14,
                            "valutazione": 0
                        },
                        {
                            "nome": 15,
                            "valutazione": 0
                        },
                        {
                            "nome": 16,
                            "valutazione": 0
                        },
                        {
                            "nome": 17,
                            "valutazione": 0
                        },
                        {
                            "nome": 18,
                            "valutazione": 0
                        },
                        {
                            "nome": 19,
                            "valutazione": 0
                        },
                        {
                            "nome": 20,
                            "valutazione": 0
                        },
                        {
                            "nome": 21,
                            "valutazione": 0
                        },
                        {
                            "nome": 22,
                            "valutazione": 0
                        },
                        {
                            "nome": 23,
                            "valutazione": 0
                        },
                        {
                            "nome": 24,
                            "valutazione": 0
                        },
                        {
                            "nome": 25,
                            "valutazione": 0
                        },
                        {
                            "nome": 26,
                            "valutazione": 0
                        },
                        {
                            "nome": 27,
                            "valutazione": 0
                        },
                        {
                            "nome": 28,
                            "valutazione": 0
                        },
                        {
                            "nome": 29,
                            "valutazione": 0
                        },
                        {
                            "nome": 30,
                            "valutazione": 0
                        },
                        {
                            "nome": 31,
                            "valutazione": 0
                        },
                        {
                            "nome": 32,
                            "valutazione": 0
                        },
                        {
                            "nome": 33,
                            "valutazione": 0
                        },
                        {
                            "nome": 34,
                            "valutazione": 0
                        },
                        {
                            "nome": 35,
                            "valutazione": 0
                        },
                        {
                            "nome": 36,
                            "valutazione": 0
                        },
                        {
                            "nome": 37,
                            "valutazione": 0
                        },
                        {
                            "nome": 38,
                            "valutazione": 0
                        },
                        {
                            "nome": 39,
                            "valutazione": 0
                        },
                        {
                            "nome": 40,
                            "valutazione": 0
                        }
                    ]
                },
                {
                    "mese": 7,
                    "componenti": [
                        {
                            "nome": 1,
                            "valutazione": 0
                        },
                        {
                            "nome": 2,
                            "valutazione": 0
                        },
                        {
                            "nome": 3,
                            "valutazione": 0
                        },
                        {
                            "nome": 4,
                            "valutazione": 0
                        },
                        {
                            "nome": 5,
                            "valutazione": 0
                        },
                        {
                            "nome": 6,
                            "valutazione": 0
                        },
                        {
                            "nome": 7,
                            "valutazione": 0
                        },
                        {
                            "nome": 8,
                            "valutazione": 0
                        },
                        {
                            "nome": 9,
                            "valutazione": 0
                        },
                        {
                            "nome": 10,
                            "valutazione": 0
                        },
                        {
                            "nome": 11,
                            "valutazione": 0
                        },
                        {
                            "nome": 12,
                            "valutazione": 0
                        },
                        {
                            "nome": 13,
                            "valutazione": 0
                        },
                        {
                            "nome": 14,
                            "valutazione": 0
                        },
                        {
                            "nome": 15,
                            "valutazione": 0
                        },
                        {
                            "nome": 16,
                            "valutazione": 0
                        },
                        {
                            "nome": 17,
                            "valutazione": 0
                        },
                        {
                            "nome": 18,
                            "valutazione": 0
                        },
                        {
                            "nome": 19,
                            "valutazione": 0
                        },
                        {
                            "nome": 20,
                            "valutazione": 0
                        },
                        {
                            "nome": 21,
                            "valutazione": 0
                        },
                        {
                            "nome": 22,
                            "valutazione": 0
                        },
                        {
                            "nome": 23,
                            "valutazione": 0
                        },
                        {
                            "nome": 24,
                            "valutazione": 0
                        },
                        {
                            "nome": 25,
                            "valutazione": 0
                        },
                        {
                            "nome": 26,
                            "valutazione": 0
                        },
                        {
                            "nome": 27,
                            "valutazione": 0
                        },
                        {
                            "nome": 28,
                            "valutazione": 0
                        },
                        {
                            "nome": 29,
                            "valutazione": 0
                        },
                        {
                            "nome": 30,
                            "valutazione": 0
                        },
                        {
                            "nome": 31,
                            "valutazione": 0
                        },
                        {
                            "nome": 32,
                            "valutazione": 0
                        },
                        {
                            "nome": 33,
                            "valutazione": 0
                        },
                        {
                            "nome": 34,
                            "valutazione": 0
                        },
                        {
                            "nome": 35,
                            "valutazione": 0
                        },
                        {
                            "nome": 36,
                            "valutazione": 0
                        },
                        {
                            "nome": 37,
                            "valutazione": 0
                        },
                        {
                            "nome": 38,
                            "valutazione": 0
                        },
                        {
                            "nome": 39,
                            "valutazione": 0
                        },
                        {
                            "nome": 40,
                            "valutazione": 0
                        }
                    ]
                },
                {
                    "mese": 8,
                    "componenti": [
                        {
                            "nome": 1,
                            "valutazione": 0
                        },
                        {
                            "nome": 2,
                            "valutazione": 0
                        },
                        {
                            "nome": 3,
                            "valutazione": 0
                        },
                        {
                            "nome": 4,
                            "valutazione": 0
                        },
                        {
                            "nome": 5,
                            "valutazione": 0
                        },
                        {
                            "nome": 6,
                            "valutazione": 0
                        },
                        {
                            "nome": 7,
                            "valutazione": 0
                        },
                        {
                            "nome": 8,
                            "valutazione": 0
                        },
                        {
                            "nome": 9,
                            "valutazione": 0
                        },
                        {
                            "nome": 10,
                            "valutazione": 0
                        },
                        {
                            "nome": 11,
                            "valutazione": 0
                        },
                        {
                            "nome": 12,
                            "valutazione": 0
                        },
                        {
                            "nome": 13,
                            "valutazione": 0
                        },
                        {
                            "nome": 14,
                            "valutazione": 0
                        },
                        {
                            "nome": 15,
                            "valutazione": 0
                        },
                        {
                            "nome": 16,
                            "valutazione": 0
                        },
                        {
                            "nome": 17,
                            "valutazione": 0
                        },
                        {
                            "nome": 18,
                            "valutazione": 0
                        },
                        {
                            "nome": 19,
                            "valutazione": 0
                        },
                        {
                            "nome": 20,
                            "valutazione": 0
                        },
                        {
                            "nome": 21,
                            "valutazione": 0
                        },
                        {
                            "nome": 22,
                            "valutazione": 0
                        },
                        {
                            "nome": 23,
                            "valutazione": 0
                        },
                        {
                            "nome": 24,
                            "valutazione": 0
                        },
                        {
                            "nome": 25,
                            "valutazione": 0
                        },
                        {
                            "nome": 26,
                            "valutazione": 0
                        },
                        {
                            "nome": 27,
                            "valutazione": 0
                        },
                        {
                            "nome": 28,
                            "valutazione": 0
                        },
                        {
                            "nome": 29,
                            "valutazione": 0
                        },
                        {
                            "nome": 30,
                            "valutazione": 0
                        },
                        {
                            "nome": 31,
                            "valutazione": 0
                        },
                        {
                            "nome": 32,
                            "valutazione": 0
                        },
                        {
                            "nome": 33,
                            "valutazione": 0
                        },
                        {
                            "nome": 34,
                            "valutazione": 0
                        },
                        {
                            "nome": 35,
                            "valutazione": 0
                        },
                        {
                            "nome": 36,
                            "valutazione": 0
                        },
                        {
                            "nome": 37,
                            "valutazione": 0
                        },
                        {
                            "nome": 38,
                            "valutazione": 0
                        },
                        {
                            "nome": 39,
                            "valutazione": 0
                        },
                        {
                            "nome": 40,
                            "valutazione": 0
                        }
                    ]
                },
                {
                    "mese": 9,
                    "componenti": [
                        {
                            "nome": 1,
                            "valutazione": 0
                        },
                        {
                            "nome": 2,
                            "valutazione": 0
                        },
                        {
                            "nome": 3,
                            "valutazione": 0
                        },
                        {
                            "nome": 4,
                            "valutazione": 0
                        },
                        {
                            "nome": 5,
                            "valutazione": 0
                        },
                        {
                            "nome": 6,
                            "valutazione": 0
                        },
                        {
                            "nome": 7,
                            "valutazione": 0
                        },
                        {
                            "nome": 8,
                            "valutazione": 0
                        },
                        {
                            "nome": 9,
                            "valutazione": 0
                        },
                        {
                            "nome": 10,
                            "valutazione": 0
                        },
                        {
                            "nome": 11,
                            "valutazione": 0
                        },
                        {
                            "nome": 12,
                            "valutazione": 0
                        },
                        {
                            "nome": 13,
                            "valutazione": 0
                        },
                        {
                            "nome": 14,
                            "valutazione": 0
                        },
                        {
                            "nome": 15,
                            "valutazione": 0
                        },
                        {
                            "nome": 16,
                            "valutazione": 0
                        },
                        {
                            "nome": 17,
                            "valutazione": 0
                        },
                        {
                            "nome": 18,
                            "valutazione": 0
                        },
                        {
                            "nome": 19,
                            "valutazione": 0
                        },
                        {
                            "nome": 20,
                            "valutazione": 0
                        },
                        {
                            "nome": 21,
                            "valutazione": 0
                        },
                        {
                            "nome": 22,
                            "valutazione": 0
                        },
                        {
                            "nome": 23,
                            "valutazione": 0
                        },
                        {
                            "nome": 24,
                            "valutazione": 0
                        },
                        {
                            "nome": 25,
                            "valutazione": 0
                        },
                        {
                            "nome": 26,
                            "valutazione": 0
                        },
                        {
                            "nome": 27,
                            "valutazione": 0
                        },
                        {
                            "nome": 28,
                            "valutazione": 0
                        },
                        {
                            "nome": 29,
                            "valutazione": 0
                        },
                        {
                            "nome": 30,
                            "valutazione": 0
                        },
                        {
                            "nome": 31,
                            "valutazione": 0
                        },
                        {
                            "nome": 32,
                            "valutazione": 0
                        },
                        {
                            "nome": 33,
                            "valutazione": 0
                        },
                        {
                            "nome": 34,
                            "valutazione": 0
                        },
                        {
                            "nome": 35,
                            "valutazione": 0
                        },
                        {
                            "nome": 36,
                            "valutazione": 0
                        },
                        {
                            "nome": 37,
                            "valutazione": 0
                        },
                        {
                            "nome": 38,
                            "valutazione": 0
                        },
                        {
                            "nome": 39,
                            "valutazione": 0
                        },
                        {
                            "nome": 40,
                            "valutazione": 0
                        }
                    ]
                },
                {
                    "mese": 10,
                    "componenti": [
                        {
                            "nome": 1,
                            "valutazione": 0
                        },
                        {
                            "nome": 2,
                            "valutazione": 0
                        },
                        {
                            "nome": 3,
                            "valutazione": 0
                        },
                        {
                            "nome": 4,
                            "valutazione": 0
                        },
                        {
                            "nome": 5,
                            "valutazione": 0
                        },
                        {
                            "nome": 6,
                            "valutazione": 0
                        },
                        {
                            "nome": 7,
                            "valutazione": 0
                        },
                        {
                            "nome": 8,
                            "valutazione": 0
                        },
                        {
                            "nome": 9,
                            "valutazione": 0
                        },
                        {
                            "nome": 10,
                            "valutazione": 0
                        },
                        {
                            "nome": 11,
                            "valutazione": 0
                        },
                        {
                            "nome": 12,
                            "valutazione": 0
                        },
                        {
                            "nome": 13,
                            "valutazione": 0
                        },
                        {
                            "nome": 14,
                            "valutazione": 0
                        },
                        {
                            "nome": 15,
                            "valutazione": 0
                        },
                        {
                            "nome": 16,
                            "valutazione": 0
                        },
                        {
                            "nome": 17,
                            "valutazione": 0
                        },
                        {
                            "nome": 18,
                            "valutazione": 0
                        },
                        {
                            "nome": 19,
                            "valutazione": 0
                        },
                        {
                            "nome": 20,
                            "valutazione": 0
                        },
                        {
                            "nome": 21,
                            "valutazione": 0
                        },
                        {
                            "nome": 22,
                            "valutazione": 0
                        },
                        {
                            "nome": 23,
                            "valutazione": 0
                        },
                        {
                            "nome": 24,
                            "valutazione": 0
                        },
                        {
                            "nome": 25,
                            "valutazione": 0
                        },
                        {
                            "nome": 26,
                            "valutazione": 0
                        },
                        {
                            "nome": 27,
                            "valutazione": 0
                        },
                        {
                            "nome": 28,
                            "valutazione": 0
                        },
                        {
                            "nome": 29,
                            "valutazione": 0
                        },
                        {
                            "nome": 30,
                            "valutazione": 0
                        },
                        {
                            "nome": 31,
                            "valutazione": 0
                        },
                        {
                            "nome": 32,
                            "valutazione": 0
                        },
                        {
                            "nome": 33,
                            "valutazione": 0
                        },
                        {
                            "nome": 34,
                            "valutazione": 0
                        },
                        {
                            "nome": 35,
                            "valutazione": 0
                        },
                        {
                            "nome": 36,
                            "valutazione": 0
                        },
                        {
                            "nome": 37,
                            "valutazione": 0
                        },
                        {
                            "nome": 38,
                            "valutazione": 0
                        },
                        {
                            "nome": 39,
                            "valutazione": 0
                        },
                        {
                            "nome": 40,
                            "valutazione": 0
                        }
                    ]
                },
                {
                    "mese": 11,
                    "componenti": [
                        {
                            "nome": 1,
                            "valutazione": 0
                        },
                        {
                            "nome": 2,
                            "valutazione": 0
                        },
                        {
                            "nome": 3,
                            "valutazione": 0
                        },
                        {
                            "nome": 4,
                            "valutazione": 0
                        },
                        {
                            "nome": 5,
                            "valutazione": 0
                        },
                        {
                            "nome": 6,
                            "valutazione": 0
                        },
                        {
                            "nome": 7,
                            "valutazione": 0
                        },
                        {
                            "nome": 8,
                            "valutazione": 0
                        },
                        {
                            "nome": 9,
                            "valutazione": 0
                        },
                        {
                            "nome": 10,
                            "valutazione": 0
                        },
                        {
                            "nome": 11,
                            "valutazione": 0
                        },
                        {
                            "nome": 12,
                            "valutazione": 0
                        },
                        {
                            "nome": 13,
                            "valutazione": 0
                        },
                        {
                            "nome": 14,
                            "valutazione": 0
                        },
                        {
                            "nome": 15,
                            "valutazione": 0
                        },
                        {
                            "nome": 16,
                            "valutazione": 0
                        },
                        {
                            "nome": 17,
                            "valutazione": 0
                        },
                        {
                            "nome": 18,
                            "valutazione": 0
                        },
                        {
                            "nome": 19,
                            "valutazione": 0
                        },
                        {
                            "nome": 20,
                            "valutazione": 0
                        },
                        {
                            "nome": 21,
                            "valutazione": 0
                        },
                        {
                            "nome": 22,
                            "valutazione": 0
                        },
                        {
                            "nome": 23,
                            "valutazione": 0
                        },
                        {
                            "nome": 24,
                            "valutazione": 0
                        },
                        {
                            "nome": 25,
                            "valutazione": 0
                        },
                        {
                            "nome": 26,
                            "valutazione": 0
                        },
                        {
                            "nome": 27,
                            "valutazione": 0
                        },
                        {
                            "nome": 28,
                            "valutazione": 0
                        },
                        {
                            "nome": 29,
                            "valutazione": 0
                        },
                        {
                            "nome": 30,
                            "valutazione": 0
                        },
                        {
                            "nome": 31,
                            "valutazione": 0
                        },
                        {
                            "nome": 32,
                            "valutazione": 0
                        },
                        {
                            "nome": 33,
                            "valutazione": 0
                        },
                        {
                            "nome": 34,
                            "valutazione": 0
                        },
                        {
                            "nome": 35,
                            "valutazione": 0
                        },
                        {
                            "nome": 36,
                            "valutazione": 0
                        },
                        {
                            "nome": 37,
                            "valutazione": 0
                        },
                        {
                            "nome": 38,
                            "valutazione": 0
                        },
                        {
                            "nome": 39,
                            "valutazione": 0
                        },
                        {
                            "nome": 40,
                            "valutazione": 0
                        }
                    ]
                },
                {
                    "mese": 12,
                    "componenti": [
                        {
                            "nome": 1,
                            "valutazione": 0
                        },
                        {
                            "nome": 2,
                            "valutazione": 0
                        },
                        {
                            "nome": 3,
                            "valutazione": 0
                        },
                        {
                            "nome": 4,
                            "valutazione": 0
                        },
                        {
                            "nome": 5,
                            "valutazione": 0
                        },
                        {
                            "nome": 6,
                            "valutazione": 0
                        },
                        {
                            "nome": 7,
                            "valutazione": 0
                        },
                        {
                            "nome": 8,
                            "valutazione": 0
                        },
                        {
                            "nome": 9,
                            "valutazione": 0
                        },
                        {
                            "nome": 10,
                            "valutazione": 0
                        },
                        {
                            "nome": 11,
                            "valutazione": 0
                        },
                        {
                            "nome": 12,
                            "valutazione": 0
                        },
                        {
                            "nome": 13,
                            "valutazione": 0
                        },
                        {
                            "nome": 14,
                            "valutazione": 0
                        },
                        {
                            "nome": 15,
                            "valutazione": 0
                        },
                        {
                            "nome": 16,
                            "valutazione": 0
                        },
                        {
                            "nome": 17,
                            "valutazione": 0
                        },
                        {
                            "nome": 18,
                            "valutazione": 0
                        },
                        {
                            "nome": 19,
                            "valutazione": 0
                        },
                        {
                            "nome": 20,
                            "valutazione": 0
                        },
                        {
                            "nome": 21,
                            "valutazione": 0
                        },
                        {
                            "nome": 22,
                            "valutazione": 0
                        },
                        {
                            "nome": 23,
                            "valutazione": 0
                        },
                        {
                            "nome": 24,
                            "valutazione": 0
                        },
                        {
                            "nome": 25,
                            "valutazione": 0
                        },
                        {
                            "nome": 26,
                            "valutazione": 0
                        },
                        {
                            "nome": 27,
                            "valutazione": 0
                        },
                        {
                            "nome": 28,
                            "valutazione": 0
                        },
                        {
                            "nome": 29,
                            "valutazione": 0
                        },
                        {
                            "nome": 30,
                            "valutazione": 0
                        },
                        {
                            "nome": 31,
                            "valutazione": 0
                        },
                        {
                            "nome": 32,
                            "valutazione": 0
                        },
                        {
                            "nome": 33,
                            "valutazione": 0
                        },
                        {
                            "nome": 34,
                            "valutazione": 0
                        },
                        {
                            "nome": 35,
                            "valutazione": 0
                        },
                        {
                            "nome": 36,
                            "valutazione": 0
                        },
                        {
                            "nome": 37,
                            "valutazione": 0
                        },
                        {
                            "nome": 38,
                            "valutazione": 0
                        },
                        {
                            "nome": 39,
                            "valutazione": 0
                        },
                        {
                            "nome": 40,
                            "valutazione": 0
                        }
                    ]
                }
            ],
            "reg": [],
        };

        console.log(idUser)
        users[idUser]['pazienti'].push(paziente);
        users[idUser]['pazienti'].forEach((item, index) => {
            item.id = index;
        });
        // fs.writeFileSync(filePath, JSON.stringify(users));
        // ipcRenderer.send('salvaJson', users);
        window.localStorage.setItem('users', JSON.stringify(users));

        caricaUtenti(paziente);

        divAddPaz.style.display = 'none';
        divUtenti.style.display = 'flex';

    }
}

function caricaUtenti(paziente) {
    let divPaziente = document.createElement('div');
    divPaziente.className = 'paziente';

    divPaziente.addEventListener('click', () => {

        document.getElementById('inputTrascrivere').value = "";
        document.getElementById('outputTrascritto').value = "";


        caricaTabella(paziente);
    });


    let divNomePaz = document.createElement('div');
    divNomePaz.className = 'nomePaz';
    divNomePaz.textContent = paziente['nome'] + ' ' + paziente['cognome'];

    let divDataPaz = document.createElement('div');
    divDataPaz.className = 'dataPaz';
    divDataPaz.textContent = paziente['dataNascita'];

    let divDiagnosiPaz = document.createElement('div');
    divDiagnosiPaz.className = 'diagnosiPaz';
    divDiagnosiPaz.textContent = paziente['diagnosi'];

    let divNomePazN = document.createElement('div');
    divNomePazN.className = 'nomePazN';
    divNomePazN.textContent = paziente['nome'][0];
    for (let i = 1; i < paziente['nome'].length; i++) {
        divNomePazN.textContent += "*";
    }
    divNomePazN.textContent += ' ' + paziente['cognome'][0];
    for (let i = 1; i < paziente['cognome'].length; i++) {
        divNomePazN.textContent += "*";
    }

    divPaziente.append(divNomePaz, divNomePazN, divDataPaz, divDiagnosiPaz);

    let divUtentiPazienti = document.getElementById('utenti');
    let hr = divUtentiPazienti.querySelector('hr');
    divUtentiPazienti.insertBefore(divPaziente, hr);
    divNomePazN.style.display = 'none';


}

function showPopup() {
    document.getElementById('popup').classList.remove('popup-hidden');
    document.getElementById('popup').classList.add('popup-visible');
    document.getElementById('overlay').classList.remove('overlay-hidden');
    document.getElementById('overlay').classList.add('overlay-visible');
}

// Funzione per nascondere il popup e l'overlay
function hidePopup() {
    document.getElementById('popup').classList.remove('popup-visible');
    document.getElementById('popup').classList.add('popup-hidden');
    document.getElementById('overlay').classList.remove('overlay-visible');
    document.getElementById('overlay').classList.add('overlay-hidden');
}


// ============================================= LOGIN =============================================
function accedi() {
    let txtUsername = document.getElementById('txtUsername').value;
    let txtPassword = document.getElementById('txtPassword').value;
    let trovato = false;
    console.log(users)
    if (users.length == 0) {
        document.getElementById('errAcc').style.display = 'block';
        setTimeout(function () {
            document.getElementById('errAcc').style.display = 'none';
        }, 5000);
    }
    for (let utente of users) {
        if (utente.username == txtUsername && utente.password == txtPassword) {
            document.getElementById("nomeLogop").innerHTML = utente.nome + " " + utente.cognome;
            idUser = utente.id;
            console.log("Utente trovato");
            console.log(utente);
            trovato = true;
            document.getElementById('logged').style.display = 'block';
            document.getElementById('loginHome').style.display = 'none';

            let num = Math.floor(Math.random() * 4) + 1;
            if (num == 1) {
                document.getElementById("overlayNew").classList.remove('overlay-hidden');
            }
            for (let paziente of utente.pazienti) {
                caricaUtenti(paziente);
            }
            boolAcc = false;
            break;
        }
        if (!trovato) {
            console.log("Utente non trovato");
            document.getElementById('errAcc').style.display = 'block';
            setTimeout(function () {
                document.getElementById('errAcc').style.display = 'none';
            }, 5000);
        }
    }
}
function registrati() {
    let txtNome = document.getElementById('txtNome').value;
    let txtCognome = document.getElementById('txtCognome').value;
    let txtUsernameRegistrato = document.getElementById('txtUsernameRegistrato').value;
    let txtPasswordRegistrato = document.getElementById('txtPasswordRegistrato').value;
    let leng;
    if (users == null) {
        leng = 0;
    }
    else {
        leng = users.length;
    }
    let newUser = {
        "id": leng,
        "nome": txtNome,
        "cognome": txtCognome,
        "username": txtUsernameRegistrato,
        "password": txtPasswordRegistrato,
        "pazienti": []
    }
    let trovatoUsername = false;
    if (txtNome == "" || txtCognome == "" || txtUsernameRegistrato == "" || txtPasswordRegistrato == "") {
        console.log("Compilare tutti i campi");
        document.getElementById('errReg').style.display = 'block';
        document.getElementById('errReg').textContent = 'Compilare tutti i campi';
        setTimeout(function () {
            document.getElementById('errReg').style.display = 'none';
        }, 5000);
    } else {
        for (let utente of users) {
            if (utente.username == newUser.username) {
                trovatoUsername = true;
                break;
            }
        }
        if (!trovatoUsername) {
            users.push(newUser);
            users.forEach((item, index) => {
                item.id = index;
            });
            idUser = newUser.id;
            // fs.writeFileSync(filePath, JSON.stringify(users));
            // ipcRenderer.send('salvaJson', users);
            window.localStorage.setItem('users', JSON.stringify(users));
            document.getElementById('logged').style.display = 'block';
            document.getElementById('loginHome').style.display = 'none';
            document.getElementById("nomeLogop").innerHTML = txtNome + " " + txtCognome;
            boolAcc = false;
        }
        else {
            console.log("Username già esistente");
            document.getElementById('errReg').style.display = 'block';
            document.getElementById('errReg').textContent = 'Username già esistente';
            setTimeout(function () {
                document.getElementById('errReg').style.display = 'none';
            }, 5000);
        }
    }
}



function caricaSchedaUser() {
    let _id = document.getElementById('idPaziente').value;
    console.log(users[idUser]['pazienti'][_id]);
    let paziente = users[idUser]['pazienti'][_id];
    document.getElementById('schedaNomeN').innerHTML = paziente.nome[0];
    for (let i = 1; i < paziente.nome.length; i++) {
        document.getElementById('schedaNomeN').textContent += "*";
    }
    document.getElementById('schedaNomeN').innerHTML += " " + paziente.cognome[0];
    for (let i = 1; i < paziente.cognome.length; i++) {
        document.getElementById('schedaNomeN').textContent += "*";
    }
    document.getElementById('schedaNome').innerHTML = paziente.nome + " " + paziente.cognome;
    document.getElementById('schedaNascita').innerHTML = paziente.dataNascita;
    document.getElementById('schedaDiagnosi').innerHTML = paziente.diagnosi;


}

function caricaForm() {
    let _id = document.getElementById('idPaziente').value;
    let paziente = users[idUser]['pazienti'][_id];
    let nMese = document.getElementById('numMese').value - 1;
    for (let comp of paziente['mesi'][nMese]["componenti"]) {
        if (comp.nome == 1) {
            let radioButtons = document.querySelectorAll('input[type="radio"][name="morfolgia_libera"]');

            radioButtons.forEach(function (button) {
                button.checked = false;
            });
            if (comp.valutazione == 1) {
                let radio = document.querySelectorAll('input[name="morfolgia_libera"][value="corretto"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 2) {
                let radio = document.querySelectorAll('input[name="morfolgia_libera"][value="attenzione"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 3) {
                let radio = document.querySelectorAll('input[name="morfolgia_libera"][value="critico"]');
                radio[0].checked = true;
            }
        }
        if (comp.nome == 2) {
            let radioButtons = document.querySelectorAll('input[type="radio"][name="argomento"]');

            radioButtons.forEach(function (button) {
                button.checked = false;
            });
            if (comp.valutazione == 1) {
                let radio = document.querySelectorAll('input[name="argomento"][value="corretto"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 2) {
                let radio = document.querySelectorAll('input[name="argomento"][value="attenzione"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 3) {
                let radio = document.querySelectorAll('input[name="argomento"][value="critico"]');
                radio[0].checked = true;
            }
        }

        if (comp.nome == 3) {
            let radioButtons = document.querySelectorAll('input[type="radio"][name="morfolgia_legata"]');

            radioButtons.forEach(function (button) {
                button.checked = false;
            });
            if (comp.valutazione == 1) {
                let radio = document.querySelectorAll('input[name="morfolgia_legata"][value="corretto"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 2) {
                let radio = document.querySelectorAll('input[name="morfolgia_legata"][value="attenzione"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 3) {
                let radio = document.querySelectorAll('input[name="morfolgia_legata"][value="critico"]');
                radio[0].checked = true;
            }
        }

        if (comp.nome == 4) {
            let radioButtons = document.querySelectorAll('input[type="radio"][name="predicato"]');

            radioButtons.forEach(function (button) {
                button.checked = false;
            });
            if (comp.valutazione == 1) {
                let radio = document.querySelectorAll('input[name="predicato"][value="corretto"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 2) {
                let radio = document.querySelectorAll('input[name="predicato"][value="attenzione"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 3) {
                let radio = document.querySelectorAll('input[name="predicato"][value="critico"]');
                radio[0].checked = true;
            }
        }

        if (comp.nome == 5) {
            let radioButtons = document.querySelectorAll('input[type="radio"][name="morfolgia_legata_predicato"]');

            radioButtons.forEach(function (button) {
                button.checked = false;
            });
            if (comp.valutazione == 1) {
                let radio = document.querySelectorAll('input[name="morfolgia_legata_predicato"][value="corretto"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 2) {
                let radio = document.querySelectorAll('input[name="morfolgia_legata_predicato"][value="attenzione"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 3) {
                let radio = document.querySelectorAll('input[name="morfolgia_legata_predicato"][value="critico"]');
                radio[0].checked = true;
            }
        }

        if (comp.nome == 6) {
            let radioButtons = document.querySelectorAll('input[type="radio"][name="morfolgia_libera_2"]');

            radioButtons.forEach(function (button) {
                button.checked = false;
            });
            if (comp.valutazione == 1) {
                let radio = document.querySelectorAll('input[name="morfolgia_libera_2"][value="corretto"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 2) {
                let radio = document.querySelectorAll('input[name="morfolgia_libera_2"][value="attenzione"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 3) {
                let radio = document.querySelectorAll('input[name="morfolgia_libera_2"][value="critico"]');
                radio[0].checked = true;
            }
        }

        if (comp.nome == 7) {
            let radioButtons = document.querySelectorAll('input[type="radio"][name="argomento_2"]');

            radioButtons.forEach(function (button) {
                button.checked = false;
            });
            if (comp.valutazione == 1) {
                let radio = document.querySelectorAll('input[name="argomento_2"][value="corretto"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 2) {
                let radio = document.querySelectorAll('input[name="argomento_2"][value="attenzione"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 3) {
                let radio = document.querySelectorAll('input[name="argomento_2"][value="critico"]');
                radio[0].checked = true;
            }
        }

        if (comp.nome == 8) {
            let radioButtons = document.querySelectorAll('input[type="radio"][name="morfolgia_legata_2"]');

            radioButtons.forEach(function (button) {
                button.checked = false;
            });
            if (comp.valutazione == 1) {
                let radio = document.querySelectorAll('input[name="morfolgia_legata_2"][value="corretto"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 2) {
                let radio = document.querySelectorAll('input[name="morfolgia_legata_2"][value="attenzione"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 3) {
                let radio = document.querySelectorAll('input[name="morfolgia_legata_2"][value="critico"]');
                radio[0].checked = true;
            }
        }

        if (comp.nome == 9) {
            let radioButtons = document.querySelectorAll('input[type="radio"][name="predicato_2"]');

            radioButtons.forEach(function (button) {
                button.checked = false;
            });
            if (comp.valutazione == 1) {
                let radio = document.querySelectorAll('input[name="predicato_2"][value="corretto"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 2) {
                let radio = document.querySelectorAll('input[name="predicato_2"][value="attenzione"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 3) {
                let radio = document.querySelectorAll('input[name="predicato_2"][value="critico"]');
                radio[0].checked = true;
            }
        }

        if (comp.nome == 10) {
            let radioButtons = document.querySelectorAll('input[type="radio"][name="morfolgia_legata_predicato_2"]');

            radioButtons.forEach(function (button) {
                button.checked = false;
            });
            if (comp.valutazione == 1) {
                let radio = document.querySelectorAll('input[name="morfolgia_legata_predicato_2"][value="corretto"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 2) {
                let radio = document.querySelectorAll('input[name="morfolgia_legata_predicato_2"][value="attenzione"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 3) {
                let radio = document.querySelectorAll('input[name="morfolgia_legata_predicato_2"][value="critico"]');
                radio[0].checked = true;
            }
        }

        if (comp.nome == 11) {
            let radioButtons = document.querySelectorAll('input[type="radio"][name="morfolgia_libera_predicato_2"]');

            radioButtons.forEach(function (button) {
                button.checked = false;
            });
            if (comp.valutazione == 1) {
                let radio = document.querySelectorAll('input[name="morfolgia_libera_predicato_2"][value="corretto"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 2) {
                let radio = document.querySelectorAll('input[name="morfolgia_libera_predicato_2"][value="attenzione"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 3) {
                let radio = document.querySelectorAll('input[name="morfolgia_libera_predicato_2"][value="critico"]');
                radio[0].checked = true;
            }
        }

        if (comp.nome == 12) {
            let radioButtons = document.querySelectorAll('input[type="radio"][name="secondo_argomento_2"]');

            radioButtons.forEach(function (button) {
                button.checked = false;
            });
            if (comp.valutazione == 1) {
                let radio = document.querySelectorAll('input[name="secondo_argomento_2"][value="corretto"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 2) {
                let radio = document.querySelectorAll('input[name="secondo_argomento_2"][value="attenzione"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 3) {
                let radio = document.querySelectorAll('input[name="secondo_argomento_2"][value="critico"]');
                radio[0].checked = true;
            }
        }

        if (comp.nome == 13) {
            let radioButtons = document.querySelectorAll('input[type="radio"][name="morfolgia_legata_secondo_predicato_2"]');

            radioButtons.forEach(function (button) {
                button.checked = false;
            });
            if (comp.valutazione == 1) {
                let radio = document.querySelectorAll('input[name="morfolgia_legata_secondo_predicato_2"][value="corretto"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 2) {
                let radio = document.querySelectorAll('input[name="morfolgia_legata_secondo_predicato_2"][value="attenzione"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 3) {
                let radio = document.querySelectorAll('input[name="morfolgia_legata_secondo_predicato_2"][value="critico"]');
                radio[0].checked = true;
            }
        }
        if (comp.nome == 28) {
            let radioButtons = document.querySelectorAll('input[type="radio"][name="valFinaleRBT"]');

            radioButtons.forEach(function (button) {
                button.checked = false;
            });
            if (comp.valutazione == 1) {
                let radio = document.querySelectorAll('input[name="valFinaleRBT"][value="corretto"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 2) {
                let radio = document.querySelectorAll('input[name="valFinaleRBT"][value="attenzione"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 3) {
                let radio = document.querySelectorAll('input[name="valFinaleRBT"][value="critico"]');
                radio[0].checked = true;
            }
        }
        if (comp.nome == 29) {
            let radioButtons = document.querySelectorAll('input[type="radio"][name="valFinaleRBT2"]');

            radioButtons.forEach(function (button) {
                button.checked = false;
            });
            if (comp.valutazione == 1) {
                let radio = document.querySelectorAll('input[name="valFinaleRBT2"][value="corretto"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 2) {
                let radio = document.querySelectorAll('input[name="valFinaleRBT2"][value="attenzione"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 3) {
                let radio = document.querySelectorAll('input[name="valFinaleRBT2"][value="critico"]');
                radio[0].checked = true;
            }
        }
        if (comp.nome == 14) {
            if (comp.valutazione == 0) {
                document.getElementById('stopping').checked = false;
            }
            if (comp.valutazione == 1) {
                document.getElementById('stopping').checked = true;
            }
        }
        if (comp.nome == 15) {
            if (comp.valutazione == 0) {
                document.getElementById('affricazione').checked = false;
            }
            if (comp.valutazione == 1) {
                document.getElementById('affricazione').checked = true;
            }
        }
        if (comp.nome == 16) {
            if (comp.valutazione == 0) {
                document.getElementById('fricazione').checked = false;
            }
            if (comp.valutazione == 1) {
                document.getElementById('fricazione').checked = true;
            }
        }
        if (comp.nome == 17) {
            if (comp.valutazione == 0) {
                document.getElementById('gliding').checked = false;
            }
            if (comp.valutazione == 1) {
                document.getElementById('gliding').checked = true;
            }
        }
        if (comp.nome == 18) {
            if (comp.valutazione == 0) {
                document.getElementById('anteriorizzazione').checked = false;
            }
            if (comp.valutazione == 1) {
                document.getElementById('anteriorizzazione').checked = true;
            }
        }
        if (comp.nome == 19) {
            if (comp.valutazione == 0) {
                document.getElementById('desonorizzazione').checked = false;
            }
            if (comp.valutazione == 1) {
                document.getElementById('desonorizzazione').checked = true;
            }
        }
        if (comp.nome == 20) {
            if (comp.valutazione == 0) {
                document.getElementById('semplificazione_gruppi_consonantici').checked = false;
            }
            if (comp.valutazione == 1) {
                document.getElementById('semplificazione_gruppi_consonantici').checked = true;
            }
        }
        if (comp.nome == 21) {
            if (comp.valutazione == 0) {
                document.getElementById('riduzione_dittonghi').checked = false;
            }
            if (comp.valutazione == 1) {
                document.getElementById('riduzione_dittonghi').checked = true;
            }
        }
        if (comp.nome == 22) {
            if (comp.valutazione == 0) {
                document.getElementById('metatesi').checked = false;
            }
            if (comp.valutazione == 1) {
                document.getElementById('metatesi').checked = true;
            }
        }
        if (comp.nome == 23) {
            if (comp.valutazione == 0) {
                document.getElementById('armonie_vocaliche').checked = false;
            }
            if (comp.valutazione == 1) {
                document.getElementById('armonie_vocaliche').checked = true;
            }
        }
        if (comp.nome == 24) {
            if (comp.valutazione == 0) {
                document.getElementById('armonie_consonantiche').checked = false;
            }
            if (comp.valutazione == 1) {
                document.getElementById('armonie_consonantiche').checked = true;
            }
        }
        if (comp.nome == 25) {
            if (comp.valutazione == 0) {
                document.getElementById('epentesi').checked = false;
            }
            if (comp.valutazione == 1) {
                document.getElementById('epentesi').checked = true;
            }
        }
        if (comp.nome == 26) {
            if (comp.valutazione == 0) {
                document.getElementById('cancellazione_sillaba').checked = false;
            }
            if (comp.valutazione == 1) {
                document.getElementById('cancellazione_sillaba').checked = true;
            }
        }
        if (comp.nome == 27) {
            if (comp.valutazione == 0) {
                document.getElementById('cancellazione_fonema').checked = false;
            }
            if (comp.valutazione == 1) {
                document.getElementById('cancellazione_fonema').checked = true;
            }
        }
        if (comp.nome == 30) {
            let radioButtons = document.querySelectorAll('input[type="radio"][name="frasi_ad_un_argomento"]');

            radioButtons.forEach(function (button) {
                button.checked = false;
            });
            if (comp.valutazione == 1) {
                let radio = document.querySelectorAll('input[name="frasi_ad_un_argomento"][value="corretto"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 2) {
                let radio = document.querySelectorAll('input[name="frasi_ad_un_argomento"][value="attenzione"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 3) {
                let radio = document.querySelectorAll('input[name="frasi_ad_un_argomento"][value="critico"]');
                radio[0].checked = true;
            }
        }
        if (comp.nome == 31) {
            let radioButtons = document.querySelectorAll('input[type="radio"][name="frasi_a_due_argomento"]');

            radioButtons.forEach(function (button) {
                button.checked = false;
            });
            if (comp.valutazione == 1) {
                let radio = document.querySelectorAll('input[name="frasi_a_due_argomento"][value="corretto"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 2) {
                let radio = document.querySelectorAll('input[name="frasi_a_due_argomento"][value="attenzione"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 3) {
                let radio = document.querySelectorAll('input[name="frasi_a_due_argomento"][value="critico"]');
                radio[0].checked = true;
            }
        }
        if (comp.nome == 32) {
            let radioButtons = document.querySelectorAll('input[type="radio"][name="frasi_a_tre_argomento"]');

            radioButtons.forEach(function (button) {
                button.checked = false;
            });
            if (comp.valutazione == 1) {
                let radio = document.querySelectorAll('input[name="frasi_a_tre_argomento"][value="corretto"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 2) {
                let radio = document.querySelectorAll('input[name="frasi_a_tre_argomento"][value="attenzione"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 3) {
                let radio = document.querySelectorAll('input[name="frasi_a_tre_argomento"][value="critico"]');
                radio[0].checked = true;
            }
        }
        if (comp.nome == 33) {
            let radioButtons = document.querySelectorAll('input[type="radio"][name="frasi_complesse"]');

            radioButtons.forEach(function (button) {
                button.checked = false;
            });
            if (comp.valutazione == 1) {
                let radio = document.querySelectorAll('input[name="frasi_complesse"][value="corretto"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 2) {
                let radio = document.querySelectorAll('input[name="frasi_complesse"][value="attenzione"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 3) {
                let radio = document.querySelectorAll('input[name="frasi_complesse"][value="critico"]');
                radio[0].checked = true;
            }
        }
        if (comp.nome == 34) {
            let radioButtons = document.querySelectorAll('input[type="radio"][name="articoli"]');

            radioButtons.forEach(function (button) {
                button.checked = false;
            });
            if (comp.valutazione == 1) {
                let radio = document.querySelectorAll('input[name="articoli"][value="corretto"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 2) {
                let radio = document.querySelectorAll('input[name="articoli"][value="attenzione"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 3) {
                let radio = document.querySelectorAll('input[name="articoli"][value="critico"]');
                radio[0].checked = true;
            }
        }
        if (comp.nome == 35) {
            let radioButtons = document.querySelectorAll('input[type="radio"][name="predicati"]');

            radioButtons.forEach(function (button) {
                button.checked = false;
            });
            if (comp.valutazione == 1) {
                let radio = document.querySelectorAll('input[name="predicati"][value="corretto"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 2) {
                let radio = document.querySelectorAll('input[name="predicati"][value="attenzione"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 3) {
                let radio = document.querySelectorAll('input[name="predicati"][value="critico"]');
                radio[0].checked = true;
            }
        }
        if (comp.nome == 36) {
            let radioButtons = document.querySelectorAll('input[type="radio"][name="preposizioni_semplici"]');

            radioButtons.forEach(function (button) {
                button.checked = false;
            });
            if (comp.valutazione == 1) {
                let radio = document.querySelectorAll('input[name="preposizioni_semplici"][value="corretto"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 2) {
                let radio = document.querySelectorAll('input[name="preposizioni_semplici"][value="attenzione"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 3) {
                let radio = document.querySelectorAll('input[name="preposizioni_semplici"][value="critico"]');
                radio[0].checked = true;
            }
        }
        if (comp.nome == 37) {
            let radioButtons = document.querySelectorAll('input[type="radio"][name="preposizioni_articolate"]');

            radioButtons.forEach(function (button) {
                button.checked = false;
            });
            if (comp.valutazione == 1) {
                let radio = document.querySelectorAll('input[name="preposizioni_articolate"][value="corretto"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 2) {
                let radio = document.querySelectorAll('input[name="preposizioni_articolate"][value="attenzione"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 3) {
                let radio = document.querySelectorAll('input[name="preposizioni_articolate"][value="critico"]');
                radio[0].checked = true;
            }
        }
        if (comp.nome == 38) {
            let radioButtons = document.querySelectorAll('input[type="radio"][name="pronomi_riflessivi_clitici"]');

            radioButtons.forEach(function (button) {
                button.checked = false;
            });
            if (comp.valutazione == 1) {
                let radio = document.querySelectorAll('input[name="pronomi_riflessivi_clitici"][value="corretto"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 2) {
                let radio = document.querySelectorAll('input[name="pronomi_riflessivi_clitici"][value="attenzione"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 3) {
                let radio = document.querySelectorAll('input[name="pronomi_riflessivi_clitici"][value="critico"]');
                radio[0].checked = true;
            }
        }
        if (comp.nome == 39) {
            let radioButtons = document.querySelectorAll('input[type="radio"][name="pronomi"]');

            radioButtons.forEach(function (button) {
                button.checked = false;
            });
            if (comp.valutazione == 1) {
                let radio = document.querySelectorAll('input[name="pronomi"][value="corretto"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 2) {
                let radio = document.querySelectorAll('input[name="pronomi"][value="attenzione"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 3) {
                let radio = document.querySelectorAll('input[name="pronomi"][value="critico"]');
                radio[0].checked = true;
            }
        }
        if (comp.nome == 40) {
            let radioButtons = document.querySelectorAll('input[type="radio"][name="congiunzioni"]');

            radioButtons.forEach(function (button) {
                button.checked = false;
            });
            if (comp.valutazione == 1) {
                let radio = document.querySelectorAll('input[name="congiunzioni"][value="corretto"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 2) {
                let radio = document.querySelectorAll('input[name="congiunzioni"][value="attenzione"]');
                radio[0].checked = true;
            }
            if (comp.valutazione == 3) {
                let radio = document.querySelectorAll('input[name="congiunzioni"][value="critico"]');
                radio[0].checked = true;
            }
        }
    }
    caricaGraficiGruppi()
}

function caricaGraficiGruppi() {
    let _id = document.getElementById('idPaziente').value;
    document.getElementById('jsonGruppi').textContent = JSON.stringify(users[idUser]["pazienti"][_id]["reg"], null, 2);
}
function eliminaPaziente() {
    document.getElementById('containerForm').style.display = 'none';
    let _id = document.getElementById('idPaziente').value;
    users[idUser]["pazienti"] = users[idUser]["pazienti"].filter((item) => item.id !== parseInt(_id));
    users[idUser]["pazienti"].forEach((item, index) => {
        item.id = index;
    });
    //rimuovi tutti gli elementi con class pazienti 
    let pazienti = document.getElementsByClassName('paziente');
    while (pazienti[0]) {
        pazienti[0].parentNode.removeChild(pazienti[0]);
    }
    for (let paziente of users[idUser]["pazienti"]) {
        caricaUtenti(paziente);
    }
    // ipcRenderer.send('salvaJson', users);
    window.localStorage.setItem('users', JSON.stringify(users));
    console.log("scritto");
}


function buttonClicked(value, name) {
    let nMese = document.getElementById('numMese').value - 1;
    let nome = "";
    let valutazione = 0;
    if (value === 'corretto') {
        valutazione = 1;
    }
    if (value === 'attenzione') {
        valutazione = 2;
    }
    if (value === 'critico') {
        valutazione = 3;
    }



    if (name === 'morfolgia_libera') {
        nome = 1;
    }
    if (name === 'argomento') {
        nome = 2;
    }
    if (name === 'morfolgia_legata') {
        nome = 3;
    }
    if (name === 'predicato') {
        nome = 4;
    }
    if (name === 'morfolgia_legata_predicato') {
        nome = 5;
    }
    if (name === 'morfolgia_libera_2') {
        nome = 6;
    }
    if (name === 'argomento_2') {
        nome = 7;
    }
    if (name === 'morfolgia_legata_2') {
        nome = 8;
    }
    if (name === 'predicato_2') {
        nome = 9;
    }
    if (name === 'morfolgia_legata_predicato_2') {
        nome = 10;
    }
    if (name === 'morfolgia_libera_predicato_2') {
        nome = 11;
    }
    if (name === 'secondo_argomento_2') {
        nome = 12;
    }
    if (name === 'morfolgia_legata_secondo_predicato_2') {
        nome = 13;
    }
    if (name === 'valFinaleRBT') {
        nome = 28;
    }
    if (name === 'valFinaleRBT2') {
        nome = 29;
    }
    if (name === 'frasi_ad_un_argomento') {
        nome = 30;
    }
    if (name === 'frasi_a_due_argomento') {
        nome = 31;
    }
    if (name === 'frasi_a_tre_argomento') {
        nome = 32;
    }
    if (name === 'frasi_complesse') {
        nome = 33;
    }
    if (name === 'articoli') {
        nome = 34;
    }
    if (name === 'predicati') {
        nome = 35;
    }
    if (name === 'preposizioni_semplici') {
        nome = 36;
    }
    if (name === 'preposizioni_articolate') {
        nome = 37;
    }
    if (name === 'pronomi_riflessivi_clitici') {
        nome = 38;
    }
    if (name === 'pronomi') {
        nome = 39;
    }
    if (name === 'congiunzioni') {
        nome = 40;
    }

    let _id = document.getElementById('idPaziente').value;
    users[idUser]["pazienti"][_id]["mesi"][nMese]["componenti"].map((item) => {
        console.log(item);
        if (item.nome === nome) {
            item.valutazione = valutazione;
        }
    });
    // ipcRenderer.send('salvaJson', users);
    window.localStorage.setItem('users', JSON.stringify(users));
}


function buttonChkClicked(id, value) {
    let nMese = document.getElementById('numMese').value - 1;
    let nome = "";
    let valutazione = 0;
    if (value === true) {
        valutazione = 1;
    }
    if (value === false) {
        valutazione = 0;
    }
    if (id === 'stopping') {
        nome = 14;
    }
    if (id === 'affricazione') {
        nome = 15;
    }
    if (id === 'fricazione') {
        nome = 16;
    }
    if (id === 'gliding') {
        nome = 17;
    }
    if (id === 'anteriorizzazione') {
        nome = 18;
    }
    if (id === 'desonorizzazione') {
        nome = 19;
    }
    if (id === 'semplificazione_gruppi_consonantici') {
        nome = 20;
    }
    if (id === 'riduzione_dittonghi') {
        nome = 21;
    }
    if (id === 'metatesi') {
        nome = 22;
    }
    if (id === 'armonie_vocaliche') {
        nome = 23;
    }
    if (id === 'armonie_consonantiche') {
        nome = 24;
    }
    if (id === 'epentesi') {
        nome = 25;
    }
    if (id === 'cancellazione_sillaba') {
        nome = 26;
    }
    if (id === 'cancellazione_fonema') {
        nome = 27;
    }
    let _id = document.getElementById('idPaziente').value;
    users[idUser]["pazienti"][_id]["mesi"][nMese]["componenti"].map((item) => {
        if (item.nome === nome) {
            item.valutazione = valutazione;
        }
    });
    // ipcRenderer.send('salvaJson', users);
    window.localStorage.setItem('users', JSON.stringify(users));
}


function caricaPosizioni(numMese) {
    let letters = ["j", "w", "p", "b", "m", "t", "d", "n", "k", "g", "f", "v", "l", "r", "s", "z", "ʃ", "dʒ", "ts", "dz", "ɲ", "ʎ", "tʃ", "ʒ", "a", "e", "ɛ", "i", "o", "ɔ", "u"];
    let write = ["/j/", "/w/", "/p/", "/b/", "/m/", "/t/", "/d/", "/n/", "/k/", "/g/", "/f/", "/v/", "/l/", "/r/ o /ʀ/", "/s/", "/z/", "/ʃ/", "/dʒ/", "/ts/", "/dz/", "/ɲ/ o /ŋ/", "/ʎ/", "/tʃ/", "/ʒ/", "/a/", "/e/", "/ɛ/", "/i/", "/o/", "/ɔ/", "/u/"];

    let posizioniMedie = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let posizioniIniziali = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const consonanti = "bcdfghjklmnpqrstvwxyz";
    let _id = document.getElementById('idPaziente').value;
    let tras;
    for (let trascritto of users[idUser]["pazienti"][_id]["reg"]) {
        let mese = trascritto.data.split('/')[1];
        if (mese == numMese) {
            tras = trascritto.trascritto;
            let parole = tras.split(" ");
            for (let parola of parole) {
                for (let [i, lettera] of letters.entries()) {
                    if (lettera != "d" && lettera != "t" && lettera != "s" && lettera != "z" && lettera != "ʃ" && lettera != "ʒ") {
                        if (parola.includes(lettera) && !parola.startsWith(lettera)) {
                            let count = countLetters(parola, lettera);
                            posizioniMedie[i] += count;

                            // posizioniMedie[i]++;
                        }
                        if (parola.startsWith(lettera) && parola.substring(1, parola.length).includes(lettera)) {
                            let count = countLetters(parola.substring(1, parola.length), lettera);
                            posizioniMedie[i] += count;
                        }
                        if (parola.startsWith(lettera)) {
                            posizioniIniziali[i]++;
                        }
                    }
                    if (lettera == "ʃ") {
                        let nS;
                        let regex = /(?<!t)ʃ/g;
                        let corrispondenze = parola.match(regex);
                        nS = corrispondenze ? corrispondenze.length : 0;
                        posizioniMedie[i] += nS;
                    }
                    if (lettera == "ʒ") {
                        let nS;
                        let regex = /(?<!d)ʒ/g;
                        let corrispondenze = parola.match(regex);
                        nS = corrispondenze ? corrispondenze.length : 0;
                        posizioniMedie[i] += nS;
                    }
                    if (lettera == "d") {
                        let nD;
                        if (parola.startsWith("d") && !parola.startsWith("dz") && !parola.startsWith("dʒ")) {
                            posizioniIniziali[i]++;
                        }
                        let regex = /d(?![zʒ])/gi;
                        let corrispondenze = parola.substring(1, parola.length).match(regex);
                        nD = corrispondenze ? corrispondenze.length : 0;
                        posizioniMedie[i] += nD;
                    }
                    if (lettera == "t") {
                        let nT;
                        if (parola.startsWith("t") && !parola.startsWith("ts") && !parola.startsWith("tʃ")) {
                            posizioniIniziali[i]++;
                        }
                        let regex = /t(?![sʃ])/gi;
                        let corrispondenze = parola.substring(1, parola.length).match(regex);
                        nT = corrispondenze ? corrispondenze.length : 0;
                        posizioniMedie[i] += nT;
                    }
                    if (lettera == "s") {
                        let nS;
                        if (parola.startsWith("s")) {
                            posizioniIniziali[i]++;
                        }
                        let regex = /(?<!t)s/g;
                        let corrispondenze = parola.substring(1, parola.length).match(regex);
                        nS = corrispondenze ? corrispondenze.length : 0;
                        posizioniMedie[i] += nS;
                    }
                    if (lettera == "z") {
                        let nZ;
                        if (parola.startsWith("z")) {
                            posizioniIniziali[i]++;
                        }
                        let regex = /(?<!d)z/g;
                        let corrispondenze = parola.substring(1, parola.length).match(regex);
                        nZ = corrispondenze ? corrispondenze.length : 0;
                        posizioniMedie[i] += nZ;
                    }
                }
            }
        }
    }
    function countLetters(str, letters) {
        const consonanti = "bcdfghjklmnpqrstvwxyz";
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
    // console.log(letters);
    // console.log(posizioniMedie);
    // console.log(posizioniIniziali);
    let letteraAdd
    let containerWrite
    svuotaCampiFon();
    let vocaliContainer = ""
    for (let [i, lettera] of posizioniIniziali.entries()) {
        if (lettera > 0 && i < 24) {
            letteraAdd = write[i];
            let lc = letters[i];
            if (lc === "m" || lc === "n" || lc === "ɲ" || lc === "ŋ") {
                containerWrite = document.getElementById('nasali');
            }
            if (lc === "p" || lc === "t" || lc === "k") {
                containerWrite = document.getElementById('oraliSorde');
            }
            if (lc === "b" || lc === "d" || lc === "g") {
                containerWrite = document.getElementById('oraliSonore');
            }
            if (lc === "f" || lc === "s" || lc === "ʃ") {
                containerWrite = document.getElementById('sorde');
            }
            if (lc === "v" || lc === "z" || lc === "ʒ") {
                containerWrite = document.getElementById('sonore');
            }
            if (lc === "tʃ" || lc === "ts") {
                containerWrite = document.getElementById('sordeS');
            }
            if (lc === "dʒ" || lc === "dz") {
                containerWrite = document.getElementById('sonoreS');
            }
            if (lc === "r" || lc === "R") {
                containerWrite = document.getElementById('vibranti');
            }
            if (lc === "l" || lc === "ʎ") {
                containerWrite = document.getElementById('nonVibranti');
            }
            if (lc === "j" || lc === "w") {
                containerWrite = document.getElementById('semiConsonanti');
            }
            let div = document.createElement('div');
            div.innerHTML = letteraAdd;
            containerWrite.append(div);
        }
        if (lettera > 0 && i > 23) {
            let lc = letters[i];
            letteraAdd = write[i];
            vocaliContainer=vocaliContainer+" "+letteraAdd;
        }
    }
    if (vocaliContainer!="") {
        document.getElementById('invVocaliInziale').textContent = "Vocali in posizione iniziale: "+vocaliContainer;
    }
    vocaliContainer=""
    for (let [i, lettera] of posizioniMedie.entries()) {
        if (lettera > 0 && i < 24) {
            letteraAdd = write[i];
            let lc = letters[i];
            if (lc === "m" || lc === "n" || lc === "ɲ" || lc === "ŋ") {
                containerWrite = document.getElementById('nasali2');
            }
            if (lc === "p" || lc === "t" || lc === "k") {
                containerWrite = document.getElementById('oraliSorde2');
            }
            if (lc === "b" || lc === "d" || lc === "g") {
                containerWrite = document.getElementById('oraliSonore2');
            }
            if (lc === "f" || lc === "s" || lc === "ʃ") {
                containerWrite = document.getElementById('sorde2');
            }
            if (lc === "v" || lc === "z" || lc === "ʒ") {
                containerWrite = document.getElementById('sonore2');
            }
            if (lc === "tʃ" || lc === "ts") {
                containerWrite = document.getElementById('sordeS2');
            }
            if (lc === "dʒ" || lc === "dz") {
                containerWrite = document.getElementById('sonoreS2');
            }
            if (lc === "r" || lc === "R") {
                containerWrite = document.getElementById('vibranti2');
            }
            if (lc === "l" || lc === "ʎ") {
                containerWrite = document.getElementById('nonVibranti2');
            }
            if (lc === "j" || lc === "w") {
                containerWrite = document.getElementById('semiConsonanti2');
            }
            let div = document.createElement('div');
            div.innerHTML = letteraAdd;
            containerWrite.append(div);
        }
        if (lettera > 0 && i > 23) {
            let lc = letters[i];
            letteraAdd = write[i];
            vocaliContainer=vocaliContainer+" "+letteraAdd;
        }

    }
    if (vocaliContainer!="") {
        document.getElementById('invVocaliMediane').textContent = "Vocali in posizione mediana: "+vocaliContainer;
    }


    // CREAZIONE CHART
    let jsonChar = {
        "testo": letters,
        "fonMed": posizioniMedie,
        "fonIniz": posizioniIniziali
    }
    document.getElementById('spanJson').textContent = JSON.stringify(jsonChar, null, 2);
};


function svuotaCampiFon() {
    document.getElementById('nasali').innerHTML = "";
    document.getElementById('oraliSorde').innerHTML = "";
    document.getElementById('oraliSonore').innerHTML = "";
    document.getElementById('sorde').innerHTML = "";
    document.getElementById('sonore').innerHTML = "";
    document.getElementById('sordeS').innerHTML = "";
    document.getElementById('sonoreS').innerHTML = "";
    document.getElementById('vibranti').innerHTML = "";
    document.getElementById('nonVibranti').innerHTML = "";
    document.getElementById('semiConsonanti').innerHTML = "";
    document.getElementById('nasali2').innerHTML = "";
    document.getElementById('oraliSorde2').innerHTML = "";
    document.getElementById('oraliSonore2').innerHTML = "";
    document.getElementById('sorde2').innerHTML = "";
    document.getElementById('sonore2').innerHTML = "";
    document.getElementById('sordeS2').innerHTML = "";
    document.getElementById('sonoreS2').innerHTML = "";
    document.getElementById('vibranti2').innerHTML = "";
    document.getElementById('nonVibranti2').innerHTML = "";
    document.getElementById('semiConsonanti2').innerHTML = "";
}

function cercaPaziente(value) {
    let pazienti = document.getElementsByClassName('paziente');
    value = value.toString();
    for (let paziente of pazienti) {
        if (paziente.textContent.toLowerCase().includes(value.toLowerCase())) {
            paziente.style.display = 'block';
        }
        else {
            paziente.style.display = 'none';
        }
    }


}