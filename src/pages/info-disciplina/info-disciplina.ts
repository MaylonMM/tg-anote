import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';

import firebase from 'firebase';

import { Disciplina } from '../../models/disciplina.model';
import { Periodo } from '../../models/periodo.model';
import { Curso } from '../../models/curso.model';
import { Professor } from '../../models/professor.model';

@IonicPage()
@Component({
  selector: 'page-info-disciplina',
  templateUrl: 'info-disciplina.html',
})
export class InfoDisciplinaPage {

  disciplina: Disciplina;
  periodo: Periodo;
  curso: Curso;
  professor: Professor;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    this.disciplina = new Disciplina;
    this.periodo = new Periodo;
    this.curso = new Curso;
    this.professor = new Professor;

    this.professor.nome = "Sem professor"
  }

  ionViewDidEnter() {
    this.updatePage();
  }

  updatePage() {
    let dadosDisciplina = this.navParams.get("disciplina");

    if(dadosDisciplina != undefined) {
      this.disciplina = dadosDisciplina;

      let loading = this.loadingCtrl.create({
        content: "Carregando..."
      });
      loading.present();

      firebase.firestore().collection("periodos").doc(this.disciplina.periodo).get()
      .then((periodo) => {
        this.periodo = {
          nome: periodo.data().nome,
          sigla: periodo.data().sigla,
          tipo: periodo.data().tipo,
          user: periodo.data().user,
          curso: periodo.data().curso,
          id: periodo.id
        };
        firebase.firestore().collection("cursos").doc(this.periodo.curso).get()
        .then((curso) => {
          this.curso = {
            nome: curso.data().nome,
            sigla: curso.data().sigla,
            dataInicio: curso.data().dataInicio,
            dataFinalizacao: curso.data().dataFinalizacao,
            escola: curso.data().escola,
            user: curso.data().user,
            id: curso.id
          };
          if(this.disciplina.professor != "") {
            firebase.firestore().collection("professores").doc(this.disciplina.professor).get()
            .then((professor) => {
              this.professor = {
                nome: professor.data().nome,
                telefone: professor.data().telefone,
                email: professor.data().email,
                user: professor.data().user,
                id: professor.id
              };
              loading.dismiss();
            }).catch((erro) => {
              console.log(erro);
              loading.dismiss();
              this.toastCtrl.create({
                message: "Ocorreu um erro inesperado. :(",
                duration: 3000
              }).present();
            });
          } else {
            loading.dismiss();
          }
        }).catch((erro) => {
          console.log(erro);
          loading.dismiss();
          this.toastCtrl.create({
            message: "Ocorreu um erro inesperado. :(",
            duration: 3000
          }).present();
        });
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
    this.navCtrl.push('CadDisciplinaPage', {
      disciplina: this.disciplina,
      curso: this.curso
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

            firebase.firestore().collection("disciplinas").doc(this.disciplina.id).delete()
            .then(() => {
              this.navCtrl.setRoot('DisciplinasPage');
              loading.dismiss();
              this.toastCtrl.create({
                message: "Disciplina excluída.",
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
