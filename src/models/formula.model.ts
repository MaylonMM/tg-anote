import { Variavel } from "./variavel.model";

export class Formula {
  tipo: string;
  expressao: string;
  variaveis: Variavel[];

  constructor() {
    this.tipo = "media";
    this.expressao = "0";
    this.variaveis = [];
  }
}
