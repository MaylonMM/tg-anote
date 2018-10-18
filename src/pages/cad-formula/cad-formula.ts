import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import firebase from 'firebase';
import * as math from 'mathjs';
import { Formula } from '../../models/formula.model';

@IonicPage()
@Component({
  selector: 'page-cad-formula',
  templateUrl: 'cad-formula.html',
})
export class CadFormulaPage {

  formula: Formula;
  disciplina: any = undefined;

  uid: any = undefined;
  media: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController
  ) {
    this.formula = this.navParams.get("formula");
    this.disciplina = this.navParams.get("disciplina");

    if(this.formula.tipo == "media") {
      this.media = true;
    } else {
      this.media = false;
    }
  }

  ionViewDidEnter() {
    this.updatePage();
  }

  updatePage() {
    let user = firebase.auth().currentUser;

    if(user != null) {
      this.uid = user.uid;
    } else {
      this.uid = undefined;
    }

  }

  tecla(operacao: string) {
    if(this.formula.expressao == "0") {
      this.formula.expressao = "";
    }
    if(operacao == 'd') {
      this.formula.expressao = "0";
      this.formula.variaveis = [];
    } else if(operacao == 'f') {
      this.alertCtrl.create({
        title: "Nova Variável",
        message: "Nome da Variável (Ex.: P1)",
        inputs: [
          {
            name: "var",
            type: "text"
          }
        ],
        buttons: [
          {
            text: "Cancelar"
          },
          {
            text: "Adicionar",
            handler: (data) => {
              this.formula.variaveis.push({
                nome: data.var,
                valor: 0
              });
              if(this.formula.tipo == "media") {
                this.formula.expressao = this.getExpressao();
              } else {
                this.formula.expressao = this.formula.expressao + data.var;
              }
            }
          }
        ]
      }).present();
    } else {
      this.formula.expressao = this.formula.expressao + operacao;
    }
  }

  onSelectChange(selectedValue: any) {
    if(selectedValue.checked == true) {
      this.formula.tipo = "media";
      this.formula.expressao = this.getExpressao();
    } else {
      this.formula = {
        tipo: "pers",
        expressao: "0",
        variaveis: []
      };
    }
  }

  getExpressao() {
    let exp = "";

    if(this.formula.variaveis.length > 0) {
      exp = "(";
      let cont = 0;
      this.formula.variaveis.forEach((v) => {
        if(cont == 0) {
          exp = exp + v.nome;
        } else {
          exp = exp + "+" + v.nome;
        }
        cont++;
      });
      exp = exp + ")/" + this.formula.variaveis.length;
    } else {
      exp = "0"
    }

    return exp;
  }

  salvar() {
    if(this.validarExpressao()) {
      console.log("Expressão Válida! :)");
      let data = {
        formula: this.formula
      };
      this.viewCtrl.dismiss(data);
    } else {
      console.log("Expressão Inválida... :(");
      this.alertCtrl.create({
        title: "Fórmula Inválida!",
        message: "A fórmula que foi informada não é válida. Faça uma revisão e salve novamente.",
        buttons: [
          {
            text: "Ok"
          }
        ]
      }).present();
      this.formula.expressao = "0";
      this.formula.variaveis = [];
    }
  }

  validarExpressao() {
    const parser = math.parser();

    this.formula.variaveis.forEach((v) => {
      let inc = "";
      inc = inc + v.nome + " = " + v.valor;
      parser.eval(inc);
    });

    try{
      parser.eval(this.formula.expressao);
      return true;
    }catch{
      return false;
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
