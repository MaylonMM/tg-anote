import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';

import firebase from 'firebase';
import moment from 'moment';

import { Anotacao } from '../../models/anotacao.model';
import { Disciplina } from '../../models/disciplina.model';
import { Variavel } from '../../models/variavel.model';

@IonicPage()
@Component({
  selector: 'page-info-anotacao',
  templateUrl: 'info-anotacao.html',
})
export class InfoAnotacaoPage {

  anotacao: Anotacao;
  disciplina: Disciplina;
  variavel: Variavel;
  startTime: string;
  endTime: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    moment.locale('pt-BR');
    this.anotacao = new Anotacao;
    this.disciplina = new Disciplina;
    this.variavel = new Variavel;
    this.startTime = "Carregando...";
    this.endTime = "Carregando...";
  }

  ionViewDidEnter() {
    this.updatePage();
  }

  updatePage() {
    let dadosAnotacao = this.navParams.get("anotacao");

    if(dadosAnotacao != undefined) {
      this.anotacao = dadosAnotacao;

      let loading = this.loadingCtrl.create({
        content: "Carregando Informações..."
      });
      loading.present();

      if(this.anotacao.disciplina != "") {
        firebase.firestore().collection("disciplinas").doc(this.anotacao.disciplina).get()
        .then((disciplina) => {
          this.disciplina = {
            nome: disciplina.data().nome,
            sigla: disciplina.data().sigla,
            periodo: disciplina.data().periodo,
            notaMin: disciplina.data().notaMin,
            notaMed: disciplina.data().notaMed,
            notaMax: disciplina.data().notaMax,
            formula: disciplina.data().formula,
            user: disciplina.data().user,
            id: disciplina.id
          };

          if(this.anotacao.variavel != '') {
            this.disciplina.formula.variaveis.forEach((v) => {
              if(v.nome == this.anotacao.variavel) {
                this.variavel.nome = v.nome;
                this.variavel.valor = v.valor;
              }
            });
          }
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

      if(this.anotacao.diaTodo) {
        this.startTime = moment(new Date(this.anotacao.startTime)).add(moment(new Date(this.anotacao.startTime)).utcOffset() * -1, 'm').format("L");
        this.endTime = moment(new Date(this.anotacao.endTime)).add(moment(new Date(this.anotacao.endTime)).utcOffset() * -1, 'm').format("L");
      } else {
        this.startTime = moment(new Date(this.anotacao.startTime)).add(moment(new Date(this.anotacao.startTime)).utcOffset() * -1, 'm').format("L LT");
        this.endTime = moment(new Date(this.anotacao.endTime)).add(moment(new Date(this.anotacao.endTime)).utcOffset() * -1, 'm').format("L LT");
      }
    }
  }

  alterar() {
    this.navCtrl.push('CadAnotacaoPage', {
      anotacao: this.anotacao,
      disciplina: this.disciplina,
    });
  }

  deletar() {
    this.alertCtrl.create({
      title: "Cuidado",
      message: "Você REALMENTE deseja excluir essa anotação?",
      buttons: [
        {
          text: "Não"
        },
        {
          text: "Sim",
          handler: () => {
            firebase.firestore().collection("anotacoes").doc(this.anotacao.id).delete()
            .then(() => {
              console.log("Anotação Excluida");
              this.navCtrl.setRoot('AgendaPage');
              this.toastCtrl.create({
                message: "Anotação excluida com sucesso!",
                duration: 3000
              }).present();
            }).catch(() => {
              this.toastCtrl.create({
                message: "Infelizmente ocorreu um erro ao excluir a anotação. Por favor, tente novamente...",
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
