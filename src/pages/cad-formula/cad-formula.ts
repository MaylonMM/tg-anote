import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

import firebase from 'firebase';
import * as math from 'mathjs';

import { Disciplina } from '../../models/disciplina.model';

@IonicPage()
@Component({
  selector: 'page-cad-formula',
  templateUrl: 'cad-formula.html',
})
export class CadFormulaPage {

  uid: string;
  disciplina: Disciplina;
  isMedia: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController
  ) {
    this.uid = "";
    this.disciplina = new Disciplina;
    this.isMedia = true;
  }

  ionViewDidEnter() {
    this.updatePage();
  }

  updatePage() {
    let user = firebase.auth().currentUser;
    let dadosDisciplina = this.navParams.get("disciplina");

    if(user != null) {
      this.uid = user.uid;
    }

    if(dadosDisciplina != undefined) {
      this.disciplina = dadosDisciplina;
      if(this.disciplina.formula.tipo == "media") {
        this.isMedia = true;
      } else {
        this.isMedia = false;
      }
    }
  }

  tecla(operacao: string) {
    if(this.disciplina.formula.expressao == "0") {
      this.disciplina.formula.expressao = "";
    }

    if(operacao == 'd') {
      this.disciplina.formula.expressao = "0";
      this.disciplina.formula.variaveis = [];
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
              let flag = false;
              this.disciplina.formula.variaveis.forEach((v) => {
                if(v.nome == data.var) {
                  flag = true;
                }
              });
              if(!flag) {
                this.disciplina.formula.variaveis.push({
                  nome: data.var,
                  valor: 0
                });
                if(this.disciplina.formula.tipo == "media") {
                  this.disciplina.formula.expressao = this.getExpressao();
                } else {
                  this.disciplina.formula.expressao = this.disciplina.formula.expressao + data.var;
                }
              } else {
                this.alertCtrl.create({
                  title: "Atenção",
                  message: "Já existe uma variável com este nome nesta fórmula",
                  buttons: [
                    {
                      text: "Ok"
                    }
                  ]
                }).present();
              }
            }
          }
        ]
      }).present();
    } else {
      this.disciplina.formula.expressao = this.disciplina.formula.expressao + operacao;
    }
  }

  onSelectChange(selectedValue: any) {
    if(selectedValue.checked == true) {
      this.disciplina.formula.tipo = "media";
      this.disciplina.formula.expressao = this.getExpressao();
    } else {
      this.disciplina.formula = {
        tipo: "pers",
        expressao: "0",
        variaveis: []
      };
    }
  }

  getExpressao() {
    let exp = "";

    if(this.disciplina.formula.variaveis.length > 0) {
      exp = "(";
      let cont = 0;
      this.disciplina.formula.variaveis.forEach((v) => {
        if(cont == 0) {
          exp = exp + v.nome;
        } else {
          exp = exp + "+" + v.nome;
        }
        cont++;
      });
      exp = exp + ")/" + this.disciplina.formula.variaveis.length;
    } else {
      exp = "0"
    }

    return exp;
  }

  salvar() {
    if(this.validarExpressao()) {
      let data = {
        formula: this.disciplina.formula
      };
      this.viewCtrl.dismiss(data);
    } else {
      this.alertCtrl.create({
        title: "Fórmula Inválida!",
        message: "A fórmula que foi informada não é válida. Faça uma revisão e salve novamente.",
        buttons: [
          {
            text: "Ok"
          }
        ]
      }).present();
      this.disciplina.formula.expressao = "0";
      this.disciplina.formula.variaveis = [];
    }
  }

  validarExpressao() {
    const parser = math.parser();

    this.disciplina.formula.variaveis.forEach((v) => {
      let inc = "";
      inc = inc + v.nome + " = " + v.valor;
      parser.eval(inc);
    });

    try{
      parser.eval(this.disciplina.formula.expressao);
      return true;
    }catch{
      return false;
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
