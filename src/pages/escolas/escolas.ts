import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-escolas',
  templateUrl: 'escolas.html',
})
export class EscolasPage {

  escolas: any[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {

  }

  goCadEscola() {
    this.navCtrl.push('CadEscolaPage');
  }

  ionViewDidEnter(){
    firebase.firestore().collection("escolas")
    .where("user", "==", firebase.auth().currentUser.uid)
    .orderBy("nome", "asc").get()
    .then((data) => {
      this.escolas = data.docs;
    }).catch((erro) => {
      console.log(erro);
    });
  }

  goInfo(escola) {
    this.navCtrl.push('InfoEscolaPage', {
      escola: escola
    });
  }

}
