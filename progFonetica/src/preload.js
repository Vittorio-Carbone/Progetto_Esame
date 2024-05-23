const { ipcRenderer } = require('electron');
const path = require('path');
const filePath = path.join(__dirname, 'utenti.json');
const fs = require('fs');
let users = [];
let vettoreStampa1 = [];
let vettoreStampa2 = [];
let vettoreStampaData = [];
let idUser;
document.addEventListener('DOMContentLoaded', () => {
    users = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    users = users;
    // for (let paziente of users["pazienti"]) {
    //     caricaUtenti(paziente);
    // }

    document.getElementById('btnSalvaTrascrizione').addEventListener('click', function () {
        salvaTrascrizione();
    });

    document.getElementById('btnSalvaPaz').addEventListener('click', function () {
        salvaPaziente();
    });



    document.getElementById('cancel').addEventListener('click', function () {
        hidePopup();
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
    });

    document.getElementById("iconUser").addEventListener('click', () => {
        caricaSchedaUser();
    });



    document.getElementById('confermaOptDel').addEventListener('click', () => {
        eliminaPaziente();
    });
});



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
    ipcRenderer.send('salvaJson', users);
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
    for (let i = paziente['reg'].length - 1; i >= 0; i--) {
        let registrazione = paziente['reg'][i];
        //console.log(registrazione);
        let tr = document.createElement('tr');

        let tdChk = document.createElement('td');
        tdChk.style.fontWeight = '700';
        let chk = document.createElement('input');
        chk.type = 'checkbox';
        chk.value = registrazione['id'];
        chk.className = 'chk';
        chk.addEventListener('click', () => {
            if (chk.checked) {
                vettoreStampa1.push(registrazione['testo']);
                vettoreStampa2.push(registrazione['trascritto']);
                vettoreStampaData.push(registrazione['data']);
            } else {
                // Trova l'indice dell'elemento con lo stesso testo da eliminare
                const index = vettoreStampa1.findIndex(item => item === registrazione['testo']);

                // Rimuovi l'elemento dagli array solo se esiste un elemento con lo stesso testo
                if (index !== -1) {
                    vettoreStampa1.splice(index, 1);
                    vettoreStampa2.splice(index, 1);
                    vettoreStampaData.splice(index, 1);
                }
            }
        });
        tdChk.append(chk);

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
                console.log(users)
                users[idUser]["pazienti"][_id]["reg"] = users[idUser]["pazienti"][_id]["reg"].filter((item) => item.id !== registrazione['id']);
                users[idUser]["pazienti"][_id]["reg"].forEach((item, index) => {
                    item.id = index;
                });
                console.log(users)
                caricaTabella(paziente);
                // fs.writeFileSync(filePath, JSON.stringify(users));
                ipcRenderer.send('salvaJson', users);
                hidePopup();
            });
        });
        let iElimina = document.createElement('i');
        iElimina.className = 'fa-solid fa-trash';
        tdElimina.append(iElimina);

        tr.append(tdChk, tdId, tdFraseOriginale, tdFraseTrascritta, tdData, tdElimina);
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
            "reg": [],
        };


        users[idUser]['pazienti'].push(paziente);
        users[idUser]['pazienti'].forEach((item, index) => {
            item.id = index;
        });
        // fs.writeFileSync(filePath, JSON.stringify(users));
        ipcRenderer.send('salvaJson', users);

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

    divPaziente.append(divNomePaz, divDataPaz, divDiagnosiPaz);

    document.getElementById('utenti').append(divPaziente);


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
    for (let utente of users) {
        console.log(utente)
        if (utente.username == txtUsername && utente.password == txtPassword) {
            idUser = utente.id;
            console.log("Utente trovato");
            console.log(utente);
            trovato = true;
            document.getElementById('logged').style.display = 'block';
            document.getElementById('loginHome').style.display = 'none';
            for (let paziente of utente.pazienti) {
                caricaUtenti(paziente);
            }
            break;
        }
        if (!trovato) {
            console.log("Utente non trovato");
        }
    }
}
function registrati() {
    let txtNome = document.getElementById('txtNome').value;
    let txtCognome = document.getElementById('txtCognome').value;
    let txtUsernameRegistrato = document.getElementById('txtUsernameRegistrato').value;
    let txtPasswordRegistrato = document.getElementById('txtPasswordRegistrato').value;
    let newUser = {
        "id": users.length,
        "nome": txtNome,
        "cognome": txtCognome,
        "username": txtUsernameRegistrato,
        "password": txtPasswordRegistrato,
        "pazienti": []
    }
    let trovatoUsername = false;
    if (txtNome == "" || txtCognome == "" || txtUsernameRegistrato == "" || txtPasswordRegistrato == "") {
        console.log("Compilare tutti i campi");
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
            // fs.writeFileSync(filePath, JSON.stringify(users));
            ipcRenderer.send('salvaJson', users);
            document.getElementById('logged').style.display = 'block';
            document.getElementById('loginHome').style.display = 'none';
        }
        else {
            console.log("Username già esistente");
        }
    }
}



function caricaSchedaUser(){
    
    let _id=document.getElementById('idPaziente').value;
    console.log(users[idUser]['pazienti'][_id]);
    let paziente=users[idUser]['pazienti'][_id];
    document.getElementById('schedaNome').innerHTML = paziente.nome + " " + paziente.cognome;
    document.getElementById('schedaNascita').innerHTML = paziente.dataNascita;
    document.getElementById('schedaDiagnosi').innerHTML = paziente.diagnosi;
}


function eliminaPaziente() {
    let _id = document.getElementById('idPaziente').value;
    users[idUser]["pazienti"] = users[idUser]["pazienti"].filter((item) => item.id !== parseInt(_id));
    users[idUser]["pazienti"].forEach((item, index) => {
        item.id = index;
    });
    //rimuovi tutti gli elementi con class pazienti 
    let pazienti = document.getElementsByClassName('paziente');
    while(pazienti[0]) {
        pazienti[0].parentNode.removeChild(pazienti[0]);
    }
    for (let paziente of users[idUser]["pazienti"]) {
        caricaUtenti(paziente);
    }
    ipcRenderer.send('salvaJson', users);
    console.log("scritto");
}