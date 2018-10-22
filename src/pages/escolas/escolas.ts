import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import firebase from 'firebase';

import { Escola } from '../../models/escola.model';

@IonicPage()
@Component({
  selector: 'page-escolas',
  templateUrl: 'escolas.html',
})
export class EscolasPage {

  uid: string;
  escolas: Escola[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {
    this.uid = "";
    this.escolas = [];
  }

  ionViewDidEnter(){
    this.updatePage();
  }

  updatePage() {
    let user = firebase.auth().currentUser;

    if(user != null) {
      let loadind = this.loadingCtrl.create({
        content: "Carregando Escolas..."
      });


      loadind.present();
      this.uid = user.uid;

      firebase.firestore().collection("escolas")
      .where("user", "==", this.uid)
      .orderBy("nome", "asc").get()
      .then((data) => {
        this.escolas = [];
        data.docs.forEach((escola) => {
          this.escolas.push({
            nome: escola.data().nome,
            sigla: escola.data().sigla,
            telefone: escola.data().telefone,
            email: escola.data().email,
            endereco: escola.data().endereco,
            cidade: escola.data().cidade,
            estado: escola.data().estado,
            user: escola.data().user,
            id: escola.id
          });
        });
        loadind.dismiss();
      }).catch((erro) => {
        console.log(erro);
        loadind.dismiss();
        this.toastCtrl.create({
          message: "Ocorreu um erro inesperado. :(",
          duration: 3000
        }).present();
      });
    }
  }

  goCadEscola() {
    this.navCtrl.push('CadEscolaPage');
  }

  goInfo(escola) {
    this.navCtrl.push('InfoEscolaPage', {
      escola: escola
    });
  }

}
