export class Escola {
  nome: string;
  sigla: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  estado: string;
  user: string;

  id?: string;

  constructor() {
    this.nome = "";
    this.sigla = "";
    this.telefone = "";
    this.email = "";
    this.endereco = "";
    this.cidade = "";
    this.estado = "";
    this.user = "";
  }
}
