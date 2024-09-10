vocali = ['a', 'i', 'e', 'o', 'u'];
accentate = ['à', 'ì', 'è', 'é', 'ò', 'ù'];
noAccentate = ['a', 'i', 'e', 'e', 'o', 'u'];
// scritta = ['a', 'i', 'i', 'e', 'o', 'u', 'u', 'p', 'b', 'm', 'n', 't', 'd', 'g', 'c', 'gn', 'q', 'r', 'l', 'f', 'v', 's', 's', 'z', 'z', 'gli', 'glia', 'glio', 'gliu', 'glie', 'sce', 'sci', 'scio', 'scia', 'sciu', 'cia', 'cio', 'ce', 'ci', 'ciu', 'gia', 'gio', 'ge', 'gi', 'giu', 'h', 'j', 'y', ':'];
// fonemi = ['a', 'i', 'j', 'e', 'o', 'u', 'w', 'p', 'b', 'm', 'n', 't', 'd', 'g', 'k', 'ɲ:', 'k', 'r', 'l', 'f', 'v', 's', 'z', 'ʣ', 'ʦ:', 'ʎ:i', 'ʎ:i', 'ʎ:o', 'ʎ:u', 'ʎ:e', 'ʃe', 'ʃi', 'ʃo', 'ʃa', 'ʃu', 'tʃa', 'tʃo', 'tʃe', 'tʃi', 'tʃu', 'dʒa', 'dʒo', 'dʒe', 'dʒi', 'dʒu', '', 'dʒ', 'i', ':'];
// scritta = ["glia", "glio", "gliu", "glie", 'scio', 'scia', 'sciu', "gli", 'sce', 'sci', 'cia', 'cio', 'ciu', 'gia', 'gio', "giu", "gn", "ce", "ci", "ge", "gi", 'a', 'i', 'i', 'e', 'o', 'u', 'u', 'p', 'b', 'm', 'n', 't', 'd', 'g', 'c', 'q', 'r', 'l', 'f', 'v', 's', 's', 'z', 'z', 'h', 'j', 'y' ]
// fonemi = ['ʎ:a', 'ʎ:o', 'ʎ:u', 'ʎ:e', 'ʃo', 'ʃa', 'ʃu', 'ʎ:i','ʃe', 'ʃi', 'tʃa', 'tʃo', 'tʃu', 'dʒa', 'dʒo', 'dʒu', 'ɲ:', 'tʃe',  'tʃi',  'dʒe', 'dʒi', 'a', 'i', 'j', 'e', 'o', 'u', 'w', 'p', 'b', 'm', 'n', 't', 'd', 'g', 'k','k', 'r', 'l', 'f', 'v', 's', 'z', 'ʣ', 'ʦ:', '', 'dʒ', 'i' ]
scritta = ["glia", "glio", "gliu", "glie", 'scio', 'scia', 'sciu', "gli", 'sce', 'sci', 'cia', 'cio', 'ciu', 'gia', 'gio', "giu", "gn", "ce", "ci", "ge", "gi", 'j', 'a', 'e', 'o', 'p', 'b', 'm', 'n', 't', 'd', 'r', 'l', 'f', 'v']
fonemi = ['ʎ:à', 'ʎ:ò', 'ʎ:ù', 'ʎ:è', 'ʃò', 'ʃà', 'ʃù', 'ʎ:ì', 'ʃè', 'ʃì', 'tʃà', 'tʃò', 'tʃù', 'dʒà', 'dʒò', 'dʒù', 'ɲ:', 'tʃè', 'tʃì', 'dʒè', 'dʒì', 'dʒ', 'a', 'e', 'o', 'p', 'b', 'm', 'n', 't', 'd', 'r', 'l', 'f', 'v']
scrittaDopo = ['y', '*', 'h', " lwi ", "lwi ", " lwi", "cq", "q", "i:", " z'e ", " dz:ants:ara ", " ts:ants:ara ", " dz:ants:are ", " ts:ants:are ", " dz:ja ", " dz:jo ", " mjo ", " mja ", " mai ", " vja ", " two ", " swo ", " swa ", " swe ", " jo ", " dwe ", " marja ", " sja ", " elja ", " lutʃà ", " via ", " vja ", " iɱvja ", " iɱvjo ", " italja ", " pjo "  ]
fonemiDopo = ['i', 'j', '', " lui ", "lui ", " lui", "k:", "k", "ij", "s'e", " dzandzara ", " dzandzara ", " dzandzare ", " dzandzare ", " zia ", " zio ", " mio ", " mia ", " mai ", " via ", " tuo ", " suo ", " sua ", " sue ", " io ", " due ", " maria ", " sia ", " elia ", " lutʃia ", " via ", " via ", " iɱvia ", " iɱvio ", " italia ", " pio "]
scrittaPrima = ["c'e", "cci", "ggi", "cch", "cca", "cco", "ccu", "cce", "ggh", "gga", "ggo", "ggu", "gge", "n c", "n g", "n k", "nc", "ng", "nk", "n v", "n f", "nv", "nf"]
fonemiPrima = ["tʃ:e", "tʃ:i", "dʒ:", "k:", "k:a", "k:o", "k:u", "tʃ:e", "g:", "g:a", "g:o", "g:u", "dʒ:e", "ŋ c", "ŋ g", "ŋ k", "ŋc", "ŋg", "ŋk", "ɱ v", "ɱ f", "ɱv", "ɱf"]



