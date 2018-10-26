import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';

import firebase from 'firebase';

import { Professor } from '../../models/professor.model';
import { Disciplina } from '../../models/disciplina.model';

@IonicPage()
@Component({
  selector: 'page-info-professor',
  templateUrl: 'info-professor.html',
})
export class InfoProfessorPage {

  professor: Professor;
  disciplinasDoProf: Disciplina[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    this.professor = new Professor;
    this.disciplinasDoProf = [];
  }

  ionViewDidEnter() {
    this.updatePage();
  }

  updatePage() {
    let dadosProfessor = this.navParams.get("professor");

    if(dadosProfessor != undefined) {
      this.professor = dadosProfessor;

      let loading = this.loadingCtrl.create({
        content: "Carregando..."
      });
      loading.present();

      firebase.firestore().collection("disciplinas")
      .where("professor", "==", this.professor.id)
      .orderBy("nome", "asc").get()
      .then((data) => {
        this.disciplinasDoProf = [];
        data.docs.forEach((disciplina) => {
          this.disciplinasDoProf.push({
            nome: disciplina.data().nome,
            sigla: disciplina.data().sigla,
            periodo: disciplina.data().periodo,
            notaMax: disciplina.data().notaMax,
            notaMed: disciplina.data().notaMed,
            notaMin: disciplina.data().notaMin,
            formula: disciplina.data().formula,
            professor: disciplina.data().professor,
            user: disciplina.data().user,
            id: disciplina.id
          });
        });
        console.log(this.disciplinasDoProf);
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

  alterar() {
    this.navCtrl.push('CadProfessorPage', {
      professor: this.professor,
      disciplinasDoProf: this.disciplinasDoProf
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
            let loading = this.loadingCtrl.create({
              content: "Deletando..."
            });
            loading.present();

            firebase.firestore().collection("professores").doc(this.professor.id).delete()
            .then(() => {
              this.navCtrl.setRoot('ProfessoresPage');
              loading.dismiss();
              this.toastCtrl.create({
                message: "Dados do(a) professor(a) excluídos.",
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
