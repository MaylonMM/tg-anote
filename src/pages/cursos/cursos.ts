import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';

import firebase from 'firebase';

import { Curso } from '../../models/curso.model';

@IonicPage()
@Component({
  selector: 'page-cursos',
  templateUrl: 'cursos.html',
})
export class CursosPage {

  uid: string;
  cursos: Curso[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {
    this.uid = "";
    this.cursos = [];
  }

  ionViewDidEnter(){
    this.updatePage()
  }

  updatePage() {
    let user = firebase.auth().currentUser;

    if(user != null) {
      this.uid = user.uid;
      let loadind = this.loadingCtrl.create({
        content: "Carregando Cursos..."
      });
      loadind.present();

      firebase.firestore().collection("cursos")
      .where("user", "==", this.uid)
      .orderBy("nome", "asc").get()
      .then((data) => {
        this.cursos = [];
        data.docs.forEach((curso) => {
          this.cursos.push({
            nome: curso.data().nome,
            sigla: curso.data().sigla,
            dataInicio: curso.data().dataInicio,
            dataFinalizacao: curso.data().dataFinalizacao,
            escola: curso.data().escola,
            user: curso.data().user,
            id: curso.id
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

  goCadCurso() {
    this.navCtrl.push('CadCursoPage');
  }

  goInfo(curso) {
    this.navCtrl.push('InfoCursoPage', {
      curso: curso
    });
  }

}
