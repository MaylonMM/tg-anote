import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-info-escola',
  templateUrl: 'info-escola.html',
})
export class InfoEscolaPage {

  escola: any = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    this.escola = this.navParams.get("escola");
  }

  alterar() {
    this.navCtrl.push('CadEscolaPage', {
      escola: this.escola
    })
  }

  deletar() {
    console.log("Entrou no deletar");
    this.alertCtrl.create({
      title: "Cuidado",
      message: "Você REALMENTE deseja excluir esses dados?",
      buttons: [
        {
          text: "Não"
        },
        {
          text: "Sim",
          handler: () => {
            firebase.firestore().collection("escolas").doc(this.escola.id).delete()
            .then(() => {
              this.navCtrl.setRoot('EscolasPage');

              this.toastCtrl.create({
                message: "Escola excluida com sucesso.",
                duration: 3000
              }).present();
            }).catch(() => {
              this.toastCtrl.create({
                message: "Não foi possivel excluir a escola.",
                duration: 3000
              }).present();
            });
          }
        }
      ]
    }).present();

  }

}
