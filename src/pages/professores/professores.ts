import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import firebase from 'firebase';

import { Professor } from '../../models/professor.model';

@IonicPage()
@Component({
  selector: 'page-professores',
  templateUrl: 'professores.html',
})
export class ProfessoresPage {

  uid: string;
  professores: Professor[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {
    this.uid = "";
    this.professores = [];
  }

  ionViewDidEnter() {
    this.updatePage();
  }

  updatePage() {
    let user = firebase.auth().currentUser;

    if(user != null) {
      this.uid = user.uid;
      let loading = this.loadingCtrl.create({
        content: "Carregando Professores..."
      });
      loading.present();

      firebase.firestore().collection("professores")
      .where("user", "==", this.uid)
      .orderBy("nome", "asc").get()
      .then((data) => {
        this.professores = [];
        data.docs.forEach((professor) => {
          this.professores.push({
            nome: professor.data().nome,
            telefone: professor.data().telefone,
            email: professor.data().email,
            user: professor.data().user,
            id: professor.id
          });
        });
        loading.dismiss();
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

  goCadProfessor() {
    this.navCtrl.push('CadProfessorPage');
  }

  goInfo(professor) {
    this.navCtrl.push('InfoProfessorPage', {
      professor: professor
    });
  }

}
