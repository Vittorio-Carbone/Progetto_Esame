import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage {
  constructor() {}
  statoRec: string = 'REGISTRA';
  micON: boolean = false;
  registra(){
    this.micON = !this.micON; 
    if(this.micON){
      this.statoRec='INTERROMPI';
      console.log('INIZIO REC');
    }else{
      this.statoRec='REGISTRA';
      console.log('STOP REC');
    }
  }
}
