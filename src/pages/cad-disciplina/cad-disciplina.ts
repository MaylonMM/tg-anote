import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, ModalController } from 'ionic-angular';

import firebase from 'firebase';

import { Disciplina } from '../../models/disciplina.model';
import { Curso } from '../../models/curso.model';
import { Periodo } from '../../models/periodo.model';
import { SelectOpt } from '../../models/selectOpt.model';

@IonicPage()
@Component({
  selector: 'page-cad-disciplina',
  templateUrl: 'cad-disciplina.html',
})
export class CadDisciplinaPage {

  uid: string;
  disciplina: Disciplina;
  curso: Curso;
  cursos: Curso[];
  periodos: Periodo[];
  selectOptCurso: SelectOpt;
  selectOptPeriodo: SelectOpt;
  edit: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    public modalCtrl: ModalController
  ) {
    this.uid = "";
    this.disciplina = new Disciplina;
    this.curso = new Curso;
    this.cursos = [];
    this.periodos = [];
    this.selectOptCurso = { title: "Cursos", subTitle: "Selecione um curso" };
    this.selectOptPeriodo = { title: "Sem Períodos", subTitle: "Selecione um curso para listar seus períodos" };
    this.edit = false;
  }

  ionViewDidEnter() {
    this.updatePage();
  }

  updatePage() {
    let user = firebase.auth().currentUser;
    let dadosDisciplina = this.navParams.get("disciplina");

    if(user != null) {
      this.uid = user.uid;
      let loading = this.loadingCtrl.create({
        content: "Carregando Cursos..."
      });
      loading.present();

      firebase.firestore().collection("cursos")
      .where("user", "==", this.uid)
      .orderBy("nome", "asc").get()
      .then((data) => {
        this.cursos = [];
        data.docs.forEach((curso) => {
          this.cursos.push({
            nome: curso.data().nome,
            sigla: curso.data().sigla,
            escola: curso.data().escola,
            dataInicio: curso.data().dataInicio,
            dataFinalizacao: curso.data().dataFinalizacao,
            user: curso.data().user,
            id: curso.id
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

    if(dadosDisciplina != undefined) {
      this.edit = true;
      this.disciplina = dadosDisciplina;
      this.curso = this.navParams.get("curso");
      this.onChangeCurso();
    }
  }

  onChangeCurso() {
    let loading = this.loadingCtrl.create({
      content: "Carregando Períodos..."
    });
    loading.present();

    firebase.firestore().collection("periodos")
    .where("user", "==", this.uid)
    .where("curso", "==", this.curso.id)
    .orderBy("nome", "asc").get()
    .then((data) => {
      this.periodos = [];
      data.docs.forEach((periodo) => {
        this.periodos.push({
          nome: periodo.data().nome,
          sigla: periodo.data().sigla,
          tipo: periodo.data().tipo,
          curso: periodo.data().curso,
          user: periodo.data().user,
          id: periodo.id
        });
      });
      loading.dismiss();
      this.selectOptPeriodo = { title: "Períodos", subTitle: "Selecione um período" };
    }).catch((erro) => {
      console.log(erro);
      loading.dismiss();
      this.toastCtrl.create({
        message: "Ocorreu um erro inesperado. :(",
        duration: 3000
      }).present();
    });
  }

  salvar() {
    if(this.edit) {
      this.atualizar();
    } else {
      let loading = this.loadingCtrl.create({
        content: "Salvando..."
      });
      loading.present();

      firebase.firestore().collection("disciplinas").add({
        nome: this.disciplina.nome,
        sigla: this.disciplina.sigla,
        notaMin: this.disciplina.notaMin,
        notaMed: this.disciplina.notaMed,
        notaMax: this.disciplina.notaMax,
        formula: this.disciplina.formula,
        periodo: this.disciplina.periodo,
        user: this.uid
      }).then(() => {
        this.navCtrl.setRoot('DisciplinasPage');
        loading.dismiss();
        this.toastCtrl.create({
          message: "Disciplina cadastrada com sucesso! :)",
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

  atualizar() {
    let loading = this.loadingCtrl.create({
      content: "Atualizando..."
    });
    loading.present();

    firebase.firestore().collection("disciplinas").doc(this.disciplina.id).update({
      nome: this.disciplina.nome,
      sigla: this.disciplina.sigla,
      notaMin: this.disciplina.notaMin,
      notaMed: this.disciplina.notaMed,
      notaMax: this.disciplina.notaMax,
      formula: this.disciplina.formula,
      periodo: this.disciplina.periodo
    }).then(() => {
      this.navCtrl.setRoot('DisciplinasPage');
      loading.dismiss();
      this.toastCtrl.create({
        message: "Disciplina atualizada! :)",
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

  addFormula() {
    let pageAddFormula = this.modalCtrl.create('CadFormulaPage', {
      disciplina: this.disciplina
    });
    pageAddFormula.onDidDismiss(data => {
      if(data != undefined) {
        this.disciplina.formula = data.formula;
      }
    });
    pageAddFormula.present();
  }

  voltar() {
    if(this.navCtrl.canGoBack()) {
      this.navCtrl.pop();
    } else {
      this.navCtrl.setRoot('HomePage');
    }
  }

}
