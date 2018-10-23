export class Curso {
  nome: string;
  sigla: string;
  dataInicio: string;
  dataFinalizacao: string;
  escola: string;
  user: string;

  id?: string;

  constructor() {
    this.nome = "";
    this.sigla = "";
    this.dataInicio = "";
    this.dataFinalizacao = "";
    this.escola = "";
  }
}
