import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-disciplinas',
  templateUrl: 'disciplinas.html',
})
export class DisciplinasPage {

  disciplinas: any[] = undefined;
  uid: any = undefined;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {

  }

  ionViewDidEnter() {
    this.update();

  }

  goCadDisciplina() {
    this.navCtrl.push('CadDisciplinaPage');

  }

  goInfo(disciplina) {
    this.navCtrl.push('InfoDisciplinaPage', {
      disciplina: disciplina
    });

  }

  update() {
    let user = firebase.auth().currentUser;

    if(user != null) {
      this.uid = firebase.auth().currentUser.uid;

      firebase.firestore().collection("disciplinas")
      .where("user", "==", this.uid)
      .orderBy("nome", "asc").get()
      .then((data) => {
        console.log("Disciplinas Encontradas");

        this.disciplinas = data.docs;
      }).catch((erro) => {
        console.log("Erro ao Encontrar Disciplinas");
        console.log(erro);
      });
    } else {
      this.uid = undefined;
    }

  }

}
