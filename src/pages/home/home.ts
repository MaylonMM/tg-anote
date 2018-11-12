import { Component } from '@angular/core';
import { NavController, IonicPage, ToastController, LoadingController } from 'ionic-angular';

import * as firebase from 'firebase';
import 'firebase/firestore';
import moment from 'moment';

import { Anotacao } from '../../models/anotacao.model';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  user: any;
  momento: string;
  proxSemana: string;
  anotacoes: Anotacao[];
  todasAnotacoes: Anotacao[];
  msgApresentacao: string;
  avaliacao: Anotacao;
  trabalho: Anotacao;
  licao: Anotacao;

  startTimeAvaliacao: string;
  endTimeAvaliacao: string;
  startTimeTrabalho: string;
  endTimeTrabalho: string;
  startTimeLicao: string;
  endTimeLicao: string;

  constructor(
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    moment.locale('pt-BR');

    this.user = undefined;
    this.momento = moment(new Date).add(moment(new Date).utcOffset(), "m").toISOString();
    this.proxSemana = moment(this.momento).add(1, "w").toISOString();
    this.anotacoes = [];
    this.todasAnotacoes = [];
    this.msgApresentacao = "";
    this.avaliacao = new Anotacao;
    this.trabalho = new Anotacao;
    this.licao = new Anotacao;

    this.startTimeAvaliacao = "";
    this.endTimeAvaliacao = "";
    this.startTimeTrabalho = "";
    this.endTimeTrabalho = "";
    this.startTimeLicao = "";
    this.endTimeLicao = "";
  }

  ionViewDidEnter() {
    this.updatePage();
  }

  updatePage() {
    let user = firebase.auth().currentUser;

    this.carregarApresentacao();

    if(user != null) {
      this.user = user;
      this.buscarAnotacoes();
      this.buscarProximasAnotacoes();
    }
  }

  carregarApresentacao() {
    let horario = moment(new Date()).hour();
    console.log(horario);

    if(horario < 6) {
      this.msgApresentacao = "Boa noite";
    } else if(horario < 12) {
      this.msgApresentacao = "Bom dia";
    } else if(horario < 18) {
      this.msgApresentacao = "Boa tarde";
    } else {
      this.msgApresentacao = "Boa noite";
    }
  }

  logout() {
    if(firebase.auth().currentUser != null) {
      firebase.auth().signOut()
      .then(() => {
        this.toastCtrl.create({
          message: "Você se desconectou com sucesso.",
          duration: 3000
        }).present();

        this.navCtrl.setRoot('LoginPage');
      }).catch(() => {
        this.toastCtrl.create({
          message: "Erro ao tentar desconectar.",
          duration: 3000
        }).present();
      });
    } else {
      this.navCtrl.setRoot('LoginPage');
    }
  }

  buscarAnotacoes() {
    let loading = this.loadingCtrl.create({
      content: "Carregando..."
    });
    loading.present();

    firebase.firestore().collection("anotacoes")
    .where("user", "==", this.user.uid)
    .where("startTime", ">=", this.momento)
    .where("startTime", "<=", this.proxSemana)
    .get()
    .then((data) => {
      this.anotacoes = [];
      data.docs.forEach((anotacao) => {
        this.anotacoes.push({
          titulo: anotacao.data().titulo,
          tipo: anotacao.data().tipo,
          disciplina: anotacao.data().disciplina,
          diaTodo: anotacao.data().diaTodo,
          startTime: anotacao.data().startTime,
          endTime: anotacao.data().endTime,
          obs: anotacao.data().obs,
          variavel: anotacao.data().variavel,
          image: anotacao.data().image,
          user: anotacao.data().user,
          id: anotacao.id
        });
      });
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

  buscarProximasAnotacoes() {
    let loading = this.loadingCtrl.create({
      content: "Carregando..."
    });
    loading.present();

    firebase.firestore().collection("anotacoes")
    .where("user", "==", this.user.uid)
    .where("startTime", ">=", this.momento)
    .orderBy("startTime", "asc")
    .get()
    .then((data) => {
      let a = false;
      let t = false;
      let l = false;

      this.todasAnotacoes = [];
      data.docs.forEach((anotacao) => {
        this.todasAnotacoes.push({
          titulo: anotacao.data().titulo,
          tipo: anotacao.data().tipo,
          disciplina: anotacao.data().disciplina,
          diaTodo: anotacao.data().diaTodo,
          startTime: anotacao.data().startTime,
          endTime: anotacao.data().endTime,
          obs: anotacao.data().obs,
          variavel: anotacao.data().variavel,
          image: anotacao.data().image,
          user: anotacao.data().user,
          id: anotacao.id
        });
      });

      this.todasAnotacoes.forEach((anotacao) => {
        if(anotacao.tipo == "Avaliação" && a == false) {
          a = true;
          this.avaliacao = anotacao;

          if(anotacao.diaTodo) {
            this.startTimeAvaliacao = moment(new Date(anotacao.startTime)).add(moment(new Date(anotacao.startTime)).utcOffset() * -1, 'm').format("L");
            this.endTimeAvaliacao = moment(new Date(anotacao.endTime)).add(moment(new Date(anotacao.endTime)).utcOffset() * -1, 'm').format("L");
          } else {
            this.startTimeAvaliacao = moment(new Date(anotacao.startTime)).add(moment(new Date(anotacao.startTime)).utcOffset() * -1, 'm').format("L LT");
            this.endTimeAvaliacao = moment(new Date(anotacao.endTime)).add(moment(new Date(anotacao.endTime)).utcOffset() * -1, 'm').format("L LT");
          }
        }

        if(anotacao.tipo == "Trabalho" && t == false) {
          t = true;
          this.trabalho = anotacao;

          if(anotacao.diaTodo) {
            this.startTimeTrabalho= moment(new Date(anotacao.startTime)).add(moment(new Date(anotacao.startTime)).utcOffset() * -1, 'm').format("L");
            this.endTimeTrabalho = moment(new Date(anotacao.endTime)).add(moment(new Date(anotacao.endTime)).utcOffset() * -1, 'm').format("L");
          } else {
            this.startTimeTrabalho = moment(new Date(anotacao.startTime)).add(moment(new Date(anotacao.startTime)).utcOffset() * -1, 'm').format("L LT");
            this.endTimeTrabalho = moment(new Date(anotacao.endTime)).add(moment(new Date(anotacao.endTime)).utcOffset() * -1, 'm').format("L LT");
          }
        }

        if(anotacao.tipo == "Lição de Casa" && l == false) {
          l = true;
          this.licao = anotacao;

          if(anotacao.diaTodo) {
            this.startTimeLicao= moment(new Date(anotacao.startTime)).add(moment(new Date(anotacao.startTime)).utcOffset() * -1, 'm').format("L");
            this.endTimeLicao = moment(new Date(anotacao.endTime)).add(moment(new Date(anotacao.endTime)).utcOffset() * -1, 'm').format("L");
          } else {
            this.startTimeLicao = moment(new Date(anotacao.startTime)).add(moment(new Date(anotacao.startTime)).utcOffset() * -1, 'm').format("L LT");
            this.endTimeLicao = moment(new Date(anotacao.endTime)).add(moment(new Date(anotacao.endTime)).utcOffset() * -1, 'm').format("L LT");
          }
        }
      });

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

  goAgenda() {
    this.navCtrl.push('AgendaPage');
  }

  goAnotacao(anotacao: Anotacao) {
    this.navCtrl.push('InfoAnotacaoPage', {
      anotacao: anotacao
    });
  }

}
