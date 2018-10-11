import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-cad-anotacao',
  templateUrl: 'cad-anotacao.html',
})
export class CadAnotacaoPage {

  uid: any = undefined;
  titulo: string = "";
  tipo: string = "";
  disciplina: any = undefined;
  startTime: any = undefined;
  endTime: any = undefined;
  diaTodo: boolean = false;
  obs: string = "";

  disciplinas: any[] = [];
  selectOptDisciplina: any = {};
  tipos: string[] = [];
  selectOptTipo: any = {};

  editando: boolean = false;
  anotacao: any = undefined;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.startTime = new Date().toISOString();
    this.endTime = new Date().toISOString();
    this.selectOptDisciplina = {
      title: "Disciplinas",
      subTitle: "Selecione uma disciplina"
    };
    this.selectOptTipo = {
      title: "Tipos",
      subTitle: "Selecione um tipo de anotação"
    };
    this.tipos = [
      "Avaliação",
      "Trabalho",
      "Lição de Casa",
      "Lembrete"
    ];
  }

  ionViewDidEnter() {
    this.updatePage();
  }

  updatePage() {
    let user = firebase.auth().currentUser;

    if(user != null) {
      this.uid = user.uid;

      let loadind = this.loadingCtrl.create({
        content: "Carregando Disciplinas..."
      });
      loadind.present();

      firebase.firestore().collection("disciplinas")
      .where("user", "==", this.uid)
      .orderBy("nome", "asc").get()
      .then((data) => {
        console.log("Disciplinas encontradas... Listando-as...");
        this.disciplinas = data.docs;
        loadind.dismiss();
      }).catch((erro) => {
        console.log("Erro ao tentar encontrar as disciplinas.");
        console.log(erro);
        loadind.dismiss();
      });
    } else {
      this.uid = undefined;
    }

    this.anotacao = this.navParams.get("anotacao");
    if(this.anotacao != undefined) {
      this.carregar();
    }
  }

  carregar() {
    this.editando = true;
    this.titulo = this.anotacao.data().titulo;
    this.tipo = this.anotacao.data().tipo;
    this.disciplina = this.navParams.get("disciplina");
    this.startTime = this.anotacao.data().startTime;
    this.endTime = this.anotacao.data().endTime;
    this.diaTodo = this.anotacao.data().diaTodo;
    this.obs = this.anotacao.data().obs;
  }

  salvar() {
    if(!this.editando) {
      let loading = this.loadingCtrl.create({
        content: "Salvando..."
      });
      loading.present();

      firebase.firestore().collection("anotacoes").add({
        titulo: this.titulo,
        tipo: this.tipo,
        disciplina: this.disciplina,
        startTime: this.startTime,
        endTime: this.endTime,
        diaTodo: this.diaTodo,
        obs: this.obs,
        user: this.uid
      }).then(() => {
        console.log("Anotação cadastrada!");
        loading.dismiss();
        this.navCtrl.setRoot('AgendaPage');
        this.toastCtrl.create({
          message: "Anotação cadastrada com sucesso!",
          duration: 3000
        }).present();
      }).catch((erro) => {
        console.log("Erro ao cadastrar a anotação");
        console.log(erro);
        loading.dismiss();
        this.toastCtrl.create({
          message: "Ocorreu um erro ao cadastrar essa anotação. Por favor, tente novamente.",
          duration: 3000
        }).present();
      });
    } else {
      this.atualizar();
    }
  }

  atualizar() {
    let loading = this.loadingCtrl.create({
      content: "Atualizando..."
    });
    loading.present();

    firebase.firestore().collection("anotacoes").doc(this.anotacao.id).update({
      titulo: this.titulo,
      tipo: this.tipo,
      disciplina: this.disciplina,
      startTime: this.startTime,
      endTime: this.endTime,
      diaTodo: this.diaTodo,
      obs: this.obs
    }).then(() => {
      console.log("Anotação Atualizada");
      loading.dismiss();
      this.navCtrl.setRoot('AgendaPage');
      this.toastCtrl.create({
        message: "Anotação atualizada com sucesso!",
        duration: 3000
      }).present();
    }).catch((erro) => {
      console.log("Erro ao atualizar a disciplina");
      console.log(erro);
      loading.dismiss();
      this.toastCtrl.create({
        message: "Infelizmente ocorreu um erro ao atualizar a disciplina, por favor tente novamente.",
        duration: 3000
      }).present();
    });
  }

}
