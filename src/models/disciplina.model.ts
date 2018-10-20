import { Formula } from './formula.model';

export class Disciplina {
  nome: string;
  sigla: string;
  periodo: string;
  notaMax: number;
  notaMed: number;
  notaMin: number;
  formula: Formula;
  user: string;

  id?: string;

  constructor() {
    this.nome = "";
    this.sigla = "";
    this.periodo = "";
    this.formula = new Formula;
  }
}
