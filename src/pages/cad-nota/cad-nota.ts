import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';

import firebase from 'firebase';
import * as math from 'mathjs';

import { Disciplina } from '../../models/disciplina.model';
import { SelectOpt } from './../../models/selectOpt.model';

@IonicPage()
@Component({
  selector: 'page-cad-nota',
  templateUrl: 'cad-nota.html',
})
export class CadNotaPage {

  uid: string;
  disciplinas: Disciplina[];
  disciplina: Disciplina;
  selectOptDisciplina: SelectOpt;
  nota: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {
    this.uid = "";
    this.disciplinas = [];
    this.disciplina = new Disciplina;
    this.selectOptDisciplina = {
      title: 'Disciplinas',
      subTitle: 'Seleciona uma disciplina'
    };
    this.nota = 0;
  }

  ionViewDidEnter() {
    this.updatePage();
  }

  updatePage() {
    let user = firebase.auth().currentUser;

    if(user != null) {
      let loadind = this.loadingCtrl.create({
        content: "Carregando Disciplinas..."
      });

      loadind.present();
      this.uid = user.uid;

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
            notaMax: disciplina.data().notaMax,
            notaMed: disciplina.data().notaMed,
            notaMin: disciplina.data().notaMin,
            formula: disciplina.data().formula,
            professor: disciplina.data().professor,
            user: disciplina.data().user,
            id: disciplina.id
          });
        });
        loadind.dismiss();
      }).catch((erro) => {
        console.log(erro);
        this.toastCtrl.create({
          message: "Ocorreu um erro inesperado. :(",
          duration: 3000
        }).present();
      });
    }
  }

  calcular() {
    const parser = math.parser();

    this.disciplina.formula.variaveis.forEach((v) => {
      let inc = "";

      if(v.valor.toString() == "") {
        v.valor = 0;
      }

      inc = inc + v.nome + " = " + v.valor;
      parser.eval(inc);
    });

    this.nota = parser.eval(this.disciplina.formula.expressao);
  }

  onSelectDisciplina(select: any) {
    this.disciplinas.forEach((disc) => {
      if(disc.nome == select) {
        this.disciplina = disc;
      }
    });

    this.calcular();
  }

  salvar() {
    let loadind = this.loadingCtrl.create({
      content: "Salvando Notas..."
    });

    loadind.present();
    this.calcular();

    firebase.firestore().collection("disciplinas").doc(this.disciplina.id).update({
      formula: this.disciplina.formula
    }).then(() => {
      //trocar para um pop() futuramente
      this.navCtrl.setRoot('HomePage');
      loadind.dismiss();
      this.toastCtrl.create({
        message: "Suas notas foram salvas! :)",
        duration: 3000
      }).present();
    }).catch((erro) => {
      loadind.dismiss();
      console.log(erro);
      this.toastCtrl.create({
        message: "Ocorreu um erro inesperado. :(",
        duration: 3000
      }).present();
    });
  }

  voltar() {
    //trocar para um pop() futuramente
    this.navCtrl.setRoot('HomePage');
  }

}
