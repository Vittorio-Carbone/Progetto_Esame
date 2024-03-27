import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { startWith } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, FormsModule],
})
export class HomePage implements OnInit {

  ngOnInit(): void {
    for (let i = 0; i < this.scritta.length; i++) {
      //console.log(this.scritta[i] + " -> " + this.fonemi[i]);
    }
    console.log(this.scritta.length + " " + this.fonemi.length);

  }

  constructor() { }
  statoRec: string = 'REGISTRA';
  micON: boolean = false;
  trascrizione: string = "";
  trascritto: any = "";

  vocali = ['a', 'i', 'e', 'o', 'u'];
  accentate = ['à', 'ì', 'è', 'é', 'ò', 'ù'];
  noAccentate = ['a', 'i', 'e', 'e', 'o', 'u'];
  // scritta = ['a', 'i', 'i', 'e', 'o', 'u', 'u', 'p', 'b', 'm', 'n', 't', 'd', 'g', 'c', 'gn', 'q', 'r', 'l', 'f', 'v', 's', 's', 'z', 'z', 'gli', 'glia', 'glio', 'gliu', 'glie', 'sce', 'sci', 'scio', 'scia', 'sciu', 'cia', 'cio', 'ce', 'ci', 'ciu', 'gia', 'gio', 'ge', 'gi', 'giu', 'h', 'j', 'y', ':'];
  // fonemi = ['a', 'i', 'j', 'e', 'o', 'u', 'w', 'p', 'b', 'm', 'n', 't', 'd', 'g', 'k', 'ɲ:', 'k', 'r', 'l', 'f', 'v', 's', 'z', 'ʣ', 'ʦ:', 'ʎ:i', 'ʎ:i', 'ʎ:o', 'ʎ:u', 'ʎ:e', 'ʃe', 'ʃi', 'ʃo', 'ʃa', 'ʃu', 'ʧa', 'ʧo', 'ʧe', 'ʧi', 'ʧu', 'ʤa', 'ʤo', 'ʤe', 'ʤi', 'ʤu', '', 'ʤ', 'i', ':'];
  // scritta = ["glia", "glio", "gliu", "glie", 'scio', 'scia', 'sciu', "gli", 'sce', 'sci', 'cia', 'cio', 'ciu', 'gia', 'gio', "giu", "gn", "ce", "ci", "ge", "gi", 'a', 'i', 'i', 'e', 'o', 'u', 'u', 'p', 'b', 'm', 'n', 't', 'd', 'g', 'c', 'q', 'r', 'l', 'f', 'v', 's', 's', 'z', 'z', 'h', 'j', 'y' ]
  // fonemi = ['ʎ:a', 'ʎ:o', 'ʎ:u', 'ʎ:e', 'ʃo', 'ʃa', 'ʃu', 'ʎ:i','ʃe', 'ʃi', 'ʧa', 'ʧo', 'ʧu', 'ʤa', 'ʤo', 'ʤu', 'ɲ:', 'ʧe',  'ʧi',  'ʤe', 'ʤi', 'a', 'i', 'j', 'e', 'o', 'u', 'w', 'p', 'b', 'm', 'n', 't', 'd', 'g', 'k','k', 'r', 'l', 'f', 'v', 's', 'z', 'ʣ', 'ʦ:', '', 'ʤ', 'i' ]
  scritta = ["glia", "glio", "gliu", "glie", 'scio', 'scia', 'sciu', "gli", 'sce', 'sci', 'cia', 'cio', 'ciu', 'gia', 'gio', "giu", "gn", "ce", "ci", "ge", "gi", 'j', 'a', 'e', 'o', 'p', 'b', 'm', 'n', 't', 'd', 'q', 'r', 'l', 'f', 'v']
  fonemi = ['ʎ:à', 'ʎ:ò', 'ʎ:ù', 'ʎ:è', 'ʃò', 'ʃà', 'ʃù', 'ʎ:ì', 'ʃè', 'ʃì', 'ʧà', 'ʧò', 'ʧù', 'ʤà', 'ʤò', 'ʤù', 'ɲ:', 'ʧè', 'ʧì', 'ʤè', 'ʤì', 'ʤ', 'a', 'e', 'o', 'p', 'b', 'm', 'n', 't', 'd', 'k', 'r', 'l', 'f', 'v']
  scrittaDopo = ['y', '*', 'h']
  fonemiDopo = ['i', 'j', '']
  registra() {
    this.micON = !this.micON;
    if (this.micON) {
      this.statoRec = 'INTERROMPI';
      console.log('INIZIO REC');
    } else {
      this.statoRec = 'REGISTRA';
      console.log('STOP REC');
    }
  }

