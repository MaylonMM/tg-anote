import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, ViewController } from 'ionic-angular';

import firebase from 'firebase';

import { Professor } from '../../models/professor.model';
import { Disciplina } from '../../models/disciplina.model';

@IonicPage()
@Component({
  selector: 'page-cad-professor',
  templateUrl: 'cad-professor.html',
})
export class CadProfessorPage {

  uid: string;
  professor: Professor;
  professores: Professor[];
  disciplinasDoProf: Disciplina[];
  disciplina: Disciplina;
  edit: boolean;
  novo: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.uid = "";
    this.professor = new Professor;
    this.professores = [];
    this.disciplinasDoProf = [];
    this.disciplina = new Disciplina
    this.edit = false;
    this.novo = false;
  }

  ionViewDidEnter() {
    this.updatePage();
  }

  updatePage() {
    let user = firebase.auth().currentUser;
    let dadosProfessor = this.navParams.get("professor");
    let dadosProfessores = this.navParams.get("professores");

    if (user != null) {
      this.uid = user.uid;
    }

    if(dadosProfessor != undefined) {
      this.edit = true;
      this.professor = dadosProfessor;
      this.disciplinasDoProf = this.navParams.get("disciplinasDoProf");
    }

    if(dadosProfessores != undefined) {
      this.novo = true;
      this.professores = dadosProfessores;
    }
  }

  salvar() {
    if(this.edit) {
      this.atualizar();
    } else {
      let loading = this.loadingCtrl.create({
        content: "Salvando..."
      });
      loading.present();

      firebase.firestore().collection("professores").add({
        nome: this.professor.nome,
        telefone: this.professor.telefone,
        email: this.professor.email,
        user: this.uid
      }).then((doc) => {
        if(this.novo) {
          loading.dismiss();
          this.professores.push(this.professor);
          let data = {
            professores: this.professores,
            id: doc.id
          };
          this.viewCtrl.dismiss(data);
        } else {
          this.navCtrl.setRoot('ProfessoresPage');
          loading.dismiss();
          this.toastCtrl.create({
            message: "Professor(a) cadastrado(a)! :)",
            duration: 3000
          }).present();
        }
      }).catch((erro) => {
        console.log(erro);
        loading.dismiss();
        this.toastCtrl.create({
          message: "Ocorreu um erro inesperado. :(",
          duration: 3000
        }).present();
      })
    }
  }

  atualizar() {
    let loading = this.loadingCtrl.create({
      content: "Atualizando..."
    });
    loading.present();

    firebase.firestore().collection("professores").doc(this.professor.id).update({
      nome: this.professor.nome,
      telefone: this.professor.telefone,
      email: this.professor.email
    }).then(() => {
      this.navCtrl.setRoot('ProfessoresPage');
      loading.dismiss();
      this.toastCtrl.create({
        message: "Professor(a) atualizado(a)! :)",
        duration: 3000
      }).present();
    }).catch((erro) => {
      console.log(erro);
      loading.dismiss();
      this.toastCtrl.create({
        message: "Ocorreu um erro inesperado. :(",
        duration: 3000
      }).present();
    })
  }

  removerDisciplina(disciplina) {
    let loading = this.loadingCtrl.create({
      content: "Removendo..."
    });
    loading.present();

    this.disciplina = disciplina;
    this.disciplina.professor = "";

    firebase.firestore().collection("disciplinas").doc(this.disciplina.id).update({
      professor: this.disciplina.professor
    }).then(() => {
      let index = this.disciplinasDoProf.indexOf(this.disciplina);
      if(index > -1) {
        this.disciplinasDoProf.splice(index, 1);
      }
      loading.dismiss();
    }).catch((erro) => {
      console.log(erro);
      loading.dismiss();
      this.toastCtrl.create({
        message: "Ocorreu um erro inesperado. :(",
        duration: 3000
      }).present();
    })
  }

  voltar() {
    if(this.novo) {
      this.viewCtrl.dismiss();
    } else {
      if(this.navCtrl.canGoBack()) {
        this.navCtrl.pop();
      } else {
        this.navCtrl.setRoot('HomePage');
      }
    }
  }

}
