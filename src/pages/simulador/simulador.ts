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
            professor: disciplina.data().professor,
            user: disciplina.data().user
          });
        });
        loadind.dismiss();
      }).catch((erro) => {
        loadind.dismiss();
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
    let preNota = 0;

    this.disciplina.formula.variaveis.forEach((v) => {
      let inc = "";

      if(v.valor.toString() == "") {
        v.valor = 0;
      }

      inc = inc + v.nome + " = " + v.valor;
      parser.eval(inc);
    });

    preNota = parser.eval(this.disciplina.formula.expressao);

    if(preNota < this.disciplina.notaMin) {
      this.nota = this.disciplina.notaMin;
    } else if(preNota > this.disciplina.notaMax) {
      this.nota = this.disciplina.notaMax;
    } else {
      this.nota = preNota;
    }

    console.log(this.nota, this.disciplina.notaMed);
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
