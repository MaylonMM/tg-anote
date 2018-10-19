import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import firebase from 'firebase';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-info-anotacao',
  templateUrl: 'info-anotacao.html',
})
export class InfoAnotacaoPage {

  anotacao: any = {};
  disciplina: any = {
    nome: "Nenhuma",
    id: ""
  };
  diaTodo: string = "Não";
  dataInicial: any = {};
  dataFinal: any = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    moment.locale('pt-BR');
    this.anotacao = this.navParams.get("data");

    if(this.anotacao == undefined) {
      this.navCtrl.setRoot('DisciplinasPage');
    } else {
      this.updatePage();
    }
  }

  updatePage() {
    let loading = this.loadingCtrl.create({
      content: "Carregando Informações..."
    });
    loading.present();

    if(this.anotacao.data().disciplina != "") {
      firebase.firestore().collection("disciplinas").doc(this.anotacao.data().disciplina).get()
      .then((doc) => {
        console.log("Disciplina encontrada");
        this.disciplina = {
          nome: doc.data().nome,
          id: doc.id
        };
        loading.dismiss();
      }).catch((erro) => {
        console.log("Erro ao encontrar a disciplina");
        console.log(erro);
        loading.dismiss();
      });
    } else {
      loading.dismiss();
    }

    if(this.anotacao.data().diaTodo) {
      this.diaTodo = "Sim";
    }

    this.dataInicial = moment(new Date(this.anotacao.data().startTime)).add(moment(new Date(this.anotacao.data().startTime)).utcOffset() * -1, 'm').format("L LT");
    this.dataFinal = moment(new Date(this.anotacao.data().endTime)).add(moment(new Date(this.anotacao.data().endTime)).utcOffset() * -1, 'm').format("L LT");
  }

  alterar() {
    this.navCtrl.push('CadAnotacaoPage', {
      anotacao: this.anotacao,
      disciplina: this.disciplina.id
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

}
