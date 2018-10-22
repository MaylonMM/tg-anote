import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController } from 'ionic-angular';

import firebase from 'firebase';

import { Escola } from '../../models/escola.model';

@IonicPage()
@Component({
  selector: 'page-info-escola',
  templateUrl: 'info-escola.html',
})
export class InfoEscolaPage {

  escola: Escola;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    this.escola = new Escola();
  }

  ionViewDidEnter() {
    this.updatePage();
  }

  updatePage() {
    let dadosEscola = this.navParams.get("escola");

    if(dadosEscola != undefined) {
      this.escola = dadosEscola;
    }
  }

  alterar() {
    this.navCtrl.push('CadEscolaPage', {
      escola: this.escola
    })
  }

  deletar() {
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
            let loading = this.loadingCtrl.create({
              content: "Deletando..."
            });
            loading.present();

            firebase.firestore().collection("escolas").doc(this.escola.id).delete()
            .then(() => {
              this.navCtrl.setRoot('EscolasPage');
              loading.dismiss();
              this.toastCtrl.create({
                message: "Escola excluída.",
                duration: 3000
              }).present();
            }).catch((erro) => {
              console.log(erro);
              loading.dismiss();
              this.toastCtrl.create({
                message: "Ocorreu um erro inesperado. :(",
                duration: 3000
              }).present();
            });
          }
        }
      ]
    }).present();
  }

  voltar() {
    if(this.navCtrl.canGoBack()) {
      this.navCtrl.pop();
    } else {
      this.navCtrl.setRoot('HomePage');
    }
  }

}
