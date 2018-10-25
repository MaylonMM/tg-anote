export class Anotacao {
  titulo: string;
  tipo: string;
  startTime: string;
  endTime: string;
  diaTodo: boolean;
  obs: string;
  image: string;
  disciplina: string;
  variavel: string;
  user: string;

  id?: string;

  constructor() {
    this.titulo = "";
    this.tipo = "";
    this.startTime = "";
    this.endTime = "";
    this.diaTodo = false;
    this.obs = "";
    this.image = "";
    this.disciplina = "";
    this.variavel = "";
    this.user = "";
  }
}
