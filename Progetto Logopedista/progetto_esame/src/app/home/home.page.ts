import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';


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
  scritta = ["glia", "glio", "gliu", "glie", 'scio', 'scia', 'sciu', "gli", 'sce', 'sci', 'cia', 'cio', 'ciu', 'gia', 'gio', "giu", "gn", "ce", "ci", "ge", "gi", 'j', 'a', 'e', 'o',  'p', 'b', 'm', 'n', 't', 'd', 'q', 'r', 'l', 'f', 'v', 'z', 'z', 'h', 'y','*' ]
  fonemi = ['ʎ:à', 'ʎ:ò', 'ʎ:ù', 'ʎ:è', 'ʃò', 'ʃà', 'ʃù', 'ʎ:ì','ʃè', 'ʃì', 'ʧà', 'ʧò', 'ʧù', 'ʤà', 'ʤò', 'ʤù', 'ɲ:', 'ʧè',  'ʧì',  'ʤè', 'ʤì', 'ʤ', 'a', 'e', 'o', 'p', 'b', 'm', 'n', 't', 'd', 'k', 'r', 'l', 'f', 'v', 'ʣ', 'ʦ:', '', 'i','j' ]
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
    let daTrascrivere :any = this.trascritto;
    this.trascritto = "";
    for (let i = 0; i < this.scritta.length; i++) {
      //Controllo delle i
      if(daTrascrivere.includes("ia") || daTrascrivere.includes("ie") || daTrascrivere.includes("io") || daTrascrivere.includes("iu")){
        daTrascrivere=daTrascrivere.replaceAll("i","*");
      }
      else
      {
        daTrascrivere=daTrascrivere.replaceAll("i","i");
      }
      //Controllo delle u
      if(daTrascrivere.includes("ua") || daTrascrivere.includes("ue") || daTrascrivere.includes("uo") || daTrascrivere.includes("ui")){
        daTrascrivere=daTrascrivere.replaceAll("u","w");
      }
      else
      {
        daTrascrivere=daTrascrivere.replaceAll("u","u");
      }
      //Controllo delle g
      if(daTrascrivere.includes("ga") || daTrascrivere.includes("go") || daTrascrivere.includes("gu") || daTrascrivere.includes("gh")){
        daTrascrivere=daTrascrivere.replaceAll("g","g");
      }
      else
      {
        daTrascrivere=daTrascrivere.replaceAll("g","");
      }
      //controllo delle c
      if(daTrascrivere.includes("ca") || daTrascrivere.includes("co") || daTrascrivere.includes("cu") || daTrascrivere.includes("ch")){
        daTrascrivere=daTrascrivere.replaceAll("c","k");
      }
      else
      {
        daTrascrivere=daTrascrivere.replaceAll("c","");
      }
      //Controllo della s
      if(daTrascrivere.startsWith("s") || daTrascrivere.includes("s:") || 
       daTrascrivere.includes("st") || daTrascrivere.includes("sca") || daTrascrivere.includes("sco")
       || daTrascrivere.includes("scu") || daTrascrivere.includes("sch") || daTrascrivere.includes("sp")
       || daTrascrivere.includes("sr") || daTrascrivere.includes("sf")){
        daTrascrivere=daTrascrivere.replaceAll("s","s");
      }
      else if(daTrascrivere.includes("s") || daTrascrivere.includes("sg") || daTrascrivere.includes("sb")
      || daTrascrivere.includes("sd") || daTrascrivere.includes("sv") || daTrascrivere.includes("sm")
      || daTrascrivere.includes("sl")){
        daTrascrivere=daTrascrivere.replaceAll("s","z");
      }
    }

    for (let i = 0; i < this.scritta.length; i++) {
      if(daTrascrivere.includes(this.scritta[i])){
        daTrascrivere=daTrascrivere.replaceAll(this.scritta[i],this.fonemi[i]);
      }
    }
    this.trascritto=daTrascrivere;
  }
}

