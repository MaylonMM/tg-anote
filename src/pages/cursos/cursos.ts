import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-cursos',
  templateUrl: 'cursos.html',
})
export class CursosPage {

  cursos: any[] = undefined;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {

  }

  ionViewDidEnter(){
    firebase.firestore().collection("cursos")
    .where("user", "==", firebase.auth().currentUser.uid)
    .orderBy("nome", "asc").get()
    .then((data) => {
      this.cursos = data.docs;
    }).catch((erro) => {
      console.log(erro);
    });
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
