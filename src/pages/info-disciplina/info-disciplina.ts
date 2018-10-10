import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-info-disciplina',
  templateUrl: 'info-disciplina.html',
})
export class InfoDisciplinaPage {

  disciplina: any = {};
  periodo: any = {};
  curso: any = {};

  nomePeriodo: string = "";
  nomeCurso: string = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    this.disciplina = this.navParams.get("disciplina");

    if(this.disciplina == undefined) {
      this.navCtrl.setRoot('DisciplinasPage');
    } else {
      this.updatePage();
    }

  }

  updatePage() {
    firebase.firestore().collection("periodos").doc(this.disciplina.data().periodo).get()
    .then((doc) => {
      console.log("Periodo Encontrado");
      this.periodo = doc;
      this.nomePeriodo = this.periodo.data().nome;

      firebase.firestore().collection("cursos").doc(this.periodo.data().curso).get()
      .then((doc) => {
        console.log("Curso Encontrado");
        this.curso = doc;
        this.nomeCurso = this.curso.data().nome;
      }).catch((erro) => {
        console.log("Erro ao Encontrar o Curso: ", this.periodo.data().curso);
        console.log(erro);
      });
    }).catch((erro) => {
      console.log("Erro ao Encontrar o Periodo: ", this.disciplina.data().periodo);
      console.log(erro);
    });

  }

  alterar() {
    this.navCtrl.push('CadDisciplinaPage', {
      disciplina: this.disciplina,
      periodo: this.periodo,
      nomePeriodo: this.nomePeriodo,
      curso: this.curso,
      nomeCurso: this.nomeCurso,
      periodoId: this.periodo.id,
      cursoId: this.curso.id
    });

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
            firebase.firestore().collection("disciplinas").doc(this.disciplina.id).delete()
            .then(() => {
              console.log("Disciplina Excluida");
              this.navCtrl.setRoot('CursosPage');
              this.toastCtrl.create({
                message: "Disciplina excluida com sucesso.",
                duration: 3000
              }).present();
            }).catch(() => {
              this.toastCtrl.create({
                message: "Não foi possivel excluir a disciplina.",
                duration: 3000
              }).present();
            });
          }
        }
      ]
    }).present();

  }
}
