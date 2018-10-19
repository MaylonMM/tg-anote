import { Variavel } from './../../models/variavel.model';
import { Formula } from './../../models/formula.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import firebase from 'firebase';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-cad-anotacao',
  templateUrl: 'cad-anotacao.html',
})
export class CadAnotacaoPage {

  uid: any = undefined;
  titulo: string = "";
  tipo: string = "";
  disciplina: any = "";
  startTime: any = undefined;
  endTime: any = undefined;
  diaTodo: boolean = false;
  obs: string = "";

  formula: Formula = {
    tipo: "",
    expressao: "",
    variaveis: []
  }
  variavel: Variavel = {
    nome: "",
    valor: 0
  }

  disciplinas: any[] = [];
  selectOptDisciplina: any = {};
  tipos: string[] = [];
  selectOptTipo: any = {};
  selectOptNota: any = {};

  editando: boolean = false;
  anotacao: any = undefined;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.startTime = moment(this.startTime).add(moment(this.startTime).utcOffset(), 'm').toISOString();
    this.endTime = moment(this.endTime).add(moment(this.endTime).utcOffset() + 60, 'm').toISOString();
    this.selectOptDisciplina = {
      title: "Disciplinas",
      subTitle: "Selecione uma disciplina"
    };
    this.selectOptTipo = {
      title: "Tipos",
      subTitle: "Selecione um tipo de anotação"
    };
    this.selectOptNota = {
      title: "Notas",
      subTitle: "Selecione um uma nota para vincular a anotação"
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
    this.variavel = this.anotacao.data().variavel;
    this.carregarVariaveis();
  }

  salvar() {
    if(this.tipo == "Avaliação" || this.tipo == "Trabalho" || this.tipo == "Lição de Casa") {
      this.formula.variaveis.forEach((v) => {
        if(v.nome == this.variavel.nome) {
          v.valor = this.variavel.valor;
        }
      });

      firebase.firestore().collection("disciplinas").doc(this.disciplina).update({
        formula: this.formula
      }).then((doc) => {
        console.log("Nota atualizada");
      }).catch((erro) => {
        console.log("Não deu pra atualizar a nota", erro);
      });
    }

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
        user: this.uid,
        variavel: this.variavel
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
      obs: this.obs,
      variavel: this.variavel
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

  onSelectChangeDisc(select: any) {
    this.carregarVariaveis();
  }

  carregarVariaveis() {
    if(this.tipo == "Avaliação" || this.tipo == "Trabalho" || this.tipo == "Lição de Casa") {
      let loading = this.loadingCtrl.create({
        content: "Carregando Notas..."
      });
      loading.present();

      firebase.firestore().collection("disciplinas").doc(this.disciplina).get()
      .then((doc) => {
        this.formula = doc.data().formula;
        loading.dismiss();
      }).catch((erro) => {
        console.log(erro);
        loading.dismiss();
      });
    }
  }

  onSelectChangeNota(select: any) {
    this.formula.variaveis.forEach((v) => {
      if(v.nome == select) {
        console.log(v.valor);
        this.variavel.valor = v.valor;
        this.variavel.nome = v.nome;
      }
    });
  }

}
