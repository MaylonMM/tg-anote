import { Formula } from './../../models/formula.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, ModalController } from 'ionic-angular';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-cad-disciplina',
  templateUrl: 'cad-disciplina.html',
})
export class CadDisciplinaPage {

  nome: string = "";
  sigla: string = "";
  curso: any = undefined;
  periodo: any = undefined;
  notaMin: number = undefined;
  notaMed: number = undefined;
  notaMax: number = undefined;
  formula: Formula;

  uid: any = undefined;
  cursos: any[] = [];
  periodos: any[] = [];
  selectOptCurso: any = {};
  selectOptPeriodo: any = {};

  editando: boolean = false;
  disciplina: any = undefined;
  periodoId: any = undefined;
  cursoId: any = undefined;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    public modalCtrl: ModalController
  ) {
    this.selectOptCurso = {
      title: "Cursos",
      subTitle: "Selecione um curso"
    };
    this.selectOptPeriodo = {
      title: "Sem Períodos",
      subTitle: "Selecione um curso para listar seus períodos"
    };
    this.formula = {
      tipo: "media",
      expressao: "",
      variaveis: []
    }
  }

  ionViewDidEnter() {
    this.updatePage();

  }

  updatePage() {
    let user = firebase.auth().currentUser;

    if(user != null) {
      this.uid = user.uid;

      let load = this.loadingCtrl.create({
        content: "Carregando Cursos..."
      });
      load.present();

      firebase.firestore().collection("cursos")
      .where("user", "==", this.uid)
      .orderBy("nome", "asc").get()
      .then((data) => {
        console.log("Cursos Listados");
        this.cursos = data.docs;
        load.dismiss();

      }).catch((erro) => {
        console.log("Erro ao Listar Cursos");
        console.log(erro);
        load.dismiss();
      });
    } else {
      this.uid = undefined;
    }



    this.disciplina = this.navParams.get("disciplina");

    if(this.disciplina != undefined) {
      this.editando = true;

      this.nome = this.disciplina.data().nome;
      this.sigla = this.disciplina.data().sigla;
      this.curso = this.navParams.get("nomeCurso");
      this.cursoId = this.navParams.get("cursoId");

      firebase.firestore().collection("periodos")
      .where("user", "==", this.uid)
      .where("curso", "==", this.cursoId)
      .orderBy("nome", "asc").get()
      .then((data) => {
        console.log("Periodos Listados");
        this.periodos = data.docs;
        this.selectOptPeriodo = {
          title: "Períodos",
          subTitle: "Selecione um período"
        };
        this.periodo = this.navParams.get("periodoId");
      }).catch((erro) => {
        console.log("Erro ao Listar Periodos");
        console.log(erro);
      });

      this.notaMin = this.disciplina.data().notaMin;
      this.notaMax = this.disciplina.data().notaMax;
      this.notaMed = this.disciplina.data().notaMed;
      this.formula = this.disciplina.data().formula;
      this.periodoId = this.navParams.get("periodoId");
    }

  }

  onSelectChange(selectedValue: any) {
    let load = this.loadingCtrl.create({
      content: "Carregando Períodos..."
    });
    load.present();

    let i = 0;
    firebase.firestore().collection("cursos")
    .where("nome", "==", selectedValue).get()
    .then((data) => {
      console.log("Curso Encontrado");
      data.docs.forEach((doc) => {
        if(i == 0) {
          i++;

          firebase.firestore().collection("periodos")
          .where("user", "==", this.uid)
          .where("curso", "==", doc.id)
          .orderBy("nome", "asc").get()
          .then((data) => {
            console.log("Periodos Listados");
            this.periodos = data.docs;
            load.dismiss();
            this.selectOptPeriodo = {
              title: "Períodos",
              subTitle: "Selecione um período"
            };
          }).catch((erro) => {
            console.log("Erro ao Listar Periodos");
            console.log(erro);
            load.dismiss();
          });
        }
      });
    }).catch((erro) => {
      console.log("Erro ao Encontrar Curso");
      console.log(erro);
      load.dismiss();
    });

  }

  salvar() {
    let load = this.loadingCtrl.create({
      content: "Salvando..."
    });
    load.present();

    if(this.formula.expressao == "") {
      this.formula.expressao = "0";
    }

    if(!this.editando) {
      firebase.firestore().collection("disciplinas").add({
        nome: this.nome,
        sigla: this.sigla,
        notaMin: this.notaMin,
        notaMed: this.notaMed,
        notaMax: this.notaMax,
        formula: this.formula,
        periodo: this.periodo,
        user: this.uid
      }).then((doc) => {
        console.log("Disciplina Cadastrada");
        load.dismiss();
        this.navCtrl.setRoot('DisciplinasPage');

        this.toastCtrl.create({
          message: "Disciplina cadastrada com sucesso!",
          duration: 3000
        }).present();
      }).catch((erro) => {
        console.log("Erro ao Cadastrar a Disciplina");
        console.log(erro);
        load.dismiss();

        this.toastCtrl.create({
          message: "Ocorreu um erro ao cadastrar essa disciplina. Por favor, tente novamente.",
          duration: 3000
        }).present();
      });

    } else {
      firebase.firestore().collection("disciplinas").doc(this.disciplina.id).update({
        nome: this.nome,
        sigla: this.sigla,
        notaMin: this.notaMin,
        notaMed: this.notaMed,
        notaMax: this.notaMax,
        formula: this.formula,
        periodo: this.periodo
      }).then(() => {
        console.log("Disciplina Atualizada");
        load.dismiss();
        this.navCtrl.setRoot('DisciplinasPage');
        this.toastCtrl.create({
          message: "Disciplina atualizada com sucesso!",
          duration: 3000
        }).present();
      }).catch((erro) => {
        console.log("Erro ao Atualizar a Disciplina");
        console.log(erro);
        load.dismiss();
        this.toastCtrl.create({
          message: "Ocorreu um erro ao atualizar a disciplina",
          duration: 3000
        }).present();
      });
    }
  }

  addFormula() {
    let pageAddFormula = this.modalCtrl.create('CadFormulaPage', {
      formula: this.formula,
      disciplina: this.nome
    });
    pageAddFormula.onDidDismiss(data => {
      if(data != undefined) {
        this.formula = data.formula;
      }
    });
    pageAddFormula.present();
  }

}
