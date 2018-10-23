import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';

import firebase from 'firebase';

import { Disciplina } from '../../models/disciplina.model';

@IonicPage()
@Component({
  selector: 'page-disciplinas',
  templateUrl: 'disciplinas.html',
})
export class DisciplinasPage {

  uid: string;
  disciplinas: Disciplina[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {
    this.uid = "";
    this.disciplinas = [];
  }

  ionViewDidEnter() {
    this.updatePage();
  }

  updatePage() {
    let user = firebase.auth().currentUser;

    if(user != null) {
      this.uid = user.uid;
      let loadind = this.loadingCtrl.create({
        content: "Carregando Disciplinas..."
      });
      loadind.present();

      firebase.firestore().collection("disciplinas")
      .where("user", "==", this.uid)
      .orderBy("nome", "asc").get()
      .then((data) => {
        this.disciplinas = [];
        data.docs.forEach((disciplina) => {
          this.disciplinas.push({
            nome: disciplina.data().nome,
            sigla: disciplina.data().sigla,
            periodo: disciplina.data().periodo,
            notaMin: disciplina.data().notaMin,
            notaMed: disciplina.data().notaMed,
            notaMax: disciplina.data().notaMax,
            formula: disciplina.data().formula,
            user: disciplina.data().user,
            id: disciplina.id
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

  goCadDisciplina() {
    this.navCtrl.push('CadDisciplinaPage');
  }

  goInfo(disciplina) {
    this.navCtrl.push('InfoDisciplinaPage', {
      disciplina: disciplina
    });
  }

}