$(document).ready(function () {
    $('#btnInvia').click(function () {
        trascritto = " " + $("#inputTrascrivere").val() + " ";
        console.log(trascritto)
        trascrivi();
        ultimaTrascrizione();
        $("#outputTrascritto").val(trascritto);

    });






    function trascrivi() {
        // trascritto = trascrizione;
        trascritto = trascritto.toLowerCase();
        for (let i = 0; i < trascritto.length; i++) {
            for (let j = 0; j < accentate.length; j++) {
                sostituisciAccenti(i, j);
            }
        }
        for (let i = 0; i < scrittaPrima.length; i++) {
            if (trascritto.includes(scrittaPrima[i])) {
                trascritto = trascritto.replaceAll(scrittaPrima[i], fonemiPrima[i]);
            }
        }
        console.log(trascritto)
        doppie();
        trascrizioneFonemi();
        for (let j = 0; j < accentate.length; j++) {
            sostituisciAccenti(0, j);
        }
    };



    function sostituisciAccenti(i, j) {
        let sost = trascritto.split("").findIndex((char) => {
            return char == accentate[j];
        })
        if (sost != -1) {
            trascritto = trascritto.replaceAll(accentate[j], noAccentate[j]);
        }
    }

    function doppie() {
        let primaParte = "";
        let secondaParte = "";
        for (let i = 0; i < trascritto.length; i++) {
            if (trascritto[i] != " ") {
                if (trascritto[i] == trascritto[i + 1]) {
                    primaParte = trascritto.substring(0, i + 1);
                    secondaParte = trascritto.substring(i + 2, trascritto.length);
                    trascritto = primaParte + ":" + secondaParte;
                }
            }
        }
    }

    function trascrizioneFonemi() {
        trascritto = trascritto.toLowerCase();
        // let daTrascrivere: any = trascritto.split(" ");
        let daTrascrivere = trascritto;
        trascritto = "";
        for (let i = 0; i < scritta.length; i++) {
            if (daTrascrivere.includes(scritta[i])) {
                daTrascrivere = daTrascrivere.replaceAll(scritta[i], fonemi[i]);
            }
        }
        let daTrascrivere2 = daTrascrivere.split(" ");


        console.log(daTrascrivere2)
        for (let daTra of daTrascrivere2) {
            // for (let i = 0; i < scritta.length; i++) {
            // Controllo delle I
            if (daTra.includes("ia") || daTra.includes("ie") || daTra.includes("io") || daTra.includes("iu")) {
                daTrascrivere = daTrascrivere.replaceAll(daTra, daTra.replaceAll("ia", "ja"));
                daTra = daTra.replaceAll("ia", "ja")
                daTrascrivere = daTrascrivere.replaceAll(daTra, daTra.replaceAll("ie", "je"));
                daTra = daTra.replaceAll("ie", "je")
                daTrascrivere = daTrascrivere.replaceAll(daTra, daTra.replaceAll("io", "jo"));
                daTra = daTra.replaceAll("io", "jo")
                daTrascrivere = daTrascrivere.replaceAll(daTra, daTra.replaceAll("iu", "ju"));
                daTra = daTra.replaceAll("iu", "ju")
            }
            // Controllo delle U
            if (daTra.includes("ua") || daTra.includes("ue") || daTra.includes("uo") || daTra.includes("ui")) {
                daTrascrivere = daTrascrivere.replaceAll(daTra, daTra.replaceAll("ua", "wa"));
                daTra = daTra.replaceAll("ua", "wa")
                daTrascrivere = daTrascrivere.replaceAll(daTra, daTra.replaceAll("ue", "we"));
                daTra = daTra.replaceAll("ue", "we")
                daTrascrivere = daTrascrivere.replaceAll(daTra, daTra.replaceAll("uo", "wo"));
                daTra = daTra.replaceAll("uo", "wo")
                daTrascrivere = daTrascrivere.replaceAll(daTra, daTra.replaceAll("ui", "wi"));
                daTra = daTra.replaceAll("ui", "wi")


            }
            // Controllo delle G
            if (daTra.includes("ga") || daTra.includes("go") || daTra.includes("gu") || daTra.includes("gh")) {
                daTrascrivere = daTrascrivere.replaceAll(daTra, daTra.replaceAll("ga", "ga"));
                daTra = daTra.replaceAll("ga", "ga")
                daTrascrivere = daTrascrivere.replaceAll(daTra, daTra.replaceAll("go", "go"));
                daTra = daTra.replaceAll("go", "go")
                daTrascrivere = daTrascrivere.replaceAll(daTra, daTra.replaceAll("gu", "gu"));
                daTra = daTra.replaceAll("gu", "gu")
                daTrascrivere = daTrascrivere.replaceAll(daTra, daTra.replaceAll("gh", "gh"));
                daTra = daTra.replaceAll("gh", "gh")
            }
            if (daTra.includes("g")) {
                // TOGLIE TUTTE LE G CHE NON SONO SEGUITE DA H A U O
                // daTrascrivere = daTrascrivere.replace(daTra, daTra.replace(/g(?!([hauo]))/g, ''));
                // daTra = daTra.replace(/g(?!([hauo]))/g, '')
            }
            //Controllo della Z
            if (daTra.startsWith("z")) {
                daTrascrivere = daTrascrivere.replace(daTra, daTra.replace("z", '§§'));
                daTra = daTra.replace("z", '§§')
            }
            if (daTra.includes("z")) {
                daTrascrivere = daTrascrivere.replaceAll(daTra.substring(1, daTra.length), daTra.substring(1, daTra.length).replaceAll("z", "ts:"));
                daTra = daTra.substring(0, 1) + daTra.substring(1, daTra.length).replaceAll("z", "ts:")

            }
            daTrascrivere = daTrascrivere.replace(daTra, daTra.replace("§§", 'dz:'));
            daTra = daTra.replace("§§", 'dz:')


            // //Controllo della S
            if (daTra.includes("s")) {
                let lettereConsonanti = "nprlb";
                if (daTra.substring(1, daTra.length).includes("s")) {
                    let indices = [];
                    let index = daTra.indexOf("s");
                    while (index !== -1) {
                        indices.push(index);
                        index = daTra.indexOf("s", index + 1);
                    }
                    for (let ind of indices) {
                        if (lettereConsonanti.includes(daTra[ind - 1])) {
                            daTrascrivere = daTrascrivere.replace(daTra, daTra.replace("s", '^*^'));
                            daTra = daTra.replace("s", '^*^')
                        }
                    }
                }
                if (daTra.startsWith("s")) {
                    daTrascrivere = daTrascrivere.replace(daTra, daTra.replace(/s(?!([tpcfqaeiouj:]))/g, 'z'));
                    daTra = daTra.replace(/g(?!([tpcfqaeiouj:]))/g, 'z')
                }
                daTrascrivere = daTrascrivere.replaceAll(daTra.substring(1, daTra.length), daTra.substring(1, daTra.length).replaceAll(/s(?!([tpcfq:]))/g, 'z'));
                daTra = daTra.substring(0, 1) + daTra.substring(1, daTra.length).replaceAll(/s(?!([tpcfq:]))/g, 'z')

                if (daTrascrivere.includes("zw")) {
                    daTrascrivere = daTrascrivere.replace("zwa", "swa");
                    daTra = daTra.replace("zwa", 'swa')
                    daTrascrivere = daTrascrivere.replace("zwe", "swe");
                    daTra = daTra.replace("zwe", 'swe')
                    daTrascrivere = daTrascrivere.replace("zwi", "swi");
                    daTra = daTra.replace("zwi", 'swi')
                    daTrascrivere = daTrascrivere.replace("zwo", "swo");
                    daTra = daTra.replace("zwo", 'swo')
                    daTrascrivere = daTrascrivere.replace("zwu", "swu");
                    daTra = daTra.replace("zwu", 'swu')
                }


            }
            daTrascrivere = daTrascrivere.replace(daTra, daTra.replace('^*^', "s"));
            daTra = daTra.replace('^*^', "s")

            //controllo delle C
            if (daTra.includes("cr") || daTra.includes("cl") || daTra.includes("ca") || daTra.includes("co") || daTra.includes("cu") || daTra.includes("ch") ||
                daTra.includes("cw")) {
                daTrascrivere = daTrascrivere.replaceAll(daTra, daTra.replaceAll("ca", "ka"));
                daTra = daTra.replaceAll("ca", "ka")
                daTrascrivere = daTrascrivere.replaceAll(daTra, daTra.replaceAll("co", "ko"));
                daTra = daTra.replaceAll("co", "ko")
                daTrascrivere = daTrascrivere.replaceAll(daTra, daTra.replaceAll("cu", "ku"));
                daTra = daTra.replaceAll("cu", "ku")
                daTrascrivere = daTrascrivere.replaceAll(daTra, daTra.replaceAll("ch", "kh"));
                daTra = daTra.replaceAll("ch", "kh")
                daTrascrivere = daTrascrivere.replaceAll(daTra, daTra.replaceAll("cr", "kr"));
                daTra = daTra.replaceAll("cr", "kr")
                daTrascrivere = daTrascrivere.replaceAll(daTra, daTra.replaceAll("cl", "kl"));
                daTra = daTra.replaceAll("cl", "kl")
                daTrascrivere = daTrascrivere.replaceAll(daTra, daTra.replaceAll("cw", "kw"));
                daTra = daTra.replaceAll("cw", "kw")
            }
            if (daTra.includes("c")) {
                // TOGLIE TUTTE LE C CHE NON SONO SEGUITE DA H A U 
                // daTrascrivere = daTrascrivere.replace(daTra, daTra.replace(/c(?!([hau]))/g, ''));
                // daTra = daTra.replace(/c(?!([hau]))/g, '')
            }
        }

        for (let i = 0; i < scrittaDopo.length; i++) {
            if (daTrascrivere.includes(scrittaDopo[i])) {
                daTrascrivere = daTrascrivere.replaceAll(scrittaDopo[i], fonemiDopo[i]);
            }
        }
        daTrascrivere = daTrascrivere.replaceAll("::", ":");
        trascritto = daTrascrivere;


    }
    function isZAtMiddle(word) {
        var middleIndex = Math.floor(word.length / 2);
        return word.charAt(middleIndex) === 'z';
    }



    function ultimaTrascrizione() {
        let index = 0;
        let foundIndex;
        let consonanti = "bcdfghjklmnpqrsvwxyz";
        let vocali = "aeiou";

        // CORREZIONI ŋ
        do {
            foundIndex = trascritto.indexOf("ŋ", index);
            if (foundIndex != -1) {
                if (trascritto[foundIndex + 1] == " ") {
                    if (trascritto[foundIndex + 3] == "ʃ" || trascritto[foundIndex + 3] == "ʒ") {
                        trascritto = trascritto.substring(0, foundIndex) + "n" + trascritto.substring(foundIndex + 1);
                    }
                } else {
                    if (trascritto[foundIndex + 2] == "ʃ" || trascritto[foundIndex + 2] == "ʒ") {
                        trascritto = trascritto.substring(0, foundIndex) + "n" + trascritto.substring(foundIndex + 1);
                    }
                }
            }
            if (foundIndex != -1) {
                index = foundIndex + 1;
            }
        } while (foundIndex != -1);


        index = 0;
        foundIndex = 0;
        // CORREZIONI ʃe
        do {
            foundIndex = trascritto.indexOf("ʃe", index);
            if (foundIndex != -1) {
                if (consonanti.includes(trascritto[foundIndex - 1])) {

                } else {
                    trascritto = trascritto.substring(0, foundIndex) + "ʃ:" + trascritto.substring(foundIndex + 1);
                }
            }
            if (foundIndex != -1) {
                index = foundIndex + 1;
            }
        } while (foundIndex != -1);


        index = 0;
        foundIndex = 0;
        // CORREZIONI ʃi
        do {
            foundIndex = trascritto.indexOf("ʃi", index);
            if (foundIndex != -1) {
                if (consonanti.includes(trascritto[foundIndex - 1])) {

                } else {
                    trascritto = trascritto.substring(0, foundIndex) + "ʃ:" + trascritto.substring(foundIndex + 1);
                }
            }
            if (foundIndex != -1) {
                index = foundIndex + 1;
            }
        } while (foundIndex != -1);


        index = 0;
        foundIndex = 0;
        // CORREZIONI ʎ:
        do {
            foundIndex = trascritto.indexOf("ʎ:", index);
            if (foundIndex != -1) {
                if (consonanti.includes(trascritto[foundIndex - 1])) {
                    trascritto = trascritto.substring(0, foundIndex) + "ʎ" + trascritto.substring(foundIndex + 2);
                } else {

                }
            }
            if (foundIndex != -1) {
                index = foundIndex + 1;
            }
        } while (foundIndex != -1);


        index = 0;
        foundIndex = 0;
        // CORREZIONI ts:
        do {
            foundIndex = trascritto.indexOf("ts:", index);
            if (foundIndex != -1) {
                if (consonanti.includes(trascritto[foundIndex - 1])) {
                    trascritto = trascritto.substring(0, foundIndex) + "ts" + trascritto.substring(foundIndex + 3);
                } else {

                }
            }
            if (foundIndex != -1) {
                index = foundIndex + 1;
            }
        } while (foundIndex != -1);


        trascritto = trascritto.replaceAll(" lutʃ:ia ", "lutʃia");

    }


});