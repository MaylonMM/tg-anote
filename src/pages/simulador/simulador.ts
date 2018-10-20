import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import firebase from 'firebase';
import * as math from 'mathjs';

import { Disciplina } from '../../models/disciplina.model';
import { SelectOpt } from './../../models/selectOpt.model';

@IonicPage()
@Component({
  selector: 'page-simulador',
  templateUrl: 'simulador.html',
})
export class SimuladorPage {

  uid: string;
  disciplinas: Disciplina[];
  disciplina: Disciplina;
  selectOptDisciplina: SelectOpt;
  nota: number;
  result: string;

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
    this.result = "";
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
            user: disciplina.data().user
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

  onSelectDisciplina(select: any) {
    this.disciplinas.forEach((disc) => {
      if(disc.nome == select) {
        this.disciplina = disc;
      }
    });
  }

  calcular() {
    const parser = math.parser();

    this.disciplina.formula.variaveis.forEach((v) => {
      let inc = "";
      inc = inc + v.nome + " = " + v.valor;
      parser.eval(inc);
    });

    this.nota = parser.eval(this.disciplina.formula.expressao);

    if(this.nota >= this.disciplina.notaMed) {
      this.result = "Aprovado!"
    } else {
      this.result = "Reprovado..."
    }
  }

  voltar() {
    this.navCtrl.setRoot('HomePage');
  }

}
