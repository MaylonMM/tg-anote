import { Formula } from './formula.model';

export class Disciplina {
  nome: string;
  sigla: string;
  periodo: string;
  notaMax: number;
  notaMed: number;
  notaMin: number;
  formula: Formula;
  professor: string;
  user: string;

  id?: string;

  constructor() {
    this.nome = "";
    this.sigla = "";
    this.periodo = "";
    this.notaMin = 0;
    this.notaMax = 10;
    this.notaMed = 5;
    this.formula = new Formula;
    this.professor = "";
    this.user = "";
  }
}