  trascrivi() {
    this.trascritto = this.trascrizione;
    for (let i = 0; i < this.trascritto.length; i++) {
      for (let j = 0; j < this.accentate.length; j++) {
        this.sostituisciAccenti(i, j);
      }
    }
    this.doppie();
    this.trascrizioneFonemi();
    for (let j = 0; j < this.accentate.length; j++) {
      this.sostituisciAccenti(0, j);
    }
  }



  sostituisciAccenti(i: number, j: number) {
    let sost = this.trascritto.split("").findIndex((char: any) => {
      return char == this.accentate[j];
    })
    if (sost != -1) {
      this.trascritto = this.trascritto.replaceAll(this.accentate[j], this.noAccentate[j]);
    }
  }

  doppie() {
    let primaParte = "";
    let secondaParte = "";
    for (let i = 0; i < this.trascritto.length; i++) {
      if (this.trascritto[i] == this.trascritto[i + 1]) {
        primaParte = this.trascritto.substring(0, i + 1);
        secondaParte = this.trascritto.substring(i + 2, this.trascritto.length);
        this.trascritto = primaParte + ":" + secondaParte;
      }
    }
  }

  trascrizioneFonemi() {
    this.trascritto = this.trascritto.toLowerCase();
    // let daTrascrivere: any = this.trascritto.split(" ");
    let daTrascrivere: any = this.trascritto;
    console.log(daTrascrivere);
    this.trascritto = "";
    for (let i = 0; i < this.scritta.length; i++) {
      if (daTrascrivere.includes(this.scritta[i])) {
        daTrascrivere = daTrascrivere.replaceAll(this.scritta[i], this.fonemi[i]);
      }
    }
    let daTrascrivere2: any = daTrascrivere.split(" ");
    console.log(daTrascrivere2)
    for (let daTra of daTrascrivere2) {
      // for (let i = 0; i < this.scritta.length; i++) {
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
        daTrascrivere = daTrascrivere.replace(daTra, daTra.replace(/g(?!([hauo]))/g, ''));
        daTra = daTra.replace(/g(?!([hauo]))/g, '')
      }
      //Controllo della Z
      if (daTra.startsWith("z")) {
        console.log("inizia con z: " + daTra);
        daTrascrivere = daTrascrivere.replace(daTra, daTra.replace("z", 'ʣ'));
        daTra = daTra.replace("z", 'ʣ')
      }
      if (daTra.includes("z") && this.isZAtMiddle(daTra)) {
        console.log("metà con z: " + daTra);
        daTrascrivere = daTrascrivere.replaceAll(daTra, daTra.replaceAll("z", "ʦ:"));
        daTra = daTra.replaceAll("z", "ʦ:")
      }
      //Controllo della S
      if (daTra.includes("s") || daTra.includes("sg") || daTra.includes("sb")
        || daTra.includes("sd") || daTra.includes("sv") || daTra.includes("sm")
        || daTra.includes("sl")) {
          if(!daTra.startsWith("s")){
            daTrascrivere = daTrascrivere.replace(daTra, daTra.replace("sg", 'zg'));
            daTra = daTra.replace("sg", 'zg')
            daTrascrivere = daTrascrivere.replace(daTra, daTra.replace("sb", 'zb'));
            daTra = daTra.replace("sb", 'zb')
            daTrascrivere = daTrascrivere.replace(daTra, daTra.replace("sd", 'zd'));
            daTra = daTra.replace("sd", 'zd')
            daTrascrivere = daTrascrivere.replace(daTra, daTra.replace("sv", 'zv'));
            daTra = daTra.replace("sv", 'zv')
            daTrascrivere = daTrascrivere.replace(daTra, daTra.replace("sm", 'zm'));
            daTra = daTra.replace("sm", 'zm')
            daTrascrivere = daTrascrivere.replace(daTra, daTra.replace("sl", 'zl'));
            daTra = daTra.replace("sl", 'zl')
            daTrascrivere = daTrascrivere.replace(daTra, daTra.replace(/s(?![t|ca|co|cu|ch|p|r|f|:])/g, 'z'));
            daTra = daTra.replace(/s(?![t|ca|co|cu|ch|p|r|f|:])/g, 'z')
          }
          else
          {
            daTrascrivere = daTrascrivere.replace(daTra.substring(1, daTra.length), daTra.substring(1, daTra.length).replace("sg", 'zg'));
            daTra = "s"+daTra.substring(1, daTra.length).replace("sg", 'zg')
            daTrascrivere = daTrascrivere.replace(daTra.substring(1, daTra.length), daTra.substring(1, daTra.length).replace("sb", 'zb'));
            daTra = "s"+daTra.substring(1, daTra.length).replace("sb", 'zb')
            daTrascrivere = daTrascrivere.replace(daTra.substring(1, daTra.length), daTra.substring(1, daTra.length).replace("sd", 'zd'));
            daTra = "s"+daTra.substring(1, daTra.length).replace("sd", 'zd')
            daTrascrivere = daTrascrivere.replace(daTra.substring(1, daTra.length), daTra.substring(1, daTra.length).replace("sv", 'zv'));
            daTra = "s"+daTra.substring(1, daTra.length).replace("sv", 'zv')
            daTrascrivere = daTrascrivere.replace(daTra.substring(1, daTra.length), daTra.substring(1, daTra.length).replace("sm", 'zm'));
            daTra = "s"+daTra.substring(1, daTra.length).replace("sm", 'zm')
            daTrascrivere = daTrascrivere.replace(daTra.substring(1, daTra.length), daTra.substring(1, daTra.length).replace("sl", 'zl'));
            daTra = "s"+daTra.substring(1, daTra.length).replace("sl", 'zl')
            daTrascrivere = daTrascrivere.replace(daTra.substring(1, daTra.length), daTra.substring(1, daTra.length).replace(/s(?![t|ca|co|cu|ch|p|r|f|:])/g, 'z'));
            daTra = "s"+daTra.substring(1, daTra.length).replace(/s(?![t|ca|co|cu|ch|p|r|f|:])/g, 'z')
          }
      }
      if (daTra.startsWith("s") || daTra.includes("s:") ||
        daTra.includes("st") || daTra.includes("sca") || daTra.includes("sco")
        || daTra.includes("scu") || daTra.includes("sch") || daTra.includes("sp")
        || daTra.includes("sr") || daTra.includes("sf")) {
        
      }

      //controllo delle C
      if (daTra.includes("ca") || daTra.includes("co") || daTra.includes("cu") || daTra.includes("ch")) {
        daTrascrivere = daTrascrivere.replaceAll(daTra, daTra.replaceAll("ca", "ka"));
        daTra = daTra.replaceAll("ca", "ka")
        daTrascrivere = daTrascrivere.replaceAll(daTra, daTra.replaceAll("co", "ko"));
        daTra = daTra.replaceAll("co", "ko")
        daTrascrivere = daTrascrivere.replaceAll(daTra, daTra.replaceAll("cu", "ku"));
        daTra = daTra.replaceAll("cu", "ku")
        daTrascrivere = daTrascrivere.replaceAll(daTra, daTra.replaceAll("ch", "kh"));
        daTra = daTra.replaceAll("ch", "kh")
      }
      if (daTra.includes("c")) {
        daTrascrivere = daTrascrivere.replace(daTra, daTra.replace(/c(?!([hau]))/g, ''));
        daTra = daTra.replace(/c(?!([hau]))/g, '')
      }
    }

    for (let i = 0; i < this.scrittaDopo.length; i++) {
      if (daTrascrivere.includes(this.scrittaDopo[i])) {
        daTrascrivere = daTrascrivere.replaceAll(this.scrittaDopo[i], this.fonemiDopo[i]);
      }
    }

    this.trascritto = daTrascrivere;


  }
  isZAtMiddle(word: any) {
    var middleIndex = Math.floor(word.length / 2);
    return word.charAt(middleIndex) === 'z';
  }

}

